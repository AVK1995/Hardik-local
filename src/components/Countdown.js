'use client';

import { useEffect, useState } from 'react';

const KEY = 'paw_offer_deadline';
const HOURS = Number(process.env.NEXT_PUBLIC_COUNTDOWN_HOURS || 5);

/** One deadline shared by every CTA lockup on the page, persisted for the visit. */
function getDeadline() {
  try {
    const stored = Number(window.localStorage.getItem(KEY));
    if (stored && stored > Date.now()) return stored;
    const next = Date.now() + HOURS * 60 * 60 * 1000;
    window.localStorage.setItem(KEY, String(next));
    return next;
  } catch {
    return Date.now() + HOURS * 60 * 60 * 1000;
  }
}

const pad = (n) => String(n).padStart(2, '0');

export default function Countdown() {
  // Render the full duration on the server and on first paint, so hydration matches.
  const [left, setLeft] = useState(HOURS * 3600);

  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => setLeft(Math.max(0, Math.round((deadline - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;

  return (
    <span className="sdp-urgency-timer" suppressHydrationWarning>
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}
