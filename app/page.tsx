import type { Metadata } from 'next';
import { FeatureGrid } from '@/components/FeatureGrid';
import { Faq } from '@/components/Faq';
import { GalleryGrid } from '@/components/GalleryGrid';
import { Hero } from '@/components/Hero';
import { Icon } from '@/components/Icon';
import { ImageText } from '@/components/ImageText';
import { JsonLd } from '@/components/JsonLd';
import { PlaceList } from '@/components/PlaceList';
import { Paragraphs } from '@/components/Rich';
import { ReviewCarousel } from '@/components/ReviewCarousel';
import { RoomCard } from '@/components/RoomCard';
import { Section } from '@/components/Section';
import { SmartLink } from '@/components/SmartLink';
import { Stats } from '@/components/Stats';
import { getContent, photo, ratingMetric, resolveLink, type PhotoSource } from '@/content';
import { lodgingJsonLd, pageMetadata } from '@/lib/seo';
import { fill, score } from '@/lib/text';
import styles from './pages.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getContent();
  return pageMetadata(site, site.pages.home.seo, '/', { absoluteTitle: true });
}

export default async function Home() {
  const site = await getContent();
  const { pages, ui, rating, hosts, property } = site;
  const home = pages.home;
  const ratingVars = { label: rating.label, count: rating.count, source: rating.source, score: score(rating.score) };

  const stats = home.rating.stats.flatMap((s) => {
    const m = ratingMetric(site, s.metric);
    return m ? [{ icon: s.icon, label: s.label, ...m }] : [];
  });

  const galleryItems = home.gallery.photos
    .map((id) => photo(site, id))
    .filter((p): p is PhotoSource => p !== null)
    .map((p) => ({ photo: p }));

  const nearby = home.location.places
    .map((name) => site.places.find((p) => p.name === name))
    .filter((p) => p !== undefined);

  const links = {
    welcome: resolveLink(site, home.welcome.cta),
    rooms: resolveLink(site, home.rooms.cta),
    gallery: resolveLink(site, home.gallery.cta),
    location: resolveLink(site, home.location.cta),
    faq: resolveLink(site, home.faq.cta),
  };

  return (
    <>
      <JsonLd data={lodgingJsonLd(site)} />

      <Hero site={site} hero={home.hero} size="full" next="welcome" />

      <ImageText
        id="welcome"
        tone="cream"
        imagePosition="right"
        image={photo(site, home.welcome.image)}
        title={home.welcome.title}
        body={home.welcome.body}
        subtext={home.welcome.signature}
      >
        {links.welcome && (
          <SmartLink href={links.welcome.href} className="btn btn-outline">
            {links.welcome.label}
            <Icon name="arrowRight" />
          </SmartLink>
        )}
      </ImageText>

      <Section tone="white" title={fill(home.rating.title, ratingVars)} subtitle={fill(home.rating.subtitle, ratingVars)}>
        <Stats items={stats} />
        <hr className="divider" />
      </Section>

      <Section id="rooms" tone="light" title={home.rooms.title} subtitle={home.rooms.subtitle}>
        <div className={styles.roomGrid}>
          {site.rooms.map((room, i) => (
            <RoomCard key={room.slug} site={site} room={room} index={i} />
          ))}
        </div>
        {links.rooms && (
          <div className={styles.center} data-reveal="up">
            <SmartLink href={links.rooms.href} className="btn btn-primary">
              {links.rooms.label}
              <Icon name="arrowRight" />
            </SmartLink>
          </div>
        )}
      </Section>

      <Section tone="white" title={home.amenities.title} subtitle={home.amenities.subtitle}>
        <FeatureGrid items={site.amenities} />
      </Section>

      <Section tone="cream" title={home.gallery.title} subtitle={home.gallery.subtitle}>
        <GalleryGrid items={galleryItems} labels={ui} layout="mosaic" />
        {links.gallery && (
          <div className={styles.center} data-reveal="up">
            <SmartLink href={links.gallery.href} className="btn btn-outline">
              {links.gallery.label}
              <Icon name="arrowRight" />
            </SmartLink>
          </div>
        )}
      </Section>

      <ImageText
        tone="light"
        imagePosition="left"
        image={photo(site, home.location.image)}
        icon="pin"
        title={home.location.title}
        body={home.location.body}
      >
        {nearby.length > 0 && <PlaceList places={nearby} compact />}
        {links.location && (
          <SmartLink href={links.location.href} className="btn btn-primary">
            {links.location.label}
            <Icon name="arrowRight" />
          </SmartLink>
        )}
      </ImageText>

      <Section tone="white" width="narrow" title={home.hosts.title} subtitle={home.hosts.subtitle}>
        <div className={styles.hosts} data-reveal="up">
          <Icon name="quote" size={44} className={styles.hostsQuote} />
          <Paragraphs text={hosts.about} className={styles.hostsText} />
          <p className={styles.hostsName}>{hosts.names}</p>
          <div className={styles.chips}>
            {hosts.score !== undefined && (
              <span className={styles.chip}>
                <Icon name="star" size={18} />
                {fill(ui.hostScore, { score: score(hosts.score) })}
              </span>
            )}
            {property.languages.length > 0 && (
              <span className={styles.chip}>
                <Icon name="globe" size={18} />
                {ui.languages}: {property.languages.map((l) => l.name).join(', ')}
              </span>
            )}
          </div>
        </div>
      </Section>

      {site.reviews.length > 0 && (
        <Section tone="light" className={styles.reviews} title={home.reviews.title} subtitle={fill(home.reviews.subtitle, ratingVars)}>
          <svg className={styles.slope} viewBox="0 0 1440 74" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 0H1440V0L0 74Z" fill="#fff" />
          </svg>
          <ReviewCarousel reviews={site.reviews} labels={ui} />
          {rating.sourceUrl && (
            <div className={styles.center}>
              <a className="link-arrow" href={rating.sourceUrl} target="_blank" rel="noopener noreferrer">
                {fill(ui.ratingSummary, ratingVars)}
                <Icon name="external" />
                <span className="visually-hidden"> {ui.newTab}</span>
              </a>
            </div>
          )}
        </Section>
      )}

      {site.faq.length > 0 && (
        <Section tone="white" width="narrow" title={home.faq.title} subtitle={home.faq.subtitle}>
          <Faq items={site.faq.slice(0, home.faq.count)} />
          {links.faq && (
            <div className={styles.center} data-reveal="up">
              <SmartLink href={links.faq.href} className="btn btn-outline">
                {links.faq.label}
                <Icon name="arrowRight" />
              </SmartLink>
            </div>
          )}
        </Section>
      )}
    </>
  );
}
