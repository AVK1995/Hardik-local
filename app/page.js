'use client';

import './landing.css';

import useReveal from './components/useReveal';
import CtaLockup from './components/CtaLockup';
import VslFrame from './components/VslFrame';
import CheckinWall from './components/CheckinWall';
import Faq from './components/Faq';
import StickyCta from './components/StickyCta';
import { ArrowDown, Arrow, Check, Shield, Star, pointerIcons } from './components/Icons';

import {
  MISSING,
  announce,
  trustRow,
  hero,
  forYouIf,
  transformations,
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
        <div className="sdp-announce-track">
          {[0, 1].map((dup) =>
            announce.map((line, i) => (
              <span key={`${dup}-${i}`}>
                {line} <span className="dot">·</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* ─────────── BEAT 0b · Trust row (§12, light) ─────────── */}
      <div className="pa-trustrow">
        <div className="sdp-wrap pa-trustrow-inner">
          {trustRow.map((chip) => (
            <span className="pa-trustchip" key={chip}>
              <Check size={13} />
              {chip}
            </span>
          ))}
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
            <span className="sdp-h1-l1">{hero.h1line1}</span>
            <span className="sdp-h1-l2">{hero.h1line2}</span>
          </h1>

          <p className="sdp-sub" data-sdp-reveal style={{ '--d': '.1s' }}>
            {hero.sub}
          </p>

          {/* pre-video pills = programme FEATURES, never transformation figures */}
          <div className="pa-pillrow" data-sdp-reveal style={{ '--d': '.15s' }}>
            {hero.featurePills.map((pill) => (
              <span className="sdp-marker-chip" key={pill}>
                <span className="sdp-marker-dot" />
                {pill}
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

          <div className="pa-stats" data-sdp-reveal>
            {hero.stats.map((s) => (
              <div className="pa-stat" key={s.label}>
                <div className="pa-stat-v">{s.value}</div>
                <div className="pa-stat-l">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="pa-pillrow" data-sdp-reveal>
            {hero.outcomePills.map((pill) => (
              <span className="sdp-marker-chip" key={pill}>
                <span className="sdp-marker-dot" />
                {pill}
              </span>
            ))}
          </div>
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

      {/* ─────────── BEAT 3 · TRANSFORMATIONS (§6 marquee, light) ─────────── */}
      <section className="sdp-section sdp-light">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {transformations.eyebrow}
          </span>
          <H2 parts={transformations.h2} />
        </div>
        <div className="pa-marquee pa-mt-24" data-sdp-reveal>
          <div className="pa-marquee-track">
            {[0, 1].map((dup) =>
              transformations.items.map((item) => (
                <figure className="pa-ba" key={`${dup}-${item.src}`}>
                  <img src={item.src} alt={item.caption} loading="lazy" />
                  <figcaption className="pa-ba-cap">{item.caption}</figcaption>
                </figure>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ─────────── BEAT 4 · PROOF, case cards (§6 exhibit frame + §4 lit number, light-alt) ─────────── */}
      <section className="sdp-section sdp-light-alt">
        <div className="sdp-wrap">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            The case files
          </span>
          <H2 parts={cases.h2} />
          <p className="pa-lede" data-sdp-reveal>
            {cases.lede}
          </p>

          <div className="pa-cases pa-mt-24">
            {cases.items.map((c, i) => (
              <article className="sdp-card pa-case" key={c.name} data-sdp-reveal style={{ '--d': `${i * 0.05}s` }}>
                <div className="pa-case-mat">
                  <div className="pa-case-metric">
                    <span className="pa-metric-n pa-metric-from">{c.metric.from}</span>
                    <span className="pa-metric-arrow">
                      <Arrow size={20} />
                    </span>
                    <span className="pa-metric-n pa-metric-to">{c.metric.to}</span>
                  </div>
                  <span className="pa-metric-l">{c.metric.label}</span>
                  {/* Media slot intentionally empty — see MISSING note below. */}
                  <div className="pa-media-pending">Photo / clip pending</div>
                </div>
                <div className="pa-case-meta">
                  <span>
                    {c.name} · {c.meta}
                  </span>
                  <span className="pa-verified">
                    <Check size={12} /> Verified case
                  </span>
                </div>
                <p className="pa-case-quote">{c.quote}</p>
              </article>
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

          <div className="pa-founder pa-mt-24">
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

              {/* BEAT 5a — credential pill row */}
              {founder.credentials.length > 0 ? (
                <div className="pa-credrow" data-sdp-reveal>
                  {founder.credentials.map((c) => (
                    <span className="pa-credpill" key={c}>
                      <Check size={12} />
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <Missing note={MISSING.founderCredentials} />
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
            {guarantee.h2 ? (
              <>
                <H2 parts={guarantee.h2} />
                <p>{guarantee.body}</p>
              </>
            ) : (
              <Missing note={MISSING.guarantee} />
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
