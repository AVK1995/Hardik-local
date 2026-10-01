'use client';

import { WhatsApp } from '@/components/Icons';
import { whatsappUrl } from '@/lib/config';
import { thankYou } from '@/lib/content';

/**
 * §9a The WhatsApp confirmation step — the bridge at the top of /thank-you.
 *
 * WHY THIS EXISTS. A Calendly booking does not put the man in WhatsApp, and
 * WhatsApp will not let a business message someone who has not messaged it
 * first. Every reminder in the ops workflow — payment, nudge, booking, T-1h,
 * T-10m — therefore depends on this one tap. Framing it as the step that
 * confirms the call is what gets it tapped.
 *
 * It deliberately contradicts what this page used to open with. The old mast
 * led with a tick and "your call is confirmed", which left nothing to do; the
 * confirming language now sits BELOW this, after the tap has been asked for.
 *
 * STICKY BAR. The bar is rendered by this component but is a sibling concern:
 * it is visible from first paint, with no reveal class, no scroll listener and
 * no entrance transition. That is a deliberate break from .sdp-stuck on the
 * landing page, which starts translated off-screen and is revealed by JS — the
 * whole point here is that the one action on the page is never below the fold.
 */
export default function ConfirmationStep() {
  const c = thankYou.confirm;
  const href = whatsappUrl(c.waText);

  /* One <a>, rendered twice — inline and in the sticky bar. Keeping it as a
     local avoids the two drifting apart when the label or target changes. */
  const cta = (extraClass) => (
    <a
      className={`ty-wa ${extraClass}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="ty-wa-ico" aria-hidden="true">
        <WhatsApp size={22} />
      </span>
      <span className="ty-wa-text">
        {c.cta.map((line) => (
          <span className="ty-wa-ln" key={line}>
            {line}
          </span>
        ))}
      </span>
    </a>
  );

  return (
    <>
      <div className="ty-confirm">
        {/* No data-sdp-reveal on the headline or the CTA. Reveals fade in on
            intersection, and this is the first thing on the page — it must be
            readable at paint, not a beat later. */}
        <h1 className="sdp-h2 ty-confirm-h1">
          <span className="ty-alert">{c.alert}</span>
          {c.h1}
        </h1>

        <div className="ty-avatar">
          <img src={c.photo} alt={c.photoAlt} width="168" height="168" />
        </div>

        <p className="ty-confirm-step">
          {c.step.map((r, i) =>
            r.strong ? <strong key={i}>{r.text}</strong> : <span key={i}>{r.text}</span>
          )}
        </p>
        <p className="ty-confirm-lead">
          {c.lead.map((r, i) =>
            r.strong ? <strong key={i}>{r.text}</strong> : <span key={i}>{r.text}</span>
          )}
        </p>

        {cta('ty-wa-inline')}

        <p className="ty-confirm-note">{c.note}</p>
      </div>

      {/* Mobile only — see the .ty-stuck rules. Rendered always so there is no
          hydration difference between server and client; CSS does the hiding. */}
      <div className="ty-stuck">
        <div className="sdp-wrap ty-stuck-inner">{cta('ty-wa-stuck')}</div>
      </div>
    </>
  );
}
