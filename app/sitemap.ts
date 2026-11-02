import type { MetadataRoute } from 'next';
import { getContent, roomPath } from '@/content';
import { absoluteUrl } from '@/lib/paths';
import { photoUrl } from '@/lib/seo';

export const dynamic = 'force-static';

/** Every page, with the photos it shows, so they can surface in image search. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getContent();
  const { pages } = site;
  const lastModified = new Date();
  const images = (ids: string[]) => [...new Set(ids)].map((id) => photoUrl(site, id)).filter((u): u is string => Boolean(u));

  const entry = (path: string, priority: number, ids: string[]): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: 'monthly',
    priority,
    images: images(ids),
  });

  return [
    entry('/', 1, [pages.home.hero.image, pages.home.welcome.image, ...pages.home.gallery.photos]),
    entry('/rooms/', 0.9, [pages.rooms.hero.image, ...site.rooms.map((r) => r.cover)]),
    ...site.rooms.map((room) => entry(roomPath(room), 0.9, room.photos)),
    entry('/gallery/', 0.7, site.photos.map((p) => p.id)),
    entry('/location/', 0.7, [pages.location.hero.image, pages.location.intro.image]),
    entry('/good-to-know/', 0.6, [pages.info.hero.image]),
  ];
}
