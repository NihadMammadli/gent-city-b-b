'use client';

import { useEffect, useRef, useState } from 'react';

type Props = { value: number; decimals?: number; duration?: number };

/**
 * A number that counts up from zero the first time it is seen — the
 * damla-group stats, eased out (easeOutQuart). It renders the real value on
 * the server, so search engines, no-JS and reduced-motion visitors read the
 * figure itself; it only resets to zero when it is about to animate.
 */
export function CountUp({ value, decimals = 0, duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || !document.documentElement.classList.contains('motion')) return;

    let frame = 0;
    setShown(0);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        let start: number | null = null;
        const tick = (now: number) => {
          start ??= now;
          const t = Math.min((now - start) / duration, 1);
          setShown(value * (1 - Math.pow(1 - t, 4)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return <span ref={ref}>{shown.toFixed(decimals)}</span>;
}
