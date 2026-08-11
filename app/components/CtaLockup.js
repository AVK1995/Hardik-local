'use client';

import Countdown from './Countdown';
import { Arrow, trustIcons } from './Icons';
import { cta } from '../content';

/**
 * THE CTA LOCKUP — written once, reused VERBATIM at every proof beat (7x on the
 * landing page + the condensed sticky). Rush is welded to Reassure; they never
 * appear apart.
 *
 * Layer 3 currently carries the honest-disqualification line, NOT a guarantee.
 * When guarantee terms land, set `cta.guaranteeLine` in content.js and it appears
 * in all instances at once.
 */
export default function CtaLockup({ className = '', delay = 0 }) {
  return (
    <div className={`sdp-lockup ${className}`} data-sdp-reveal style={{ '--d': `${delay}s` }}>
      <a className="sdp-cta" href="/checkout">
        <span className="sdp-cta-line">
          {cta.button}
          <span className="arrow">
            <Arrow size={13} />
          </span>
        </span>
        <span className="cta-sub">{cta.buttonSub}</span>
      </a>

      {/* Layer 1 — trust chips */}
      <div className="sdp-risk-strip">
        {cta.chips.map((chip) => {
          const Ico = chip.icon ? trustIcons[chip.icon] : null;
          return (
            <span className="sdp-risk-badge" key={chip.label}>
              {Ico && (
                <span className="sdp-risk-icon-blue">
                  <Ico size={16} />
                </span>
              )}
              {chip.label}
            </span>
          );
        })}
      </div>

      {/* Layer 2 — urgency */}
      <div className="sdp-urgency-wrap">
        <span className="sdp-urgency-label">{cta.urgencyLabel}</span>
        <Countdown />
      </div>

      {/* Layer 3 — risk reversal */}
      <em className="sdp-cta-note">{cta.guaranteeLine || cta.reassurance}</em>
    </div>
  );
}
