'use client';

import '../funnel-pages.css';

import { useState } from 'react';
import useReveal from '../components/useReveal';
import FunnelSteps from '../components/FunnelSteps';
import SiteFooter from '../components/SiteFooter';
import { Arrow, Check, ChevronDown, Lock, Shield } from '../components/Icons';
import { checkout } from '../content';

const PAYMENT_URL = process.env.NEXT_PUBLIC_PAYMENT_URL || '';
const methodTiles = ['UPI', 'Cards', 'Netbanking', 'Wallets'];
const stripIcons = [Lock, Shield, Lock];

/**
 * §10 Transaction — step 1 of the funnel (checkout → book → thank-you).
 *
 * Rebuilt 2026-08-11 to the client's reference: details form on the left, order
 * summary on the right, one focal action. The ₹97 total is the lit value
 * moment (C3) and the only place on the site that still names a price, now that
 * the CTAs have dropped it.
 *
 * On submit we hand off to the payment provider. Until NEXT_PUBLIC_PAYMENT_URL
 * is set the button cannot complete, so the form says so rather than silently
 * doing nothing — the field values are NOT posted anywhere yet.
 */
export default function Checkout() {
  useReveal();
  /* Open by default — the collapse only exists so the summary does not bury the
     form on a phone, not to hide the order. */
  const [sumOpen, setSumOpen] = useState(true);

  const half = checkout.fields.filter((f) => f.half);
  const full = checkout.fields.filter((f) => !f.half);

  const field = (f) => (
    <div className={`fp-field${f.half ? ' fp-field-half' : ''}`} key={f.name}>
      <label htmlFor={f.name}>
        {f.label} <span className="fp-req">*</span>
      </label>
      {f.dial ? (
        <div className="fp-dialrow">
          <select className="fp-dial" name="dial" aria-label="Country dialling code" defaultValue="+91">
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
            required
          />
        </div>
      ) : (
        <input
          id={f.name}
          name={f.name}
          type={f.type}
          autoComplete={f.autoComplete}
          placeholder={f.placeholder}
          required
        />
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (PAYMENT_URL) window.location.href = PAYMENT_URL;
              }}
            >
              <div className="fp-fieldrow">{half.map(field)}</div>
              {full.map(field)}

              <div className="fp-paybtn">
                <button className="sdp-cta" type="submit" disabled={!PAYMENT_URL}>
                  <span className="sdp-cta-line">
                    <span className="sdp-cta-text">{checkout.button}</span>
                    <span className="arrow">
                      <Arrow size={13} />
                    </span>
                  </span>
                </button>
              </div>
            </form>

            <em className="fp-micro">{checkout.microline}</em>

            {!PAYMENT_URL && (
              <div className="fp-missing">
                [MISSING — set NEXT_PUBLIC_PAYMENT_URL. The button is disabled until a payment
                provider is wired; nothing typed above is submitted anywhere yet.]
              </div>
            )}

            <div className="fp-methods">
              {methodTiles.map((m) => (
                <span className="fp-method" key={m}>
                  {m}
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

            <div className="fp-center">
              <a className="fp-back" href="/">
                Back to the breakdown
              </a>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
