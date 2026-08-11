'use client';

import '../funnel-pages.css';

import useReveal from './useReveal';
import SiteFooter from './SiteFooter';
import { legalEntity } from '../content';

/**
 * One renderer for all four policy pages. They differ only in their content
 * object, so the shell — masthead, prose column, contact block, back link —
 * lives here once.
 *
 * The warning banner is not decoration. A policy page that never names the
 * entity standing behind it is unenforceable, and on a site that takes payment
 * and collects health information that is a live compliance problem rather than
 * a cosmetic gap. It stays visible until `legalEntity` is filled in, on the
 * same principle as the MISSING flags elsewhere in this project: an obvious
 * hole is safer than a plausible invention.
 */
export default function LegalPage({ doc }) {
  useReveal();

  const missing = Object.entries(legalEntity)
    .filter(([k, v]) => k !== 'updated' && !v)
    .map(([k]) => k);

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
          {missing.length > 0 && (
            <div className="fp-missing" data-sdp-reveal>
              <strong>[NOT READY TO PUBLISH]</strong>
              <br />
              This is an authored draft and has not been reviewed by a lawyer. It is missing:{' '}
              {missing.join(', ')}. Fill in <code>legalEntity</code> in <code>app/content.js</code>{' '}
              and have the text checked before launch. This notice disappears on its own once every
              field is set.
            </div>
          )}

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
                <span>Entity</span>
                {legalEntity.name || <em className="lg-todo">[registered legal name required]</em>}
              </li>
              <li>
                <span>Email</span>
                {legalEntity.email || <em className="lg-todo">[contact email required]</em>}
              </li>
              <li>
                <span>Address</span>
                {legalEntity.address || <em className="lg-todo">[registered address required]</em>}
              </li>
              <li>
                <span>Jurisdiction</span>
                {legalEntity.jurisdiction || <em className="lg-todo">[jurisdiction required]</em>}
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
