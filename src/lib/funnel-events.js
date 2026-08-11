'use client';

import { fireAddToCartOnce, fireInitiateCheckoutOnce } from '@/lib/analytics';
import { trackGa4EventOnce } from '@/lib/ga4';

/* ═══════════════════════════════════════════════════════════════════════════
   One function per funnel moment, so components never have to know that two
   independent tracking systems exist — or that the two systems deliberately
   disagree about when one of these moments happens.

   That disagreement is real and intentional, so it is spelled out here rather
   than discovered later:

     Meta `ic_event`   fires only AFTER the form validates clean. It feeds an
                       abandoned-checkout audience, and a man who bounced off a
                       validation error is not an abandoned checkout.

     GA4 `initiate_checkout` fires on the FIRST Pay click, BEFORE validation.
                       It answers "how many men tried to pay", and a half-filled
                       form that bounced still tried.

   So GA4's count will legitimately run higher than Meta's. That is the design,
   not a leak — do not "fix" it by aligning them.
   ═══════════════════════════════════════════════════════════════════════════ */

/** A landing CTA heading to /checkout was clicked. Never blocks navigation. */
export function trackCheckoutCtaClick() {
  fireAddToCartOnce();
  trackGa4EventOnce('add_to_cart');
}

/** The hero VSL started playing. GA4 only — Meta gets no video event. */
export function trackVslPlay() {
  trackGa4EventOnce('video_play');
}

/** The Pay button was clicked, before any validation has run. GA4 only. */
export function trackPayClickAttempt() {
  trackGa4EventOnce('initiate_checkout');
}

/**
 * The form validated clean and create-order is next. Meta only.
 * Awaited by the caller, but it swallows its own failures — a tracking
 * problem must never stop a payment.
 */
export async function trackValidatedCheckoutIntent(customer) {
  await fireInitiateCheckoutOnce(customer);
}

/** Calendly confirmed a real booking. GA4 only. */
export function trackCallBooked() {
  trackGa4EventOnce('book_call');
}
