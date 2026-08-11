'use client';

import { useEffect, useRef, useState } from 'react';
import CtaLabel from './CtaLabel';
import { Arrow, trustIcons } from './Icons';
import { cta, sticky } from '../content';

/**
 * Weld — sticky CTA bar (R8), rebuilt to the reference layout 2026-08-11.
 *
 * Two behaviours are deliberate and were asked for explicitly:
 *
 *  1. It is on from the very first paint. Previously it waited until the hero
 *     had scrolled past, so the first screen carried no persistent CTA. The
 *     initial state is `true` rather than being switched on in an effect, so
 *     the server HTML already renders it open and there is no slide-in flash.
 *
 *  2. It still yields to the closing section. #final-cta carries the same CTA
 *     plus the colophon, so leaving the bar up would both duplicate a visible
 *     CTA and sit on top of the footer. It hides as soon as that section shows.
 *
 * While the bar is up it reserves its own height as padding on <body>, so the
 * end of the page can never hide underneath it on short viewports.
 */
export default function StickyCta() {
  const [on, setOn] = useState(true);
  const barRef = useRef(null);

  useEffect(() => {
    const finale = document.getElementById('final-cta');
    if (!finale || typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(([e]) => setOn(!e.isIntersecting), { threshold: 0 });
    io.observe(finale);
    return () => io.disconnect();
  }, []);

  /* Reserve the bar's height so nothing is ever obscured by it. Measured rather
     than hard-coded because the bar wraps to two rows on narrow screens. */
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const apply = () => {
      document.body.style.paddingBottom = on ? `${bar.offsetHeight}px` : '';
    };
    apply();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(apply) : null;
    ro?.observe(bar);
    return () => {
      ro?.disconnect();
      document.body.style.paddingBottom = '';
    };
  }, [on]);

  const chips = cta.chips.slice(0, sticky.chipCount);

  return (
    <div className={`sdp-stuck${on ? ' on' : ''}`} ref={barRef} aria-hidden={!on}>
      <div className="sdp-wrap sdp-stuck-inner">
        <div className="sdp-stuck-copy">
          <span className="sdp-stuck-title">
            {sticky.lead} <em>{sticky.leadAccent}</em>
          </span>
          <span className="sdp-stuck-chips">
            {chips.map((chip) => {
              const Ico = chip.icon ? trustIcons[chip.icon] : null;
              return (
                <span className="sdp-stuck-chip" key={chip.label}>
                  {Ico && <Ico size={13} />}
                  {chip.label}
                </span>
              );
            })}
          </span>
        </div>

        <a className="sdp-cta" href="/checkout" tabIndex={on ? 0 : -1}>
          <span className="sdp-cta-line">
            <CtaLabel />
            <span className="arrow">
              <Arrow size={12} />
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}
