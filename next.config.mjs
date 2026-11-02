/* The site is exported as static files, so it can live on any host that
   serves a folder: GitHub Pages today, a CDN or nginx tomorrow.

   GitHub Pages serves a project repository from /<repo>, so every URL needs
   that prefix there and none at a domain root. The deploy workflow sets
   NEXT_PUBLIC_BASE_PATH; locally it is empty. */
const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const basePath = raw === '/' ? '' : raw.replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
};

export default nextConfig;
