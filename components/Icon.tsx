import type { ReactNode } from 'react';

/**
 * The icon set: one 24px grid, 1.6 stroke, round caps — the line weight of
 * the damla-group icons. Content refers to icons by name (`"icon": "wifi"`);
 * a name not in this list draws a check mark rather than nothing, so content
 * from an API can never leave a hole in a card.
 */
const PATHS = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  arrowRight: <path d="M4 12h15M13 6l6 6-6 6" />,
  arrowLeft: <path d="M20 12H5M11 6l-6 6 6 6" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />,
  expand: <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />,
  home: <path d="M4 11l8-6.5 8 6.5M6 9.5V20h12V9.5M10 20v-5h4v5" />,
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.8" />
      <path d="M21 16l-5.5-5.5L5 20" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),

  wifi: (
    <>
      <path d="M2.5 9a14 14 0 0119 0M5.5 12.5a9.5 9.5 0 0113 0M8.5 16a5 5 0 017 0" />
      <circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  fireplace: (
    <>
      <path d="M3 5h18M4.5 5v15M19.5 5v15M3 20h18" />
      <path d="M8 20v-6a4 4 0 018 0v6" />
      <path d="M12 19c-1.3 0-2-.9-2-1.9 0-1.3 1.2-1.9 1.5-3.1.9.6 2.5 1.8 2.5 3.1 0 1-.7 1.9-2 1.9z" />
    </>
  ),
  coffee: (
    <>
      <path d="M4 9h12v4.5A5.5 5.5 0 0110.5 19h-1A5.5 5.5 0 014 13.5V9z" />
      <path d="M16 10.5h1.5a2.5 2.5 0 010 5H16M3 21.5h14" />
      <path d="M8 3.5c-.6.8-.6 1.7 0 2.5M12 3.5c-.6.8-.6 1.7 0 2.5" />
    </>
  ),
  bath: (
    <>
      <path d="M3 12h18v2a5 5 0 01-5 5H8a5 5 0 01-5-5v-2z" />
      <path d="M6 12V6a2.5 2.5 0 015 0M7 19l-1 2M17 19l1 2" />
    </>
  ),
  shower: (
    <>
      <path d="M4 21V8a4 4 0 014-4h1a4 4 0 014 4v1M9.5 9h7" />
      <path d="M10.5 13v1M13 13v1M15.5 13v1M11.5 16.5v1M14.5 16.5v1M13 20v1" />
    </>
  ),
  soundproof: <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4zM16 9.5l5 5M21 9.5l-5 5" />,
  sofa: (
    <>
      <path d="M5 11V8a2 2 0 012-2h10a2 2 0 012 2v3" />
      <path d="M3 13a2 2 0 014 0v2h10v-2a2 2 0 014 0v4H3zM5 17v2M19 17v2" />
    </>
  ),
  tv: <path d="M4.5 5h15A1.5 1.5 0 0121 6.5v9a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 15.5v-9A1.5 1.5 0 014.5 5zM9 20h6M12 17v3" />,
  family: (
    <>
      <circle cx="7.5" cy="7" r="2.5" />
      <circle cx="16.5" cy="7" r="2.5" />
      <circle cx="12" cy="13" r="1.8" />
      <path d="M3.5 20v-3.5A3.5 3.5 0 017 13h1M20.5 20v-3.5A3.5 3.5 0 0017 13h-1M9 20v-1.5a3 3 0 016 0V20" />
    </>
  ),
  gift: (
    <>
      <path d="M4 10h16v4H4zM5.5 14v6h13v-6M12 10v10" />
      <path d="M12 10c-1-3-5-4-5-1.5S10 10 12 10zm0 0c1-3 5-4 5-1.5S14 10 12 10z" />
    </>
  ),
  view: <path d="M5 3h14a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1zM12 3v18M4 12h16" />,

  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />,
  starFill: <path fill="currentColor" stroke="none" d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />,
  pin: (
    <>
      <path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0113 0c0 4.8-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z" />,
  heart: <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0112 7.3 4.3 4.3 0 0119.5 10c0 5.4-7.5 10-7.5 10z" />,
  quote: <path d="M10 7H6a2 2 0 00-2 2v3a2 2 0 002 2h2v1a3 3 0 01-3 3M20 7h-4a2 2 0 00-2 2v3a2 2 0 002 2h2v1a3 3 0 01-3 3" />,

  checkin: <path d="M14 4h4a1 1 0 011 1v14a1 1 0 01-1 1h-4M3 12h11M10 8l4 4-4 4" />,
  checkout: <path d="M10 4H6a1 1 0 00-1 1v14a1 1 0 001 1h4M10 12h11M17 8l4 4-4 4" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  child: (
    <>
      <circle cx="12" cy="5.5" r="2.5" />
      <path d="M7.5 11l4.5-1.5 4.5 1.5M12 9.5v5M9.5 20.5l2.5-6 2.5 6" />
    </>
  ),
  bed: (
    <>
      <path d="M3 18.5V6M3 14h18v4.5M21 14v-2a3 3 0 00-3-3h-7v5" />
      <circle cx="7" cy="11" r="1.8" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0114 0" />
    </>
  ),
  guests: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0111 0M15 5.3a3 3 0 010 5.4M17 13.7a5.5 5.5 0 013.5 5.3" />
    </>
  ),
  size: <path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6" />,
  pet: (
    <>
      <circle cx="6.5" cy="10" r="1.6" />
      <circle cx="10" cy="6" r="1.6" />
      <circle cx="14" cy="6" r="1.6" />
      <circle cx="17.5" cy="10" r="1.6" />
      <path d="M12 12c-2.5 0-5 3-5 5.5 0 1.5 1.3 2 2.5 2 1 0 1.6-.6 2.5-.6s1.5.6 2.5.6c1.2 0 2.5-.5 2.5-2C17 15 14.5 12 12 12z" />
    </>
  ),
  nosmoking: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8M7 12.5h7.5v2.5H7z" />
    </>
  ),
  party: (
    <>
      <path d="M9 18V6l11-2v12" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
  stairs: <path d="M3 20h5v-4h4v-4h4V8h5" />,

  castle: <path d="M4 21V9h2.5v2.5h2.25V9h2.5v2.5h1.5V9h2.5v2.5h2.25V9H20v12zM10 21v-4a2 2 0 014 0v4" />,
  walk: (
    <>
      <circle cx="13" cy="4.5" r="2" />
      <path d="M8 12l3-4 3 1 2 3.5M11 8l-1 5.5 3 2.5 1 5M10 13.5L8 21" />
    </>
  ),
  landmark: <path d="M12 2.5v3M9 21V8l3-2.5L15 8v13M6 21h12M11 12h2M11 16h2" />,
  tree: <path d="M12 21v-6M12 3a5 5 0 00-4.6 7A4 4 0 008 18h8a4 4 0 00.6-8A5 5 0 0012 3z" />,
  parking: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M9.5 17V7.5h3.5a2.75 2.75 0 010 5.5H9.5" />
    </>
  ),
  train: (
    <>
      <rect x="5" y="3" width="14" height="13" rx="3" />
      <path d="M5 10h14M9 13h.01M15 13h.01M8 20l2-4M16 20l-2-4" />
    </>
  ),
  plane: <path d="M21 15.5l-8-4.5V5a1.5 1.5 0 00-3 0v6l-8 4.5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-4l8 2.5z" />,

  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" />,
  chat: <path d="M4 20l1.4-4A8 8 0 1112 20a8 8 0 01-3.9-1z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

type Props = {
  name: string;
  size?: number;
  className?: string;
  /** Give the icon a name for screen readers; without one it is decorative. */
  title?: string;
};

export function Icon({ name, size = 24, className, title }: Props) {
  const body = (PATHS as Record<string, ReactNode>)[name] ?? PATHS.check;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      focusable="false"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {body}
    </svg>
  );
}
