/* ═══════════════════════════════════════════════════════════════════════════
   Attribution resolution — shared by middleware (Edge), create-order and the
   Razorpay webhook (Node). Pure JS only: no node:crypto, no React, no DOM, so
   it runs unchanged in the Edge runtime.

   ── Why this file exists ─────────────────────────────────────────────────
   Lead pay_TPvkniUArkCDLM (2026-08-15) arrived with utm{} entirely blank and
   clid empty, while the referrer note still carried the full ad URL. Root
   cause: attribution capture lived ONLY in a React useEffect, so a Facebook
   in-app browser that navigated before hydration captured nothing. The Meta
   pixel — a plain script tag — had already fired, which is why _fbc existed
   and our own attribution did not.

   The fix is layered, and every layer is implemented here:

     1. URL      — middleware reads the query string server-side, on the very
                   first request, before any JS. Cannot lose a hydration race.
     2. COOKIE   — what middleware persisted (server-observed, last-touch).
     3. BODY     — what the browser restored from localStorage/cookie.
     4. REFERRER — parse utm_* out of the landing URL we recorded.
     5. _FBC     — derive fbclid + click ts from Meta's own cookie.

   Precedence is exactly that order, per field. `resolveAttribution` also
   reports WHICH layer answered, so every CRM row is auditable and a silent
   regression shows up as a column value rather than as a lost sale.
   ═══════════════════════════════════════════════════════════════════════════ */

export const ATTR_COOKIE = 'apw_attr';
export const ATTR_TTL_SECONDS = 30 * 24 * 60 * 60; // matches Meta's window

/* URL param -> internal key. Internal keys are short because they ride inside
   a Razorpay note with a 256-char ceiling. */
export const URL_TO_KEY = {
  utm_source: 'source',
  utm_medium: 'medium',
  utm_campaign: 'campaign',
  utm_content: 'content',
  utm_term: 'term',
  fbclid: 'fbclid',
  gclid: 'gclid',
};

export const UTM_KEYS = ['source', 'medium', 'campaign', 'content', 'term'];

const isFilled = (v) => typeof v === 'string' && v.length > 0;

/* ── ad-grade vs organic (ATTRIBUTION_UTM_PRIORITY_ADDENDUM, 2026-08-30) ──
   A buyer can touch TWO tagged entries inside the 30-day window — the paid ad
   AND the Instagram bio link — both writing the same cookie in the same in-app
   browser. Last-touch then lets a later bio tap overwrite the ad, and the CRM
   reports link_in_bio for a sale the ad actually produced. (~2-3 in 10 paid
   leads at Reset by Shruti.)

   So utm sources are RANKED, not just ordered: a real ad utm found anywhere
   beats an organic bio utm sitting in the cookie. Meta was always fine — it
   attributes on fbclid — this only corrects our own CRM columns.

   The distinction is made on utm_source. Keep paid ads' utm_source distinct
   from the bio link's (ads use Instagram_Reels / Facebook_Mobile_Reels…, the
   bio uses ig / link_in_bio) and this just works. Tune the set per client. */
export const ORGANIC_SOURCES = new Set([
  'ig', 'fb', 'instagram', 'facebook', 'l.instagram.com', 'lm.facebook.com',
  'linktr.ee', 'taplink.cc', 'beacons.ai', 'bio.link',
]);

export const utmSetOf = (o = {}) => ({
  source: o.source || '', medium: o.medium || '', campaign: o.campaign || '',
  content: o.content || '', term: o.term || '',
});

export const hasUtm = (u = {}) => UTM_KEYS.some((k) => isFilled(u[k]));

export function isOrganicUtm(u = {}) {
  if (!hasUtm(u)) return false;
  if ((u.content || '').toLowerCase() === 'link_in_bio') return true;
  if (ORGANIC_SOURCES.has((u.source || '').toLowerCase())) return true;
  if ((u.medium || '').toLowerCase() === 'social' && !(u.campaign || '').length) return true;
  return false;
}

export const isAdUtm = (u = {}) => isFilled(u.source) && hasUtm(u) && !isOrganicUtm(u);

/* ── parsing ─────────────────────────────────────────────────────────────── */

/** Pull attribution out of any URL or query string. Never throws. */
export function parseAttributionFromUrl(input) {
  const out = {};
  if (!input) return out;
  try {
    const search = input.includes('?') ? input.slice(input.indexOf('?')) : input;
    const sp = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    for (const [param, key] of Object.entries(URL_TO_KEY)) {
      const value = sp.get(param);
      if (isFilled(value)) out[key] = value;
    }
  } catch {
    /* Unparseable — treat as no attribution rather than throwing on a request. */
  }
  return out;
}

