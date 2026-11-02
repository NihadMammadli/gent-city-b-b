'use client';

import { useEffect, useRef, useState } from 'react';
import type { PhotoSource } from '@/content';
import { cx } from '@/lib/cx';
import { fill } from '@/lib/text';
import { Icon } from './Icon';
import { Picture } from './Picture';
import styles from './GalleryGrid.module.css';

export type GalleryItem = { photo: PhotoSource; category?: string };

type Props = {
  items: GalleryItem[];
  /** With categories, a row of filters sits above the grid. */
  categories?: { id: string; label: string }[];
  allLabel?: string;
  labels: { previous: string; next: string; close: string; openPhoto: string; photoCount: string; galleryFilter: string };
  layout?: 'mosaic' | 'grid';
};

/**
 * Photos as a mosaic; select one and it opens full screen. The viewer is a
 * native <dialog>, so focus stays inside it and Escape closes it; the arrow
 * keys and a swipe move between photos.
 */
export function GalleryGrid({ items, categories, allLabel, labels, layout = 'mosaic' }: Props) {
  const [filter, setFilter] = useState('all');
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);

  const shown = filter === 'all' ? items : items.filter((i) => i.category === filter);
  const current = index === null ? null : shown[index];

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const move = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + shown.length) % shown.length));

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onClose = () => setIndex(null);
    d.addEventListener('close', onClose);
    return () => d.removeEventListener('close', onClose);
  }, []);

  return (
    <div className={styles.gallery}>
      {categories && categories.length > 0 && (
        <div className={styles.filters} role="group" aria-label={labels.galleryFilter} data-reveal="up">
          {[{ id: 'all', label: allLabel ?? 'All' }, ...categories].map((c) => {
            const count = c.id === 'all' ? items.length : items.filter((i) => i.category === c.id).length;
            if (!count) return null;
            return (
              <button
                key={c.id}
                type="button"
                className={cx(styles.filter, filter === c.id && styles.filterActive)}
                aria-pressed={filter === c.id}
                onClick={() => setFilter(c.id)}
              >
                {c.label}
                <span className={styles.count}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <ul key={filter} className={cx(styles.grid, styles[layout])}>
        {shown.map(({ photo }, i) => (
          <li key={photo.id} className={styles.cell} style={{ '--i': i % 6 } as React.CSSProperties}>
            <button
              type="button"
              className={styles.thumb}
              onClick={() => open(i)}
              aria-label={fill(labels.openPhoto, { n: i + 1, total: shown.length, alt: photo.alt })}
            >
              <Picture photo={photo} sizes="(max-width: 600px) 92vw, (max-width: 1024px) 46vw, 400px" className={styles.image} placeholder />
              <span className={styles.zoom} aria-hidden="true">
                <Icon name="expand" size={22} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className={styles.viewer}
        aria-label={current?.photo.alt}
        onClick={(e) => e.target === e.currentTarget && close()}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') move(1);
          if (e.key === 'ArrowLeft') move(-1);
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          const start = touchX.current;
          const end = e.changedTouches[0]?.clientX;
          if (start !== null && end !== undefined && Math.abs(end - start) > 50) move(end < start ? 1 : -1);
          touchX.current = null;
        }}
      >
        {current && index !== null && (
          <>
            <figure className={styles.figure}>
              <Picture key={current.photo.id} photo={current.photo} sizes="100vw" className={styles.large} priority />
              <figcaption className={styles.caption}>
                <span>{current.photo.alt}</span>
                <span className={styles.counter}>{fill(labels.photoCount, { n: index + 1, total: shown.length })}</span>
              </figcaption>
            </figure>
            <button type="button" className={cx(styles.nav, styles.prev)} onClick={() => move(-1)} aria-label={labels.previous}>
              <Icon name="arrowLeft" size={22} />
            </button>
            <button type="button" className={cx(styles.nav, styles.next)} onClick={() => move(1)} aria-label={labels.next}>
              <Icon name="arrowRight" size={22} />
            </button>
            <button type="button" className={styles.close} onClick={close} aria-label={labels.close}>
              <Icon name="close" size={26} />
            </button>
          </>
        )}
      </dialog>
    </div>
  );
}
