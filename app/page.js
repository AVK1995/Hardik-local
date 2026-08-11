'use client';

import './landing.css';

import useReveal from './components/useReveal';
import CtaLockup from './components/CtaLockup';
import VslFrame from './components/VslFrame';
import CheckinWall from './components/CheckinWall';
import VideoTestimonials from './components/VideoTestimonials';
import Faq from './components/Faq';
import StickyCta from './components/StickyCta';
import { ArrowDown, Check, Shield, Star, pointerIcons, programmeIcons, trustIcons } from './components/Icons';

import {
  MISSING,
  announce,
  trustRow,
  trustAvatars,
  hero,
  forYouIf,
  cases,
  checkinWall,
  founder,
  mechanism,
  programme,
  guarantee,
  faq,
  finalCta,
  cta,
} from './content';


/** H2 formula: [plain setup clause] + [ONE accent tail on the payoff/mechanism]. */
function H2({ parts }) {
  return (
    <h2 className="sdp-h2" data-sdp-reveal>
      {parts[0]}
      <em>{parts[1]}</em>
    </h2>
  );
}

function Missing({ note }) {
  return (
    <div className="pa-missing" data-sdp-reveal>
      <span className="pa-missing-tag">Placeholder</span>
      <p>
        <strong>[{note}]</strong>
        <br />
        Supply the copy and it drops straight in via <code>app/content.js</code>. Nothing has been
        written here on our side.
      </p>
    </div>
  );
}

