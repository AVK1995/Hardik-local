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

export const markerIcons = {
  testosterone: Mars,
  hba1c: Droplet,
  belly: Tape,
  ldl: Artery,
  triglycerides: Triglyceride,
  bp: Gauge,
};

export const pointerIcons = { report: Report, target: Target, route: Route };

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
