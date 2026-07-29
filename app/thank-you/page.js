'use client';

import '../funnel-pages.css';

import useReveal from '../components/useReveal';
import { Check, Calendar } from '../components/Icons';
import { thankYou } from '../content';

/**
 * §9 Confirmation — success seal + next-steps ledger (R12). Calm closure:
 * NO competing CTA on this page, by design.
 */
export default function ThankYou() {
  useReveal();

  return (
    <main className="sdp-root fp-page">
      <div className="sdp-wrap">
        <div className="fp-mast">
          <div className="fp-seal" data-sdp-reveal>
            <Check size={44} />
          </div>
          <h2 className="sdp-h2" data-sdp-reveal>
            {thankYou.seal}
          </h2>
          <p className="sdp-sub" data-sdp-reveal>
            {thankYou.bridge}
          </p>

          <span className="fp-datestrip" data-sdp-reveal>
            <Calendar size={15} />
            {/* Populated from the booking confirmation once the scheduler is wired. */}
            Your call time will appear here and in your email
          </span>
        </div>

        <div className="fp-agenda">
          {thankYou.prep.map((row, i) => (
            <div className="fp-arow" key={row.title} data-sdp-reveal style={{ '--d': `${i * 0.05}s` }}>
              <span className="fp-aord">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{row.title}</h3>
                <p>{row.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="fp-statband" style={{ marginBottom: 80 }}>
          {thankYou.statBand.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
    </main>
  );
}
