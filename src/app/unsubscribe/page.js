'use client';

import Link from 'next/link';

import '@/styles/funnel-pages.css';

import useReveal from '@/hooks/useReveal';
import SiteFooter from '@/components/SiteFooter';
import { Check } from '@/components/Icons';
import { unsubscribe } from '@/lib/content';

/**
 * The page a man lands on AFTER the unsubscribe link in an email has done its
 * work. It confirms; it does not ask. No form, no input, no button that claims
 * to do something — the removal happens on the email provider's side before
 * the redirect, and a second "are you sure" here would only make him wonder
 * whether the first one worked.
 *
 * Not linked from the site footer, deliberately: reached from a nav menu this
 * page would tell someone they had been unsubscribed when nothing had happened.
 *
 * Below the confirmation sits a short reminder of what this business does,
 * carried over from the landing copy. A man who unsubscribes today is not
 * necessarily a man who is not interested — he just does not want the emails.
 */
export default function Unsubscribe() {
  useReveal();

  return (
    <main className="sdp-root fp-page">
      <div className="sdp-wrap">
        <div className="fp-mast">
          <div className="fp-seal us-seal" data-sdp-reveal>
            <Check size={44} />
          </div>
          <span className="sdp-eyebrow center" data-sdp-reveal>
            {unsubscribe.eyebrow}
          </span>
          <h1 className="sdp-h2" data-sdp-reveal>
            {unsubscribe.h1[0]}
            <em>{unsubscribe.h1[1]}</em>
          </h1>
          <p className="sdp-sub" data-sdp-reveal>
            {unsubscribe.sub}
          </p>
          <p className="us-keep" data-sdp-reveal>
            {unsubscribe.keepNote}
          </p>
        </div>
      </div>

      <section className="sdp-section sdp-light-alt">
        <div className="sdp-wrap">
          <h2 className="fp-sectionh" data-sdp-reveal>
            {unsubscribe.aboutTitle}
          </h2>
          <p className="sdp-sub" data-sdp-reveal>
            {unsubscribe.aboutBody}
          </p>

          <ul className="us-points" data-sdp-reveal>
            {unsubscribe.aboutPoints.map((p) => (
              <li key={p}>
                <span className="fp-sumtick">
                  <Check size={12} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <div className="fp-center">
            <Link className="fp-back" href="/">
              {unsubscribe.backCta}
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
