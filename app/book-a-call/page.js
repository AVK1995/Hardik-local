'use client';

import '../funnel-pages.css';

import { useEffect, useRef, useState } from 'react';
import useReveal from '../components/useReveal';
import FunnelSteps from '../components/FunnelSteps';
import CalendlyEmbed from '../components/CalendlyEmbed';
import SiteFooter from '../components/SiteFooter';
import Faq from '../components/Faq';
import { Arrow, Check, Clock } from '../components/Icons';
import { book } from '../content';

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
  const barRef = useRef(null);

  /* The bar hides for two reasons, tracked separately:
       - the scheduler is on screen, so scrolling to it would do nothing;
       - the footer is on screen, where a fixed bar sits on top of the legal
         links and the disclaimer and hides them.
     Either one suppresses it. */
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const slot = document.getElementById(SLOT_ID);
    const footer = document.querySelector('.sf');

    const state = { atSlot: false, atFooter: false };
    const sync = () => setStuck(!state.atSlot && !state.atFooter);

    const slotIo = new IntersectionObserver(
      ([e]) => {
        state.atSlot = e.isIntersecting;
        sync();
      },
      { threshold: 0.12 }
    );
    const footIo = new IntersectionObserver(
      ([e]) => {
        state.atFooter = e.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );

    if (slot) slotIo.observe(slot);
    if (footer) footIo.observe(footer);
    return () => {
      slotIo.disconnect();
      footIo.disconnect();
    };
  }, []);

  /* While the bar is up it reserves its own height, so the last thing on the
     page is never sitting underneath it. */
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const apply = () => {
      document.body.style.paddingBottom = stuck ? `${bar.offsetHeight}px` : '';
    };
    apply();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(apply) : null;
    ro?.observe(bar);
    return () => {
      ro?.disconnect();
      document.body.style.paddingBottom = '';
    };
  }, [stuck]);

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
      {/* ── Announce strip ──
          Static, matching the landing page: the scrolling marquee was stopped
          there and left running here, which made the two pages feel like they
          came from different sites. */}
      <div className="sdp-announce">
        <span className="sdp-announce-line">{book.marquee}</span>
      </div>

      <div className="sdp-wrap">
        <FunnelSteps current={1} />

        {/* ── Hero ──
            The eyebrow here is a receipt, not a label: it is the first thing a
            man sees after paying, so it gets a live tick badge instead of the
            standard rule-dash eyebrow. */}
        <div className="fp-mast">
          <span className="bk-paid" data-sdp-reveal>
            <span className="bk-paid-mark" aria-hidden="true">
              <Check size={15} />
            </span>
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
            {/* The [MISSING call length] flag was removed 2026-08-11. The
                duration is still unstated in the docx, so the pill simply omits
                it rather than announcing the gap. See MISSING.callLength. */}
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
                {/* Numbered 3D plate, the same one the landing timeline uses,
                    so the two pages read as one site. */}
                <span className="bk-card-num sdp-num3d">{String(i + 1).padStart(2, '0')}</span>
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

          {/* Same accordion component as the landing page, not a flat list. */}
          <div className="pa-mt-24">
            <Faq items={book.faq} idPrefix="bk-faq" />
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
      <div className={`sdp-stuck bk-stuck${stuck ? ' on' : ''}`} ref={barRef} aria-hidden={!stuck}>
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
