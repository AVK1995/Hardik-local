/**
 * One bespoke icon family. Inline line-SVG, single stroke weight (1.6),
 * coloured via currentColor only (C11 / C12). No emoji, no icon fonts.
 */
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function Check({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export function Arrow({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowDown({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M12 5v13M6 12l6 6 6-6" />
    </svg>
  );
}

export function Plus({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Play({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5z" fill="currentColor" />
    </svg>
  );
}

export function Report({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v4h4" />
      <path d="M9 13h7M9 17h5" />
    </svg>
  );
}

export function Target({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.4" />
    </svg>
  );
}

export function Route({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.5 6H14a3.5 3.5 0 0 1 0 7h-4a3.5 3.5 0 0 0 0 7h5.5" />
    </svg>
  );
}

export function Shield({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.4-2.9 7.9-7 9-4.1-1.1-7-4.6-7-9V6z" />
      <path d="M9 12.2l2.2 2.2L15.4 10" />
    </svg>
  );
}

export function Lock({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  );
}

export function Calendar({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="15" rx="2.4" />
      <path d="M4 10h16M9 3.5v4M15 3.5v4" />
    </svg>
  );
}

export function Clock({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.6V12l3 1.8" />
    </svg>
  );
}

export function Star({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3.6l2.6 5.3 5.8.85-4.2 4.1 1 5.75L12 16.9l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Close({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/* Solid, not stroked: the only filled icon in the family. It sits inside the
   hero's eyebrow pill at 15px, where a 1.6 stroke reads as a thin scratch. */
export function User({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
      <circle cx="12" cy="7.6" r="4" />
      <path d="M12 13.4c-4.1 0-7.4 2.7-7.4 6 0 .6.5 1 1.1 1h12.6c.6 0 1.1-.4 1.1-1 0-3.3-3.3-6-7.4-6z" />
    </svg>
  );
}

export function Users({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="9" cy="8" r="3.4" />
      <path d="M2.8 19.5a6.2 6.2 0 0 1 12.4 0" />
      <path d="M16.2 5.2a3.4 3.4 0 0 1 0 5.6" />
      <path d="M17.6 14.2a6.2 6.2 0 0 1 3.6 5.3" />
    </svg>
  );
}

export function Globe({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.6 3.7 5.7 3.7 9s-1.3 6.4-3.7 9c-2.4-2.6-3.7-5.7-3.7-9S9.6 5.6 12 3z" />
    </svg>
  );
}

/* ── Health markers. One mark per marker, chosen to be distinguishable from
   each other at 14px rather than merely thematic. ───────────────────────── */

/* Testosterone — the Mars glyph, the standard mark for the male hormone. */
export function Mars({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="10" cy="14" r="5.6" />
      <path d="M14.8 9.2 20.5 3.5" />
      <path d="M15.5 3.5h5v5" />
    </svg>
  );
}

/* HbA1c — a blood droplet; the marker is read off a blood sample. */
export function Droplet({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M12 3.2c3.4 4 5.6 6.9 5.6 9.6a5.6 5.6 0 1 1-11.2 0c0-2.7 2.2-5.6 5.6-9.6z" />
    </svg>
  );
}

/* Belly fat — a tape measure round the waist. */
export function Tape({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <rect x="3" y="7" width="18" height="10" rx="4.2" />
      <path d="M8 7v10M12 7v10M16 7v10" />
    </svg>
  );
}

/* LDL cholesterol — an artery in cross-section, narrowed by plaque. */
export function Artery({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 6.6a5.4 5.4 0 0 1 0 10.8 5.4 5.4 0 0 1-3.4-9.6" />
    </svg>
  );
}

/* Triglycerides — a glycerol backbone carrying its three fatty-acid chains. */
export function Triglyceride({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M6 4.5v15" />
      <path d="M6 7h5.5l3 2 3-2" />
      <path d="M6 12h5.5l3 2 3-2" />
      <path d="M6 17h5.5l3 2 3-2" />
    </svg>
  );
}

/* Premature ejaculation — a stopwatch, the one marker on this row that is
   about timing rather than a blood value. */
export function Stopwatch({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <circle cx="12" cy="13.6" r="7.6" />
      <path d="M12 9.8v3.8l2.6 1.6" />
      <path d="M9.6 2.6h4.8" />
      <path d="M18.6 6.4l1.4-1.4" />
    </svg>
  );
}

/* Blood pressure — the dial of a sphygmomanometer. */
export function Gauge({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M3.6 17.5a9 9 0 1 1 16.8 0" />
      <path d="M12 17.5 16.4 10" />
      <circle cx="12" cy="17.5" r="1.5" />
    </svg>
  );
}

/* ── Programme timeline icons (2026-08-11) ────────────────────────────────
   One per component of the 12-week programme, chosen to match what the step
   actually is rather than for decoration. */
export function Leaf({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

export function Heart({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export function Dumbbell({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.4 14.4 9.6 9.6" />
      <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
      <path d="m21.5 21.5-1.4-1.4" />
      <path d="M3.9 3.9 2.5 2.5" />
      <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
    </svg>
  );
}

export function Chat({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function Chart({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <path d="m19 9-5 5-4-4-3 3" />
    </svg>
  );
}

/* Disclosure chevron for the collapsible order summary. Rotated by CSS. */
/* ── Fallback-slot block (book-a-call) ───────────────────────────────────── */

/* WhatsApp. Solid, not stroked: the glyph is only recognisable as WhatsApp at
   filled weight — outlined it just reads as a speech bubble. */
export function WhatsApp({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.23 8.23 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23z" />
      <path d="M16.56 14.22c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.78.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-2-1.23a7.5 7.5 0 0 1-1.38-1.72c-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.6.19 1.14.16 1.56.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.15-1.18-.06-.11-.23-.17-.48-.3z" />
    </svg>
  );
}

export function Mail({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <rect x="2.6" y="5" width="18.8" height="14" rx="2.4" />
      <path d="m3.4 6.6 8.6 6 8.6-6" />
    </svg>
  );
}

/* Hourglass — the "wait for the redirect" mark on checkout. Stroked at the
   family weight so it sits beside Lock and Shield in the same row, rather
   than the emoji the pattern spec suggested. */
export function Hourglass({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M7 3h10M7 21h10" />
      <path d="M8 3v3.2c0 1.5 1.2 2.6 2.4 3.5.9.7.9 1.9 0 2.6C9.2 13.2 8 14.3 8 15.8V21" />
      <path d="M16 3v3.2c0 1.5-1.2 2.6-2.4 3.5-.9.7-.9 1.9 0 2.6 1.2.9 2.4 2 2.4 3.5V21" />
    </svg>
  );
}

export function Alert({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...base} aria-hidden="true">
      <path d="M12 3.6 21.2 19.6H2.8z" />
      <path d="M12 9.6v4.2" />
      <circle cx="12" cy="16.6" r=".9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChevronDown({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/* Hero health-marker chips: keyed from `icon` on each entry in hero.markers. */
export const markerIcons = {
  testosterone: Mars,
  pe: Stopwatch,
  hba1c: Droplet,
  belly: Tape,
  ldl: Artery,
  triglycerides: Triglyceride,
  bp: Gauge,
};

export const pointerIcons = { report: Report, target: Target, route: Route };

/* Programme timeline: keyed from `icon` on each item in `programme.items`. */
export const programmeIcons = {
  report: Report,
  leaf: Leaf,
  heart: Heart,
  dumbbell: Dumbbell,
  chat: Chat,
  chart: Chart,
};

/* Trust-row and CTA chips. A chip with icon:null renders no icon at all. */
export const trustIcons = {
  shield: Shield,
  lock: Lock,
  star: Star,
  check: Check,
  user: User,
  users: Users,
  globe: Globe,
  clock: Clock,
};
