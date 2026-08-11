'use client';

import { useState } from 'react';
import { Play } from '@/components/Icons';

/**
 * §8 Proof — the video testimonial grid.
 *
 * Facade pattern, same shape as VslFrame: each card shows a local poster and a
 * play disc, and only swaps in the Vimeo <iframe> on click. Three iframes
 * mounted on load would pull the Vimeo player bundle three times before anyone
 * presses anything, so the poster stands in until intent is shown.
 *
 * Aspect ratio comes from the SOURCE dimensions carried on each item (w/h), set
 * as --ar on the card. A landscape clip renders 16:9 and a portrait one renders
 * 9:16 with no CSS change — see cases.videoTestimonials in content.js.
 *
 * Only one clip plays at a time. Without this the grid can end up with three
 * overlapping audio tracks, which on a testimonial section is unusable.
 */
export default function VideoTestimonials({ items = [], slots = 3 }) {
  const [activeId, setActiveId] = useState(null);

  if (items.length === 0) {
    return (
      <div className="pa-tcards pa-tcards-vid pa-mt-24">
        {Array.from({ length: slots }, (_, i) => (
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
    );
  }

  return (
    <div className="pa-tcards pa-tcards-vid pa-mt-24">
      {items.map((v, i) => {
        const playing = activeId === v.vimeoId;
        /* Playing state rides on a data attribute, NOT a className. useReveal
           adds `vis` imperatively with classList.add, so any React rewrite of
           className wipes it — and because the observer has already unobserved
           the node, the card would fade to opacity:0 and never come back.
           Keeping the className literal constant means React never touches it. */
        return (
          <div
            className="pa-tcard pa-tcard-vid"
            data-playing={playing ? '' : undefined}
            key={v.vimeoId}
            data-sdp-reveal
            style={{ '--d': `${i * 0.05}s`, '--ar': `${v.w} / ${v.h}` }}
          >
            <span className="pa-tphoto">
              {playing ? (
                /* dnt=1 keeps Vimeo from setting tracking cookies. title/byline/
                   portrait off so the card chrome stays ours, not Vimeo's.
                   allow list and referrerPolicy mirror what Vimeo's own oEmbed
                   hands back — trimming them costs fullscreen and web-share. */
                <iframe
                  className="pa-tframe"
                  src={`https://player.vimeo.com/video/${v.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`}
                  title={`${v.name} — client testimonial`}
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <>
                  <img src={v.poster} alt="" loading="lazy" decoding="async" />
                  <span className="pa-tglass" />
                  <button
                    type="button"
                    className="pa-tplay-hit"
                    onClick={() => setActiveId(v.vimeoId)}
                    aria-label={`Play ${v.name}'s testimonial`}
                  >
                    <span className="pa-tplay">
                      <Play size={22} />
                    </span>
                  </button>
                  <span className="pa-tag">Video</span>
                </>
              )}
            </span>
            <span className="pa-tcard-body">
              <span className="nm">{v.name}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