/**
 * Meta's _fbc is `fb.<subdomainIndex>.<clickTimestampMs>.<fbclid>`.
 *
 * This is the ONLY complete source of fbclid we have. The referrer note is
 * capped at 256 chars by Razorpay and real fbclids run ~195 chars, so a
 * referrer-parsed fbclid is very often silently truncated — for the lead that
 * exposed this bug it came out 49 chars instead of 195. Never trust the
 * referrer for fbclid; trust it only for utm_*.
 */
export function parseFbc(fbc) {
  if (!isFilled(fbc)) return {};
  const parts = fbc.split('.');
  if (parts.length < 4 || parts[0] !== 'fb') return {};
  const ts = Number(parts[2]);
  return {
    fbclid: parts.slice(3).join('.'),
    ts: Number.isFinite(ts) && ts > 0 ? ts : undefined,
  };
}

/**
 * Read the attribution cookie, tolerating every encoding it can arrive in.
 *
 * There are three writers and they do not agree on encoding:
 *   - middleware  -> NextResponse.cookies.set() percent-encodes for us
 *   - lib/utm.js  -> writes document.cookie with its own encodeURIComponent
 *   - req.cookies.get() already decodes ONE layer before we see the value
 *
 * So the same cookie reaches this function as raw JSON, single-encoded, or
 * (before the middleware fix) double-encoded. A single hardcoded
 * decodeURIComponent silently failed on two of those three and returned {} —
 * which made the CLIENT treat storage as empty and overwrite the middleware's
 * capture with landing_url=/checkout, reintroducing the exact bug L1 fixes.
 *
 * decodeURIComponent also THROWS on a stray '%' (a utm value containing a
 * literal percent), which the old catch turned into silent data loss.
 *
 * Parse first, decode only if that fails, and try at most twice.
 */
export function readAttrCookie(raw) {
  if (!isFilled(raw)) return {};

  let candidate = raw;
  for (let i = 0; i < 3; i += 1) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
      return {};
    } catch {
      /* Not JSON yet — peel one encoding layer and retry. */
    }
    try {
      const decoded = decodeURIComponent(candidate);
      if (decoded === candidate) return {};
      candidate = decoded;
    } catch {
      return {};
    }
  }
  return {};
}

/* ── merge ───────────────────────────────────────────────────────────────── */

/**
 * ATTRIBUTION is LAST-TOUCH: a URL carrying params overwrites the stored set,
 * so a later ad click beats a stale link-in-bio. CONTEXT is FIRST-TOUCH:
 * referrer + landing_url are written once, even for untagged traffic, which is
 * what lets an untagged buyer still be classified by channel.
 *
 * Returns { attr, changed } so callers can skip a pointless Set-Cookie.
 */
export function mergeAttribution(stored, { live, landingUrl, referrer, now }) {
  const attr = { ...stored };
  let changed = false;

  if (!isFilled(attr.landing_url) && isFilled(landingUrl)) {
    attr.landing_url = landingUrl;
    attr.referrer = isFilled(referrer) ? referrer : '';
    changed = true;
  }

  /* AD-STICKY last-touch (addendum §3b). An organic bio tap must not overwrite
     a stored ad utm; a real ad tap always wins, and the latest ad wins. This
     stops the cookie being contaminated in the first place, so §3a's ranking
     is defence-in-depth rather than the only guard.

     Click IDs stay PURE last-touch — fbclid identifies the click, not the
     campaign, and Meta's attribution depends on it being current. */
  if (live && Object.keys(live).length > 0) {
    const liveUtm = utmSetOf(live);
    let touched = false;

    if (hasUtm(liveUtm) && (isAdUtm(liveUtm) || !isAdUtm(utmSetOf(attr)))) {
      for (const k of UTM_KEYS) attr[k] = liveUtm[k];
      touched = true;
    }
    if (isFilled(live.fbclid)) { attr.fbclid = live.fbclid; touched = true; }
    if (isFilled(live.gclid)) { attr.gclid = live.gclid; touched = true; }

    if (touched) {
      attr.ts = now;
      changed = true;
    }
  }

  return { attr, changed };
}

/* ── resolution (the layered fallback) ───────────────────────────────────── */

/**
 * Resolve the final attribution from every available source, in precedence
 * order, per field. Also returns `provenance` — which layer supplied the UTMs
 * and which supplied the fbclid — so a blank row is diagnosable after the fact
 * instead of being discovered on lead #1.
 */
