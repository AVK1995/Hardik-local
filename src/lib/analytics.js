'use client';

/* ═══════════════════════════════════════════════════════════════════════════
   Browser-side Meta work. Three jobs, and one job it deliberately does NOT do.

     1. Manual Advanced Matching (MAM) — hash the checkout form's values
        client-side and re-init the pixel with them, so every subsequent
        PageView carries identity. Persisted to a first-party cookie so a man
        who comes back in a week is still recognised on his first pageview.

     2. atc_event trigger — tell the server the first landing CTA was clicked.

     3. ic_event trigger — tell the server a valid form is about to pay.

   What it does NOT do: fire any conversion event from the browser. No
   Purchase, no Lead, no standard event of any kind — this dataset is
   health-categorised and those are blocked by name. The browser fires
   PageView and nothing else; every conversion signal is server-side CAPI.
   ═══════════════════════════════════════════════════════════════════════════ */

import { restoreFbclid, restoreFbclidTs } from '@/lib/utm';

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

const MAM_COOKIE_NAME = 'apw_mam';
const MAM_COOKIE_TTL_SECONDS = 30 * 24 * 60 * 60; // matches Meta's attribution window

const ATC_FLAG = 'apw_atc_fired';
const IC_FLAG = 'apw_ic_fired';

/* ── hashing ─────────────────────────────────────────────────────────────── */

/**
 * SHA-256 hex via Web Crypto. Available in every modern browser over HTTPS
 * and on http://localhost. Pre-hashing means the cookie never holds plain
 * PII — and Meta recognises a 64-char hex string as already-hashed, so there
 * is no double-hashing when fbq receives it.
 */
export async function sha256Hex(value) {
  if (typeof crypto === 'undefined' || !crypto.subtle) return value;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/* Meta's normalisation spec — must match src/lib/meta-capi.js exactly, or the
   browser and the server will hash the same man into two different people. */
async function buildHashedMatching({ email, phone, firstName, lastName, city, country }) {
  const normalised = {};
  if (email) normalised.em = email.trim().toLowerCase();
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits) normalised.ph = digits;
  }
  if (firstName) normalised.fn = firstName.trim().toLowerCase();
  if (lastName) normalised.ln = lastName.trim().toLowerCase();
  if (city) {
    const ct = city.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (ct) normalised.ct = ct;
  }
  if (country) {
    const co = country.trim().toLowerCase();
    if (co) normalised.country = co;
  }

  const keys = Object.keys(normalised);
  const hashes = await Promise.all(keys.map((k) => sha256Hex(normalised[k])));
  const matching = {};
  keys.forEach((k, i) => {
    matching[k] = hashes[i];
  });

  /* external_id is a stable per-USER id, not per-transaction. sha256(email)
     gives the same value in the browser, in the CAPI payload and in the
     Pabbly row, which is what lets Meta stitch one man across all three. */
  if (matching.em) matching.external_id = matching.em;
  return matching;
}

/* ── MAM cookie ──────────────────────────────────────────────────────────── */

function writeMamCookie(matching) {
  if (typeof document === 'undefined') return;
  if (Object.keys(matching).length === 0) return;
  const value = encodeURIComponent(JSON.stringify(matching));
  document.cookie = `${MAM_COOKIE_NAME}=${value}; Path=/; Max-Age=${MAM_COOKIE_TTL_SECONDS}; SameSite=Lax`;
}

export function readMamCookie() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${MAM_COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Re-init the pixel with hashed identity. Pass raw values — this hashes them.
 *
 * Called in three places: when the checkout form first validates clean (the
 * earliest moment we know who he is), on payment success, and on /thank-you
 * mount as a safety net.
 */
export async function setMetaAdvancedMatching(data) {
  if (typeof window === 'undefined' || !window.fbq || !META_PIXEL_ID) return;
  const matching = await buildHashedMatching(data);
  if (Object.keys(matching).length === 0) return;
  window.fbq('init', META_PIXEL_ID, matching);
  writeMamCookie(matching);
}

/** Re-fire MAM from the persisted cookie. fbq init is idempotent. */
export function reapplyMamFromCookie() {
  if (typeof window === 'undefined' || !window.fbq || !META_PIXEL_ID) return;
  const matching = readMamCookie();
  if (!matching || Object.keys(matching).length === 0) return;
  window.fbq('init', META_PIXEL_ID, matching);
}

/* ── atc_event ───────────────────────────────────────────────────────────── */

/**
 * First landing-CTA click of this browser's lifetime fires one atc_event.
 * Which CTA does not matter — hero, mid-page or sticky, they are the same
 * intent and Meta should hear it once.
 *
 * sendBeacon rather than fetch: the click navigates to /checkout immediately
 * and a normal fetch would be cancelled in flight. The flag is stamped
 * optimistically for the same reason — a tab killed mid-navigation must still
 * leave the browser marked as counted.
 *
 * Never blocks the click. The anchor navigates regardless of what happens here.
 */
export function fireAddToCartOnce() {
  if (typeof window === 'undefined') return;

  try {
    if (window.localStorage.getItem(ATC_FLAG) === '1') return;
    window.localStorage.setItem(ATC_FLAG, '1');
  } catch {
    /* Private mode: no client-side dedup. Meta's 48h event_id dedup, which
       derives from _fbp, is the remaining safety net. */
  }

  const url = '/api/meta/add-to-cart';
  /* fbclid + click time ride along so the server can rebuild _fbc when Meta's
     own cookie is absent — the iOS / in-app case where attribution otherwise
     degrades to probabilistic. */
  const payload = JSON.stringify({
    eventSourceUrl: window.location.href,
    fbclid: restoreFbclid(),
    fbclidTs: restoreFbclidTs(),
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
      return;
    }
  } catch {
    /* Fall through to fetch. */
  }

  try {
    fetch(url, {
      method: 'POST',
      body: payload,
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
  } catch {
    /* Tracking is never allowed to break navigation. */
  }
}

/* ── ic_event ────────────────────────────────────────────────────────────── */

/**
 * Fire ic_event once per unique email per browser.
 *
 * Keyed on the email hash rather than a bare flag on purpose: a man who
 * abandons, comes back and pays under a different address is a genuinely
 * different intent and should be counted again.
 *
 * The flag is stamped only on a successful response — if the call failed we
 * want the next attempt to retry rather than be silently suppressed.
 *
 * Returns nothing and never throws: the caller proceeds to create-order
 * regardless. A tracking failure must never cost a payment.
 */
export async function fireInitiateCheckoutOnce(customer) {
  if (typeof window === 'undefined') return;
  const email = (customer?.email || '').trim().toLowerCase();
  if (!email) return;

  try {
    const emailHash = await sha256Hex(email);

    try {
      if (window.localStorage.getItem(IC_FLAG) === emailHash) return;
    } catch {
      /* No dedup available; Meta's event_id dedup still applies. */
    }

    const res = await fetch('/api/meta/initiate-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
        eventSourceUrl: window.location.href,
        fbclid: restoreFbclid(),
        fbclidTs: restoreFbclidTs(),
      }),
    });

    if (res.ok) {
      try {
        window.localStorage.setItem(IC_FLAG, emailHash);
      } catch {
        /* Best effort. */
      }
    }
  } catch (err) {
    console.warn('[ic] client trigger failed (payment continues):', err);
  }
}
