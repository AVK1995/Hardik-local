'use client';

import { useState } from 'react';
import { Play } from './Icons';
import { vsl } from '../content';

/* An env override still wins, so the video can be swapped without a deploy of
   this file. Set NEXT_PUBLIC_VSL_URL to a full embed URL (Vimeo, YouTube, a
   hosted player) and it is used verbatim in place of the id below. */
const URL_OVERRIDE = process.env.NEXT_PUBLIC_VSL_URL || '';
const POSTER = process.env.NEXT_PUBLIC_VSL_POSTER || vsl.poster;

const EMBED = URL_OVERRIDE
  ? URL_OVERRIDE
  : `https://player.vimeo.com/video/${vsl.vimeoId}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;

/**
 * §8 Focal media — the hero VSL (R2/R7).
 *
 * Facade, matching VideoTestimonials: the poster stands in until someone
 * actually presses play, so Vimeo's player bundle is not pulled on every first
 * paint of the landing page. It is the heaviest thing the hero could load and
 * most visitors scroll past it.
 *
 * The frame takes its aspect ratio from the clip's own dimensions via --ar, so
 * a portrait VSL would frame portrait with no CSS change.
 */
export default function VslFrame() {
  const [playing, setPlaying] = useState(false);

  return (
    /* data-playing, not a className — rewriting className here wipes the `vis`
       class useReveal adds imperatively, and since the observer has already
       unobserved the node the player would fade to opacity:0 the instant you
       pressed play. Same trap as Faq.js and VideoTestimonials.js. */
    <div
      className="sdp-vsl"
      data-playing={playing ? '' : undefined}
      data-sdp-reveal
      style={{ '--d': '.1s', '--ar': `${vsl.w} / ${vsl.h}` }}
    >
      {playing ? (
        <iframe
          className="sdp-vsl-embed"
          src={EMBED}
          title={vsl.title}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <>
          <img className="sdp-vsl-poster" src={POSTER} alt="" />
          <button
            type="button"
            className="sdp-vsl-play"
            onClick={() => setPlaying(true)}
            aria-label="Play the video"
          >
            <span className="sdp-vsl-disc">
              <Play size={30} />
            </span>
          </button>
        </>
      )}
    </div>
  );
}
