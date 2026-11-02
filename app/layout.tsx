import type { Metadata, Viewport } from 'next';
import { Urbanist } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Motion } from '@/components/Motion';
import { ScrollToTop } from '@/components/ScrollToTop';
import { getContent, resolveHref } from '@/content';
import { absoluteUrl } from '@/lib/paths';
import { plain } from '@/lib/text';
import './globals.css';

const urbanist = Urbanist({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-urbanist',
});

/* Motion is opt-in: `motion` is added only when the visitor has not asked
   for reduced motion, and taken off again if the JavaScript never arrives
   (see app/globals.css). Runs before the first paint. */
const MOTION_SCRIPT = `(function(){try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: no-preference)').matches)return;d.classList.add('motion');setTimeout(function(){if(d.dataset.fired!=='true')d.classList.remove('motion')},3000)}catch(e){}})()`;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getContent();
  return {
    metadataBase: new URL(absoluteUrl('/')),
    title: { default: plain(site.pages.home.seo.title), template: site.meta.titleTemplate },
    description: site.brand.description,
    applicationName: site.brand.name,
    keywords: site.meta.keywords,
    formatDetection: { telephone: false, email: false, address: false },
    robots: { index: true, follow: true },
    appleWebApp: { title: site.brand.shortName },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const site = await getContent();
  return { themeColor: site.meta.themeColor, colorScheme: 'light' };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getContent();
  const book = resolveHref(site, '@booking');

  return (
    /* data-scroll-behavior: the smooth scrolling in globals.css is for jumps
       within a page; Next.js turns it off while it changes pages */
    <html lang={site.meta.language} className={urbanist.variable} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_SCRIPT }} />
      </head>
      <body>
        <a className="skip" href="#main">
          {site.ui.skip}
        </a>
        <Header
          name={site.brand.name}
          tagline={site.brand.tagline}
          nav={site.nav}
          book={book ? { label: site.ui.bookShort, href: book } : null}
          labels={{
            navLabel: site.ui.navLabel,
            menuOpen: site.ui.menuOpen,
            menuClose: site.ui.menuClose,
            home: site.ui.home,
            newTab: site.ui.newTab,
          }}
        />
        <main id="main">{children}</main>
        <Footer site={site} />
        {/* after <main>, so it runs once the new page is in place */}
        <ScrollToTop />
        <Motion />
      </body>
    </html>
  );
}
