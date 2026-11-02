import { photo, resolveLink, type HeroData, type Site } from '@/content';
import { cx } from '@/lib/cx';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import { Icon } from './Icon';
import { Picture } from './Picture';
import { Em } from './Rich';
import { SmartLink } from './SmartLink';
import styles from './Hero.module.css';

type Props = {
  site: Site;
  hero: HeroData;
  /** 'full' fills the first screen (home); 'page' is the shorter inner-page hero. */
  size?: 'full' | 'page';
  breadcrumbs?: Crumb[];
  /** The id of the section the scroll cue leads to. */
  next?: string;
};

/**
 * The damla-group hero: a full-bleed photograph under a navy gradient, the
 * blurred placeholder showing until the photo arrives, the title, line and
 * buttons rising in one after another, and a bouncing cue to scroll on.
 */
export function Hero({ site, hero, size = 'page', breadcrumbs, next }: Props) {
  const image = photo(site, hero.image);
  const primary = resolveLink(site, hero.primary);
  const secondary = resolveLink(site, hero.secondary);

  return (
    <section className={cx(styles.hero, styles[size])}>
      <div className={styles.media}>
        {image?.kind === 'local' && (
          <div className={styles.blur} style={{ backgroundImage: `url(${image.blur})` }} aria-hidden="true" />
        )}
        {image && <Picture photo={image} sizes="100vw" priority fade className={styles.image} />}
        <div className={styles.overlay} aria-hidden="true" />
      </div>

      <div className={styles.content}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} label={site.ui.breadcrumb} className={styles.crumbs} />}
        {hero.eyebrow && <p className={styles.eyebrow}>{hero.eyebrow}</p>}
        <h1 className={cx('title-l', styles.title)}>
          <Em text={hero.title} />
        </h1>
        {hero.subtitle && <p className={styles.subtitle}>{hero.subtitle}</p>}
        {(primary || secondary) && (
          <div className={cx('btn-row btn-row--stack', styles.actions)}>
            {primary && (
              <SmartLink href={primary.href} className="btn btn-primary" newTabLabel={site.ui.newTab}>
                {primary.label}
                <Icon name="arrowRight" />
              </SmartLink>
            )}
            {secondary && (
              <SmartLink href={secondary.href} className="btn btn-light" newTabLabel={site.ui.newTab}>
                {secondary.label}
              </SmartLink>
            )}
          </div>
        )}
      </div>

      {next && (
        <a href={`#${next}`} className={styles.cue} aria-label={site.ui.scrollDown}>
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="22" height="38" rx="11" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" />
            <rect className={styles.wheel} x="10" y="9" width="4" height="8" rx="2" fill="currentColor" fillOpacity="0.6" />
          </svg>
        </a>
      )}
    </section>
  );
}
