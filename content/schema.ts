/**
 * The content contract.
 *
 * Every word, number, link and photo the site shows is described here, once.
 * Whatever supplies the content — content/site.json today, a CMS or the
 * Damla Group API tomorrow — must return a document of this shape, and it is
 * validated against this schema before a single page is built. The types the
 * components use are inferred from it, so a field cannot be read that the
 * contract does not promise.
 *
 * Conventions every source follows:
 *   - An empty string means "leave this part out". Components hide it rather
 *     than rendering a gap, so clearing a field is always safe.
 *   - `*stars*` inside a heading mark the words set in the bronze accent.
 *   - A blank line inside long text starts a new paragraph.
 *   - `{name}` placeholders in `ui` labels are filled in by the page.
 *   - A link's href is a site path ('/rooms/'), an anchor ('#rooms'), a full
 *     URL, or '@booking' — the booking link from `contact.bookingUrl`.
 *   - A photo is referred to everywhere by its id in `photos`.
 */
import { z } from 'zod';

/** Shown when filled in, left out when empty. */
const Text = z.string().default('');
/** The page cannot do without it. */
const Required = z.string().trim().min(1);
/** A photo id; checked against `photos` below. */
const PhotoRef = Required;
/** An icon name from components/Icon.tsx. Unknown names fall back to a check mark. */
const IconName = z.string().default('check');

const Link = z.object({ label: Required, href: Required });

const Seo = z.object({
  title: Required,
  description: Required,
  /** The photo used for the share card; falls back to the site's default. */
  image: Text,
});

const Hero = z.object({
  eyebrow: Text,
  title: Required,
  subtitle: Text,
  image: PhotoRef,
  primary: Link.optional(),
  secondary: Link.optional(),
});

const Heading = z.object({ title: Required, subtitle: Text });

/* ------------------------------------------------------------------ lists */

export const PhotoSchema = z.object({
  id: Required,
  alt: Required,
  /** One of `gallery.categories`; drives the gallery filter. */
  category: Required,
  /**
   * A remote image (e.g. from an API's media library). Used when there is no
   * local cut of this id in content/images.json; width and height keep the
   * layout from jumping while it loads.
   */
  src: Text,
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

const Feature = z.object({ icon: IconName, title: Required, text: Text });

const FacilityGroup = z.object({ title: Required, items: z.array(Required).min(1) });

export const RoomSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase words joined by hyphens'),
  name: Required,
  /** A small label above the name, e.g. "For two". */
  tag: Text,
  summary: Required,
  description: Required,
  sizeM2: z.number().positive(),
  maxGuests: z.number().int().positive(),
  beds: Required,
  view: Text,
  highlights: z.array(z.object({ icon: IconName, label: Required })).default([]),
  facilities: z.array(FacilityGroup).default([]),
  cover: PhotoRef,
  photos: z.array(PhotoRef).min(1),
  /** Where this room is booked; empty uses `contact.bookingUrl`. */
  bookingUrl: Text,
  seo: Seo,
});

const Review = z.object({
  name: Required,
  country: Text,
  score: z.number().min(0).max(10),
  title: Text,
  text: Required,
  travellerType: Text,
});

const Place = z.object({
  name: Required,
  distance: Required,
  note: Text,
  /** One of `pages.location.places.groups`. */
  group: Required,
  icon: IconName,
});

const Rule = z.object({ icon: IconName, title: Required, text: Required });

const Faq = z.object({ question: Required, answer: Required });

/* ------------------------------------------------------------------ pages */

const HomePage = z.object({
  seo: Seo,
  hero: Hero,
  welcome: z.object({ title: Required, body: Required, signature: Text, image: PhotoRef, cta: Link.optional() }),
  rating: Heading.extend({
    stats: z.array(z.object({
      /** 'score', 'count', or a key from `rating.categories`. */
      metric: Required,
      label: Required,
      icon: IconName,
    })),
  }),
  rooms: Heading.extend({ cta: Link.optional() }),
  amenities: Heading,
  gallery: Heading.extend({ photos: z.array(PhotoRef), cta: Link.optional() }),
  location: z.object({
    title: Required,
    body: Required,
    image: PhotoRef,
    /** Names from `places`, shown as a short list. */
    places: z.array(Required).default([]),
    cta: Link.optional(),
  }),
  hosts: Heading,
  reviews: Heading,
  faq: Heading.extend({ count: z.number().int().positive().default(4), cta: Link.optional() }),
});

