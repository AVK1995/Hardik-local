'use client';

import '../funnel-pages.css';

import { useEffect, useState } from 'react';
import useReveal from '../components/useReveal';
import FunnelSteps from '../components/FunnelSteps';
import CalendlyEmbed from '../components/CalendlyEmbed';
import SiteFooter from '../components/SiteFooter';
import { Arrow, Check, Clock } from '../components/Icons';
import { MISSING, book } from '../content';

const MARQUEE_REPEAT = 4;
const SLOT_ID = 'pick-slot';

/**
 * Step 2 of the funnel. Structure follows the reference page the client sent —
 * marquee, hero, scheduler, what's included, why the window matters, FAQ,
 * closing push — but every word is ours, rewritten from the landing copy.
 *
 * ONE call to action on this page, repeated: "Pick My Slot", and it always
 * scrolls to the scheduler rather than navigating. The man has already paid;
 * sending him anywhere else here would be a mistake.
 */
export default function BookACall() {
  useReveal();
  const [stuck, setStuck] = useState(true);

  /* The sticky bar is pointless while the scheduler is on screen — it would
     scroll you to what you are already looking at. */
  useEffect(() => {
    const slot = document.getElementById(SLOT_ID);
    if (!slot || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0.12 });
    io.observe(slot);
    return () => io.disconnect();
  }, []);

  const toSlot = (e) => {
    e.preventDefault();
    document.getElementById(SLOT_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pickBtn = (extraClass = '') => (
    <a className={`sdp-cta bk-cta ${extraClass}`} href={`#${SLOT_ID}`} onClick={toSlot}>
      <span className="sdp-cta-line">
        <span className="sdp-cta-text">{book.stickyCta}</span>
        <span className="arrow">
          <Arrow size={13} />
        </span>
      </span>
    </a>
  );

  return (
    <main className="sdp-root fp-page">
      {/* ── Marquee ── */}
      <div className="sdp-announce">
        <div className="sdp-announce-track">
          {[0, 1].map((half) =>
            Array.from({ length: MARQUEE_REPEAT }, (_, rep) =>
              book.marquee.map((line, i) => (
                <span key={`${half}-${rep}-${i}`}>
                  {line} <span className="dot">·</span>
                </span>
              ))
            )
          )}
        </div>
      </div>

      <div className="sdp-wrap">
        <FunnelSteps current={1} />

        {/* ── Hero ── */}
        <div className="fp-mast">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {book.eyebrow}
          </span>
          <h1 className="sdp-h2" data-sdp-reveal>
            {book.h2[0]}
            <em>{book.h2[1]}</em>
          </h1>
          <p className="sdp-sub" data-sdp-reveal>
            {book.sub}
          </p>
        </div>
      </div>

      {/* ── Scheduler ── */}
      <section className="bk-slot">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {book.calendarEyebrow}
          </span>
          <h2 className="sdp-h2" data-sdp-reveal>
            {book.calendarH2[0]}
            <em>{book.calendarH2[1]}</em>
          </h2>

          <CalendlyEmbed id={SLOT_ID} />

          <ul className="bk-assure" data-sdp-reveal>
            {book.assurances.map((a) => (
              <li key={a}>
                <span className="bk-tick">
                  <Check size={12} />
                </span>
                {a}
              </li>
            ))}
          </ul>

          <div className="fp-center">
            <span className="fp-disarm" data-sdp-reveal>
              <Clock size={13} />
              {book.disarmDuration ? `${book.disarmDuration} · ` : ''}
              {book.disarm}
            </span>
            {!book.disarmDuration && <div className="fp-missing">[{MISSING.callLength}]</div>}
          </div>
        </div>
      </section>

      {/* ── What's included ── */}
      <section className="sdp-section sdp-light-alt">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {book.includedEyebrow}
          </span>
          <h2 className="sdp-h2" data-sdp-reveal>
            {book.includedH2[0]}
            <em>{book.includedH2[1]}</em>
          </h2>
          <p className="sdp-sub" data-sdp-reveal>
            {book.includedSub}
          </p>

          <div className="bk-grid">
            {book.included.map((it, i) => (
              <div className="bk-card" key={it.title} data-sdp-reveal style={{ '--d': `${i * 0.05}s` }}>
                <span className="bk-card-tag">
                  <Check size={11} />
                  Included
                </span>
                <h3>{it.title}</h3>
                <p>{it.body}</p>
              </div>
            ))}
          </div>

          <div className="fp-center">{pickBtn('bk-cta-inline')}</div>
        </div>
      </section>

      {/* ── Why the window matters ── */}
      <section className="sdp-section sdp-dark">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {book.ceilingEyebrow}
          </span>
          <h2 className="sdp-h2" data-sdp-reveal>
            {book.ceilingH2[0]}
            <em>{book.ceilingH2[1]}</em>
          </h2>
          <div className="bk-prose" data-sdp-reveal>
            {book.ceilingBody.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="sdp-section sdp-light">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {book.faqEyebrow}
          </span>
          <h2 className="sdp-h2" data-sdp-reveal>
            {book.faqH2[0]}
            <em>{book.faqH2[1]}</em>
          </h2>

          <div className="sdp-narrow pa-mt-24">
            {book.faq.map((item, i) => (
              <div className="bk-q" key={item.q} data-sdp-reveal style={{ '--d': `${i * 0.04}s` }}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing push ── */}
      <section className="sdp-section sdp-light-alt">
        <div className="sdp-wrap fp-center">
          <h2 className="sdp-h2" data-sdp-reveal>
            {book.finaleH2[0]}
            <em>{book.finaleH2[1]}</em>
          </h2>
          <p className="sdp-sub" data-sdp-reveal>
            {book.finaleBody}
          </p>
          {pickBtn('bk-cta-inline')}
        </div>
      </section>

      <SiteFooter />

      {/* ── Sticky: the page's only CTA, and it scrolls rather than navigates ── */}
      <div className={`sdp-stuck bk-stuck${stuck ? ' on' : ''}`} aria-hidden={!stuck}>
        <div className="sdp-wrap sdp-stuck-inner">
          <div className="sdp-stuck-copy">
            <span className="sdp-stuck-title">
              One Step Left. <em>Pick Your Slot.</em>
            </span>
            <span className="sdp-stuck-chips">
              <span className="sdp-stuck-chip">{book.disarm}</span>
            </span>
          </div>
          <a className="sdp-cta" href={`#${SLOT_ID}`} onClick={toSlot} tabIndex={stuck ? 0 : -1}>
            <span className="sdp-cta-line">
              <span className="sdp-cta-text">{book.stickyCta}</span>
              <span className="arrow">
                <Arrow size={12} />
              </span>
            </span>
          </a>
        </div>
      </div>
    </main>
  );
}
