'use client';

import { useEffect } from 'react';

/**
 * Staggered reveal-on-scroll (C7). Fail-open by design:
 *  - if JS never runs, `.no-js` on <html> keeps everything visible;
 *  - if IntersectionObserver is missing, we mark everything visible immediately;
 *  - prefers-reduced-motion is handled in CSS, which forces opacity:1.
 */
export default function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('[data-sdp-reveal]'));
    if (!nodes.length) return;

    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('vis'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('vis');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}
