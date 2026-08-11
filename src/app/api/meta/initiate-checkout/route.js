import { NextResponse } from 'next/server';

import { pricing } from '@/lib/config';
import { sendInitiateCheckoutEvent } from '@/lib/meta-capi';
import { readRequestContext } from '@/lib/request-context';

/* ═══════════════════════════════════════════════════════════════════════════
   `ic_event` — the visitor's form validated clean and they are one step from
   the create-order call. The abandoned-checkout signal.

   Fired from the submit handler, never from the payment webhook: the whole
   point is the man who clicks Pay and then bails at the Razorpay screen. The
   webhook only ever sees successful captures, so it is blind to exactly the
   case this event exists for.

   400 on a missing email is intentional — an IC with no identity is worth
   less than the noise it adds, and it means the caller has a bug.
   ═══════════════════════════════════════════════════════════════════════════ */

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const customer = body?.customer ?? {};

  if (!customer.email) {
    console.warn('[ic] rejected — no email in body');
    return NextResponse.json({ ok: false, error: 'email_required' }, { status: 400 });
  }

  if (!pricing.trackingEnabled) {
    console.log('[ic] tracking disabled (test fee) — skipping');
    return NextResponse.json({ ok: true, skipped: 'test_mode' });
  }

  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    console.warn('[ic] META_PIXEL_ID / META_CAPI_ACCESS_TOKEN not set — skipping');
    return NextResponse.json({ ok: true, skipped: 'env_missing' });
  }

  const { fbc, fbp, clientIp, clientUserAgent } = readRequestContext(req);

  try {
    await sendInitiateCheckoutEvent({
      pixelId,
      accessToken,
      email: customer.email,
      phone: `${customer.dialCode ?? ''}${customer.phone ?? ''}`,
      firstName: customer.firstName,
      lastName: customer.lastName,
      city: customer.city,
      countryCode: customer.countryCode,
      eventSourceUrl: body?.eventSourceUrl,
      value: pricing.inr,
      currency: pricing.currency,
      fbc,
      fbp,
      clientIp,
      clientUserAgent,
    });
    console.log('[ic] sent');
    return NextResponse.json({ ok: true, capi: 'sent' });
  } catch (err) {
    console.error('[ic] Meta CAPI error:', err);
    return NextResponse.json({ ok: true, capi: 'error' });
  }
}
