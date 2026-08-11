'use client';

import '@/styles/funnel-pages.css';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import useReveal from '@/hooks/useReveal';
import FunnelSteps from '@/components/FunnelSteps';
import SiteFooter from '@/components/SiteFooter';
import { payMarks } from '@/components/PayMarks';
import { Arrow, Check, ChevronDown, Lock, Shield } from '@/components/Icons';
import { checkout } from '@/lib/content';
import { brand, pricing } from '@/lib/config';
import { setMetaAdvancedMatching } from '@/lib/analytics';
import { trackPayClickAttempt, trackValidatedCheckoutIntent } from '@/lib/funnel-events';
import { restoreUtm, restoreFbclid } from '@/lib/utm';

const stripIcons = [Lock, Shield, Lock];

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

const EMPTY = { firstName: '', lastName: '', email: '', city: '', phone: '' };

/**
 * Loads Razorpay's checkout bundle on demand rather than on page load.
 *
 * It is ~100KB of third-party JS that only matters to the minority of
 * visitors who actually reach the Pay button, and this page's job before that
 * click is to render fast. Resolving a promise (rather than firing the modal
 * from an onLoad callback) also removes the race where a fast clicker beats
 * the script and gets a dead button.
 */
function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('no window'));
    if (window.Razorpay) return resolve(window.Razorpay);

    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Razorpay));
      existing.addEventListener('error', () => reject(new Error('razorpay script failed')));
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('razorpay script failed'));
    document.body.appendChild(script);
  });
}

/**
 * Validation lives in one function so the Pay handler and the form-fill
 * Advanced Matching effect can never disagree about what "valid" means.
 * Returns a map of field → message; empty map means clean.
 */
function validateFields(fields, dialCode) {
  const errors = {};

  if (!fields.firstName.trim()) errors.firstName = 'Please enter your first name.';
  if (!fields.lastName.trim()) errors.lastName = 'Please enter your last name.';

  const email = fields.email.trim();
  if (!email) errors.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    errors.email = 'That email address does not look right.';

  if (!fields.city.trim()) errors.city = 'Please enter your city.';

  const digits = fields.phone.replace(/\D/g, '');
  if (!digits) errors.phone = 'Please enter your phone number.';
  else if (dialCode === '+91' && digits.length !== 10)
    errors.phone = 'An Indian number is 10 digits.';
  else if (digits.length < 6 || digits.length > 15) errors.phone = 'That number does not look right.';

  return errors;
}

/**
 * §10 Transaction — step 1 of the funnel (checkout → book → thank-you).
 *
 * Details form on the left, order summary on the right, one focal action. The
 * ₹97 total is the lit value moment (C3) and the only place on the site that
 * still names a price.
 *
 * ── Tracking, and why the order of operations is not negotiable ───────────
 * Three things fire from this page, at three different moments:
 *
 *   1. Advanced Matching — 500ms after the form first validates clean, so the
 *      pixel knows who he is even if he never pays.
 *   2. GA4 `initiate_checkout` — at the TOP of the Pay handler, BEFORE
 *      validation. The question it answers is "how many men tried to pay",
 *      and a man who bounced off a validation error tried. This is also why
 *      the form carries noValidate: with native validation the browser would
 *      swallow the submit event on an invalid form and this would never fire.
 *   3. Meta `ic_event` — AFTER validation passes, immediately before
 *      create-order. It feeds an abandoned-checkout audience, which a
 *      half-filled form is not.
 *
 * Nothing here calls a verify-payment route. The Razorpay webhook is the sole
 * tracking authority for a completed payment, precisely so that the UPI payer
 * who never returns to this tab is still counted.
 */
