'use client';

import { useState } from 'react';
import { Plus } from './Icons';
import { faq } from '../content';

/**
 * §5 Objection-set — ruled FAQ ledger (R4). Q.0X ordinals, open is a physical
 * event (accent border + white surface + shadow) and the icon rotates 45 degrees
 * to an x. The top objection carries "Most asked" and is open by default (C8).
 */
export default function Faq() {
  const firstOpen = faq.items.findIndex((i) => i.mostAsked);
  const [open, setOpen] = useState(firstOpen === -1 ? 0 : firstOpen);

  return (
    <div className="sdp-narrow">
      {faq.items.map((item, i) => {
        const isOpen = open === i;
        return (
          /* Open state is a data attribute, NEVER a className. useReveal adds
             `vis` with classList.add, so re-rendering a changed className string
             wipes it — and the observer has already unobserved the node, so the
             answer faded to opacity:0 and stayed gone the moment you toggled it.
             Keeping the className literal means React never touches it. */
          <div className="sdp-q" data-open={isOpen ? '' : undefined} key={item.q} data-sdp-reveal style={{ '--d': `${i * 0.04}s` }}>
            <button
              type="button"
              className="sdp-q-head"
              aria-expanded={isOpen}
              aria-controls={`faq-body-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span>
                <span className="sdp-q-ord">Q.{String(i + 1).padStart(2, '0')}</span>
                {item.q}
                {item.mostAsked && <span className="sdp-mostasked">Most asked</span>}
              </span>
              <span className="ic">
                <Plus size={13} />
              </span>
            </button>
            <div className="sdp-q-body" id={`faq-body-${i}`} role="region">
              <div className="sdp-q-body-inner">{item.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
