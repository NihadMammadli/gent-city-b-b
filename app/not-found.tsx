import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { Em } from '@/components/Rich';
import { SmartLink } from '@/components/SmartLink';
import { getContent } from '@/content';
import styles from './pages.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getContent();
  const { seo } = site.pages.notFound;
  /* Next.js marks a not-found page noindex on its own */
  return { title: seo.title, description: seo.description };
}

export default async function NotFound() {
  const site = await getContent();
  const page = site.pages.notFound;
  return (
    <section className={`${styles.notFound} tone-light`}>
      <Icon name="home" size={72} className={styles.notFoundIcon} />
      <h1 className="title-m">
        <Em text={page.title} />
      </h1>
      <p className="body">{page.text}</p>
      <SmartLink href={page.cta.href} className="btn btn-primary">
        {page.cta.label}
        <Icon name="arrowRight" />
      </SmartLink>
    </section>
  );
}
