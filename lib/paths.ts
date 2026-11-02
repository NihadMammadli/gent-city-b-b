/**
 * Where the site lives. Both values come from the build environment, never
 * from content: the same content can be published to GitHub Pages under
 * /gent-city-b-b or to its own domain at the root.
 *
 * `next/link` and the metadata files get the base path from next.config.mjs
 * automatically; a raw `<img src>` or an absolute URL in metadata does not,
 * so those go through `asset()` and `absoluteUrl()`.
 */
const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** '' at a domain root, '/gent-city-b-b' on GitHub Pages. Never a trailing slash. */
export const BASE_PATH = raw === '/' ? '' : raw.replace(/\/+$/, '');

/** The origin only, no path. */
export const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nihadmammadli.github.io').replace(/\/+$/, '');

/** Prefix a public/ path: `asset('/img/a.webp')` → '/gent-city-b-b/img/a.webp'. */
export function asset(path: string): string {
  return `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;
}

/** A page or file as a full URL, for canonicals, share cards and structured data. */
export function absoluteUrl(path = '/'): string {
  return `${SITE_ORIGIN}${asset(path)}`;
}
