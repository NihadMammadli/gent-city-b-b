import type { Metadata } from 'next';
import { FeatureGrid } from '@/components/FeatureGrid';
import { Hero } from '@/components/Hero';
import { Icon } from '@/components/Icon';
import { ImageText } from '@/components/ImageText';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/Section';
import { SmartLink } from '@/components/SmartLink';
import { getContent, navLabel, photo, roomBookingUrl, roomPath } from '@/content';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { fill } from '@/lib/text';
import styles from '../pages.module.css';

const PATH = '/rooms/';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getContent();
  return pageMetadata(site, site.pages.rooms.seo, PATH);
}

export default async function Rooms() {
  const site = await getContent();
  const { pages, ui } = site;
  const crumbs = [
    { name: ui.home, path: '/' },
    { name: navLabel(site, PATH, pages.rooms.hero.title), path: PATH },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Hero site={site} hero={pages.rooms.hero} breadcrumbs={crumbs} />

      <Section tone="white" className={styles.flush} title={pages.rooms.intro.title} subtitle={pages.rooms.intro.subtitle} />

      {site.rooms.map((room, i) => {
        const book = roomBookingUrl(site, room);
        return (
          <ImageText
            key={room.slug}
            id={room.slug}
            tone={i % 2 ? 'light' : 'white'}
            imagePosition={i % 2 ? 'right' : 'left'}
            image={photo(site, room.cover)}
            title={room.name}
            body={room.summary}
            subtext={room.tag}
          >
            <ul className={styles.facts}>
              <li className={styles.fact}>
                <Icon name="size" />
                <span>
                  <small>{ui.size}</small>
                  <strong>{fill(ui.sizeValue, { n: room.sizeM2 })}</strong>
                </span>
              </li>
              <li className={styles.fact}>
                <Icon name="guests" />
                <span>
                  <small>{ui.guests}</small>
                  <strong>{fill(ui.guestsValue, { n: room.maxGuests })}</strong>
                </span>
              </li>
              <li className={styles.fact}>
                <Icon name="bed" />
                <span>
                  <small>{ui.beds}</small>
                  <strong>{room.beds}</strong>
                </span>
              </li>
              {room.view && (
                <li className={styles.fact}>
                  <Icon name="view" />
                  <span>
                    <small>{ui.view}</small>
                    <strong>{room.view}</strong>
                  </span>
                </li>
              )}
            </ul>
            <div className="btn-row btn-row--stack">
              <SmartLink href={roomPath(room)} className="btn btn-primary">
                {ui.viewRoom}
                <Icon name="arrowRight" />
              </SmartLink>
              {book && (
                <SmartLink href={book} className="btn btn-outline" newTabLabel={ui.newTab}>
                  {ui.bookShort}
                </SmartLink>
              )}
            </div>
          </ImageText>
        );
      })}

      <Section tone="cream" title={pages.rooms.includes.title} subtitle={pages.rooms.includes.subtitle}>
        <FeatureGrid items={site.amenities} />
      </Section>
    </>
  );
}