export function resolveAttribution({
  cookieAttr = {},
  bodyAttr = {},
  referrer = '',
  landingUrl = '',
  fbc = '',
  now = Date.now(),
} = {}) {
  /* Quality-aware selection. Sources are scanned landing -> referrer -> cookie
     -> body and the FIRST ad-grade utm wins, wherever it lives. Only if no
     source carries an ad-grade utm do we fall back to the best-filled one —
     which for a genuine bio buyer correctly stays link_in_bio.

     This replaces the old "cookie, then body, then referrer ONLY IF all blank"
     logic. That never looked at the landing_url when the cookie held
     link_in_bio, which is exactly how a real ad sale got reported as organic.

     Whole SETS are chosen, never merged field-by-field: mixing utm_source from
     the ad with utm_content from the bio link would be worse than either. */
  const candidates = [
    { label: 'landing', utm: utmSetOf(parseAttributionFromUrl(landingUrl)) },
    { label: 'referrer', utm: utmSetOf(parseAttributionFromUrl(referrer)) },
    { label: 'cookie', utm: utmSetOf(cookieAttr) },
    { label: 'body', utm: utmSetOf(bodyAttr) },
  ];

  let chosen = candidates.find((c) => isAdUtm(c.utm));
  let utmQuality = 'ad';
  if (!chosen) {
    chosen = candidates.find((c) => hasUtm(c.utm));
    utmQuality = chosen ? (isOrganicUtm(chosen.utm) ? 'organic' : 'other') : 'none';
  }
  const utm = chosen ? { ...chosen.utm } : utmSetOf({});
  const utmSource = chosen ? chosen.label : 'none';

  for (const key of UTM_KEYS) if (!isFilled(utm[key])) utm[key] = '';

  /* fbclid: cookie -> body -> _fbc. Referrer is excluded on purpose. */
  let fbclid = '';
  let fbclidTs = 0;
  let clidSource = 'none';

  if (isFilled(cookieAttr.fbclid)) {
    fbclid = cookieAttr.fbclid;
    clidSource = 'cookie';
    fbclidTs = Number(cookieAttr.ts) || 0;
  } else if (isFilled(bodyAttr.fbclid)) {
    fbclid = bodyAttr.fbclid;
    clidSource = 'body';
    fbclidTs = Number(bodyAttr.ts) || 0;
  } else {
    const fromFbc = parseFbc(fbc);
    if (isFilled(fromFbc.fbclid)) {
      fbclid = fromFbc.fbclid;
      clidSource = 'fbc';
      fbclidTs = fromFbc.ts || 0;
    }
  }

  if (!fbclidTs) fbclidTs = Number(cookieAttr.ts) || Number(bodyAttr.ts) || 0;

  const gclid = [cookieAttr.gclid, bodyAttr.gclid].find(isFilled) || '';
  const resolvedReferrer =
    [referrer, cookieAttr.referrer, bodyAttr.referrer].find(isFilled) || '';
  const resolvedLanding =
    [landingUrl, cookieAttr.landing_url, bodyAttr.landing_url].find(isFilled) || '';

  return {
    utm,
    fbclid,
    fbclidTs: fbclidTs || now,
    gclid,
    referrer: resolvedReferrer,
    landingUrl: resolvedLanding,
    /* e.g. "utm:landing/ad|clid:fbc" — which layer saved you AND whether the
       utm is ad-grade or organic. Chart this: a rising organic share on paid
       traffic is the mis-attribution bug reappearing. */
    provenance: `utm:${utmSource}/${utmQuality}|clid:${clidSource}`,
    utmSource,
    utmQuality,
    clidSource,
  };
}

/**
 * Serialise an object into a Razorpay note value that is GUARANTEED to be
 * valid JSON under `max` chars.
 *
 * The previous code did truncate(JSON.stringify(obj)) — which, on a long
 * campaign name, slices mid-JSON and makes the note unparseable, so the
 * webhook's JSON.parse fails and EVERY utm field is lost at once. This
 * shortens the longest value repeatedly until the whole blob fits, so the
 * worst case is a clipped campaign name rather than total loss.
 */
export function packJsonNote(obj, max = 256) {
  const working = {};
  for (const [k, v] of Object.entries(obj)) working[k] = typeof v === 'string' ? v : String(v ?? '');

  let json = JSON.stringify(working);
  let guard = 0;
  while (json.length > max && guard < 200) {
    guard += 1;
    let longestKey = null;
    let longestLen = 0;
    for (const [k, v] of Object.entries(working)) {
      if (v.length > longestLen) {
        longestLen = v.length;
        longestKey = k;
      }
    }
    if (!longestKey || longestLen === 0) break;
    const overBy = json.length - max;
    const cut = Math.max(1, Math.min(longestLen, overBy));
    working[longestKey] = working[longestKey].slice(0, longestLen - cut);
    json = JSON.stringify(working);
  }

  return json.length > max ? '{}' : json;
}
