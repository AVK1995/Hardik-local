import { NextResponse } from 'next/server';
import crypto from 'crypto';

import { brand, pricing, CANONICAL_CHECKOUT_URL, TRACKING_HOST } from '@/lib/config';
import { sendMetaCapiEvent, sha256 } from '@/lib/meta-capi';
import { isTrackingHost, requestHost, resolveFbc } from '@/lib/request-context';
import { resolveAttribution } from '@/lib/attribution';

/* ═══════════════════════════════════════════════════════════════════════════
   Razorpay webhook — the single tracking authority for a completed payment.

   Why this exists rather than a browser-called verify-payment route: a man who
   pays by UPI completes the payment inside GPay/PhonePe and frequently never
   returns to this tab. The Razorpay success callback never fires, so a
   browser-dependent route never runs — and we would silently lose the lead
   even though the money arrived. Razorpay calls this route server-to-server
   regardless of what the browser did, and retries it on any non-200.

   Gate order — every stage short-circuits, only the last does side effects:
     1. HMAC signature verify        → 400 on mismatch
     2. event === 'payment.captured' → ignore everything else
     3. notes.kind === sentinel      → ignore other funnels on this account
     4. pricing.trackingEnabled      → skip ₹1 test-mode payments
     5. Pabbly + Meta CAPI fire

   Every log line carries the paymentId, so searching Vercel logs for one
   payment id reconstructs the whole trace.
   ═══════════════════════════════════════════════════════════════════════════ */

const FUNNEL_KIND = 'client_funnel';

/* Razorpay sometimes returns notes as an empty array rather than an object
   when no notes were set, which is why this is defensive about the shape. */
function safeParseNotes(notes) {
  if (!notes || typeof notes !== 'object' || Array.isArray(notes)) return {};
  const out = {};
  for (const [k, v] of Object.entries(notes)) {
    if (typeof v === 'string') out[k] = v;
  }
  return out;
}

