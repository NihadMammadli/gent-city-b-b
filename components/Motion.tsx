'use client';

import { useEffect } from 'react';

/**
 * Brings the page to life once it has rendered finished (see the motion
 * notes in app/globals.css). Every element marked `data-reveal` rises in the
 * first time it is reached, and new ones are picked up when the page changes.
 *
 * It marks <html data-fired> on mount so the head script knows the
 * JavaScript arrived and leaves the `motion` class in place.
 */
export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.fired = 'true';
    if (!root.classList.contains('motion')) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    );

    /* a `data-fade` image is held transparent over its placeholder until it
       has loaded — or failed, so a broken file never stays invisible */
    const watched = new WeakSet<HTMLImageElement>();
    const loaded = (img: HTMLImageElement) => img.classList.add('is-loaded');
    const watchImages = () => {
      document.querySelectorAll<HTMLImageElement>('img[data-fade]:not(.is-loaded)').forEach((img) => {
        if (img.complete) return loaded(img);
        if (watched.has(img)) return;
        watched.add(img);
        img.addEventListener('load', () => loaded(img), { once: true });
        img.addEventListener('error', () => loaded(img), { once: true });
      });
    };

    const scan = () => {
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
      watchImages();
    };

    /* a client-side navigation swaps the page under the layout; look again */
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });

    scan();
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