const RoomsPage = z.object({
  seo: Seo,
  hero: Hero,
  intro: Heading,
  includes: Heading,
});

const GalleryPage = z.object({
  seo: Seo,
  hero: Hero,
  intro: Heading,
  allLabel: Required,
  categories: z.array(z.object({ id: Required, label: Required })).min(1),
});

const LocationPage = z.object({
  seo: Seo,
  hero: Hero,
  intro: z.object({ title: Required, body: Required, image: PhotoRef }),
  places: Heading.extend({ groups: z.array(z.object({ id: Required, title: Required })).min(1) }),
  map: Heading.extend({ button: Required, note: Text, open: Required }),
});

const InfoPage = z.object({
  seo: Seo,
  hero: Hero,
  rules: Heading,
  faq: Heading,
  languages: Heading,
});

const NotFoundPage = z.object({ seo: Seo, title: Required, text: Required, cta: Link });

/* ------------------------------------------------------------ the site */

export const SiteSchema = z
  .object({
    meta: z.object({
      /** BCP 47 language of the page, e.g. "en". */
      language: Required,
      /** Open Graph locale, e.g. "en_GB". */
      locale: Required,
      /** Every page title but the home page's; "%s" is the page's own title. */
      titleTemplate: Required,
      themeColor: Required,
      keywords: z.array(Required).default([]),
    }),

    brand: z.object({
      name: Required,
      shortName: Required,
      tagline: Text,
      description: Required,
    }),

    property: z.object({
      /** The schema.org type for search engines, e.g. "BedAndBreakfast". */
      schemaType: Required,
      address: z.object({
        street: Required,
        district: Text,
        postalCode: Required,
        city: Required,
        region: Text,
        country: Required,
        countryCode: z.string().length(2),
      }),
      geo: z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }),
      checkIn: z.object({ from: Required, to: Required }),
      checkOut: z.object({ from: Required, to: Required }),
      languages: z.array(z.object({ code: Required, name: Required })).default([]),
      petsAllowed: z.boolean(),
      smokingAllowed: z.boolean(),
    }),

    contact: z.object({
      phone: Text,
      email: Text,
      whatsapp: Text,
      bookingUrl: Text,
      mapsUrl: Text,
    }),

    hosts: z.object({
      names: Required,
      /** The hosts' own review score on the booking platform. */
      score: z.number().min(0).max(10).optional(),
      about: Required,
    }),

    rating: z.object({
      score: z.number().min(0),
      outOf: z.number().positive(),
      label: Required,
      count: z.number().int().nonnegative(),
      source: Required,
      sourceUrl: Text,
      categories: z.array(z.object({ key: Required, label: Required, score: z.number() })).default([]),
    }),

    manager: z.object({ label: Text, name: Text, url: Text }),

    /** The menu bar. The icon is drawn beside each link in the phone menu. */
    nav: z.array(Link.extend({ icon: IconName })).min(1),

    footer: z.object({
      ctaTitle: Required,
      ctaText: Text,
      exploreTitle: Required,
      stayTitle: Required,
      contactTitle: Required,
      /** "{year}" becomes the year of the build. */
      copyright: Required,
    }),

    /** Every label that is not a heading: buttons, units, screen-reader text. */
    ui: z.object({
      book: Required,
      bookShort: Required,
      bookOn: Required,
      viewRoom: Required,
      size: Required,
      sizeValue: Required,
      guests: Required,
      guestsValue: Required,
      beds: Required,
      view: Required,
      roomPhotos: Required,
      roomFacilities: Required,
      roomBookTitle: Required,
      roomBookText: Text,
      otherRooms: Required,
      reviewScore: Required,
      ratingSummary: Required,
      hostScore: Required,
      checkIn: Required,
      checkOut: Required,
      checkInValue: Required,
      address: Required,
      phone: Required,
      email: Required,
      whatsapp: Required,
      languages: Required,
      previous: Required,
      next: Required,
      close: Required,
      openPhoto: Required,
      photoCount: Required,
      galleryFilter: Required,
      skip: Required,
      navLabel: Required,
      menuOpen: Required,
      menuClose: Required,
      home: Required,
      breadcrumb: Required,
      scrollDown: Required,
      reviewsLabel: Required,
      reviewPage: Required,
      newTab: Required,
    }),

    amenities: z.array(Feature).default([]),
    photos: z.array(PhotoSchema).min(1),
    rooms: z.array(RoomSchema).min(1),
    reviews: z.array(Review).default([]),
    places: z.array(Place).default([]),
    rules: z.array(Rule).default([]),
    faq: z.array(Faq).default([]),

    pages: z.object({
      home: HomePage,
      rooms: RoomsPage,
      gallery: GalleryPage,
      location: LocationPage,
      info: InfoPage,
      notFound: NotFoundPage,
    }),
  })
  .superRefine((site, ctx) => {
    /* references between parts of the document, which the shape alone cannot check */
    const photoIds = new Set(site.photos.map((p) => p.id));
    const ref = (id: string, path: (string | number)[]) => {
      if (id && !photoIds.has(id)) ctx.addIssue({ code: 'custom', path, message: `no photo with the id "${id}"` });
    };
    const unique = (values: string[], path: (string | number)[], what: string) => {
      const seen = new Set<string>();
      values.forEach((v, i) => {
        if (seen.has(v)) ctx.addIssue({ code: 'custom', path: [...path, i], message: `${what} "${v}" appears twice` });
        seen.add(v);
      });
    };

    unique(site.photos.map((p) => p.id), ['photos'], 'photo id');
    unique(site.rooms.map((r) => r.slug), ['rooms'], 'room slug');

    const { pages } = site;
    const heroes = { home: pages.home.hero, rooms: pages.rooms.hero, gallery: pages.gallery.hero, location: pages.location.hero, info: pages.info.hero };
    for (const [page, hero] of Object.entries(heroes)) ref(hero.image, ['pages', page, 'hero', 'image']);
    for (const [page, p] of Object.entries(pages)) ref(p.seo.image, ['pages', page, 'seo', 'image']);
    ref(pages.home.welcome.image, ['pages', 'home', 'welcome', 'image']);
    ref(pages.home.location.image, ['pages', 'home', 'location', 'image']);
    ref(pages.location.intro.image, ['pages', 'location', 'intro', 'image']);
    pages.home.gallery.photos.forEach((id, i) => ref(id, ['pages', 'home', 'gallery', 'photos', i]));

    site.rooms.forEach((room, r) => {
      ref(room.cover, ['rooms', r, 'cover']);
      ref(room.seo.image, ['rooms', r, 'seo', 'image']);
      room.photos.forEach((id, i) => ref(id, ['rooms', r, 'photos', i]));
    });

    const categories = new Set(pages.gallery.categories.map((c) => c.id));
    site.photos.forEach((p, i) => {
      if (!categories.has(p.category)) {
        ctx.addIssue({ code: 'custom', path: ['photos', i, 'category'], message: `"${p.category}" is not one of the gallery categories: ${[...categories].join(', ')}` });
      }
    });

    const groups = new Set(pages.location.places.groups.map((g) => g.id));
    site.places.forEach((p, i) => {
      if (!groups.has(p.group)) ctx.addIssue({ code: 'custom', path: ['places', i, 'group'], message: `"${p.group}" is not one of the place groups` });
    });
    const placeNames = new Set(site.places.map((p) => p.name));
    pages.home.location.places.forEach((name, i) => {
      if (!placeNames.has(name)) ctx.addIssue({ code: 'custom', path: ['pages', 'home', 'location', 'places', i], message: `no place named "${name}"` });
    });

    const metrics = new Set(['score', 'count', ...site.rating.categories.map((c) => c.key)]);
    pages.home.rating.stats.forEach((s, i) => {
      if (!metrics.has(s.metric)) ctx.addIssue({ code: 'custom', path: ['pages', 'home', 'rating', 'stats', i, 'metric'], message: `"${s.metric}" is not a rating metric` });
    });
  });

export type Site = z.infer<typeof SiteSchema>;
export type Photo = z.infer<typeof PhotoSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type Review = Site['reviews'][number];
export type Place = Site['places'][number];
export type LinkData = z.infer<typeof Link>;
export type HeroData = z.infer<typeof Hero>;
export type Ui = Site['ui'];