function safeParseJson(value) {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export async function POST(req) {
  // ─── 1. Signature verification ──────────────────────────────────────────
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[webhook] RAZORPAY_WEBHOOK_SECRET not configured');
    return NextResponse.json({ ok: false, error: 'webhook_secret_missing' }, { status: 500 });
  }

  const signature = req.headers.get('x-razorpay-signature') ?? '';
  /* req.text() before any JSON parse — the HMAC is computed over the raw
     bytes Razorpay sent. Re-serialising the parsed object changes key order
     and whitespace, and the signature will never match again. */
  const rawBody = await req.text();

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

  if (!signature || signature !== expected) {
    console.warn('[webhook] signature mismatch — rejecting');
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 400 });
  }
  console.log('[webhook] signature verified');

  // ─── 2. Parse + event filter ────────────────────────────────────────────
  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    console.error('[webhook] JSON parse failed');
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const event = body.event ?? '';
  if (event !== 'payment.captured') {
    console.log(`[webhook] event=${event} — not payment.captured, ignoring`);
    return NextResponse.json({ ok: true, ignored: true, reason: 'event_not_captured', event });
  }

  const payment = body.payload?.payment?.entity;
  if (!payment || !payment.id) {
    console.error('[webhook] payment.captured but no payment entity');
    return NextResponse.json({ ok: false, error: 'no_payment_entity' }, { status: 400 });
  }
  const paymentId = payment.id;

  // ─── 3. Kind gate — the funnel sentinel ─────────────────────────────────
  const notes = safeParseNotes(payment.notes);
  const kind = notes.kind ?? '';
  if (kind !== FUNNEL_KIND) {
    console.log(
      `[webhook] paymentId=${paymentId} kind=${kind || '(empty)'} — not our funnel, ignoring`
    );
    return NextResponse.json({ ok: true, ignored: true, reason: 'kind_mismatch', kind });
  }
  console.log(`[webhook] paymentId=${paymentId} kind matched: ${FUNNEL_KIND}`);

  // ─── 4. Test-mode gate ──────────────────────────────────────────────────
  if (!pricing.trackingEnabled) {
    console.log(`[webhook] paymentId=${paymentId} tracking disabled (test fee) — skipping`);
    return NextResponse.json({ ok: true, skipped: 'test_mode', paymentId });
  }

  /* ─── 4b. Host gate ────────────────────────────────────────────────────────
     Nothing downstream of here — Pabbly row or Meta event — may fire from a
     preview deploy or a local tunnel. Gating once, here, covers both.

     console.ERROR, not warn: reaching this line means Razorpay is calling a
     webhook URL that is NOT the production host, which would silently cost
     real conversions. That must be impossible to miss in the logs.
     Prerequisite: the Razorpay webhook URL must point at TRACKING_HOST. */
  if (!isTrackingHost(req)) {
    console.error(
      `[webhook] paymentId=${paymentId} REJECTED — arrived on host "${requestHost(req)}", expected "${TRACKING_HOST}". ` +
        'No Pabbly row, no Meta event. Check the Razorpay webhook URL.'
    );
    return NextResponse.json({ ok: true, skipped: 'wrong_host', paymentId });
  }

  // ─── 5. Unpack the notes create-order packed ────────────────────────────
  const cust = safeParseJson(notes.cust);
  const utm = safeParseJson(notes.utm);

  const firstName = cust.fn ?? '';
  const lastName = cust.ln ?? '';
  const email = cust.em ?? '';
  const phoneDigits = cust.ph ?? '';
  const city = cust.ct ?? '';
  const countryCode = cust.co ?? '';
  const dialCode = cust.dl ?? '';
  const customerType = cust.tp ?? '';
  const fullPhone = `${dialCode}${phoneDigits}`;

  const fbp = notes.fbp || undefined;
  const clientIp = notes.ip || undefined;
  const clientUserAgent = notes.ua || undefined;
  const eventSourceUrl = notes.esu || CANONICAL_CHECKOUT_URL;
  const fbclid = notes.clid ?? '';

  /* First-touch session context — CRM columns only, never Meta user_data. */
  const referrer = notes.rf ?? '';
  const landingUrl = notes.lu ?? '';

  /* L6 — last line of defence. create-order already resolves attribution, but
     this repairs orders created before that shipped, and any case where the
     notes still arrived blank: utm_* is re-parsed out of the referrer, and
     fbclid is derived from Meta's own _fbc.

     Deliberately NOT parsing fbclid from `rf`: that note is capped at 256
     chars and a real fbclid runs ~195, so a referrer-parsed fbclid is usually
     truncated. _fbc carries it in full. */
  const resolvedAttr = resolveAttribution({
    cookieAttr: {
      source: utm.s ?? '',
      medium: utm.m ?? '',
      campaign: utm.c ?? '',
      content: utm.n ?? '',
      term: utm.t ?? '',
      fbclid: notes.clid ?? '',
      ts: Number(notes.ts) || 0,
    },
    referrer,
    landingUrl,
    fbc: notes.fbc || '',
  });

  /* create-order's verdict wins when it had one; otherwise this run's. */
  const attributionSource = notes.asrc || resolvedAttr.provenance;
  if (resolvedAttr.utmSource === 'none') {
    console.error(
      `[webhook] paymentId=${paymentId} ATTRIBUTION MISSING — utm blank in notes, referrer and url`
    );
  } else {
    console.log(`[webhook] paymentId=${paymentId} attribution ${attributionSource}`);
  }

  /* Defensive hybrid rebuild. create-order already resolves _fbc, so notes.fbc
     is normally populated; this covers orders created before that shipped and
     any case where the cookie was absent at order time. Costs nothing when
     notes.fbc is already set. */
  const fbc =
    resolveFbc({
      cookieFbc: notes.fbc || '',
      fbclid: resolvedAttr.fbclid || fbclid,
      fbclidTs: resolvedAttr.fbclidTs || Number(notes.ts) || undefined,
    }) || undefined;

  // ─── 6. Server-derived values ───────────────────────────────────────────
  /* Razorpay sends paise; Pabbly and Meta both want rupees. The SDK has
     returned amount as a string in some versions, hence the coercion. */
  const rawAmount =
    typeof payment.amount === 'string' ? parseInt(payment.amount, 10) : payment.amount;
  const amountInRupees =
    typeof rawAmount === 'number' && Number.isFinite(rawAmount) && rawAmount > 0
      ? Math.round(rawAmount / 100)
      : pricing.inr;
  const currency =
    typeof payment.currency === 'string' && payment.currency.length > 0
      ? payment.currency
      : pricing.currency;

  const paymentDate = payment.created_at ? new Date(payment.created_at * 1000) : new Date();

  /* Must be identical to the browser MAM value and to the CAPI user_data
     external_id, or Meta treats one person as several. */
  const externalId = email ? sha256(email.trim().toLowerCase()) : '';

  // ─── 7. Pabbly payload — columns A–W of the CRM sheet ───────────────────
  const pabblyPayload = {
    first_name: firstName,
    last_name: lastName,
    full_name: `${firstName} ${lastName}`.trim(),
    email,
    phone: fullPhone,
    city,
    country_code: countryCode,
    customer_type: customerType,
    payment_id: paymentId,
    order_id: payment.order_id,
    amount: String(amountInRupees),
    currency,
    payment_date: paymentDate.toLocaleDateString('en-IN', { timeZone: brand.paymentTimezone }),
    payment_time: paymentDate.toLocaleTimeString('en-IN', { timeZone: brand.paymentTimezone }),
    payment_timestamp: paymentDate.toISOString(),
    /* Resolved, not raw: falls back through cookie -> body -> referrer so a
       blank notes.utm still produces a populated CRM row. */
    utm_source: resolvedAttr.utm.source,
    utm_medium: resolvedAttr.utm.medium,
    utm_campaign: resolvedAttr.utm.campaign,
    utm_content: resolvedAttr.utm.content,
    utm_term: resolvedAttr.utm.term,
    lead_id: paymentId,
    created_at: paymentDate.toISOString(),
    fbc: fbc ?? '',
    fbp: fbp ?? '',
    client_ip_address: clientIp ?? '',
    client_user_agent: clientUserAgent ?? '',
    external_id: externalId,
    event_source_url: eventSourceUrl,
    /* Reflects the actual mode rather than a hardcoded 'false'. trackingEnabled
       goes false on the ₹1 live-test fee, which is exactly when a row must be
       marked as a test in the CRM. */
    is_test: pricing.trackingEnabled ? 'false' : 'true',
    purchase_event_id: paymentId,
    /* Resolved: derived from _fbc when the captured value was lost. _fbc is
       the only COMPLETE source — a referrer-parsed fbclid is truncated. */
    fbclid: resolvedAttr.fbclid,
    /* Which layer supplied the attribution, e.g. "utm:cookie|clid:fbc".
       Map this to a CRM column: it turns a silent blank row into a diagnosis. */
    attribution_source: attributionSource,
    /* SOP fields #24/#25 — first-touch context, so an ops team can still
       classify a buyer whose utm_* all came through blank. */
    referrer,
    landing_url: landingUrl,
  };

  // ─── 8. Fire Pabbly (never throws into the response) ────────────────────
  let pabblyResult = 'skipped';
  const webhookUrl = process.env.PABBLY_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const pabblyRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pabblyPayload),
      });
      if (pabblyRes.ok) {
        pabblyResult = 'sent';
        console.log(`[webhook] paymentId=${paymentId} Pabbly sent (${pabblyRes.status})`);
      } else {
        pabblyResult = 'error';
        console.error(`[webhook] paymentId=${paymentId} Pabbly failed (${pabblyRes.status})`);
      }
    } catch (err) {
      pabblyResult = 'error';
      console.error(`[webhook] paymentId=${paymentId} Pabbly error:`, err);
    }
  } else {
    console.warn('[webhook] PABBLY_WEBHOOK_URL not set — Pabbly skipped');
  }

  // ─── 9. Fire Meta CAPI — the `sales` custom event, never `Purchase` ─────
  let capiResult = 'skipped';
  const metaPixelId = process.env.META_PIXEL_ID;
  const metaAccessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (metaPixelId && metaAccessToken && email) {
    try {
      await sendMetaCapiEvent({
        pixelId: metaPixelId,
        accessToken: metaAccessToken,
        paymentId,
        orderId: payment.order_id,
        email,
        phone: fullPhone,
        firstName,
        lastName,
        city,
        countryCode,
        eventSourceUrl,
        value: amountInRupees,
        currency,
        fbc,
        fbp,
        clientIp,
        clientUserAgent,
      });
      capiResult = 'sent';
      console.log(`[webhook] paymentId=${paymentId} Meta CAPI sent (sales)`);
    } catch (err) {
      capiResult = 'error';
      console.error(`[webhook] paymentId=${paymentId} Meta CAPI error:`, err);
    }
  } else if (!metaPixelId || !metaAccessToken) {
    console.warn('[webhook] META_PIXEL_ID / META_CAPI_ACCESS_TOKEN not set — CAPI skipped');
  } else if (!email) {
    console.warn(`[webhook] paymentId=${paymentId} email missing from notes.cust — CAPI skipped`);
  }

  // ─── 10. Self-documenting confirmation ──────────────────────────────────
  return NextResponse.json({
    ok: true,
    paymentId,
    kind,
    pabbly: pabblyResult,
    capi: capiResult,
  });
}
