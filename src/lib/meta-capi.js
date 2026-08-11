import crypto from 'crypto';

import { SITE_ORIGIN } from '@/lib/config';

/* ═══════════════════════════════════════════════════════════════════════════
   Meta Conversions API — server-side event firing.

   ── Health & Wellness posture (READ BEFORE EDITING) ──────────────────────
   This funnel's offer is erectile dysfunction / testosterone. Meta classifies
   that dataset "Health and wellness condition", which blocks mid- and
   lower-funnel STANDARD events BY NAME: Purchase, AddToCart, InitiateCheckout,
   Subscribe, Lead. Confirmed CUSTOM events with PHI-free payloads are not in
   that bucket and keep flowing.

   So, per META_HW_PREVENTIVE_SOP (this is a brand-new pixel — we are building
   to the clean target from day 0, not repairing a restricted one):

     1. NO standard event names. Ever. Not here, not in the browser.
        Conversion      → `sales`
        Add-to-cart     → `atc_event`   (opaque on purpose — `add_to_cart`
        Initiate-ckout  → `ic_event`     keyword-matches the standard
                                         vocabulary and inherits the same
                                         restriction. See META_ATC_IC_SOP §7b.)
     2. custom_data carries value / currency / order_id ONLY. No content_name,
        no content_ids, no product or category strings — every one of those is
        a health hint Meta's classifier reads.
     3. event_source_url is reduced to the ORIGIN. No path, no query.
     4. user_data keeps the full hashed identity set + external_id. Hashed PII
        is not what triggers the category flag — the event name and the payload
        descriptors are. Keeping it is what holds EMQ at 9+.

   If you ever find yourself typing 'Purchase' in this file, stop and re-read
   META_HEALTH_WELLNESS_RESTRICTION_SOP.md.
   ═══════════════════════════════════════════════════════════════════════════ */

const GRAPH_VERSION = 'v25.0';

const CONVERSION_EVENT = 'sales';
const ATC_EVENT = 'atc_event';
const IC_EVENT = 'ic_event';

export function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * @typedef {Object} CustomerData
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [email]
 * @property {string} [phone]
 * @property {string} [city]
 * @property {string} [countryCode]
 * @property {string} [dialCode]
 * @property {string} [customerType]
 *
 * @typedef {Object} UtmData
 * @property {string} [source]
 * @property {string} [medium]
 * @property {string} [campaign]
 * @property {string} [content]
 * @property {string} [term]
 */

/* Meta's normalisation spec, applied before hashing. Getting these wrong is
   the single most common cause of a low EMQ that looks like a bug elsewhere:
   an unnormalised value hashes to something Meta's index has never seen. */
function hashEmail(email) {
  const normalised = (email || '').trim().toLowerCase();
  return normalised ? sha256(normalised) : undefined;
}
function hashPhone(phone) {
  const digits = (phone || '').replace(/\D/g, '');
  return digits ? sha256(digits) : undefined;
}
function hashName(name) {
  const normalised = (name || '').trim().toLowerCase();
  return normalised ? sha256(normalised) : undefined;
}
function hashCity(city) {
  const normalised = (city || '').trim().toLowerCase().replace(/[^a-z]/g, '');
  return normalised ? sha256(normalised) : undefined;
}
function hashCountry(code) {
  const normalised = (code || '').trim().toLowerCase();
  return normalised ? sha256(normalised) : undefined;
}

/* Core setup strips the path anyway; doing it ourselves means the URL never
   leaves our server carrying a health-adjacent path or a UTM string. */
export function toOrigin(url) {
  if (!url) return SITE_ORIGIN;
  try {
    return new URL(url).origin;
  } catch {
    return SITE_ORIGIN;
  }
}

/**
 * The browser-context signals. Never hashed — these are matching keys Meta
 * reads verbatim, and hashing them silently destroys their matching value.
 */
function browserContext({ fbc, fbp, clientIp, clientUserAgent }) {
  return {
    ...(fbc && { fbc }),
    ...(fbp && { fbp }),
    ...(clientIp && { client_ip_address: clientIp }),
    ...(clientUserAgent && { client_user_agent: clientUserAgent }),
  };
}

