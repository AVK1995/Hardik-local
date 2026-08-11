'use client';

import { useState } from 'react';
import { Play } from './Icons';
import { vsl } from '../content';

/* An env override still wins, so the video can be swapped without a deploy of
   this file. Set NEXT_PUBLIC_VSL_URL to a full embed URL (Vimeo, YouTube, a
   hosted player) and it is used verbatim in place of the id below. */
const URL_OVERRIDE = process.env.NEXT_PUBLIC_VSL_URL || '';
const POSTER = process.env.NEXT_PUBLIC_VSL_POSTER || vsl.poster;

/* Playback params, and why each one is here:
     autoplay=1    the iframe is only ever created by a tap, so the browser
                   counts that gesture and lets it start WITH SOUND. Adding
                   muted=1 would guarantee autoplay but silence a sales video,
                   which is the opposite of what it is for.
     muted=0       explicit, so no future edit "helpfully" adds a mute.
     playsinline=1 iOS Safari otherwise seizes the video into its own fullscreen
                   player the moment it starts. This is the single param that
                   makes iPhone behave like every other device.
     dnt=1         no Vimeo tracking cookies. */
const EMBED = URL_OVERRIDE
  ? URL_OVERRIDE
  : `https://player.vimeo.com/video/${vsl.vimeoId}` +
    `?autoplay=1&muted=0&playsinline=1&title=0&byline=0&portrait=0&dnt=1`;

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
export default function VslFrame({ playing: playingProp, onPlay }) {
  const [playingSelf, setPlayingSelf] = useState(false);
  /* Controlled when the page passes `playing` — the "Watch the short video
     below" pill starts it from outside the frame — and self-managed otherwise,
     so the component still works standalone. */
  const controlled = playingProp !== undefined;
  const playing = controlled ? playingProp : playingSelf;
  const start = () => (controlled ? onPlay?.() : setPlayingSelf(true));

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
          <button type="button" className="sdp-vsl-play" onClick={start} aria-label="Play the video">
            <span className="sdp-vsl-disc">
              <Play size={30} />
            </span>
          </button>
        </>
      )}
    </div>
  );
}
