import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

import { pricing, CANONICAL_CHECKOUT_URL } from '@/lib/config';
import { readRequestContext, resolveFbc } from '@/lib/request-context';
import {
  ATTR_COOKIE,
  packJsonNote,
  readAttrCookie,
  resolveAttribution,
} from '@/lib/attribution';

/* ═══════════════════════════════════════════════════════════════════════════
   Creates the Razorpay order — and, just as importantly, snapshots everything
   the webhook will need into the order's `notes`.

   The webhook is server-to-server: when Razorpay calls it there is no browser,
   no cookies, no user-agent, no UTM state. Whatever we fail to pack here is
   permanently lost by the time the payment is captured. That is why the
   customer, the UTMs, the Meta cookies and the request context all ride along
   inside the order.

   Razorpay's limits (docs.razorpay.com/api/understand): max 15 note keys,
   256 chars per value. We use 9 and truncate every value defensively — a
   monster in-app-browser user-agent or a long fbclid must never be the reason
   orders.create throws and the man cannot pay.
   ═══════════════════════════════════════════════════════════════════════════ */

const NOTE_MAX_VALUE_LEN = 256;

/* Sentinel the webhook gates on. This Razorpay account can also take payment
   links, invoices and other funnels' traffic; without the gate every one of
   those would land in Pabbly and fire a Meta conversion. */
const FUNNEL_KIND = 'client_funnel';

function truncate(value, max = NOTE_MAX_VALUE_LEN) {
  if (!value) return '';
  return value.length > max ? value.slice(0, max) : value;
}

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export async function POST(req) {
  try {
    if (!razorpay) {
      console.error('[create-order] Razorpay not configured — missing env vars');
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { customer, utm, fbclid, fbclidTs, referrer, landingUrl } = body;

    /* The server is the price authority. The client does not get to name the
       amount — it only ever says "start a payment". */
    const amount = pricing.paise;
    const currency = pricing.currency;

    const { fbc: cookieFbc, fbp, clientIp, clientUserAgent } = readRequestContext(req);

    /* L2 — the SERVER's own view of attribution comes first. Middleware wrote
       this cookie off the real query string on the first request, so it does
       not depend on the browser having hydrated, or on the browser being
       honest. The client body is a supplement, not the source of truth. */
    const cookieAttr = readAttrCookie(req.cookies.get(ATTR_COOKIE)?.value);
    const bodyAttr = {
      source: utm?.source ?? '',
      medium: utm?.medium ?? '',
      campaign: utm?.campaign ?? '',
      content: utm?.content ?? '',
      term: utm?.term ?? '',
      fbclid: fbclid ?? '',
      ts: Number(fbclidTs) || 0,
      referrer: referrer ?? '',
      landing_url: landingUrl ?? '',
    };

    /* L3 + L4 — falls back to parsing utm_* out of the referrer, then to
       deriving fbclid + click-ts from Meta's own _fbc cookie. */
    const resolved = resolveAttribution({
      cookieAttr,
      bodyAttr,
      referrer: referrer || cookieAttr.referrer || '',
      landingUrl: landingUrl || cookieAttr.landing_url || '',
      fbc: cookieFbc,
    });

    /* Hybrid _fbc, resolved ONCE here so the same value reaches both the
       order notes (and therefore the webhook's CAPI event) and Pabbly. On
       iOS / in-app browsers the cookie is absent and this rebuild is the only
       thing keeping attribution deterministic. */
    const fbc = resolveFbc({
      cookieFbc,
      fbclid: resolved.fbclid,
      fbclidTs: resolved.fbclidTs,
    });

    if (resolved.utmSource === 'none') {
      console.error('[create-order] ATTRIBUTION MISSING — no utm from url/cookie/body/referrer');
    } else {
      console.log(`[create-order] attribution ${resolved.provenance}`);
    }

    const notes = {
      kind: FUNNEL_KIND,
      /* L5 — packJsonNote shortens the longest VALUE until the blob fits 256.
         The old truncate(JSON.stringify(...)) sliced mid-JSON on a long
         campaign name, which made the note unparseable and lost every utm
         field at once rather than clipping one. */
      cust: packJsonNote({
        fn: customer?.firstName ?? '',
        ln: customer?.lastName ?? '',
        em: customer?.email ?? '',
        ph: customer?.phone ?? '',
        ct: customer?.city ?? '',
        co: customer?.countryCode ?? '',
        dl: customer?.dialCode ?? '',
        tp: customer?.customerType ?? '',
      }),
      utm: packJsonNote({
        s: resolved.utm.source,
        m: resolved.utm.medium,
        c: resolved.utm.campaign,
        n: resolved.utm.content,
        t: resolved.utm.term,
      }),
      clid: truncate(resolved.fbclid),
      /* Click time in epoch ms. Carried so the webhook can defensively rebuild
         _fbc for orders created before this shipped, or if `fbc` were ever to
         arrive empty. */
      ts: truncate(String(resolved.fbclidTs || '')),
      /* Which layer supplied the attribution. Written through to Pabbly so a
         blank row is diagnosable instead of mysterious. */
      asrc: truncate(resolved.provenance),
      fbc: truncate(fbc),
      fbp: truncate(fbp),
      ip: truncate(clientIp),
      ua: truncate(clientUserAgent),
      /* First-touch session context. CRM columns only — these are NEVER part
         of Meta user_data. They are what classifies an untagged buyer by
         channel when every utm_* comes through blank. */
      rf: truncate(resolved.referrer),
      lu: truncate(resolved.landingUrl),
      /* Canonical, query-free. The live URL routinely blows past 256 chars
         once utm_* and fbclid are on it, and the query data is preserved in
         the `utm` + `clid` notes anyway. */
      esu: CANONICAL_CHECKOUT_URL,
    };

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
      notes,
    });

    console.log(`[create-order] order=${order.id} amount=${amount} notes packed`);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('[create-order]', error);
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}
