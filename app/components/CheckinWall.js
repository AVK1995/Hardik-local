import { checkinWall } from '../content';

/**
 * §6 Proof — the chat wall, as two opposed marquee rows.
 * Row one runs left to right, row two right to left, per the docx.
 *
 * Inert as of 2026-08-11: the screenshots used to open in a lightbox and lift
 * on hover. Both are gone — these rows scroll past and that is all they do, so
 * there is no state, no effect and nothing to click. That also makes this a
 * server component again.
 *
 * NO IMAGE APPEARS IN BOTH ROWS. content.js holds rowOne and rowTwo as separate
 * lists and every screenshot is used exactly once across the two. The set
 * duplication below is the seamless-loop mechanism (the track animates to -50%,
 * so it needs two identical halves), not a repeated image: the copy is marked
 * aria-hidden so assistive tech reads each screenshot once.
 *
 * A dev-only guard throws if the two lists ever overlap, so a future edit to
 * content.js cannot reintroduce a duplicate silently.
 */
if (process.env.NODE_ENV !== 'production') {
  const one = new Set(checkinWall.rowOne.map((i) => i.src));
  const clash = checkinWall.rowTwo.filter((i) => one.has(i.src)).map((i) => i.src);
  if (clash.length) {
    throw new Error(
      `checkinWall: rowOne and rowTwo must not share images. Duplicated: ${clash.join(', ')}`
    );
  }
}

function Row({ items, dir, duration }) {
  return (
    <div className="pa-chatrow" data-dir={dir} style={{ '--marq-dur': duration }}>
      <div className="pa-chattrack">
        {[0, 1].map((set) => (
          <div className="pa-chatset" key={set} aria-hidden={set === 1 ? 'true' : undefined}>
            {items.map((item) => (
              <div className="pa-shot" key={`${set}-${item.src}`}>
                <img src={item.src} alt={item.alt} loading="lazy" />
                {item.tag && <span className="pa-shot-tag">{item.tag}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CheckinWall() {
  return (
    <div className="pa-chatwall">
      <Row items={checkinWall.rowOne} dir="ltr" duration="58s" />
      <Row items={checkinWall.rowTwo} dir="rtl" duration="66s" />
    </div>
  );
}
