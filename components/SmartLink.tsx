import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Read to screen readers after a link that opens a new tab. */
  newTabLabel?: string;
  'aria-label'?: string;
};

/**
 * One link for every kind of href the content can hold: a site path goes
 * through next/link (which adds the base path), an anchor or mailto/tel stays
 * a plain anchor, and a full URL opens in a new tab.
 */
export function SmartLink({ href, children, className, newTabLabel, ...rest }: Props) {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        {newTabLabel && <span className="visually-hidden"> {newTabLabel}</span>}
      </a>
    );
  }
  if (!href.startsWith('/')) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
