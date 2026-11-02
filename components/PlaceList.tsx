import type { Place } from '@/content';
import { Icon } from './Icon';
import styles from './PlaceList.module.css';

/** Nearby places: an icon, the name and a note, the distance set against the right edge. */
export function PlaceList({ places, compact = false }: { places: Place[]; compact?: boolean }) {
  return (
    <ul className={compact ? `${styles.list} ${styles.compact}` : styles.list}>
      {places.map((p) => (
        <li key={p.name} className={styles.place}>
          <span className={styles.icon}>
            <Icon name={p.icon} size={compact ? 20 : 22} />
          </span>
          <span className={styles.text}>
            <span className={styles.name}>{p.name}</span>
            {p.note && !compact && <span className={styles.note}>{p.note}</span>}
          </span>
          <span className={styles.distance}>{p.distance}</span>
        </li>
      ))}
    </ul>
  );
}
