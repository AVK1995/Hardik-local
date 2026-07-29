'use client';

import { useEffect, useState } from 'react';
import { Close } from './Icons';
import { checkinWall } from '../content';

/**
 * §6 Proof — review wall (column masonry) of the real, consented WhatsApp
 * check-ins. Deliberately a different §6 option from the marquee above and the
 * case cards above it (vary-adjacent-proof rule).
 */
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
      <div className="pa-wall">
        {checkinWall.items.map((item, i) => (
          <button
            type="button"
            className="pa-shot"
            key={item.src}
            onClick={() => setZoom(item)}
            data-sdp-reveal
            style={{ '--d': `${(i % 4) * 0.05}s` }}
          >
            <img src={item.src} alt={item.alt} loading="lazy" />
            {item.tag && <span className="pa-shot-tag">{item.tag}</span>}
          </button>
        ))}
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
