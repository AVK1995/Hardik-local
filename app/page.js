'use client';

import './landing.css';

import useReveal from './components/useReveal';
import CtaLockup from './components/CtaLockup';
import VslFrame from './components/VslFrame';
import CheckinWall from './components/CheckinWall';
import Faq from './components/Faq';
import StickyCta from './components/StickyCta';
import { ArrowDown, Check, Play, Shield, Star, pointerIcons, trustIcons } from './components/Icons';

import {
  MISSING,
  announce,
  trustRow,
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

/* How many times the announce copy repeats per half of the marquee track.
   Each half must overflow the widest viewport or the loop shows a blank gap. */
const ANNOUNCE_REPEAT = 8;

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
        {/* The track scrolls by translateX(-50%), so the two halves must be
            identical AND each half must be wider than the viewport, or a blank
            gap appears. One short line was nowhere near wide enough, so each
            half repeats the copy ANNOUNCE_REPEAT times. */}
        <div className="sdp-announce-track">
          {[0, 1].map((half) =>
            Array.from({ length: ANNOUNCE_REPEAT }, (_, rep) =>
              announce.map((line, i) => (
                <span key={`${half}-${rep}-${i}`}>
                  {line} <span className="dot">·</span>
                </span>
              ))
            )
          )}
        </div>
      </div>

      {/* ─────────── BEAT 0b · Trust row (§12, light) ─────────── */}
      <div className="pa-trustrow">
        <div className="sdp-wrap pa-trustrow-inner">
          {trustRow.map((chip) => {
            const Ico = chip.icon ? trustIcons[chip.icon] : null;
            return (
              <span className="pa-trustchip" key={chip.label}>
                {Ico && <Ico size={14} />}
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
            {hero.sub}
          </p>

          {/* the health-marker row the finalised copy leads the hero with */}
          {hero.markersLede && (
            <p className="pa-markers-lede" data-sdp-reveal style={{ '--d': '.13s' }}>
              {hero.markersLede}
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

          <div className="pa-watch" data-sdp-reveal style={{ '--d': '.2s' }}>
            {cta.aboveVideo}
            <ArrowDown size={13} />
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

          {/* Video testimonials, 2-up. Structure matches Shruti's .tcards-vid.
              Until clips land, cases.videoSlots empty boxes hold the layout. */}
          <div className="pa-tcards pa-tcards-vid pa-mt-24">
            {cases.videoTestimonials.length > 0
              ? cases.videoTestimonials.map((v, i) => (
                  <button
                    className="pa-tcard pa-tcard-vid"
                    key={v.name}
                    data-sdp-reveal
                    style={{ '--d': `${i * 0.05}s` }}
                    type="button"
                  >
                    <span className="pa-tphoto">
                      <video src={v.src} poster={v.poster} preload="none" muted loop playsInline />
                      <span className="pa-tglass" />
                      <span className="pa-tplay">
                        <Play size={22} />
                      </span>
                      <span className="pa-tag">Video</span>
                    </span>
                    <span className="pa-tcard-body">
                      <span className="nm">{v.name}</span>
                    </span>
                  </button>
                ))
              : Array.from({ length: cases.videoSlots }, (_, i) => (
                  <div
                    className="pa-tcard pa-tcard-vid pa-tcard-ph"
                    key={`vid-slot-${i}`}
                    data-sdp-reveal
                    style={{ '--d': `${i * 0.05}s` }}
                  >
                    <span className="pa-tphoto">
                      <span className="pa-tglass" />
                      <span className="pa-tplay">
                        <Play size={22} />
                      </span>
                      <span className="pa-tag">Video</span>
                    </span>
                    <span className="pa-tcard-body">
                      <span className="nm">Video testimonial {i + 1}</span>
                    </span>
                  </div>
                ))}
          </div>
          {cases.videoTestimonials.length === 0 && <Missing note={MISSING.videoTestimonials} />}
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
            <div className="pa-founder-photo" data-sdp-reveal>
              <img src={founder.photo} alt={`${founder.name}, ${founder.role}`} />
              <Missing note={MISSING.expertsPhoto} />
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

          <div className="pa-ledger">
            {programme.items.map((item, i) => (
              <div className="pa-lrow" key={item.title} data-sdp-reveal style={{ '--d': `${i * 0.04}s` }}>
                <span className="pa-lord">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
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

          <div className="pa-plaque" data-sdp-reveal>
            {faq.plaque.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>

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
            <div className="pa-colophon-line">
              <span>{finalCta.colophon}</span>
              <span className="pa-colophon-star">
                <Star size={11} />
              </span>
              {finalCta.links.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── BEAT 12 · STICKY CTA ─────────── */}
      <StickyCta />
    </main>
  );
}
