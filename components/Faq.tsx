import { Icon } from './Icon';
import styles from './Faq.module.css';

type Item = { question: string; answer: string };

/** Questions as native disclosure widgets: keyboard and screen-reader ready, no script needed. */
export function Faq({ items }: { items: Item[] }) {
  return (
    <div className={styles.list}>
      {items.map((item, i) => (
        <details key={item.question} className={styles.item} data-reveal="up" style={{ '--i': i % 4 } as React.CSSProperties}>
          <summary className={styles.question}>
            <h3>{item.question}</h3>
            <Icon name="chevronDown" size={22} className={styles.chevron} />
          </summary>
          <p className={styles.answer}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
