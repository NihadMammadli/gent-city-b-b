import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GalleryGrid } from '@/components/GalleryGrid';
import { Hero } from '@/components/Hero';
import { Icon } from '@/components/Icon';
import { JsonLd } from '@/components/JsonLd';
import { Paragraphs } from '@/components/Rich';
import { RoomCard } from '@/components/RoomCard';
import { Section } from '@/components/Section';
import { SmartLink } from '@/components/SmartLink';
import { getContent, navLabel, photo, roomBookingUrl, roomBySlug, roomPath, type PhotoSource } from '@/content';
import { breadcrumbJsonLd, pageMetadata, roomPageJsonLd } from '@/lib/seo';
import { fill, score } from '@/lib/text';
import styles from '../../pages.module.css';

type Params = { params: Promise<{ slug: string }> };

/* one page per room in the content; a slug that is not there is a 404 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const site = await getContent();
  return site.rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const site = await getContent();
  const room = roomBySlug(site, (await params).slug);
  return room ? pageMetadata(site, room.seo, roomPath(room)) : {};
}

export default async function RoomPage({ params }: Params) {
  const site = await getContent();
  const room = roomBySlug(site, (await params).slug);
  if (!room) notFound();

  const { ui, rating } = site;
  const book = roomBookingUrl(site, room);
  const crumbs = [
    { name: ui.home, path: '/' },
    { name: navLabel(site, '/rooms/', site.pages.rooms.hero.title), path: '/rooms/' },
    { name: room.name, path: roomPath(room) },
  ];

  const photos = room.photos
    .map((id) => photo(site, id))
    .filter((p): p is PhotoSource => p !== null)
    .map((p) => ({ photo: p }));

  const facts = [
    { icon: 'size', label: ui.size, value: fill(ui.sizeValue, { n: room.sizeM2 }) },
    { icon: 'guests', label: ui.guests, value: fill(ui.guestsValue, { n: room.maxGuests }) },
    { icon: 'bed', label: ui.beds, value: room.beds },
    room.view && { icon: 'view', label: ui.view, value: room.view },
  ].filter(Boolean) as { icon: string; label: string; value: string }[];

  const others = site.rooms.filter((r) => r.slug !== room.slug);

  return (
    <>
      <JsonLd data={[roomPageJsonLd(site, room), breadcrumbJsonLd(crumbs)]} />
      <Hero
        site={site}
        breadcrumbs={crumbs}
        hero={{
          eyebrow: room.tag,
          title: room.name,
          subtitle: room.summary,
          image: room.cover,
          primary: book ? { label: ui.book, href: book } : undefined,
        }}
      />

      <Section tone="white">
        <div className={styles.roomLayout}>
          <div className={styles.roomMain} data-reveal="up">
            <Paragraphs text={room.description} className="body" />

            {room.highlights.length > 0 && (
              <ul className={styles.highlights}>
                {room.highlights.map((h) => (
                  <li key={h.label} className={styles.chip}>
                    <Icon name={h.icon} size={18} />
                    {h.label}
                  </li>
                ))}
              </ul>
            )}

            {room.facilities.length > 0 && (
              <div>
                <h2 className={`title-m ${styles.subhead}`}>{ui.roomFacilities}</h2>
                <div className={styles.facilities}>
                  {room.facilities.map((group) => (
                    <div key={group.title} className={styles.facilityGroup}>
                      <h3>{group.title}</h3>
                      <ul>
                        {group.items.map((item) => (
                          <li key={item}>
                            <Icon name="check" size={18} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className={styles.panel} data-reveal="up">
            <h2 className={styles.panelTitle}>{fill(ui.roomBookTitle, { room: room.name })}</h2>
            <ul className={styles.facts}>
              {facts.map((f) => (
                <li key={f.label} className={styles.fact}>
                  <Icon name={f.icon} />
                  <span>
                    <small>{f.label}</small>
                    <strong>{f.value}</strong>
                  </span>
                </li>
              ))}
            </ul>
            {ui.roomBookText && <p className={styles.panelText}>{ui.roomBookText}</p>}
            {book && (
              <SmartLink href={book} className="btn btn-primary" newTabLabel={ui.newTab}>
                {ui.bookOn}
                <Icon name="arrowRight" />
              </SmartLink>
            )}
            <div className={styles.badge}>
              <span className={styles.badgeScore}>{score(rating.score)}</span>
              <p>
                <strong>{rating.label}</strong>
                {fill(ui.ratingSummary, { label: rating.source, score: score(rating.score), count: rating.count })}
              </p>
            </div>
          </aside>
        </div>
      </Section>

      {photos.length > 0 && (
        <Section tone="light" title={fill(ui.roomPhotos, { room: room.name })}>
          <GalleryGrid items={photos} labels={ui} layout="grid" />
        </Section>
      )}

      {others.length > 0 && (
        <Section tone="white" title={ui.otherRooms}>
          <div className={styles.roomGrid}>
            {others.map((r, i) => (
              <RoomCard key={r.slug} site={site} room={r} index={i} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
