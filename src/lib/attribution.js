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

export function readAttrCookie(raw) {
  if (!isFilled(raw)) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
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

  if (live && Object.keys(live).length > 0) {
    Object.assign(attr, live, { ts: now });
    changed = true;
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
  const utm = {};
  let utmSource = 'none';

  /* 1 + 2. cookie (server-observed by middleware) then 3. client body. */
  for (const [label, src] of [
    ['cookie', cookieAttr],
    ['body', bodyAttr],
  ]) {
    for (const key of UTM_KEYS) {
      if (!isFilled(utm[key]) && isFilled(src?.[key])) {
        utm[key] = src[key];
        if (utmSource === 'none') utmSource = label;
      }
    }
  }

  /* 4. referrer — the landing URL we recorded still holds the query string.
        Safe for utm_*; deliberately NOT used for fbclid (see parseFbc). */
  if (UTM_KEYS.every((k) => !isFilled(utm[k]))) {
    const fromRef = parseAttributionFromUrl(referrer);
    const fromLanding = parseAttributionFromUrl(landingUrl);
    const recovered = { ...fromLanding, ...fromRef };
    let used = false;
    for (const key of UTM_KEYS) {
      if (isFilled(recovered[key])) {
        utm[key] = recovered[key];
        used = true;
      }
    }
    if (used) utmSource = 'referrer';
  }

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
    /* e.g. "utm:cookie|clid:fbc" — one column, tells you which layer saved you. */
    provenance: `utm:${utmSource}|clid:${clidSource}`,
    utmSource,
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
