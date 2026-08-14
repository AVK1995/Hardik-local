import { NextResponse } from 'next/server';

import { pricing } from '@/lib/config';
import { sendAddToCartEvent } from '@/lib/meta-capi';
import { isTrackingHost, readRequestContext, requestHost, resolveFbc } from '@/lib/request-context';

/* ═══════════════════════════════════════════════════════════════════════════
   `atc_event` — fired when a visitor clicks a landing CTA for the first time.

   Deliberately NOT part of the Razorpay webhook: this is upstream intent. A
   man who clicks the CTA and never opens checkout still belongs in the
   retargeting audience, and the payment webhook can never see him because he
   never paid.

   The browser reaches this with sendBeacon, which survives the navigation
   that follows the click. Same-origin, so _fbc/_fbp ride along automatically.
   ═══════════════════════════════════════════════════════════════════════════ */

export async function POST(req) {
  if (!pricing.trackingEnabled) {
    console.log('[atc] tracking disabled (test fee) — skipping');
    return NextResponse.json({ ok: true, skipped: 'test_mode' });
  }

  /* The browser pixel has always been host-gated; this route was not, so a
     CTA click on localhost or a preview deploy fired a real event into the
     live dataset. */
  if (!isTrackingHost(req)) {
    console.log(`[atc] host "${requestHost(req)}" is not the tracking host — skipping`);
    return NextResponse.json({ ok: true, skipped: 'wrong_host' });
  }

  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    console.warn('[atc] META_PIXEL_ID / META_CAPI_ACCESS_TOKEN not set — skipping');
    return NextResponse.json({ ok: true, skipped: 'env_missing' });
  }

  /* sendBeacon posts a Blob, so the body may be absent or unparseable. The
     event does not depend on it — eventSourceUrl is reduced to the origin
     anyway — so a bad body must never cost us the event. */
  const body = await req.json().catch(() => ({}));
  const { fbc: cookieFbc, fbp, clientIp, clientUserAgent } = readRequestContext(req);

  /* The fbc lever applies to EVERY server event, not just the purchase — an
     atc_event with a rebuilt fbc still tells Meta which ad produced the click. */
  const fbc = resolveFbc({
    cookieFbc,
    fbclid: body?.fbclid,
    fbclidTs: body?.fbclidTs,
  });

  try {
    await sendAddToCartEvent({
      pixelId,
      accessToken,
      eventSourceUrl: body?.eventSourceUrl,
      value: pricing.inr,
      currency: pricing.currency,
      fbc,
      fbp,
      clientIp,
      clientUserAgent,
    });
    console.log(`[atc] sent (fbp=${fbp ? 'present' : 'absent'})`);
    return NextResponse.json({ ok: true, capi: 'sent' });
  } catch (err) {
    console.error('[atc] Meta CAPI error:', err);
    return NextResponse.json({ ok: true, capi: 'error' });
  }
}