export default function Landing() {
  useReveal();

  return (
    <main className="sdp-root">
      {/* ─────────── BEAT 0a · Announcement strip (§11 · R10) ─────────── */}
      <div className="sdp-announce">
        {/* Static single line since 2026-08-11 — no scroll, no repetition, and
            it must not wrap. .sdp-announce-line scales its own type down on
            narrow screens to hold one line all the way to 320px. */}
        <span className="sdp-announce-line">{announce[0]}</span>
      </div>

      {/* ─────────── BEAT 0b · Trust row (§12, light) ─────────── */}
      <div className="pa-trustrow">
        <div className="sdp-wrap pa-trustrow-inner">
          {/* Overlapping avatar cluster leads the row, as in the reference. */}
          {trustAvatars.length > 0 && (
            <span className="pa-avatars">
              {trustAvatars.map((a) => (
                <img className="pa-avatar" key={a.src} src={a.src} alt={a.name} loading="eager" />
              ))}
            </span>
          )}
          {trustRow.map((chip) => {
            const Ico = chip.icon ? trustIcons[chip.icon] : null;
            return (
              <span className="pa-trustchip" key={chip.label}>
                {Ico && <Ico size={14} />}
                {chip.stars > 0 && (
                  <span className="pa-stars" aria-label={`${chip.stars} out of 5`}>
                    {Array.from({ length: chip.stars }, (_, i) => (
                      <Star key={i} size={13} />
                    ))}
                  </span>
                )}
                {chip.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* ─────────── BEAT 1 · HERO (§8 focal media, light) ─────────── */}
      <section className="sdp-hero" id="hero">
        <div className="sdp-wrap pa-hero-inner">
          {/* gate = bordered pill + glowing dot (post-Kunal), not the filled callout */}
          <span className="sdp-eyebrow-pill" data-sdp-reveal>
            <span className="glowdot" />
            {hero.gate}
          </span>

          <h1 className="sdp-h1" data-sdp-reveal style={{ '--d': '.05s' }}>
            <span className="sdp-h1-l1">
              {hero.h1.map((line) => (
                <span className="pa-h1-line" key={line}>
                  {line}
                </span>
              ))}
            </span>
            <span className="sdp-h1-l2">{hero.h1tail}</span>
          </h1>

          <p className="sdp-sub" data-sdp-reveal style={{ '--d': '.1s' }}>
            {hero.sub.map((run, i) =>
              run.em ? (
                <em className="pa-em" key={i}>
                  {run.text}
                </em>
              ) : (
                <span key={i}>{run.text}</span>
              )
            )}
          </p>

          {/* the health-marker row the finalised copy leads the hero with */}
          {hero.markersLede.length > 0 && (
            <p className="pa-markers-lede" data-sdp-reveal style={{ '--d': '.13s' }}>
              {hero.markersLede.map((run, i) =>
                run.mark ? (
                  <mark className="pa-hl" key={i}>
                    {run.text}
                  </mark>
                ) : (
                  <span key={i}>{run.text}</span>
                )
              )}
            </p>
          )}
          <div className="pa-pillrow" data-sdp-reveal style={{ '--d': '.15s' }}>
            {hero.markers.map((marker) => (
              <span className="sdp-marker-chip" key={marker}>
                <span className="sdp-marker-dot" />
                {marker}
              </span>
            ))}
          </div>

          {/* Reference sets this label as a highlighted pill, not loose text. */}
          <div className="pa-watch" data-sdp-reveal style={{ '--d': '.2s' }}>
            <span className="pa-watch-pill">
              {cta.aboveVideo}
              <ArrowDown size={13} />
            </span>
          </div>

          <VslFrame />

          {/* post-video order is exact: CTA → pointers → urgency (inside lockup)
              → reassurance (inside lockup) → credibility table → outcome pills */}
          <div className="pa-mt-lockup">
            <CtaLockup />
          </div>

          {/* no pointer copy in the finalised docx; renders nothing when empty */}
          {hero.pointers.length > 0 && (
            <div className="pa-pointers" data-sdp-reveal>
              {hero.pointers.map((p) => {
                const Ico = pointerIcons[p.icon];
                return (
                  <span className="pa-pointer" key={p.text}>
                    <span className="pa-pico">
                      <Ico size={15} />
                    </span>
                    {p.text}
                  </span>
                );
              })}
            </div>
          )}

          <div className="pa-stats" data-sdp-reveal>
            {hero.stats.map((s) => (
              <div className="pa-stat" key={s.label}>
                <div className="pa-stat-v">{s.value}</div>
                <div className="pa-stat-l">{s.label}</div>
              </div>
            ))}
          </div>

          {/* the markers row above replaces this in the finalised copy */}
          {hero.outcomePills.length > 0 && (
            <div className="pa-pillrow" data-sdp-reveal>
              {hero.outcomePills.map((pill) => (
                <span className="sdp-marker-chip" key={pill}>
                  <span className="sdp-marker-dot" />
                  {pill}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─────────── BEAT 2 · THIS IS FOR YOU IF (§2 one-sided list, light-alt) ─────────── */}
      <section className="sdp-section sdp-light-alt">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {forYouIf.eyebrow}
          </span>
          <H2 parts={forYouIf.h2} />
          <div className="pa-whowrap pa-mt-24">
            <ul className="sdp-who-list">
              {forYouIf.items.map((item, i) => (
                <li key={item.lead} data-sdp-reveal style={{ '--d': `${i * 0.05}s` }}>
                  <span className="ck">
                    <Check size={13} />
                  </span>
                  <span>
                    <strong className="pa-who-lead">{item.lead}</strong>
                    {item.body}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pa-mt-lockup">
            <CtaLockup />
          </div>
        </div>
      </section>

      {/* ─────────── BEAT 3+4 · PROOF (ported from the Shruti funnel's .section.proof) ───────────
          One section, exactly as on resetbyshrutisolanki.in: eyebrow, H2, lede,
          a 2-up grid of video testimonials, then an auto-scrolling marquee of
          case cards. The old separate before/after marquee is gone; the finalised
          docx defines this as a single beat. */}
      <section className="sdp-section sdp-light-alt pa-proof">
        <div className="sdp-wrap">
          {/* no eyebrow on this section by design */}
          <H2 parts={cases.h2} />
          <p className="pa-lede" data-sdp-reveal>
            {cases.lede}
          </p>

          {/* Video testimonials, 3-up. Three clips supplied, so the fourth slot
              Shruti's funnel carries is gone. Poster/iframe swap and the
              per-clip aspect ratio live in the component. */}
          <VideoTestimonials items={cases.videoTestimonials} slots={cases.videoSlots} />
        </div>

        {/* Case-card marquee. Two identical sets, track animates to -50%, so the
            loop is seamless. Second set is aria-hidden, as on the source. */}
        <div className="pa-case-row" data-dir="ltr" aria-label="Client transformations">
          <div className="pa-case-track" style={{ '--marq-dur': '60s' }}>
            {[0, 1].map((set) => (
              <div className="pa-case-set" key={set} aria-hidden={set === 1 ? 'true' : undefined}>
                {cases.items.map((c) => (
                  <article className="pa-tcard pa-case-card" key={`${set}-${c.name}`}>
                    <div className="pa-tcard-body">
                      <h4>{c.name}</h4>
                      <div className="meta">{c.meta}</div>
                      <div className="stars" aria-label="5 out of 5">
                        {c.rating}
                      </div>
                      <p>{c.quote}</p>
                      <div className="metrics">
                        {c.metrics.map((m) => (
                          <p className="metric" key={m.label}>
                            <span className="v">{m.from ? `${m.from} → ${m.to}` : m.value}</span>
                            <span className="k">{m.label}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── BEAT 4b · CHECK-IN WALL (§6 masonry, light) ─────────── */}
      <section className="sdp-section sdp-light">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {checkinWall.eyebrow}
          </span>
          <H2 parts={checkinWall.h2} />
          <p className="sdp-sub" data-sdp-reveal>
            {checkinWall.lede}
          </p>
          <CheckinWall />
          <div className="pa-mt-lockup">
            <CtaLockup />
          </div>
        </div>
      </section>

      {/* ─────────── BEAT 5 · FOUNDER (§12 credentials + TEXT story, DARK) ─────────── */}
      <section className="sdp-section sdp-dark">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {founder.eyebrow}
          </span>
          <H2 parts={founder.h2} />
          {founder.sub && (
            <p className="sdp-sub" data-sdp-reveal>
              {founder.sub}
            </p>
          )}

          <div className="pa-founder pa-mt-24">
            {/* The "combined shot of Hardik & Dr. Kartik" placeholder was
                removed on the client's call, 2026-08-11. MISSING.expertsPhoto
                still records the gap in content.js; it just no longer shows on
                the page. Swap `founder.photo` when the combined shot lands. */}
            <div className="pa-founder-photo" data-sdp-reveal>
              <img src={founder.photo} alt={`${founder.name}, ${founder.role}`} />
            </div>

            <div>
              <h3 className="pa-founder-name" data-sdp-reveal>
                {founder.name}
              </h3>
              <div className="pa-founder-role" data-sdp-reveal>
                {founder.role}
              </div>

              {/* BEAT 5a — credential + press row, from the finalised copy */}
              {founder.certifications.length > 0 && (
                <div className="pa-credrow" data-sdp-reveal>
                  {founder.certifications.map((c) => (
                    <span className="pa-credpill" key={c.label}>
                      <Check size={12} />
                      {c.label}
                      <a href={c.href} target="_blank" rel="noopener noreferrer">
                        {c.linkLabel}
                      </a>
                    </span>
                  ))}
                </div>
              )}

              {/* BEAT 5b — the one reliably-TEXT beat. Prose, never a component. */}
              <div className="pa-story pa-mt-24">
                {founder.story ? (
                  founder.story.map((para, i) => <p key={i}>{para}</p>)
                ) : (
                  <Missing note={MISSING.founderStory} />
                )}
              </div>
            </div>
          </div>

          {/* BEAT 5c — press wall. Static grid, not a carousel: there are two,
              and every card is a live article you can click through to. */}
          {founder.credentials.length > 0 && (
            <div className="pa-creds">
              <span className="pa-creds-eyebrow" data-sdp-reveal>
                {founder.credentialsEyebrow}
              </span>
              <div className="pa-creds-grid">
                {founder.credentials.map((c, i) => (
                  <a
                    className="pa-cred"
                    key={c.href}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-sdp-reveal
                    style={{ '--d': `${i * 0.06}s` }}
                  >
                    <span className="pa-cred-art">
                      <img src={c.image} alt={`${c.issuer} — ${c.title}`} loading="lazy" />
                    </span>
                    <span className="pa-cred-body">
                      <span className="pa-cred-kind">
                        {c.kind}
                        {c.date && <em>{c.date}</em>}
                      </span>
                      <span className="pa-cred-title">{c.title}</span>
                      <span className="pa-cred-issuer">{c.issuer}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─────────── BEAT 6 · MECHANISM (§1 numbered pillars, light-alt) ─────────── */}
      <section className="sdp-section sdp-light-alt">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {mechanism.eyebrow}
          </span>
          <H2 parts={mechanism.h2} />
          <p className="sdp-sub" data-sdp-reveal>
            {mechanism.sub}
          </p>

          <div className="pa-pillars">
            {mechanism.pillars.map((p, i) => (
              <div className="sdp-card pa-pillar" key={p.title} data-sdp-reveal style={{ '--d': `${i * 0.06}s` }}>
                <span className="sdp-pillar-num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>

          <blockquote className="pa-pullquote" data-sdp-reveal>
            <p>{mechanism.reframe}</p>
          </blockquote>

          <p className="pa-closer" data-sdp-reveal>
            {mechanism.closer}
          </p>

          <div className="pa-mt-lockup">
            <CtaLockup />
          </div>
        </div>
      </section>

      {/* ─────────── BEAT 7 · PROGRAMME (§3 itemized ledger, light) ─────────── */}
      <section className="sdp-section sdp-light">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {programme.eyebrow}
          </span>
          <H2 parts={programme.h2} />
          <p className="sdp-sub" data-sdp-reveal>
            {programme.sub}
          </p>

          {/* Timeline, not a plain ledger (2026-08-11). The rail is drawn on
              .pa-tl, and each node snaps in on reveal — see the lego keyframes
              in globals.css. Deliberately NO week numbering: the docx never
              staged these, and inventing "Week 1 / Week 2" would promise an
              order of delivery nobody has agreed to. */}
          <div className="pa-tl">
            {programme.items.map((item, i) => {
              const Ico = programmeIcons[item.icon] || programmeIcons.report;
              return (
                <div className="pa-tl-row" key={item.title} data-sdp-reveal style={{ '--d': `${i * 0.06}s` }}>
                  <span className="pa-tl-node" aria-hidden="true">
                    <Ico size={19} />
                  </span>
                  <div className="pa-tl-body">
                    <span className="pa-tl-ord">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="pa-footnote" data-sdp-reveal>
            {programme.footnote}
          </p>

          <div className="pa-mt-lockup">
            <CtaLockup />
          </div>
        </div>
      </section>

      {/* ─────────── BEAT 8 · GUARANTEE (dark card, DARK band) ─────────── */}
      <section className="sdp-section sdp-dark">
        <div className="sdp-wrap">
          <div className="sdp-guarantee-card" data-sdp-reveal>
            <div className="sdp-guarantee-icon">
              <Shield size={38} />
            </div>
            <span className="sdp-eyebrow center">{guarantee.eyebrow}</span>
            <H2 parts={guarantee.h2} />
            <p>{guarantee.body}</p>
            {guarantee.terms.length > 0 && (
              <div className="pa-guarantee-terms">
                <h3 className="pa-terms-title">{guarantee.termsTitle}</h3>
                <ul className="sdp-who-list">
                  {guarantee.terms.map((t) => (
                    <li key={t.lead}>
                      <span className="ck">
                        <Check size={13} />
                      </span>
                      <span>
                        <strong className="pa-who-lead">{t.lead}</strong>
                        {t.body}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────── BEAT 9 · TWO CHOICES — CUT (Kunal lock) ─────────── */}

      {/* ─────────── BEAT 10 · FAQ (§5 ruled ledger, light) ─────────── */}
      <section className="sdp-section sdp-light">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {faq.eyebrow}
          </span>
          <H2 parts={faq.h2} />
          <div className="pa-mt-24">
            <Faq />
          </div>

          {/* Guarded: faq.plaque is empty (no plaque copy in the docx), and an
              unguarded .pa-plaque still renders its own border, padding and
              background — an empty white slab under the FAQ. */}
          {faq.plaque.length > 0 && (
            <div className="pa-plaque" data-sdp-reveal>
              {faq.plaque.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          )}

          <div className="pa-mt-lockup">
            <CtaLockup />
          </div>
        </div>
      </section>

      {/* ─────────── BEAT 11 · FINAL CTA (closing-stage finale depth, DARK) ─────────── */}
      <section className="pa-finale sdp-dark" id="final-cta">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {finalCta.eyebrow}
          </span>
          <H2 parts={finalCta.h2} />
          <div className="pa-mt-lockup">
            <CtaLockup />
          </div>

          <div className="pa-colophon">
            {/* Brand and links are separate spans so mobile can stack them on
                two centred lines without the star drifting between them. */}
            <div className="pa-colophon-line">
              <span className="pa-colophon-brand">{finalCta.colophon}</span>
              <span className="pa-colophon-star">
                <Star size={11} />
              </span>
              <span className="pa-colophon-links">
                {finalCta.links.map((l) => (
                  <a key={l.label} href={l.href}>
                    {l.label}
                  </a>
                ))}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── BEAT 12 · STICKY CTA ─────────── */}
      <StickyCta />
    </main>
  );
}
