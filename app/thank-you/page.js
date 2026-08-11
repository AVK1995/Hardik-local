'use client';

import '../funnel-pages.css';

import { useEffect, useState } from 'react';
import useReveal from '../components/useReveal';
import FunnelSteps from '../components/FunnelSteps';
import SiteFooter from '../components/SiteFooter';
import { Check, Calendar } from '../components/Icons';
import { thankYou } from '../content';

const MARQUEE_REPEAT = 4;

/**
 * §9 Confirmation — step 3. Structure follows the reference the client sent:
 * marquee, seal + booked slot, what the call covers, prep, why the room is
 * small. Copy is ours. NO competing CTA on this page, by design — the sale is
 * made and the only job left is making sure he turns up.
 *
 * The slot in the hero comes from Calendly's redirect parameters. See
 * CalendlyEmbed.js for the one setting that has to be switched on for them to
 * arrive; without it this falls back to "check your email" rather than showing
 * an empty slot card.
 */
export default function ThankYou() {
  useReveal();
  const [slot, setSlot] = useState(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const start = q.get('event_start_time');
    if (!start) return;

    const d = new Date(start);
    if (Number.isNaN(d.getTime())) return;

    /* Rendered in the viewer's own timezone, and the zone is named explicitly.
       A time with no zone on a booking confirmation is how people miss calls. */
    setSlot({
      day: d.toLocaleDateString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      time: d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
      zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      name: q.get('invitee_full_name') || null,
    });
  }, []);

  return (
    <main className="sdp-root fp-page">
      <div className="sdp-announce">
        <div className="sdp-announce-track">
          {[0, 1].map((half) =>
            Array.from({ length: MARQUEE_REPEAT }, (_, rep) =>
              thankYou.marquee.map((line, i) => (
                <span key={`${half}-${rep}-${i}`}>
                  {line} <span className="dot">·</span>
                </span>
              ))
            )
          )}
        </div>
      </div>

      <div className="sdp-wrap">
        <FunnelSteps current={2} />

        <div className="fp-mast">
          <div className="fp-seal" data-sdp-reveal>
            <Check size={44} />
          </div>
          <h1 className="sdp-h2" data-sdp-reveal>
            {thankYou.h1[0]}
            <em>{thankYou.h1[1]}</em>
          </h1>
          <p className="sdp-sub" data-sdp-reveal>
            {thankYou.bridge}
          </p>

          {/* ── The booked slot ── */}
          <div className="ty-slot" data-sdp-reveal>
            <span className="ty-slot-label">{thankYou.slotLabel}</span>
            {slot ? (
              <>
                <span className="ty-slot-when">
                  <Calendar size={18} />
                  {slot.day}
                </span>
                <span className="ty-slot-time">
                  {slot.time}
                  <em>{slot.zone}</em>
                </span>
              </>
            ) : (
              <span className="ty-slot-when ty-slot-pending">
                <Calendar size={18} />
                {thankYou.slotPending}
              </span>
            )}
            <span className="ty-slot-name">{thankYou.sessionName}</span>
          </div>
        </div>
      </div>

      {/* ── What we'll cover ── */}
      <section className="sdp-section sdp-light-alt">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {thankYou.coverEyebrow}
          </span>
          <h2 className="sdp-h2" data-sdp-reveal>
            {thankYou.coverH2[0]}
            <em>{thankYou.coverH2[1]}</em>
          </h2>
          <p className="sdp-sub" data-sdp-reveal>
            {thankYou.coverSub}
          </p>

          <div className="fp-agenda">
            {thankYou.cover.map((row, i) => (
              <div className="fp-arow" key={row.title} data-sdp-reveal style={{ '--d': `${i * 0.05}s` }}>
                <span className="fp-aord">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{row.title}</h3>
                  <p>{row.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Prep ── */}
      <section className="sdp-section sdp-light">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {thankYou.prepEyebrow}
          </span>
          <h2 className="sdp-h2" data-sdp-reveal>
            {thankYou.prepH2[0]}
            <em>{thankYou.prepH2[1]}</em>
          </h2>
          <p className="sdp-sub" data-sdp-reveal>
            {thankYou.prepSub}
          </p>

          <div className="fp-agenda">
            {thankYou.prep.map((row, i) => (
              <div className="fp-arow" key={row.title} data-sdp-reveal style={{ '--d': `${i * 0.05}s` }}>
                <span className="fp-aord">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{row.title}</h3>
                  <p>{row.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why the room stays small ── */}
      <section className="sdp-section sdp-dark">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {thankYou.aboutEyebrow}
          </span>
          <h2 className="sdp-h2" data-sdp-reveal>
            {thankYou.aboutH2[0]}
            <em>{thankYou.aboutH2[1]}</em>
          </h2>
          <div className="bk-prose" data-sdp-reveal>
            {thankYou.aboutBody.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <p className="ty-reschedule" data-sdp-reveal>
            {thankYou.rescheduleNote}
          </p>

          <div className="fp-statband">
            {thankYou.statBand.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
