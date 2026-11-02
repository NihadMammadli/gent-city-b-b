import type { Metadata } from 'next';
import { GalleryGrid } from '@/components/GalleryGrid';
import { Hero } from '@/components/Hero';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/Section';
import { getContent, navLabel, photoSource, type PhotoSource } from '@/content';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

const PATH = '/gallery/';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getContent();
  return pageMetadata(site, site.pages.gallery.seo, PATH);
}

export default async function Gallery() {
  const site = await getContent();
  const page = site.pages.gallery;
  const crumbs = [
    { name: site.ui.home, path: '/' },
    { name: navLabel(site, PATH, page.hero.title), path: PATH },
  ];

  const items = site.photos.flatMap((p) => {
    const source: PhotoSource | null = photoSource(p);
    return source ? [{ photo: source, category: p.category }] : [];
  });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Hero site={site} hero={page.hero} breadcrumbs={crumbs} />
      <Section tone="white" width="wide" title={page.intro.title} subtitle={page.intro.subtitle}>
        <GalleryGrid items={items} categories={page.categories} allLabel={page.allLabel} labels={site.ui} layout="mosaic" />
      </Section>
    </>
  );
}
