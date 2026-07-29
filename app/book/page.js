'use client';

import '../funnel-pages.css';

import useReveal from '../components/useReveal';
import { Clock } from '../components/Icons';
import { MISSING, book } from '../content';

const CALENDAR_URL = process.env.NEXT_PUBLIC_CALENDAR_EMBED_URL || '';

/**
 * §1 Sequence — call-agenda ledger. Its job is reassurance and cutting no-shows,
 * not hype. The scheduler is a third-party embed: we FRAME it on a neutral light
 * inset panel with a branded loading placeholder, we never restyle it (C12).
 */
export default function Book() {
  useReveal();

  return (
    <main className="sdp-root fp-page">
      <div className="sdp-wrap">
        <div className="fp-mast">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {book.eyebrow}
          </span>
          <h2 className="sdp-h2" data-sdp-reveal>
            {book.h2[0]}
            <em>{book.h2[1]}</em>
          </h2>
          <p className="sdp-sub" data-sdp-reveal>
            {book.sub}
          </p>
        </div>

        <div className="fp-agenda">
          {book.agenda.map((row, i) => (
            <div className="fp-arow" key={row.title} data-sdp-reveal style={{ '--d': `${i * 0.05}s` }}>
              <span className="fp-aord">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{row.title}</h3>
                <p>{row.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="fp-center">
          <span className="fp-disarm" data-sdp-reveal>
            <Clock size={13} />
            {book.disarmDuration ? `${book.disarmDuration} · ` : ''}
            {book.disarm}
          </span>
          {!book.disarmDuration && <div className="fp-missing">[{MISSING.callLength}]</div>}
        </div>

        <div className="fp-embed" data-sdp-reveal>
          <div className="fp-embed-inner">
            {CALENDAR_URL ? (
              <iframe src={CALENDAR_URL} title="Book your root-cause call" loading="lazy" />
            ) : (
              <div className="fp-embed-ph">
                <div>
                  <div className="fp-spinner" />
                  <span>Calendar pending · set NEXT_PUBLIC_CALENDAR_EMBED_URL</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fp-center" style={{ paddingBottom: 80 }}>
          <a className="fp-back" href="/">
            Back to the breakdown
          </a>
        </div>
      </div>
    </main>
  );
}
