import type { MetadataRoute } from 'next';
import { getContent } from '@/content';
import { asset } from '@/lib/paths';

export const dynamic = 'force-static';

/** Lets the site be added to a phone's home screen, under the B&B's own name and mark. */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getContent();
  return {
    name: site.brand.name,
    short_name: site.brand.shortName,
    description: site.brand.description,
    lang: site.meta.language,
    start_url: asset('/'),
    scope: asset('/'),
    display: 'standalone',
    background_color: '#F5F3F0',
    theme_color: site.meta.themeColor,
    icons: [
      { src: asset('/icons/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: asset('/icons/icon-512.png'), sizes: '512x512', type: 'image/png' },
      { src: asset('/icons/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
