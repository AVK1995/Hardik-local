'use client';

/* ═══════════════════════════════════════════════════════════════════════════
   Attribution capture (META_CAPI_SOP_VSL §4.5 / META_TRACKING_AGENT_GUIDE §4.6).

   The man lands on `/` with ?utm_source=…&fbclid=…, then clicks through to
   /checkout, where the query string is gone. Attribution has to survive that
   hop, so it is stamped into storage on sight and read back at order-create.

   ── Two storage models, deliberately different ───────────────────────────
   ATTRIBUTION (utm_*, fbclid, gclid, ts) is LAST-TOUCH. Any page whose URL
     carries fresh attribution OVERWRITES the stored set. This reverses the
     old first-touch freeze: a man who first arrived via link-in-bio and later
     clicked the ad must have the AD credited, not the stale bio link. Pages
     with a clean URL (internal navigation) leave the stored set untouched.
   CONTEXT (referrer, landing_url) is FIRST-TOUCH. The true entry point of the
     session, written once — crucially even for UNTAGGED traffic, which is
     what lets an ops team classify a blank-UTM buyer by channel.

   `ts` is the click time in MILLISECONDS. The server needs it to rebuild
   `_fbc` as `fb.1.<ts>.<fbclid>` when Meta's own cookie is absent, which is
   the single highest-leverage attribution field we have. An ISO string will
   not do — that was the previous bug.

   ── Mirrored to BOTH localStorage AND a first-party cookie ───────────────
   localStorage alone is evicted by ITP and lost across the in-app-browser to
   external-browser handoff, which is exactly the iOS traffic where `_fbc` is
   already missing. The cookie is the durable copy.
   ═══════════════════════════════════════════════════════════════════════════ */

const ATTR_KEY = 'apw_attr';
const ATTR_TTL_SECONDS = 30 * 24 * 60 * 60; // matches Meta's attribution window

/* Superseded first-touch store. Read once so visitors who landed before this
   shipped keep their attribution instead of silently going blank. */
const LEGACY_KEY = 'apw_landing_params';

const URL_KEYS = {
  utm_source: 'source',
  utm_medium: 'medium',
  utm_campaign: 'campaign',
  utm_content: 'content',
  utm_term: 'term',
  fbclid: 'fbclid',
  gclid: 'gclid',
};

/* ── storage ─────────────────────────────────────────────────────────────── */

function migrateLegacy() {
  try {
    const raw = window.localStorage.getItem(LEGACY_KEY);
    if (!raw) return {};
    const old = JSON.parse(raw) || {};
    const attr = {};
    if (old.utm_source) attr.source = old.utm_source;
    if (old.utm_medium) attr.medium = old.utm_medium;
    if (old.utm_campaign) attr.campaign = old.utm_campaign;
    if (old.utm_content) attr.content = old.utm_content;
    if (old.utm_term) attr.term = old.utm_term;
    if (old.fbclid) attr.fbclid = old.fbclid;
    /* landed_at was an ISO string; the fbc rebuild needs epoch ms. */
    if (old.landed_at) {
      const parsed = Date.parse(old.landed_at);
      if (!Number.isNaN(parsed)) attr.ts = parsed;
    }
    return attr;
  } catch {
    return {};
  }
}

function readAttr() {
  if (typeof window === 'undefined') return {};
  try {
    const ls = window.localStorage.getItem(ATTR_KEY);
    if (ls) {
      const parsed = JSON.parse(ls);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    /* Private mode / storage disabled — fall through to the cookie. */
  }
  try {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${ATTR_KEY}=([^;]+)`));
    if (m) {
      const parsed = JSON.parse(decodeURIComponent(m[1]));
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    /* Malformed cookie — treat as empty rather than throwing on page load. */
  }
  return migrateLegacy();
}

function writeAttr(attr) {
  if (typeof window === 'undefined') return;
  const json = JSON.stringify(attr);
  try {
    window.localStorage.setItem(ATTR_KEY, json);
  } catch {
    /* Best effort; the cookie below is the durable copy. */
  }
  try {
    document.cookie = `${ATTR_KEY}=${encodeURIComponent(json)}; Path=/; Max-Age=${ATTR_TTL_SECONDS}; SameSite=Lax`;
  } catch {
    /* Nothing else to try. Attribution degrades to none, which is strictly
       better than throwing inside a page-load effect. */
  }
}

function readLiveUrl() {
  const live = {};
  try {
    const sp = new URLSearchParams(window.location.search);
    for (const [param, key] of Object.entries(URL_KEYS)) {
      const value = sp.get(param);
      if (value) live[key] = value;
    }
  } catch {
    /* Unparseable URL; nothing live to overlay. */
  }
  return live;
}

/* ── public API ──────────────────────────────────────────────────────────── */

/**
 * Mounted on every page via TrackingScripts. Safe to call repeatedly.
 * Name kept from the previous implementation so call sites do not move.
 */
export function captureLandingParams() {
  if (typeof window === 'undefined') return;
  try {
    const live = readLiveUrl();
    const hasAttribution = Object.keys(live).length > 0;
    const attr = readAttr();
    let changed = false;

    /* CONTEXT — first-touch. Written even when the URL carries no params,
       which is the whole point: it classifies untagged buyers. */
    if (!attr.landing_url) {
      attr.landing_url = window.location.href;
      attr.referrer = document.referrer || '';
      changed = true;
    }

    /* ATTRIBUTION — last-touch. Overwrite whenever this URL carries params. */
    if (hasAttribution) {
      Object.assign(attr, live, { ts: Date.now() });
      changed = true;
    }

    if (changed) writeAttr(attr);
  } catch {
    /* Never allowed to break a page load. */
  }
}

/**
 * Live-URL-first, then storage. The overlay matters when the visitor lands
 * straight on a tagged /checkout URL and captureLandingParams has not run on
 * that page yet.
 */
export function restoreLandingParams() {
  if (typeof window === 'undefined') return {};
  const attr = readAttr();
  const live = readLiveUrl();
  if (Object.keys(live).length > 0) {
    Object.assign(attr, live);
    if (!attr.ts) attr.ts = Date.now();
  }
  return attr;
}

/** Shaped for the create-order body's `utm` key. */
export function restoreUtm() {
  const p = restoreLandingParams();
  return {
    source: p.source ?? '',
    medium: p.medium ?? '',
    campaign: p.campaign ?? '',
    content: p.content ?? '',
    term: p.term ?? '',
  };
}

export function restoreFbclid() {
  return restoreLandingParams().fbclid ?? '';
}

/** Epoch ms of the click. Feeds the server-side `_fbc` rebuild. */
export function restoreFbclidTs() {
  const ts = Number(restoreLandingParams().ts);
  return Number.isFinite(ts) && ts > 0 ? ts : 0;
}

/** First-touch session context. CRM/Pabbly only — never Meta `user_data`. */
export function restoreContext() {
  const p = restoreLandingParams();
  return {
    referrer: p.referrer ?? '',
    landing_url: p.landing_url ?? '',
  };
}
