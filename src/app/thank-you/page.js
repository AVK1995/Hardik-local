'use client';

import '@/styles/funnel-pages.css';

import { useEffect } from 'react';
import useReveal from '@/hooks/useReveal';
import ConfirmationStep from '@/components/ConfirmationStep';
import FunnelSteps from '@/components/FunnelSteps';
import SiteFooter from '@/components/SiteFooter';
import { thankYou } from '@/lib/content';
import { reapplyMamFromCookie } from '@/lib/analytics';


/**
 * §9 Confirmation — step 3. Structure follows the reference the client sent:
 * marquee, the WhatsApp confirmation step, what the call covers, prep, why
 * the room is small. Copy is ours. The ONE action here is the WhatsApp tap:
 * the sale is made, and what is left is getting him into WhatsApp, because
 * until he messages there first no reminder can reach him there at all.
 *
 * The slot card that used to sit under the mast came out on the client’s
 * call (2026-10-01): it restated a time he had just picked and competed with
 * the one thing this page exists to get done. The Calendly redirect params it
 * read are no longer parsed here.
 */
export default function ThankYou() {
  useReveal();
  /* Belt and braces on Advanced Matching. The inline pixel script in the
     layout reads the same cookie, but this page is frequently arrived at by a
     Calendly redirect — a full navigation whose PageView can race the cookie
     read. Re-initialising is idempotent, so the cost of being wrong here is
     nil and the cost of skipping it is an anonymous pageview at the most
     valuable point in the funnel. */
  useEffect(() => {
    reapplyMamFromCookie();
  }, []);


  return (
    <main className="sdp-root fp-page">
      {/* Static, like the landing page and book-a-call. The scrolling track is
          retired across the funnel — three pages, one behaviour. */}
      <div className="sdp-announce">
        <span className="sdp-announce-line">{thankYou.marquee}</span>
      </div>

      <div className="sdp-wrap">
        <FunnelSteps current={2} />

        <div className="fp-mast">
          {/* The tick-and-"confirmed" mast that used to open this page is gone.
              It told the man he was done, which is the one thing that stops him
              doing the step the reminders depend on. */}
          <ConfirmationStep />

          {/* h2, not h1: ConfirmationStep owns the page heading now. */}
          <h2 className="sdp-h2 ty-reassure" data-sdp-reveal>
            {thankYou.h1[0]}
            <em>{thankYou.h1[1]}</em>
          </h2>
          <p className="sdp-sub" data-sdp-reveal>
            {thankYou.bridge}
          </p>
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
                <span className="fp-aord sdp-num3d">{String(i + 1).padStart(2, '0')}</span>
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
                <span className="fp-aord sdp-num3d">{String(i + 1).padStart(2, '0')}</span>
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
