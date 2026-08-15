'use client';

import { useEffect, useRef, useState } from 'react';
import { Play } from '@/components/Icons';
import { vsl } from '@/lib/content';

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

   NO dnt=1. It was here until 2026-08-11 and it was silently switching Vimeo
   analytics off: dnt ("do not track") stops Vimeo recording the session, so
   plays, watch time and drop-off never reach the dashboard. For a VSL that is
   the whole point of the page, that data is the reason the video exists.
   Vimeo then sets its usual cookies — which is why the privacy policy lists a
   video provider under "who else touches your data". Do not re-add dnt unless
   the client accepts losing the analytics with it. */
const PLAY_PARAMS = 'autoplay=1&muted=0&playsinline=1&title=0&byline=0&portrait=0';

/**
 * Normalise whatever is in NEXT_PUBLIC_VSL_URL into something that can actually
 * live in an iframe.
 *
 * 2026-08-15 outage: the env var was set to the Vimeo WATCH url
 * (`https://vimeo.com/1217229742`). vimeo.com serves that page with
 * X-Frame-Options, so the browser refused the frame and the hero rendered
 * "vimeo.com refused to connect" — on the live funnel, mid-ad-spend.
 * Only `player.vimeo.com/video/<id>` is embeddable.
 *
 * Rather than rely on whoever edits Vercel pasting the player URL, convert it
 * here. A watch link is the natural thing to copy out of the address bar, so
 * treating it as valid input is the robust design.
 */
function toEmbedUrl(raw) {
  if (!raw) return '';
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, '');

    /* Already an embeddable player URL — leave it alone. */
    if (host === 'player.vimeo.com' || host.endsWith('youtube-nocookie.com')) return raw;

    /* Vimeo watch page: /<id> or /<id>/<privacyHash> */
    if (host === 'vimeo.com') {
      const seg = u.pathname.split('/').filter(Boolean);
      const id = seg.find((s) => /^\d+$/.test(s));
      if (!id) return raw;
      const hash = seg[seg.indexOf(id) + 1];
      const q = `${PLAY_PARAMS}${hash ? `&h=${encodeURIComponent(hash)}` : ''}`;
      return `https://player.vimeo.com/video/${id}?${q}`;
    }

    /* YouTube watch / short links fail the same way for the same reason. */
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?${PLAY_PARAMS}`;
      if (u.pathname.startsWith('/embed/')) return raw;
    }
    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?${PLAY_PARAMS}`;
    }

    /* Anything else (a hosted mp4, a custom player) is used verbatim. */
    return raw;
  } catch {
    return raw;
  }
}

const EMBED =
  toEmbedUrl(URL_OVERRIDE) ||
  `https://player.vimeo.com/video/${vsl.vimeoId}?${PLAY_PARAMS}`;

/**
 * §8 Focal media — the hero VSL (R2/R7).
 *
 * Facade, matching VideoTestimonials: the poster stands in until someone
 * actually presses play, so Vimeo's player bundle is not pulled on every first
 * paint of the landing page. It is the heaviest thing the hero could load and
 * most visitors scroll past it.
 *
 * ── Sound ────────────────────────────────────────────────────────────────
 * The URL asks for unmuted autoplay, but a URL cannot force it: every browser
 * reserves the right to refuse, and iOS in Low Power Mode refuses outright.
 * So the Player SDK is loaded on demand (dynamic import — it stays out of the
 * initial bundle) and used to actually assert it: unmute, volume to full,
 * play. If the browser still refuses, we do NOT leave a sales video running
 * silently — the player is muted deliberately so it at least plays, and a
 * "Tap for sound" control appears. One tap fixes it, because by then the tap
 * is a fresh user gesture and no browser blocks that.
 */
export default function VslFrame({ playing: playingProp, onPlay }) {
  const [playingSelf, setPlayingSelf] = useState(false);
  const [needsSound, setNeedsSound] = useState(false);
  const frameRef = useRef(null);
  const playerRef = useRef(null);

  /* Controlled when the page passes `playing` — the "Watch the short video
     below" pill starts it from outside the frame — and self-managed otherwise,
     so the component still works standalone. */
  const controlled = playingProp !== undefined;
  const playing = controlled ? playingProp : playingSelf;
  const start = () => (controlled ? onPlay?.() : setPlayingSelf(true));

  useEffect(() => {
    if (!playing || !frameRef.current || URL_OVERRIDE) return;
    let cancelled = false;

    (async () => {
      try {
        const { default: Player } = await import('@vimeo/player');
        if (cancelled || !frameRef.current) return;

        const player = new Player(frameRef.current);
        playerRef.current = player;

        await player.ready();
        if (cancelled) return;

        await player.setMuted(false);
        await player.setVolume(1);

        try {
          await player.play();
        } catch {
          /* Unmuted autoplay refused. Play muted rather than not at all, and
             ask for the one tap that buys the sound back. */
          if (cancelled) return;
          await player.setMuted(true).catch(() => {});
          await player.play().catch(() => {});
          if (!cancelled) setNeedsSound(true);
        }
      } catch {
        /* SDK failed to load or the player would not talk to us. The iframe's
           own autoplay params still apply, so this is a degradation, not a
           break — and Vimeo's own play button remains. */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [playing]);

  const enableSound = async () => {
    const player = playerRef.current;
    if (!player) return;
    try {
      await player.setMuted(false);
      await player.setVolume(1);
      await player.play().catch(() => {});
      setNeedsSound(false);
    } catch {
      /* Leave the control up; another tap is free. */
    }
  };

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
        <>
          <iframe
            ref={frameRef}
            className="sdp-vsl-embed"
            src={EMBED}
            title={vsl.title}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          {needsSound && (
            <button type="button" className="sdp-vsl-unmute" onClick={enableSound}>
              <span className="sdp-vsl-unmute-ico" aria-hidden="true">
                <SoundOff />
              </span>
              Tap for sound
            </button>
          )}
        </>
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

/* Local to this file — the only place a muted-speaker mark is needed. */
function SoundOff() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6.5 8.8H3v6.4h3.5L11 19z" />
      <path d="m16.5 9.5 5 5M21.5 9.5l-5 5" />
    </svg>
  );
}
