import { founder } from '../content';

/**
 * BEAT 5c — the credentials marquee: certificates and press, in one rail.
 *
 * Deliberately inert (2026-08-11). It scrolls itself, linearly and forever, and
 * that is the whole of it: no arrows, no modal, no hover pause, no click. The
 * cards are proof you glance at while the page carries you past, not a gallery
 * to operate — so there is nothing here to operate.
 *
 * Because of that this is a server component with no state and no effects. The
 * loop is pure CSS: the set is rendered TWICE and the track animates to -50%,
 * so the second copy is exactly under the first when it wraps and the seam is
 * invisible. The duplicate is aria-hidden, so a screen reader hears the list
 * once. Same mechanism the check-in wall and case-card rows already use.
 */
export default function Credentials() {
  const items = founder.credentials;
  if (!items.length) return null;

  return (
    <div className="pa-creds">
      <span className="pa-creds-eyebrow" data-sdp-reveal>
        {founder.credentialsEyebrow}
      </span>

      <div className="pa-creds-rail" data-sdp-reveal>
        <div className="pa-creds-track">
          {[0, 1].map((set) => (
            <div className="pa-creds-set" key={set} aria-hidden={set === 1 ? 'true' : undefined}>
              {items.map((c) => (
                <div className="pa-cred" key={`${set}-${c.image}`}>
                  <span className="pa-cred-art">
                    <img src={c.image} alt={`${c.title} — ${c.issuer}`} loading="lazy" />
                  </span>
                  <span className="pa-cred-body">
                    <span className="pa-cred-kind">
                      {c.kind}
                      {c.date && <em>{c.date}</em>}
                    </span>
                    <span className="pa-cred-title">{c.title}</span>
                    <span className="pa-cred-issuer">{c.issuer}</span>
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