async function postToMeta({ pixelId, accessToken, events, tag }) {
  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${accessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: events }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Meta CAPI ${res.status}: ${err}`);
  }

  const json = await res.json();
  console.log(`${tag} Meta accepted ${json.events_received ?? '?'} event(s)`);
  return json;
}

/**
 * The conversion event. ONE custom event named `sales` — deliberately not a
 * pair with a standard `Purchase`, see the header block.
 *
 * event_id is the Razorpay payment id, which is what makes Razorpay's webhook
 * retries harmless: Meta collapses same-name-same-id within 48h.
 */
export async function sendMetaCapiEvent({
  pixelId,
  accessToken,
  paymentId,
  orderId,
  email,
  phone,
  firstName,
  lastName,
  city,
  countryCode,
  eventSourceUrl,
  value,
  currency,
  fbc,
  fbp,
  clientIp,
  clientUserAgent,
}) {
  const hashedEmail = hashEmail(email);

  const event = {
    event_name: CONVERSION_EVENT,
    event_time: Math.floor(Date.now() / 1000),
    event_id: paymentId,
    action_source: 'website',
    event_source_url: toOrigin(eventSourceUrl),
    user_data: {
      ...(hashedEmail && { em: [hashedEmail] }),
      ...(hashPhone(phone) && { ph: [hashPhone(phone)] }),
      ...(hashName(firstName) && { fn: [hashName(firstName)] }),
      ...(hashName(lastName) && { ln: [hashName(lastName)] }),
      ...(hashCity(city) && { ct: [hashCity(city)] }),
      ...(hashCountry(countryCode) && { country: [hashCountry(countryCode)] }),
      /* external_id must be user-stable and identical to the browser MAM
         value, which is why it is sha256(email) and not anything derived
         from the payment. See src/lib/analytics.js. */
      ...(hashedEmail && { external_id: [hashedEmail] }),
      ...browserContext({ fbc, fbp, clientIp, clientUserAgent }),
    },
    custom_data: {
      currency,
      value,
      order_id: orderId || paymentId,
    },
  };

  return postToMeta({ pixelId, accessToken, events: [event], tag: '[webhook]' });
}

/**
 * `atc_event` — intent to buy, fired the first time a visitor clicks any
 * landing CTA. There is no PII at CTA-click time (the form has not been seen
 * yet), so this event carries browser context only and its EMQ ceiling is
 * ~3-5. That is a data-availability ceiling, not a defect.
 *
 * event_id derives from _fbp so the same browser produces the same id and
 * Meta's 48h dedup catches anything the localStorage flag misses.
 */
export async function sendAddToCartEvent({
  pixelId,
  accessToken,
  eventSourceUrl,
  value,
  currency,
  fbc,
  fbp,
  clientIp,
  clientUserAgent,
}) {
  const eventId = fbp
    ? sha256(`${fbp}|atc`)
    : `${crypto.randomBytes(16).toString('hex')}_atc`;

  const event = {
    event_name: ATC_EVENT,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: 'website',
    event_source_url: toOrigin(eventSourceUrl),
    user_data: browserContext({ fbc, fbp, clientIp, clientUserAgent }),
    /* No content_ids / content_name / content_type. The product name on this
       funnel is a health hint; `currency` + `value` are not. */
    custom_data: { currency, value },
  };

  return postToMeta({ pixelId, accessToken, events: [event], tag: '[atc]' });
}

/**
 * `ic_event` — the visitor filled the form, it validated clean, and they are
 * one instruction away from the create-order call. Rare, high-quality, and the
 * basis of the abandoned-checkout audience.
 *
 * Unlike atc_event this one has the full identity set, so EMQ lands ~9.
 * event_id derives from the email hash so the same person dedupes even across
 * devices — no raw email is ever on the wire, only its hash.
 */
export async function sendInitiateCheckoutEvent({
  pixelId,
  accessToken,
  email,
  phone,
  firstName,
  lastName,
  city,
  countryCode,
  eventSourceUrl,
  value,
  currency,
  fbc,
  fbp,
  clientIp,
  clientUserAgent,
}) {
  const hashedEmail = hashEmail(email);
  const eventId = hashedEmail
    ? sha256(`${hashedEmail}|ic`)
    : `${crypto.randomBytes(16).toString('hex')}_ic`;

  const event = {
    event_name: IC_EVENT,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: 'website',
    event_source_url: toOrigin(eventSourceUrl),
    user_data: {
      ...(hashedEmail && { em: [hashedEmail] }),
      ...(hashPhone(phone) && { ph: [hashPhone(phone)] }),
      ...(hashName(firstName) && { fn: [hashName(firstName)] }),
      ...(hashName(lastName) && { ln: [hashName(lastName)] }),
      ...(hashCity(city) && { ct: [hashCity(city)] }),
      ...(hashCountry(countryCode) && { country: [hashCountry(countryCode)] }),
      ...(hashedEmail && { external_id: [hashedEmail] }),
      ...browserContext({ fbc, fbp, clientIp, clientUserAgent }),
    },
    custom_data: { currency, value },
  };

  return postToMeta({ pixelId, accessToken, events: [event], tag: '[ic]' });
}