export default function Checkout() {
  useReveal();
  const router = useRouter();

  /* Open by default — the collapse only exists so the summary does not bury the
     form on a phone, not to hide the order. */
  const [sumOpen, setSumOpen] = useState(true);
  const [fields, setFields] = useState(EMPTY);
  const [dialCode, setDialCode] = useState('+91');
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);
  const [payErr, setPayErr] = useState('');
  const formRef = useRef(null);

  const countryCode =
    (checkout.dialCodes.find((d) => d.code === dialCode)?.label || 'IN').toLowerCase();

  const setField = (name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
    /* Clear this field's error as he fixes it. Leaving a stale red message
       under a field he has just corrected reads as "still wrong". */
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  /* ── Advanced Matching on a valid, filled form ──
     The earliest moment we know who this man is. Debounced 500ms so we hash
     once he stops typing rather than on every keystroke, and fired regardless
     of whether he goes on to pay — an identified abandoner is still worth
     recognising on his next visit. */
  useEffect(() => {
    const allFilled = Object.values(fields).every((v) => v.trim());
    if (!allFilled) return;
    if (Object.keys(validateFields(fields, dialCode)).length > 0) return;

    const timer = setTimeout(() => {
      void setMetaAdvancedMatching({
        email: fields.email,
        phone: `${dialCode}${fields.phone}`,
        firstName: fields.firstName,
        lastName: fields.lastName,
        city: fields.city,
        country: countryCode,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [fields, dialCode, countryCode]);

  const customerPayload = () => ({
    firstName: fields.firstName.trim(),
    lastName: fields.lastName.trim(),
    email: fields.email.trim(),
    city: fields.city.trim(),
    phone: fields.phone.replace(/\D/g, ''),
    countryCode,
    dialCode,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paying) return;

    /* (2) BEFORE validation, first click only. See the header block. */
    trackPayClickAttempt();

    const found = validateFields(fields, dialCode);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstBad = Object.keys(found)[0];
      formRef.current
        ?.querySelector(`[name="${firstBad}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      formRef.current?.querySelector(`[name="${firstBad}"]`)?.focus({ preventScroll: true });
      return;
    }

    setPayErr('');
    setPaying(true);
    const customer = customerPayload();

    try {
      /* (3) Validated intent → Meta. Awaited so it lands before the modal
         steals focus, but it swallows its own errors: a tracking failure must
         never be the reason a man cannot pay. */
      await trackValidatedCheckoutIntent(customer);

      const Razorpay = await loadRazorpay();

      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          utm: restoreUtm(),
          fbclid: restoreFbclid(),
        }),
      });

      const order = await res.json();
      if (!res.ok || !order.orderId) throw new Error(order.error || 'order failed');

      const rzp = new Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: brand.name,
        description: checkout.summaryTitle,
        prefill: {
          name: `${customer.firstName} ${customer.lastName}`.trim(),
          email: customer.email,
          contact: `${dialCode}${customer.phone}`,
        },
        notes: { kind: 'client_funnel' },
        theme: { color: '#071A33' },
        handler: async () => {
          /* Refresh Advanced Matching with the final values, then hand him to
             the scheduler. Deliberately no tracking call here: the webhook has
             already been told by Razorpay, server to server. */
          await setMetaAdvancedMatching({
            email: customer.email,
            phone: `${dialCode}${customer.phone}`,
            firstName: customer.firstName,
            lastName: customer.lastName,
            city: customer.city,
            country: countryCode,
          });
          router.push('/book-a-call');
        },
        modal: {
          /* He closed the modal without paying. Give the button back rather
             than leaving him staring at a spinner. */
          ondismiss: () => setPaying(false),
        },
      });

      rzp.on('payment.failed', (response) => {
        setPaying(false);
        setPayErr(
          response?.error?.description ||
            'That payment did not go through. Please try again, or use a different method.'
        );
      });

      rzp.open();
    } catch (err) {
      console.error('[checkout]', err);
      setPaying(false);
      setPayErr(
        'We could not open the payment page just now. Please try again in a moment — or write to us and we will send you a payment link directly.'
      );
    }
  };

  /* The mobile pay bar routes through the form's own submit so there is
     exactly one payment path, and one place where the tracking order is
     defined. */
  const payNow = () => formRef.current?.requestSubmit();

  const half = checkout.fields.filter((f) => f.half);
  const full = checkout.fields.filter((f) => !f.half);

  const field = (f) => (
    <div className={`fp-field${f.half ? ' fp-field-half' : ''}`} key={f.name}>
      <label htmlFor={f.name}>
        {f.label} <span className="fp-req">*</span>
      </label>
      {f.dial ? (
        <div className="fp-dialrow">
          <select
            className="fp-dial"
            name="dial"
            aria-label="Country dialling code"
            value={dialCode}
            onChange={(e) => setDialCode(e.target.value)}
          >
            {checkout.dialCodes.map((d) => (
              <option key={d.code} value={d.code}>
                {d.label} {d.code}
              </option>
            ))}
          </select>
          <input
            id={f.name}
            name={f.name}
            type={f.type}
            autoComplete={f.autoComplete}
            placeholder={f.placeholder}
            value={fields[f.name]}
            onChange={(e) => setField(f.name, e.target.value)}
            aria-invalid={errors[f.name] ? true : undefined}
            aria-describedby={errors[f.name] ? `${f.name}-err` : undefined}
          />
        </div>
      ) : (
        <input
          id={f.name}
          name={f.name}
          type={f.type}
          autoComplete={f.autoComplete}
          placeholder={f.placeholder}
          value={fields[f.name]}
          onChange={(e) => setField(f.name, e.target.value)}
          aria-invalid={errors[f.name] ? true : undefined}
          aria-describedby={errors[f.name] ? `${f.name}-err` : undefined}
        />
      )}
      {errors[f.name] && (
        <span className="fp-fielderr" id={`${f.name}-err`} role="alert">
          {errors[f.name]}
        </span>
      )}
    </div>
  );

  return (
    <main className="sdp-root fp-page">
      <div className="fp-truststrip">
        <div className="sdp-wrap fp-truststrip-inner">
          {checkout.trustStrip.map((t, i) => {
            const Ico = stripIcons[i % stripIcons.length];
            return (
              <span className="fp-trustitem" key={t}>
                <Ico size={13} />
                {t}
              </span>
            );
          })}
        </div>
      </div>

      <div className="sdp-wrap">
        <FunnelSteps current={0} />

        <div className="fp-grid fp-grid-checkout">
          {/* ── details form ── */}
          <div className="fp-panel" data-sdp-reveal>
            <span className="fp-panel-title">{checkout.formEyebrow}</span>
            <h1 className="fp-panel-h">{checkout.formTitle}</h1>

            {/* noValidate is load-bearing, not laziness — see the header block:
                native validation would swallow the submit event and GA4's
                "he tried to pay" signal with it. */}
            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="fp-fieldrow">{half.map(field)}</div>
              {full.map(field)}

              <div className="fp-paybtn">
                <button className="sdp-cta" type="submit" disabled={paying}>
                  <span className="sdp-cta-line">
                    <span className="sdp-cta-text">
                      {paying ? 'Opening secure payment…' : checkout.button}
                    </span>
                    <span className="arrow">
                      <Arrow size={13} />
                    </span>
                  </span>
                </button>
              </div>
            </form>

            <em className="fp-micro">{checkout.microline}</em>

            {payErr && (
              <p className="fp-payerr" role="alert">
                {payErr}
              </p>
            )}

            {/* Network marks rather than the old UPI/CARDS/NETBANKING/WALLETS
                text tiles — a logo row is read at a glance, four words are not. */}
            <div className="fp-methods" aria-label="Accepted payment methods">
              {payMarks.map(({ key, Art }) => (
                <span className="fp-method" key={key}>
                  <Art />
                </span>
              ))}
            </div>
          </div>

          {/* ── order summary ── */}
          <div className="fp-summary-col">
            <div
              className="fp-panel fp-summary"
              data-collapsed={sumOpen ? undefined : ''}
              data-sdp-reveal
              style={{ '--d': '.06s' }}
            >
              {/* Mobile-only handle. On a phone the summary sits above the form
                  (see .fp-summary-col order), so it needs to be collapsible or
                  it buries the fields. Open by default: the man should see what
                  he is paying for without having to ask for it. */}
              <button
                type="button"
                className="fp-sum-toggle"
                aria-expanded={sumOpen}
                aria-controls="order-summary-body"
                onClick={() => setSumOpen((v) => !v)}
              >
                <span className="fp-sum-toggle-name">{checkout.summaryTitle}</span>
                <span className="fp-sum-toggle-price">{checkout.total}</span>
                <span className="fp-sum-chev" aria-hidden="true">
                  <ChevronDown size={14} />
                </span>
              </button>

              <div className="fp-sum-body" id="order-summary-body">
              <span className="fp-panel-title">{checkout.summaryEyebrow}</span>
              <h2 className="fp-panel-h">{checkout.summaryTitle}</h2>
              <span className="fp-sumpill">{checkout.summaryPill}</span>

              <ul className="fp-sumpoints">
                {checkout.summaryPoints.map((p) => (
                  <li key={p}>
                    <span className="fp-sumtick">
                      <Check size={12} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <div className="fp-pricerow">
                {checkout.totalStrike && <s className="fp-price-was">{checkout.totalStrike}</s>}
                <span className="fp-price-now">{checkout.total}</span>
                {checkout.saveBadge && <span className="fp-save">{checkout.saveBadge}</span>}
              </div>
              <p className="fp-riskline">
                <Shield size={13} />
                {checkout.riskLine}
              </p>

              {/* The [MISSING refund terms] placeholder that used to sit here is
                  gone now the policy pages exist — this points at them instead.
                  MISSING.refundTerms still records the open question in
                  content.js: the refund page states what the guarantee covers
                  without inventing terms for the ₹97 itself. */}
              <p className="fp-legalnote">
                By paying you agree to our{' '}
                <a href="/terms">Terms</a>, <a href="/privacy">Privacy Policy</a> and{' '}
                <a href="/refund">Refund Policy</a>.
              </p>

              <div className="fp-team">
                <span className="fp-team-av">{checkout.team.initials}</span>
                <div>
                  <strong>{checkout.team.name}</strong>
                  <span>{checkout.team.meta}</span>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />

      {/* ── Mobile-only pay bar ──
          A phone shows the summary first and the button sits well below the
          fold, so the page can read as "nothing to do here". This keeps the
          action in reach. Desktop has the button in view already and does not
          get one. */}
      <div className="fp-paybar" aria-hidden={false}>
        <div className="sdp-wrap fp-paybar-inner">
          <span className="fp-paybar-price">
            <s>{checkout.totalStrike}</s>
            {checkout.total}
          </span>
          <button type="button" className="sdp-cta" onClick={payNow} disabled={paying}>
            <span className="sdp-cta-line">
              <span className="sdp-cta-text">{paying ? 'Opening…' : 'Pay Now'}</span>
              <span className="arrow">
                <Arrow size={12} />
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Test-mode tell. When the fee is dropped to ₹1 for a live payment test,
          every tracking side effect is gated off server-side — this makes that
          visible rather than leaving someone wondering why Events Manager is
          silent. Never renders in production. */}
      {!pricing.trackingEnabled && (
        <p className="fp-micro" style={{ textAlign: 'center', padding: '0 0 1rem' }}>
          Test mode · ₹{pricing.inr} · tracking disabled
        </p>
      )}
    </main>
  );
}
