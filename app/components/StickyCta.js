'use client';

import { useEffect, useState } from 'react';
import { Arrow } from './Icons';
import { cta, sticky } from '../content';

/**
 * Weld — sticky CTA bar (R8). Hidden until past the hero, and hides again once the
 * final CTA is in view so it never duplicates a visible CTA.
 */
export default function StickyCta() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('hero');
    const finale = document.getElementById('final-cta');
    if (!hero || !finale || typeof IntersectionObserver === 'undefined') return;

    const state = { pastHero: false, atFinale: false };
    const sync = () => setOn(state.pastHero && !state.atFinale);

    const heroIo = new IntersectionObserver(
      ([e]) => {
        state.pastHero = !e.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    const finaleIo = new IntersectionObserver(
      ([e]) => {
        state.atFinale = e.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );

    heroIo.observe(hero);
    finaleIo.observe(finale);
    return () => {
      heroIo.disconnect();
      finaleIo.disconnect();
    };
  }, []);

  return (
    <div className={`sdp-stuck${on ? ' on' : ''}`} aria-hidden={!on}>
      <div className="sdp-wrap sdp-stuck-inner">
        <span className="sdp-stuck-label">
          {sticky.label} <span className="price">{sticky.price}</span>
        </span>
        <a className="sdp-cta" href="/checkout" tabIndex={on ? 0 : -1}>
          <span className="sdp-cta-line">
            Book My Call
            <span className="arrow">
              <Arrow size={12} />
            </span>
          </span>
        </a>
      </div>
    </div>
  );
}
