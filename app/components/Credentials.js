'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Arrow, Close } from './Icons';
import { founder } from '../content';

/**
 * BEAT 5c — the credentials carousel: certificates and press, in one rail.
 *
 * A carousel rather than the static grid it replaced, because there are now
 * seven items and a grid of seven pushed the rest of the page down by a screen.
 * Scroll-snap does the paging, so it is a real scroller — trackpad, touch and
 * the arrow buttons all drive the same thing, and it still works if JS fails.
 *
 * Clicking a card opens the full document. The card art is a rendered page at
 * card size; the modal shows it at full width, plus a link to the original PDF
 * for anyone who wants to check it properly.
 */
export default function Credentials() {
  const railRef = useRef(null);
  const closeRef = useRef(null);
  const [open, setOpen] = useState(null); // index of the open card, or null
  const [edges, setEdges] = useState({ start: true, end: false });

  const items = founder.credentials;

  /* Arrow buttons disable at the ends rather than looping — a rail that jumps
     back to the start when you reach the end reads as broken. */
  const syncEdges = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    syncEdges();
    el.addEventListener('scroll', syncEdges, { passive: true });
    window.addEventListener('resize', syncEdges);
    return () => {
      el.removeEventListener('scroll', syncEdges);
      window.removeEventListener('resize', syncEdges);
    };
  }, [syncEdges]);

  const page = (dir) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector('.pa-cred');
    /* One card plus its gap, so a press stops on a card edge every time. */
    const step = card ? card.getBoundingClientRect().width + 22 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  /* Modal: lock the page behind it, close on Escape, and move focus to the
     close button so a keyboard user is not left behind on the card. */
  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!items.length) return null;
  const active = open === null ? null : items[open];

  return (
    <div className="pa-creds">
      <span className="pa-creds-eyebrow" data-sdp-reveal>
        {founder.credentialsEyebrow}
      </span>

      <div className="pa-creds-rail-wrap" data-sdp-reveal>
        <button
          type="button"
          className="pa-creds-nav prev"
          onClick={() => page(-1)}
          disabled={edges.start}
          aria-label="Previous credentials"
        >
          <Arrow size={15} />
        </button>

        <div className="pa-creds-rail" ref={railRef}>
          {items.map((c, i) => (
            <button
              type="button"
              className="pa-cred"
              key={c.image}
              onClick={() => setOpen(i)}
              aria-label={`Open ${c.title}`}
            >
              <span className="pa-cred-art">
                <img src={c.image} alt="" loading="lazy" />
              </span>
              <span className="pa-cred-body">
                <span className="pa-cred-kind">
                  {c.kind}
                  {c.date && <em>{c.date}</em>}
                </span>
                <span className="pa-cred-title">{c.title}</span>
                <span className="pa-cred-issuer">{c.issuer}</span>
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="pa-creds-nav next"
          onClick={() => page(1)}
          disabled={edges.end}
          aria-label="More credentials"
        >
          <Arrow size={15} />
        </button>
      </div>

      {active && (
        <div className="pa-lb pa-cred-lb" role="dialog" aria-modal="true" aria-label={active.title}>
          {/* Backdrop closes; the panel stops the click so an inside press does not. */}
          <div className="pa-cred-lb-bg" onClick={() => setOpen(null)} />
          <div className="pa-cred-lb-panel">
            <button
              type="button"
              className="pa-lb-close"
              onClick={() => setOpen(null)}
              ref={closeRef}
              aria-label="Close"
            >
              <Close size={18} />
            </button>

            <img className="pa-cred-lb-img" src={active.image} alt={active.title} />

            <div className="pa-cred-lb-meta">
              <span className="pa-cred-kind">
                {active.kind}
                {active.date && <em>{active.date}</em>}
              </span>
              <h3>{active.title}</h3>
              <p>{active.issuer}</p>
              {(active.file || active.href) && (
                <a
                  className="pa-cred-lb-link"
                  href={active.file || active.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {active.file ? 'Open the original certificate' : 'Read the article'}
                  <Arrow size={13} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
