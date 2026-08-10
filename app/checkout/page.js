'use client';

import '../funnel-pages.css';

import useReveal from '../components/useReveal';
import { Arrow, Lock, Shield, Calendar } from '../components/Icons';
import { MISSING, checkout } from '../content';

const PAYMENT_URL = process.env.NEXT_PUBLIC_PAYMENT_URL || '';
const methodTiles = ['UPI', 'Cards', 'Netbanking', 'Wallets'];
const trustIcons = [Lock, Shield, Calendar];

/**
 * §10 Transaction — order-summary checkout (R11), welded to a §13 price reframe.
 * One focal action. The Rs 97 total is the lit value moment (C3).
 */
export default function Checkout() {
  useReveal();

  return (
    <main className="sdp-root fp-page">
      <div className="fp-truststrip">
        <div className="sdp-wrap fp-truststrip-inner">
          {checkout.trustStrip.map((t, i) => {
            const Ico = trustIcons[i % trustIcons.length];
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
        <div className="fp-mast">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {checkout.eyebrow}
          </span>
          <h2 className="sdp-h2" data-sdp-reveal>
            {checkout.h2[0]}
            <em>{checkout.h2[1]}</em>
          </h2>
        </div>

        <div className="fp-grid">
          {/* ── details form ── */}
          <div className="fp-panel" data-sdp-reveal>
            <span className="fp-panel-title">Your details</span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (PAYMENT_URL) window.location.href = PAYMENT_URL;
              }}
            >
              {checkout.fields.map((f) => (
                <div className="fp-field" key={f.name}>
                  <label htmlFor={f.name}>{f.label}</label>
                  <input id={f.name} name={f.name} type={f.type} autoComplete={f.autoComplete} required />
                </div>
              ))}

              <div className="fp-paybtn">
                <button className="sdp-cta" type="submit">
                  <span className="sdp-cta-line">
                    {checkout.button}
                    <span className="arrow">
                      <Arrow size={13} />
                    </span>
                  </span>
                </button>
              </div>
            </form>

            <em className="fp-micro">{checkout.microline}</em>
            {checkout.refundNote ? (
              <em className="fp-micro">{checkout.refundNote}</em>
            ) : (
              <div className="fp-missing">[{MISSING.refundTerms}]</div>
            )}
            {!PAYMENT_URL && <div className="fp-missing">[MISSING — set NEXT_PUBLIC_PAYMENT_URL]</div>}

            <div className="fp-methods">
              {methodTiles.map((m) => (
                <span className="fp-method" key={m}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* ── order ledger + price reframe ── */}
          <div>
            <div className="fp-panel" data-sdp-reveal style={{ '--d': '.06s' }}>
              <span className="fp-panel-title">{checkout.ledgerTitle}</span>
              <div className="fp-ledger">
                {checkout.ledger.map((row, i) => (
                  <div className="fp-lrow" key={row.what}>
                    <span className="fp-lord">{String(i + 1).padStart(2, '0')}</span>
                    <span className="fp-lwhat">{row.what}</span>
                    <span className="fp-lval">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="fp-total">
                <span className="fp-total-l">{checkout.totalLabel}</span>
                <span className="fp-total-v">
                  {checkout.totalStrike && <s className="fp-total-strike">{checkout.totalStrike}</s>}
                  {checkout.total}
                </span>
              </div>
            </div>

            {/* the "₹97 is a filter" reframe is not in the finalised copy */}
            {checkout.whyPrice && (
              <div className="fp-whyprice" data-sdp-reveal style={{ '--d': '.1s' }}>
                <h3>
                  {checkout.whyPrice.headline[0]}
                  <em>{checkout.whyPrice.headline[1]}</em>
                </h3>
                <p>{checkout.whyPrice.body}</p>
              </div>
            )}

            <div className="fp-center">
              <a className="fp-back" href="/">
                Back to the breakdown
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
