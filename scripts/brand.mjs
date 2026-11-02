/**
 * The mark: a Ghent stepped gable — the guild-house outline of the Graslei —
 * in gold leaf, with a door and three windows cut out of it. Paths only, so
 * it renders the same in a browser tab, a home-screen icon and sharp.
 *
 * Shared by scripts/images.mjs (PNG icons) and components/Logo.tsx keeps the
 * same path, so the header and the favicon never drift apart.
 */
export const GABLE =
  'M14 52V30h5v-6h5v-6h4v-6h8v6h4v6h5v6h5v22Z' +
  'M29 52v-9a3 3 0 0 1 6 0v9Z' +
  'M20 34h5v6h-5Z' +
  'M39 34h5v6h-5Z' +
  'M30 19h4v5h-4Z';

export const NAVY = '#0F1729';
export const GOLD = '#D4AF37';

/** The icon on navy. `rounded` false gives a full-bleed square (iOS and maskable icons round it themselves). */
export function iconSvg({ size = 64, rounded = true } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">` +
    `<rect width="64" height="64" rx="${rounded ? 14 : 0}" fill="${NAVY}"/>` +
    `<path fill="${GOLD}" fill-rule="evenodd" d="${GABLE}"/>` +
    `</svg>`;
}
