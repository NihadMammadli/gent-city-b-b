import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { Em } from './Rich';
import styles from './Section.module.css';

type Props = {
  id?: string;
  tone?: 'white' | 'light' | 'cream' | 'navy';
  title?: string;
  subtitle?: string;
  /** Section headings are h2; a page without a hero can make its first one h1. */
  titleTag?: 'h1' | 'h2';
  width?: 'default' | 'narrow' | 'wide';
  className?: string;
  children?: ReactNode;
};

/**
 * A field of the page: a tone, the centred damla-group heading (a light
 * 51px title over grey body copy) and whatever sits under it. The heading
 * rises in when it is reached.
 */
export function Section({ id, tone = 'white', title, subtitle, titleTag: Title = 'h2', width = 'default', className, children }: Props) {
  return (
    <section id={id} className={cx(styles.section, `tone-${tone}`, className)}>
      <div className={cx(styles.inner, styles[width])}>
        {title && (
          <header className={styles.head} data-reveal="up">
            <Title className={cx('title-m', styles.title)}>
              <Em text={title} />
            </Title>
            {subtitle && <p className={cx('body', styles.subtitle)}>{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
