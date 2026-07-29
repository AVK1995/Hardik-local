'use client';

import { useRef, useState } from 'react';
import { Play } from './Icons';

const VSL_URL = process.env.NEXT_PUBLIC_VSL_URL || '';
const POSTER = process.env.NEXT_PUBLIC_VSL_POSTER || '/proof/hardik.png';

/**
 * §8 Focal media — VSL frame (R2/R7). Poster swaps to a real <video> on click and
 * the decorative overlay yields so native controls stay reachable (C12).
 *
 * NEXT_PUBLIC_VSL_URL is empty until the VSL is produced; the frame then shows the
 * poster with a pending badge instead of a broken player.
 */
export default function VslFrame() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const play = () => {
    if (!VSL_URL) return;
    setPlaying(true);
    requestAnimationFrame(() => videoRef.current?.play());
  };

  return (
    <div className={`sdp-vsl${playing ? ' playing' : ''}`} data-sdp-reveal style={{ '--d': '.1s' }}>
      {playing ? (
        <video ref={videoRef} className="sdp-vsl-video" src={VSL_URL} poster={POSTER} controls playsInline />
      ) : (
        <>
          <img className="sdp-vsl-poster" src={POSTER} alt="Project Alpha Wellness video" />
          <button
            type="button"
            className="sdp-vsl-play"
            onClick={play}
            aria-label={VSL_URL ? 'Play the video' : 'Video not yet available'}
          >
            <span className="sdp-vsl-disc">
              <Play size={30} />
            </span>
          </button>
          {!VSL_URL && (
            <span className="sdp-vsl-pending">VSL pending · set NEXT_PUBLIC_VSL_URL</span>
          )}
        </>
      )}
    </div>
  );
}
