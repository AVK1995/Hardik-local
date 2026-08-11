import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

import { pricing, CANONICAL_CHECKOUT_URL } from '@/lib/config';
import { readRequestContext } from '@/lib/request-context';

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
    const { customer, utm, fbclid } = body;

    /* The server is the price authority. The client does not get to name the
       amount — it only ever says "start a payment". */
    const amount = pricing.paise;
    const currency = pricing.currency;

    const { fbc, fbp, clientIp, clientUserAgent } = readRequestContext(req);

    const notes = {
      kind: FUNNEL_KIND,
      cust: truncate(
        JSON.stringify({
          fn: customer?.firstName ?? '',
          ln: customer?.lastName ?? '',
          em: customer?.email ?? '',
          ph: customer?.phone ?? '',
          ct: customer?.city ?? '',
          co: customer?.countryCode ?? '',
          dl: customer?.dialCode ?? '',
          tp: customer?.customerType ?? '',
        })
      ),
      utm: truncate(
        JSON.stringify({
          s: utm?.source ?? '',
          m: utm?.medium ?? '',
          c: utm?.campaign ?? '',
          n: utm?.content ?? '',
          t: utm?.term ?? '',
        })
      ),
      clid: truncate(fbclid ?? ''),
      fbc: truncate(fbc),
      fbp: truncate(fbp),
      ip: truncate(clientIp),
      ua: truncate(clientUserAgent),
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
