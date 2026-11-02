import Link from 'next/link';
import { resolveHref, roomPath, type Site } from '@/content';
import { cx } from '@/lib/cx';
import { fill, score } from '@/lib/text';
import { Icon } from './Icon';
import { Logo } from './Logo';
import { Em } from './Rich';
import styles from './Footer.module.css';

/**
 * The damla-group footer: a navy call to action, then four columns — the
 * brand and its rating, the pages, the stay, and how to find and reach the
 * B&B. A contact line the content leaves empty is simply not drawn.
 */
export function Footer({ site }: { site: Site }) {
  const { footer, ui, contact, property, rating, brand, manager } = site;
  const book = resolveHref(site, '@booking');
  const year = new Date().getFullYear();
  const { address } = property;

  const reach = [
    contact.phone && { icon: 'phone', label: ui.phone, value: contact.phone, href: `tel:${contact.phone.replace(/[^\d+]/g, '')}` },
    contact.whatsapp && { icon: 'chat', label: ui.whatsapp, value: contact.whatsapp, href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}` },
    contact.email && { icon: 'mail', label: ui.email, value: contact.email, href: `mailto:${contact.email}` },
  ].filter(Boolean) as { icon: string; label: string; value: string; href: string }[];

  return (
    <footer className={styles.footer}>
      <div className={styles.cta} data-reveal="up">
        <h2 className={styles.ctaTitle}>
          <Em text={footer.ctaTitle} />
        </h2>
        {footer.ctaText && <p className={styles.ctaText}>{footer.ctaText}</p>}
        {book && (
          <a className="btn btn-primary" href={book} target="_blank" rel="noopener noreferrer">
            {ui.book}
            <Icon name="arrowRight" />
            <span className="visually-hidden"> {ui.newTab}</span>
          </a>
        )}
      </div>

      <div className={styles.bottom}>
        <div className={styles.columns}>
          <div className={cx(styles.column, styles.brand)}>
            <Logo name={brand.name} />
            {brand.tagline && <p className={styles.muted}>{brand.tagline}</p>}
            <a className={styles.rating} href={rating.sourceUrl || book || '#'} target="_blank" rel="noopener noreferrer">
              <span className={styles.score}>{score(rating.score)}</span>
              <span>
                <strong>{rating.label}</strong>
                <br />
                {fill(ui.ratingSummary, { label: rating.source, score: score(rating.score), count: rating.count })}
              </span>
              <span className="visually-hidden"> {ui.newTab}</span>
            </a>
          </div>

          <nav className={styles.column} aria-label={footer.exploreTitle}>
            <p className={styles.title}>{footer.exploreTitle}</p>
            {site.nav.map((item) => (
              <Link key={item.href} href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.column}>
            <p className={styles.title}>{footer.stayTitle}</p>
            <p className={styles.fact}>
              <span>{ui.checkIn}</span>
              {fill(ui.checkInValue, property.checkIn)}
            </p>
            <p className={styles.fact}>
              <span>{ui.checkOut}</span>
              {fill(ui.checkInValue, property.checkOut)}
            </p>
            {site.rooms.map((room) => (
              <Link key={room.slug} href={roomPath(room)} className={styles.link}>
                {room.name}
              </Link>
            ))}
          </div>

          <div className={styles.column}>
            <p className={styles.title}>{footer.contactTitle}</p>
            <address className={styles.address}>
              <Icon name="pin" size={20} className={styles.icon} />
              <a href={contact.mapsUrl || undefined} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {address.street}
                <br />
                {address.postalCode} {address.city}, {address.country}
                <span className="visually-hidden"> {ui.newTab}</span>
              </a>
            </address>
            {reach.map((r) => (
              <p key={r.icon} className={styles.address}>
                <Icon name={r.icon} size={20} className={styles.icon} />
                <a href={r.href} className={styles.link} aria-label={`${r.label}: ${r.value}`}>
                  {r.value}
                </a>
              </p>
            ))}
            {book && (
              <p className={styles.address}>
                <Icon name="calendar" size={20} className={styles.icon} />
                <a href={book} className={styles.link} target="_blank" rel="noopener noreferrer">
                  {ui.bookOn}
                  <span className="visually-hidden"> {ui.newTab}</span>
                </a>
              </p>
            )}
          </div>
        </div>

        <div className={styles.legal}>
          <p>{fill(footer.copyright, { year })}</p>
          {manager.name && (
            <p>
              {manager.label}{' '}
              {manager.url ? (
                <a href={manager.url} target="_blank" rel="noopener noreferrer" className={styles.manager}>
                  {manager.name}
                  <span className="visually-hidden"> {ui.newTab}</span>
                </a>
              ) : (
                manager.name
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
