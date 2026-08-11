'use client';

/* ═══════════════════════════════════════════════════════════════════════════
   GA4 events — deliberately independent of everything Meta.

   Four events, exact names, no parameters at all: no value, no currency, no
   revenue. These are pure counts and they stay that way so nobody can ever
   reconcile them against Meta's monetary numbers and conclude one of the two
   systems is broken.

     video_play         landing — the hero VSL actually starts
     add_to_cart        landing — first click on any CTA heading to checkout
     initiate_checkout  checkout — first Pay click, BEFORE validation runs
     book_call          book-a-call — Calendly confirms a real booking

   ONCE PER BROWSER, all four. These are reach counts ("how many men did X"),
   not volume counts. That makes them unique-visitor numbers, so incognito and
   cleared-storage visitors re-count — calibrate before comparing to Meta.

   There is deliberately no `purchase` event: checkout completion is measured
   by the /thank-you pageview GA4 collects on its own.
   ═══════════════════════════════════════════════════════════════════════════ */

const PREFIX = 'apw_ga4_';

function flagKey(event) {
  return `${PREFIX}${event}_fired`;
}

function alreadyFired(event) {
  try {
    return window.localStorage.getItem(flagKey(event)) === '1';
  } catch {
    /* Private mode. Fire anyway — an extra count beats a lost one. */
    return false;
  }
}

function stampFired(event) {
  try {
    window.localStorage.setItem(flagKey(event), '1');
  } catch {
    /* Best-effort dedup only. */
  }
}

/**
 * Fire a GA4 event at most once per browser, ever.
 *
 * The order of operations matters in two directions:
 *
 *  - The flag is stamped BEFORE gtag is called, because these fire on clicks
 *    that navigate away immediately. Stamp after and the event double-fires
 *    on the next click that beats the navigation.
 *
 *  - The flag is NOT stamped when gtag is absent. The GA4 tag only loads on
 *    the production host (see src/app/layout.js), so stamping on localhost
 *    would permanently suppress the event for that browser — including for
 *    whoever later tests on the live domain in the same browser.
 */
export function trackGa4EventOnce(event) {
  if (typeof window === 'undefined') return;
  if (alreadyFired(event)) return;

  if (typeof window.gtag !== 'function') {
    /* GA4 not on this host. Leave the flag unstamped so the event can still
       fire for real on production. */
    return;
  }

  stampFired(event);

  try {
    window.gtag('event', event);
  } catch {
    /* Analytics must never throw into a click handler. */
  }
}
