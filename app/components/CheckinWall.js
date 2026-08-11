'use client';

import { useEffect, useState } from 'react';
import { Close } from './Icons';
import { checkinWall } from '../content';

/**
 * §6 Proof — the chat wall, as two opposed marquee rows.
 * Row one runs left to right, row two right to left, per the docx.
 *
 * NO IMAGE APPEARS IN BOTH ROWS. content.js holds rowOne and rowTwo as separate
 * lists and every screenshot is used exactly once across the two. The set
 * duplication below is the seamless-loop mechanism (the track animates to -50%,
 * so it needs two identical halves), not a repeated image: the copy is marked
 * aria-hidden so assistive tech reads each screenshot once.
 *
 * A dev-only guard throws if the two lists ever overlap, so a future edit to
 * content.js cannot reintroduce a duplicate silently.
 */
if (process.env.NODE_ENV !== 'production') {
  const one = new Set(checkinWall.rowOne.map((i) => i.src));
  const clash = checkinWall.rowTwo.filter((i) => one.has(i.src)).map((i) => i.src);
  if (clash.length) {
    throw new Error(
      `checkinWall: rowOne and rowTwo must not share images. Duplicated: ${clash.join(', ')}`
    );
  }
}

function Row({ items, dir, duration, onZoom }) {
  return (
    <div className="pa-chatrow" data-dir={dir} style={{ '--marq-dur': duration }}>
      <div className="pa-chattrack">
        {[0, 1].map((set) => (
          <div className="pa-chatset" key={set} aria-hidden={set === 1 ? 'true' : undefined}>
            {items.map((item) => (
              <button
                type="button"
                className="pa-shot"
                key={`${set}-${item.src}`}
                onClick={() => onZoom(item)}
                tabIndex={set === 1 ? -1 : 0}
              >
                <img src={item.src} alt={item.alt} loading="lazy" />
                {item.tag && <span className="pa-shot-tag">{item.tag}</span>}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CheckinWall() {
  const [zoom, setZoom] = useState(null);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e) => e.key === 'Escape' && setZoom(null);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [zoom]);

  return (
    <>
      <div className="pa-chatwall">
        <Row items={checkinWall.rowOne} dir="ltr" duration="58s" onZoom={setZoom} />
        <Row items={checkinWall.rowTwo} dir="rtl" duration="66s" onZoom={setZoom} />
      </div>

      {zoom && (
        <div
          className="pa-lb"
          role="dialog"
          aria-modal="true"
          aria-label={zoom.alt}
          onClick={() => setZoom(null)}
        >
          <span className="pa-lb-close" aria-hidden="true">
            <Close />
          </span>
          <img src={zoom.src} alt={zoom.alt} />
        </div>
      )}
    </>
  );
}
