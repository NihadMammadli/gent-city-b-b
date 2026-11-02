import type { Metadata } from 'next';
import { Faq } from '@/components/Faq';
import { FeatureGrid } from '@/components/FeatureGrid';
import { Hero } from '@/components/Hero';
import { JsonLd } from '@/components/JsonLd';
import { Section } from '@/components/Section';
import { getContent, navLabel } from '@/content';
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from '@/lib/seo';
import styles from '../pages.module.css';

const PATH = '/good-to-know/';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getContent();
  return pageMetadata(site, site.pages.info.seo, PATH);
}

export default async function GoodToKnow() {
  const site = await getContent();
  const page = site.pages.info;
  const crumbs = [
    { name: site.ui.home, path: '/' },
    { name: navLabel(site, PATH, page.hero.title), path: PATH },
  ];

  return (
    <>
      <JsonLd data={site.faq.length ? [breadcrumbJsonLd(crumbs), faqJsonLd(site.faq)] : breadcrumbJsonLd(crumbs)} />
      <Hero site={site} hero={page.hero} breadcrumbs={crumbs} />

      {site.rules.length > 0 && (
        <Section tone="white" title={page.rules.title} subtitle={page.rules.subtitle}>
          <FeatureGrid items={site.rules} variant="row" />
        </Section>
      )}

      {site.faq.length > 0 && (
        <Section id="faq" tone="light" width="narrow" title={page.faq.title} subtitle={page.faq.subtitle}>
          <Faq items={site.faq} />
        </Section>
      )}

      {site.property.languages.length > 0 && (
        <Section tone="white" width="narrow" title={page.languages.title} subtitle={page.languages.subtitle}>
          <ul className={styles.languages} data-reveal="up">
            {site.property.languages.map((l) => (
              <li key={l.code} className={styles.language} lang={l.code}>
                <abbr title={l.name}>{l.code}</abbr>
                {l.name}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
