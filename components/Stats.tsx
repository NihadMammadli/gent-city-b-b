import { CountUp } from './CountUp';
import { Icon } from './Icon';
import styles from './Stats.module.css';

export type Stat = { icon: string; value: number; decimals: number; suffix: string; label: string };

/** The damla-group stats row: a gold-ringed icon, a counting number, a label. */
export function Stats({ items }: { items: Stat[] }) {
  return (
    <ul className={styles.stats}>
      {items.map((item, i) => (
        <li key={item.label} className={styles.item} data-reveal="up" style={{ '--i': i } as React.CSSProperties}>
          <span className={styles.icon}>
            <Icon name={item.icon} size={28} />
          </span>
          <p className={styles.number}>
            <CountUp value={item.value} decimals={item.decimals} />
            {item.suffix && <span className={styles.suffix}>{item.suffix}</span>}
          </p>
          <p className={styles.label}>{item.label}</p>
        </li>
      ))}
    </ul>
  );
}
