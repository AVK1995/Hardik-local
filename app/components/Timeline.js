'use client';

import { useEffect, useRef } from 'react';
import { programmeIcons } from './Icons';
import { programme } from '../content';

/* Where down the viewport the "playhead" sits. 0.55 puts it just below centre,
   so a step lights as you arrive at it rather than after it has gone past. */
const PLAYHEAD = 0.55;

/**
 * §3 The programme, as a timeline that builds while you scroll.
 *
 * The rail fills and each node lights as it reaches the playhead, so the beat
 * reads as a sequence being walked rather than a list being shown.
 *
 * State is applied to the DOM directly (a data attribute and a CSS variable)
 * instead of through React state. Two reasons: this fires on every scroll frame
 * and re-rendering six rows that often is waste, and — the important one —
 * rewriting className on these rows would wipe the `vis` class useReveal adds
 * imperatively, which is the bug that has already bitten Faq, VslFrame and
 * VideoTestimonials on this project.
 */
export default function Timeline() {
  const wrapRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const fill = fillRef.current;
    if (!wrap || !fill) return;

    const rows = Array.from(wrap.querySelectorAll('.pa-tl-row'));
    if (!rows.length) return;

    const centreOf = (row) => {
      const n = row.querySelector('.pa-tl-node');
      const r = n.getBoundingClientRect();
      return r.top + r.height / 2;
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const mark = window.innerHeight * PLAYHEAD;

      rows.forEach((row) => row.toggleAttribute('data-lit', centreOf(row) <= mark));

      /* The fill runs between the first and last node centres, not the whole
         block, so it starts and stops exactly on the end nodes. */
      const start = centreOf(rows[0]);
      const end = centreOf(rows[rows.length - 1]);
      const pct = end === start ? 0 : (mark - start) / (end - start);
      fill.style.setProperty('--fill', `${Math.min(1, Math.max(0, pct)) * 100}%`);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pa-tl" ref={wrapRef}>
      <span className="pa-tl-fill" ref={fillRef} aria-hidden="true" />

      {programme.items.map((item, i) => {
        const Ico = programmeIcons[item.icon] || programmeIcons.report;
        return (
          <div className="pa-tl-row" key={item.title} data-sdp-reveal style={{ '--d': `${i * 0.06}s` }}>
            <span className="pa-tl-node" aria-hidden="true">
              <Ico size={19} />
            </span>
            <div className="pa-tl-body">
              <span className="pa-tl-ord sdp-num3d">{String(i + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
