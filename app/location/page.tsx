import type { Metadata } from 'next';
import { Hero } from '@/components/Hero';
import { ImageText } from '@/components/ImageText';
import { JsonLd } from '@/components/JsonLd';
import { MapCard } from '@/components/MapCard';
import { PlaceList } from '@/components/PlaceList';
import { Section } from '@/components/Section';
import { getContent, navLabel, photo } from '@/content';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import styles from '../pages.module.css';

const PATH = '/location/';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getContent();
  return pageMetadata(site, site.pages.location.seo, PATH);
}

export default async function Location() {
  const site = await getContent();
  const page = site.pages.location;
  const { address, geo } = site.property;
  const crumbs = [
    { name: site.ui.home, path: '/' },
    { name: navLabel(site, PATH, page.hero.title), path: PATH },
  ];

  const groups = page.places.groups
    .map((g) => ({ ...g, places: site.places.filter((p) => p.group === g.id) }))
    .filter((g) => g.places.length > 0);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Hero site={site} hero={page.hero} breadcrumbs={crumbs} />

      <ImageText tone="light" imagePosition="left" image={photo(site, page.intro.image)} title={page.intro.title} body={page.intro.body} />

      {groups.length > 0 && (
        <Section tone="white" title={page.places.title} subtitle={page.places.subtitle}>
          <div className={styles.placeGroups}>
            {groups.map((g) => (
              <div key={g.id} className={styles.placeGroup} data-reveal="up">
                <h3>{g.title}</h3>
                <PlaceList places={g.places} />
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section id="map" tone="cream" title={page.map.title} subtitle={page.map.subtitle}>
        <MapCard
          lat={geo.lat}
          lng={geo.lng}
          title={page.map.title}
          address={[site.brand.name, address.street, `${address.postalCode} ${address.city}, ${address.country}`]}
          mapsUrl={site.contact.mapsUrl}
          labels={{ button: page.map.button, note: page.map.note, open: page.map.open, newTab: site.ui.newTab }}
        />
      </Section>
    </>
  );
}
