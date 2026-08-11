/* ═══════════════════════════════════════════════════════════════════════════
   Single source of truth for money, identity and tracking gates.

   Every tracking surface (Meta CAPI, GA4, Clarity, Pabbly) reads its
   on/off switch from here rather than testing env vars inline, so there is
   exactly one place to look when something is or isn't firing.
   ═══════════════════════════════════════════════════════════════════════════ */

/* Production origin. Meta's event_source_url is reduced to this origin
   server-side (META_HW_PREVENTIVE_SOP §Step 4.4) so no path or query string
   — which on this funnel would carry health-adjacent segments and UTMs —
   ever reaches Meta's classifier. */
export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vsl.alphawellnessproject.com'
).replace(/\/+$/, '');

export const CANONICAL_CHECKOUT_URL = `${SITE_ORIGIN}/checkout`;

/* The hostname browser-side trackers are allowed to fire from. Meta drops
   events from non-allow-listed domains silently, and GA4/Clarity would
   otherwise count localhost and Vercel preview traffic as real. */
export const TRACKING_HOST = new URL(SITE_ORIGIN).hostname;

export const brand = {
  name: 'Project Alpha Wellness',
  /* Pabbly's date/time columns are read by a human ops team in India. */
  paymentTimezone: 'Asia/Kolkata',
};

/* The ₹97 assessment fee. Drop NEXT_PUBLIC_ASSESSMENT_FEE to 1 to run live
   ₹1 test payments: `trackingEnabled` then goes false and every tracking
   side effect short-circuits, so QA orders never reach Meta or Pabbly. */
const feeInr = Number(process.env.NEXT_PUBLIC_ASSESSMENT_FEE || 97);

export const pricing = {
  inr: feeInr,
  paise: Math.round(feeInr * 100),
  currency: 'INR',
  trackingEnabled: feeInr > 1,
};
