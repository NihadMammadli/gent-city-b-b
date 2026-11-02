'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cx } from '@/lib/cx';
import { Icon } from './Icon';
import { Logo } from './Logo';
import styles from './Header.module.css';

type NavItem = { label: string; href: string; icon: string };

type Props = {
  name: string;
  tagline: string;
  nav: NavItem[];
  book: { label: string; href: string } | null;
  labels: { navLabel: string; menuOpen: string; menuClose: string; home: string; newTab: string };
};

const isCurrent = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href);

/**
 * The damla-group header: a fixed slate bar, the links with a bronze rule
 * that grows in on hover, and the bronze action on the right. Below 900px
 * the links move into a drawer that slides in from the right.
 */
export function Header({ name, tagline, nav, book, labels }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /* a new page closes the drawer */
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const bookLink = book && (
    <a className={cx('btn btn-primary', styles.book)} href={book.href} target="_blank" rel="noopener noreferrer">
      {book.label}
      <span className="visually-hidden"> {labels.newTab}</span>
    </a>
  );

  return (
    <>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link href="/" className={styles.home} aria-label={`${name} — ${labels.home}`}>
            <Logo name={name} />
          </Link>

          <nav className={styles.nav} aria-label={labels.navLabel}>
            <ul className={styles.links}>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.link}
                    aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {bookLink}
          </nav>

          <button
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-controls="site-drawer"
            aria-label={open ? labels.menuClose : labels.menuOpen}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name="menu" size={32} />
          </button>
        </div>
      </header>

      <div className={styles.scrim} data-open={open} onClick={() => setOpen(false)} aria-hidden="true" />
      <div id="site-drawer" className={styles.drawer} data-open={open} inert={!open}>
        <div className={styles.drawerHead}>
          <Logo name={name} />
          <button type="button" className={styles.close} aria-label={labels.menuClose} onClick={() => setOpen(false)}>
            <Icon name="close" size={28} />
          </button>
        </div>
        <nav className={styles.drawerNav} aria-label={labels.navLabel}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.drawerLink}
              aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.drawerFoot}>
          {bookLink}
          <p className={styles.drawerBrand}>{name}</p>
          {tagline && <p className={styles.drawerTagline}>{tagline}</p>}
        </div>
      </div>
    </>
  );
}
