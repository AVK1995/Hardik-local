import { TRACKING_HOST } from '@/lib/config';

/**
 * The four browser signals every CAPI event wants, read off the incoming
 * request. Vercel's edge populates x-forwarded-for; _fbc and _fbp are Meta's
 * own first-party cookies and attach automatically because every route that
 * calls this is same-origin with the page that triggered it.
 *
 * NOTE the `fbc` here is the RAW COOKIE ONLY. Never pass it straight to Meta —
 * run it through resolveFbc() so it falls back to a rebuild from fbclid.
 */
export function readRequestContext(req) {
  return {
    fbc: req.cookies.get('_fbc')?.value || '',
    fbp: req.cookies.get('_fbp')?.value || '',
    clientIp:
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '',
    clientUserAgent: req.headers.get('user-agent') || '',
  };
}

/**
 * HYBRID _fbc — the single highest-leverage attribution field.
 *
 * `_fbc` is the click identifier Meta uses to tie a conversion to the EXACT ad
 * click. When it is present attribution is deterministic; when it is absent
 * Meta falls back to probabilistic view-through matching and under-credits
 * real ad sales. The cookie is routinely missing on iOS and in in-app
 * browsers — precisely the traffic this funnel buys.
 *
 * So: prefer Meta's own cookie (it carries Meta's subdomain index and its own
 * timestamp), and rebuild `fb.1.<clickTimestampMs>.<fbclid>` when it is not
 * there. The click timestamp comes from the capture layer (lib/utm.js); the
 * event time is the fallback.
 *
 * Meta does NOT attribute on utm_* — those are for our CRM only. This is the
 * lever. See META_TRACKING_AGENT_GUIDE §2a.
 */
export function resolveFbc({ cookieFbc, fbclid, fbclidTs } = {}) {
  if (cookieFbc) return cookieFbc;
  if (!fbclid) return '';
  const ts = Number(fbclidTs);
  return `fb.1.${Number.isFinite(ts) && ts > 0 ? ts : Date.now()}.${fbclid}`;
}

/** The host this request actually arrived on, normalised (no port, no case). */
export function requestHost(req) {
  const raw = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  return raw.split(',')[0].trim().split(':')[0].toLowerCase();
}

/**
 * Server-side counterpart to the browser pixel's host gate.
 *
 * Without this, running `npm run dev` with the real credentials in .env.local
 * fires genuine events into the live dataset on every CTA click, and every
 * Vercel preview deploy does the same. The browser pixel has always been
 * gated; the CAPI routes were not.
 *
 * Set TRACKING_ALLOW_ALL_HOSTS=1 to bypass while debugging against a preview.
 */
export function isTrackingHost(req) {
  if (process.env.TRACKING_ALLOW_ALL_HOSTS === '1') return true;
  return requestHost(req) === TRACKING_HOST.toLowerCase();
}
