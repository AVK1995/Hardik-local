'use client';

/* ═══════════════════════════════════════════════════════════════════════════
   UTM + click-ID capture.

   The man lands on `/` with ?utm_source=…&fbclid=…, then clicks through to
   /checkout — where the query string is gone. Attribution has to survive that
   hop, so we stamp the landing params into localStorage on first sight and
   read them back at order-create time.

   First-touch wins: we only write when nothing is stored yet. A man who lands
   from an ad, leaves, and comes back via a Google search should still be
   attributed to the ad that found him.
   ═══════════════════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'apw_landing_params';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

export function captureLandingParams() {
  if (typeof window === 'undefined') return;
  try {
    if (window.localStorage.getItem(STORAGE_KEY)) return; // first touch already recorded

    const q = new URLSearchParams(window.location.search);
    const captured = {};
    for (const key of UTM_KEYS) {
      const value = q.get(key);
      if (value) captured[key] = value;
    }
    const fbclid = q.get('fbclid');
    if (fbclid) captured.fbclid = fbclid;

    if (Object.keys(captured).length === 0) return; // nothing worth storing
    captured.landed_at = new Date().toISOString();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
  } catch {
    /* Private mode / storage disabled. Attribution degrades to none, which is
       strictly better than throwing inside a page-load effect. */
  }
}

export function restoreLandingParams() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** Shaped for the create-order body's `utm` key. */
export function restoreUtm() {
  const p = restoreLandingParams();
  return {
    source: p.utm_source ?? '',
    medium: p.utm_medium ?? '',
    campaign: p.utm_campaign ?? '',
    content: p.utm_content ?? '',
    term: p.utm_term ?? '',
  };
}

export function restoreFbclid() {
  return restoreLandingParams().fbclid ?? '';
}
