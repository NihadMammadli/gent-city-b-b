import type { ReactNode } from 'react';
import type { PhotoSource } from '@/content';
import { cx } from '@/lib/cx';
import { Icon } from './Icon';
import { Picture } from './Picture';
import { Em, Paragraphs } from './Rich';
import styles from './ImageText.module.css';

type Props = {
  id?: string;
  image: PhotoSource | null;
  imagePosition?: 'left' | 'right';
  tone?: 'white' | 'light' | 'cream';
  icon?: string;
  title: string;
  titleTag?: 'h2' | 'h3';
  body: string;
  /** The smaller line under the body — a signature, a note. */
  subtext?: string;
  children?: ReactNode;
};

/**
 * The damla-group image-and-text section: the photo framed by an offset gold
 * rule, the text beside it, each sliding in from its own side.
 */
export function ImageText({ id, image, imagePosition = 'right', tone = 'light', icon, title, titleTag: Title = 'h2', body, subtext, children }: Props) {
  const media = image && (
    <div className={styles.media} data-reveal={imagePosition === 'left' ? 'left' : 'right'}>
      <div className={styles.frame}>
        <Picture photo={image} sizes="(max-width: 768px) 90vw, 550px" className={styles.image} placeholder />
      </div>
    </div>
  );

  return (
    <section id={id} className={cx(styles.section, `tone-${tone}`, imagePosition === 'left' && styles.imageLeft)}>
      <div className={styles.inner}>
        {media}
        <div className={styles.content} data-reveal={imagePosition === 'left' ? 'right' : 'left'}>
          <div className={styles.titleRow}>
            {icon && (
              <span className={styles.icon}>
                <Icon name={icon} size={28} />
              </span>
            )}
            <Title className="title-m">
              <Em text={title} />
            </Title>
          </div>
          <Paragraphs text={body} className="body" />
          {subtext && <p className={styles.subtext}>{subtext}</p>}
          {children && <div className={styles.extra}>{children}</div>}
        </div>
      </div>
    </section>
  );
}
