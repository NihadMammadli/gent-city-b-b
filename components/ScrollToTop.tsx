'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Every new page opens at its top, at once — the damla-group ScrollToTop.
 *
 * Next.js only scrolls when the new page's first element is out of view,
 * and otherwise keeps the old scroll position, so a page could open part
 * way down. This runs in the same frame as the new page, before it paints,
 * and overrides that.
 *
 * Left alone: the first load (the browser's), back and forward (the browser
 * returns you to where you were), and a link to a #section on another page.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      fromHistory.current = true;
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
