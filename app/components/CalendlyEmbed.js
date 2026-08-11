'use client';

import { useEffect, useState } from 'react';
import { CALENDLY_URL } from '../content';

const CALENDAR_URL = process.env.NEXT_PUBLIC_CALENDAR_EMBED_URL || CALENDLY_URL;

/**
 * The scheduler, plus the hand-off to /thank-you once a slot is taken.
 *
 * Calendly posts a message to the parent window on every embed milestone. We
 * only care about `calendly.event_scheduled`, which fires the moment a booking
 * completes, and we send the man to /thank-you ourselves rather than leaving
 * him on a "you are scheduled" panel inside an iframe.
 *
 * ── About the booked time ────────────────────────────────────────────────
 * The event_scheduled payload carries URIs for the event and the invitee, NOT
 * the start time. Reading the time from those URIs needs a Calendly API token
 * and a server call, which this static site has no place to keep.
 *
 * The supported way to get it client-side is Calendly's own redirect: in the
 * event type, under Confirmation Page, choose "Redirect to an external site",
 * point it at https://<domain>/thank-you and tick "Pass event details to your
 * redirected page". Calendly then appends event_start_time, invitee_full_name
 * and friends as query params, and the thank-you page renders the real slot.
 *
 * Both paths are wired. With the redirect configured, Calendly navigates and
 * the params arrive. Without it, this listener still gets the man to the right
 * page, and thank-you falls back to "check your email" instead of a blank slot.
 */
export default function CalendlyEmbed({ id = 'pick-slot' }) {
  const [booked, setBooked] = useState(false);
  /* Calendly wants embed_domain to match the host it is embedded on, and the
     host is only knowable in the browser. Reading window during render made the
     server emit `embed_domain=` and the client `embed_domain=localhost`, which
     is a hydration mismatch. Resolving it after mount means the first render is
     identical on both sides — the placeholder — and the iframe appears once the
     host is known. */
  const [host, setHost] = useState(null);

  useEffect(() => {
    setHost(window.location.hostname);
  }, []);

  useEffect(() => {
    if (!CALENDAR_URL) return;

    const onMessage = (e) => {
      if (typeof e.origin !== 'string' || !e.origin.includes('calendly.com')) return;
      if (!e.data || e.data.event !== 'calendly.event_scheduled') return;

      setBooked(true);
      /* Calendly's own redirect, when configured, will already be navigating —
         this is the fallback for when it is not, so nobody is stranded. */
      window.location.assign('/thank-you');
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <div className="fp-embed" id={id} data-sdp-reveal>
      <div className="fp-embed-inner">
        {CALENDAR_URL && host ? (
          <iframe
            src={`${CALENDAR_URL}${CALENDAR_URL.includes('?') ? '&' : '?'}embed_domain=${host}&embed_type=Inline&hide_gdpr_banner=1`}
            title="Pick your call slot"
            loading="lazy"
          />
        ) : (
          <div className="fp-embed-ph">
            <div>
              <div className="fp-spinner" />
              <span>
                {CALENDAR_URL
                  ? 'Loading available slots…'
                  : 'Calendar pending · set NEXT_PUBLIC_CALENDAR_EMBED_URL'}
              </span>
            </div>
          </div>
        )}

        {booked && (
          <div className="fp-embed-done" role="status">
            <div>
              <div className="fp-spinner" />
              <span>Slot confirmed · taking you to the next step</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
