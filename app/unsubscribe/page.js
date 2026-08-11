'use client';

import '../funnel-pages.css';

import { useState } from 'react';
import useReveal from '../components/useReveal';
import SiteFooter from '../components/SiteFooter';
import { Arrow, Shield } from '../components/Icons';
import { unsubscribe } from '../content';

/**
 * Landing page for the unsubscribe link in marketing emails.
 *
 * It cannot actually remove anyone yet — that needs the email provider's API,
 * and there is no backend here. So submitting shows an honest hand-off message
 * rather than a green "you're unsubscribed" tick that quietly does nothing.
 * A false confirmation on an unsubscribe page is worse than no page at all:
 * the man stops expecting the emails to stop, and they keep arriving.
 *
 * Wire the provider, then replace the pending state with a real result.
 */
export default function Unsubscribe() {
  useReveal();
  const [sent, setSent] = useState(false);

  return (
    <main className="sdp-root fp-page">
      <div className="sdp-wrap">
        <div className="fp-mast lg-mast">
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
        </div>

        <div className="us-card" data-sdp-reveal>
          {sent ? (
            <div className="us-done" role="status">
              <span className="us-done-mark">
                <Shield size={20} />
              </span>
              <p>{unsubscribe.pending}</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="fp-field">
                <label htmlFor="unsub-email">{unsubscribe.fieldLabel}</label>
                <input
                  id="unsub-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={unsubscribe.placeholder}
                  required
                />
              </div>
              <div className="fp-paybtn">
                <button className="sdp-cta" type="submit">
                  <span className="sdp-cta-line">
                    <span className="sdp-cta-text">{unsubscribe.button}</span>
                    <span className="arrow">
                      <Arrow size={13} />
                    </span>
                  </span>
                </button>
              </div>
            </form>
          )}

          <p className="us-keep">{unsubscribe.keepNote}</p>
        </div>

        <div className="fp-center" style={{ paddingBottom: 70 }}>
          <a className="fp-back" href="/">
            {unsubscribe.backNote}
          </a>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
