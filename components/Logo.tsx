import { cx } from '@/lib/cx';
import styles from './Logo.module.css';

/* The same stepped gable as scripts/brand.mjs draws for the icons. */
const GABLE =
  'M14 52V30h5v-6h5v-6h4v-6h8v6h4v6h5v6h5v22ZM29 52v-9a3 3 0 0 1 6 0v9ZM20 34h5v6h-5ZM39 34h5v6h-5ZM30 19h4v5h-4Z';

type Props = { name: string; tagline?: string; className?: string };

/** The mark beside the property's name, which comes from content. */
export function Logo({ name, tagline, className }: Props) {
  return (
    <span className={cx(styles.logo, className)}>
      <svg className={styles.mark} viewBox="12 10 40 44" aria-hidden="true" focusable="false">
        <path fill="currentColor" fillRule="evenodd" d={GABLE} />
      </svg>
      <span className={styles.text}>
        <span className={styles.name}>{name}</span>
        {tagline && <span className={styles.tagline}>{tagline}</span>}
      </span>
    </span>
  );
}
