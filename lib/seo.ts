/**
 * Everything search engines and link previews read, built from content.
 *
 *   pageMetadata()   title, description, canonical, Open Graph and Twitter
 *   *JsonLd()        schema.org structured data
 *
 * Structured data states only what is true and allowed. There is
 * deliberately no aggregateRating: the scores come from Booking.com, and
 * Google's review-snippet rules forbid marking up ratings gathered on
 * another site. The rating is still shown on the page, credited to its source.
 */
import type { Metadata } from 'next';
import { photo, roomBookingUrl, roomPath, type Room, type Site } from '@/content';
import { absoluteUrl } from './paths';
import { plain } from './text';

type SeoData = { title: string; description: string; image: string };

/** A photo as a full URL at its largest cut, for structured data and sitemaps. */
export function photoUrl(site: Site, id: string): string | null {
  const p = photo(site, id);
  if (!p) return null;
  if (p.kind === 'remote') return p.src;
  return absoluteUrl(`/img/${p.id}-${p.widths[p.widths.length - 1]}.webp`);
}

/** The share card for a photo: its 1200 × 630 cut, the remote file, or the home page's card. */
export function shareImage(site: Site, id: string) {
  const fallback = site.pages.home.seo.image || site.pages.home.hero.image;
  for (const candidate of [id, fallback]) {
    const p = candidate ? photo(site, candidate) : null;
    if (!p) continue;
    if (p.kind === 'local' && p.og) {
      return { url: absoluteUrl(`/og/${p.id}.jpg`), width: 1200, height: 630, alt: p.alt, type: 'image/jpeg' };
    }
    if (p.kind === 'remote') return { url: p.src, width: p.width, height: p.height, alt: p.alt };
  }
  return null;
}

/**
 * A page's metadata. Next.js replaces a layout's openGraph with the page's
 * rather than merging them, so each page states its card in full.
 */
export function pageMetadata(site: Site, seo: SeoData, path: string, options: { absoluteTitle?: boolean } = {}): Metadata {
  const url = absoluteUrl(path);
  const image = shareImage(site, seo.image);
  const title = plain(seo.title);
  const fullTitle = options.absoluteTitle ? title : site.meta.titleTemplate.replace('%s', title);

  return {
    title: options.absoluteTitle ? { absolute: title } : title,
    description: seo.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: site.brand.name,
      locale: site.meta.locale,
      title: fullTitle,
      description: seo.description,
      images: image ? [image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: seo.description,
      images: image ? [image.url] : undefined,
    },
  };
}

/* ------------------------------------------------------- structured data */

const lodgingId = () => `${absoluteUrl('/')}#lodging`;

function feature(name: string) {
  return { '@type': 'LocationFeatureSpecification', name, value: true };
}

export function roomJsonLd(site: Site, room: Room) {
  const url = absoluteUrl(roomPath(room));
  return {
    '@type': 'HotelRoom',
    '@id': `${url}#room`,
    name: room.name,
    description: room.summary,
    url,
    image: room.photos.map((id) => photoUrl(site, id)).filter(Boolean),
    bed: room.beds,
    floorSize: { '@type': 'QuantitativeValue', value: room.sizeM2, unitCode: 'MTK' },
    occupancy: { '@type': 'QuantitativeValue', minValue: 1, maxValue: room.maxGuests },
    amenityFeature: room.facilities.flatMap((group) => group.items).map(feature),
    potentialAction: roomBookingUrl(site, room) ? { '@type': 'ReserveAction', target: roomBookingUrl(site, room) } : undefined,
    containedInPlace: { '@id': lodgingId() },
  };
}

export function lodgingJsonLd(site: Site) {
  const { property: p, contact, brand } = site;
  const images = [site.pages.home.hero.image, ...site.rooms.map((r) => r.cover)];

  return {
    '@context': 'https://schema.org',
    '@type': p.schemaType,
    '@id': lodgingId(),
    name: brand.name,
    description: brand.description,
    url: absoluteUrl('/'),
    image: [...new Set(images)].map((id) => photoUrl(site, id)).filter(Boolean),
    logo: absoluteUrl('/icons/icon-512.png'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: p.address.street,
      postalCode: p.address.postalCode,
      addressLocality: p.address.city,
      addressRegion: p.address.region || undefined,
      addressCountry: p.address.countryCode,
    },
    geo: { '@type': 'GeoCoordinates', latitude: p.geo.lat, longitude: p.geo.lng },
    hasMap: contact.mapsUrl || undefined,
    telephone: contact.phone || undefined,
    email: contact.email || undefined,
    checkinTime: p.checkIn.from,
    checkoutTime: p.checkOut.to,
    petsAllowed: p.petsAllowed,
    smokingAllowed: p.smokingAllowed,
    knowsLanguage: p.languages.map((l) => l.code),
    amenityFeature: site.amenities.map((a) => feature(a.title)),
    containsPlace: site.rooms.map((room) => roomJsonLd(site, room)),
    sameAs: [contact.bookingUrl].filter(Boolean),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faq: Site['faq']) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function roomPageJsonLd(site: Site, room: Room) {
  return { '@context': 'https://schema.org', ...roomJsonLd(site, room) };
}
