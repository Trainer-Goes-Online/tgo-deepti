/**
 * Line glyphs for the page chrome.
 *
 * The copy source prints the risk badges and the trust row with emoji
 * (⭐ 🔥 💯 🛡️ ⬇️). Emoji render as a different typeface at a different
 * weight on every OS, which is exactly the thing that makes a premium
 * page look assembled. So the LABELS stay verbatim and only the emoji
 * are replaced by these one-colour glyphs, matched to what each emoji
 * meant. Same call Kunal shipped on this skin.
 */

type IconProps = { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  'aria-hidden': true as const,
});

/** ⭐ — the results guarantee badge */
export function StarIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} fill="currentColor">
      <path d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z" />
    </svg>
  );
}

/** 🔥 — the success-stories badge */
export function FlameIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5s5 4.2 5 8.7a5 5 0 0 1-10 0c0-1.6.6-2.9 1.4-4 .3 1 .9 1.8 1.8 2.2.5-3 1.8-5.4 1.8-6.9z" />
      <path d="M12 21.5a3 3 0 0 0 3-3c0-1.9-3-4.2-3-4.2s-3 2.3-3 4.2a3 3 0 0 0 3 3z" />
    </svg>
  );
}

/** 💯 — the "100% personalised" badge */
export function PercentBadgeIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.2" />
      <path d="M15.5 8.5l-7 7" />
      <circle cx="9.4" cy="9.4" r="1.5" />
      <circle cx="14.6" cy="14.6" r="1.5" />
    </svg>
  );
}

/** 🛡️ — the trust-row guarantee */
export function ShieldCheckIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5l8 3v6.7c0 4.9-3.4 9.2-8 10-4.6-.8-8-5.1-8-10V5.5l8-3z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

/** ☑️ — the self-recognition rows */
export function CheckIcon({ size = 13 }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** The CTA's circular chip. */
export function ArrowRightIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

/** ⬇️ — the watch-the-video cue */
export function ArrowDownIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4v14M6 13l6 6 6-6" />
    </svg>
  );
}

export function PlayIcon({ size = 26 }: IconProps) {
  return (
    <svg {...base(size)} fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/** Placeholder marks — what kind of asset is missing. */
export function ImageGlyph({ size = 30 }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="M4 17l4.8-4.6a2 2 0 0 1 2.7-.1L20 19" />
    </svg>
  );
}

export function FilmGlyph({ size = 30 }: IconProps) {
  return (
    <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 9h19M2.5 15h19M7.5 5v14M16.5 5v14" />
    </svg>
  );
}
