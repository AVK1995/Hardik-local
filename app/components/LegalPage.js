'use client';

import '../funnel-pages.css';

import useReveal from './useReveal';
import SiteFooter from './SiteFooter';
import { legalEntity } from '../content';

/**
 * One renderer for the policy pages. They differ only in their content object,
 * so the shell — masthead, prose column, contact block, back link — lives here
 * once.
 *
 * The not-ready-to-publish banner that used to sit above the intro is gone as
 * of 2026-08-11, now that `legalEntity` carries a name and an email. These are
 * still authored drafts that have not been through a lawyer; that caveat now
 * lives in the comment above `legal` in content.js rather than on the page.
 */
export default function LegalPage({ doc }) {
  useReveal();

  return (
    <main className="sdp-root fp-page">
      <div className="sdp-wrap">
        <div className="fp-mast lg-mast">
          <span className="sdp-eyebrow center" data-sdp-reveal>
            Project Alpha Wellness
          </span>
          <h1 className="sdp-h2" data-sdp-reveal>
            {doc.title}
          </h1>
          <p className="lg-updated" data-sdp-reveal>
            Last updated {legalEntity.updated}
          </p>
        </div>

        <div className="lg-doc">
          <p className="lg-intro" data-sdp-reveal>
            {doc.intro}
          </p>

          {doc.sections.map((s) => (
            <section className="lg-section" key={s.h} data-sdp-reveal>
              <h2>{s.h}</h2>
              {s.p.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </section>
          ))}

          <section className="lg-section lg-contact" data-sdp-reveal>
            <h2>Contact</h2>
            <p>Questions about this policy, or a request about your data, go to:</p>
            <ul className="lg-contact-list">
              <li>
                <span>Name</span>
                {legalEntity.name}
              </li>
              <li>
                <span>Email</span>
                <a href={`mailto:${legalEntity.email}`}>{legalEntity.email}</a>
              </li>
            </ul>
          </section>
        </div>

        <div className="fp-center" style={{ paddingBottom: 70 }}>
          <a className="fp-back" href="/">
            Back to Project Alpha Wellness
          </a>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
