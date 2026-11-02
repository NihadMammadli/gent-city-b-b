/**
 * The one door every page goes through for content.
 *
 *   const site = await getContent();
 *
 * Pages read the content and pass the parts each component needs as props;
 * components never import content themselves. Swapping content/site.json for
 * an API is therefore a change to content/load.ts and nothing else.
 *
 * No user-visible string belongs in app/ or components/. If you are about to
 * type one, add a field to content/schema.ts and the site.json instead.
 */
import manifest from './images.json';
import { loadContent } from './load';
import type { LinkData, Photo, Room, Site } from './schema';

export type { HeroData, LinkData, Photo, Place, Review, Room, Site, Ui } from './schema';

let pending: Promise<Site> | null = null;

/** The whole site's content, loaded and validated once per build. */
export function getContent(): Promise<Site> {
  pending ??= loadContent().catch((error) => {
    pending = null;
    throw error;
  });
  return pending;
}

/* ----------------------------------------------------------------- photos */

type Cut = { widths: number[]; width: number; height: number; focus: number[]; blur: string; og?: boolean };
const cuts = manifest as Record<string, Cut>;

/** How a photo can be drawn: our own responsive cuts, or a remote file as is. */
export type PhotoSource =
  | { kind: 'local'; id: string; alt: string; widths: number[]; width: number; height: number; position: string; blur: string; og: boolean }
  | { kind: 'remote'; id: string; alt: string; src: string; width?: number; height?: number; position: string };

export function photoSource(photo: Photo): PhotoSource | null {
  const cut = cuts[photo.id];
  if (cut) {
    const [x = 0.5, y = 0.5] = cut.focus;
    return {
      kind: 'local',
      id: photo.id,
      alt: photo.alt,
      widths: cut.widths,
      width: cut.width,
      height: cut.height,
      position: `${Math.round(x * 100)}% ${Math.round(y * 100)}%`,
      blur: cut.blur,
      og: Boolean(cut.og),
    };
  }
  if (photo.src) {
    return { kind: 'remote', id: photo.id, alt: photo.alt, src: photo.src, width: photo.width, height: photo.height, position: '50% 50%' };
  }
  return null;
}

/** A photo by id, ready to draw, or null when it is missing or has no file. */
export function photo(site: Site, id: string): PhotoSource | null {
  const p = site.photos.find((x) => x.id === id);
  return p ? photoSource(p) : null;
}

/** Whether a local cut exists — used by the content check. */
export function hasCut(id: string): boolean {
  return id in cuts;
}

/* ------------------------------------------------------------------ rooms */

export function roomBySlug(site: Site, slug: string): Room | undefined {
  return site.rooms.find((r) => r.slug === slug);
}

export function roomPath(room: Pick<Room, 'slug'>): string {
  return `/rooms/${room.slug}/`;
}

export function roomBookingUrl(site: Site, room: Room): string {
  return room.bookingUrl || site.contact.bookingUrl;
}

/* ------------------------------------------------------------------ links */

/** Resolves '@booking' to the booking page; null when there is none to go to. */
export function resolveHref(site: Site, href: string): string | null {
  if (href === '@booking') return site.contact.bookingUrl || null;
  return href || null;
}

/** A link with its href resolved, or null when it leads nowhere. */
export function resolveLink(site: Site, link: LinkData | undefined): LinkData | null {
  if (!link) return null;
  const href = resolveHref(site, link.href);
  return href ? { label: link.label, href } : null;
}

/** The menu's label for a path — what breadcrumbs call the page. */
export function navLabel(site: Site, href: string, fallback: string): string {
  return site.nav.find((n) => n.href === href)?.label ?? fallback;
}

/* ----------------------------------------------------------------- rating */

/** A value for a rating metric: 'score', 'count' or a category key. */
export function ratingMetric(site: Site, metric: string): { value: number; decimals: number; suffix: string } | null {
  const { rating } = site;
  if (metric === 'count') return { value: rating.count, decimals: 0, suffix: '' };
  const score = metric === 'score' ? rating.score : rating.categories.find((c) => c.key === metric)?.score;
  if (score === undefined) return null;
  return { value: score, decimals: 1, suffix: `/${rating.outOf}` };
}
