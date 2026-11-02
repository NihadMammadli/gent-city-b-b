import { Icon } from './Icon';
import styles from './FeatureGrid.module.css';

type Feature = { icon: string; title: string; text: string };

type Props = {
  items: Feature[];
  headingLevel?: 'h3' | 'h4';
  /** 'card' centres each one under a bronze disc; 'row' sets the icon beside the text. */
  variant?: 'card' | 'row';
};

/** The damla-group service cards: a bronze disc, a title, a line — a grid of them. */
export function FeatureGrid({ items, headingLevel = 'h3', variant = 'card' }: Props) {
  const Title = headingLevel;
  return (
    <ul className={variant === 'row' ? `${styles.grid} ${styles.rows}` : styles.grid}>
      {items.map((item, i) => (
        <li key={item.title} className={styles.card} data-reveal="up" style={{ '--i': i % 4 } as React.CSSProperties}>
          <span className={styles.icon}>
            <Icon name={item.icon} size={26} />
          </span>
          <div className={styles.copy}>
            <Title className={styles.title}>{item.title}</Title>
            {item.text && <p className={styles.text}>{item.text}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
