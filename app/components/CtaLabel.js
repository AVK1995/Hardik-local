import { cta } from '../content';

/**
 * The CTA button label, shared by the inline lockup and the sticky bar so the
 * wording and its break points can never drift apart.
 *
 * `cta.button` is a list of runs. They are wrapped in ONE span rather than
 * being handed to .sdp-cta-line directly: that container is a flex row with a
 * 12px gap, so loose runs would become flex items and take the gap as their
 * word space. Inside this wrapper they are ordinary inline text, joined by the
 * ::before space in globals.css, and go block-level on mobile.
 */
export default function CtaLabel() {
  return (
    <span className="sdp-cta-text">
      {cta.button.map((run) => (
        <span className="sdp-cta-ln" key={run}>
          {run}
        </span>
      ))}
    </span>
  );
}
