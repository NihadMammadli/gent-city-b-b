'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Review } from '@/content';
import { cx } from '@/lib/cx';
import { fill, score } from '@/lib/text';
import { Icon } from './Icon';
import styles from './ReviewCarousel.module.css';

type Props = {
  reviews: Review[];
  labels: { previous: string; next: string; reviewsLabel: string; reviewPage: string; reviewScore: string };
};

/**
 * Guest reviews as damla-group testimonial cards. The track is a native
 * scroll-snap row — three cards on a computer, one on a phone, swipeable
 * with no JavaScript at all; the round arrows and the gold dots drive it.
 */
export function ReviewCarousel({ reviews, labels }: Props) {
  const track = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const step = useCallback(() => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return 1;
    return card.offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const perView = Math.max(1, Math.round((el.clientWidth + 1) / step()));
      const count = Math.max(1, reviews.length - perView + 1);
      setPages(count);
      setPage(Math.min(count - 1, Math.round(el.scrollLeft / step())));
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [reviews.length, step]);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const target = Math.max(0, Math.min(pages - 1, i));
    const smooth = matchMedia('(prefers-reduced-motion: no-preference)').matches;
    el.scrollTo({ left: target * step(), behavior: smooth ? 'smooth' : 'auto' });
  };

  return (
    <div className={styles.carousel} data-reveal="up">
      <ul ref={track} className={styles.track} aria-label={labels.reviewsLabel} tabIndex={0}>
        {reviews.map((r) => (
          <li key={`${r.name}-${r.text.slice(0, 16)}`} className={styles.card}>
            <figure>
              <div className={styles.top}>
                <span className={styles.score}>{fill(labels.reviewScore, { score: score(r.score, 0) })}</span>
                <Icon name="quote" size={30} className={styles.quoteMark} />
              </div>
              {r.title && <p className={styles.title}>{r.title}</p>}
              <blockquote className={styles.quote}>
                <p>{r.text}</p>
              </blockquote>
              <figcaption className={styles.footer}>
                <span className={styles.name}>{r.name}</span>
                <span className={styles.meta}>{[r.country, r.travellerType].filter(Boolean).join(' · ')}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <div className={styles.controls}>
          <button type="button" className={styles.arrow} onClick={() => go(page - 1)} disabled={page === 0} aria-label={labels.previous}>
            <Icon name="arrowLeft" size={20} />
          </button>
          <div className={styles.dots}>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={cx(styles.dot, i === page && styles.dotActive)}
                onClick={() => go(i)}
                aria-label={fill(labels.reviewPage, { n: i + 1 })}
                aria-current={i === page ? 'true' : undefined}
              />
            ))}
          </div>
          <button type="button" className={styles.arrow} onClick={() => go(page + 1)} disabled={page >= pages - 1} aria-label={labels.next}>
            <Icon name="arrowRight" size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
