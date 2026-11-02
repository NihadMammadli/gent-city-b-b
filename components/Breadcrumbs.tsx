import Link from 'next/link';
import { cx } from '@/lib/cx';
import { Icon } from './Icon';
import styles from './Breadcrumbs.module.css';

export type Crumb = { name: string; path: string };

/** Where this page sits. The last crumb is the page itself and is not a link. */
export function Breadcrumbs({ items, label, className }: { items: Crumb[]; label: string; className?: string }) {
  return (
    <nav aria-label={label} className={cx(styles.crumbs, className)}>
      <ol>
        {items.map((item, i) => (
          <li key={item.path}>
            {i < items.length - 1 ? (
              <>
                <Link href={item.path}>{item.name}</Link>
                <Icon name="chevronDown" size={14} className={styles.sep} />
              </>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
