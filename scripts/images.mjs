#!/usr/bin/env node
/**
 * Cuts every photograph in scripts/images.config.mjs, and draws the icons.
 *
 *   npm run images
 *
 * For each photo:
 *   public/img/<id>-<width>.webp   one file per width (never enlarged)
 *   public/og/<id>.jpg             1200 × 630 share card, when `og` is set
 *   content/images.json            widths, shape, focus and a tiny blurred
 *                                  placeholder, read by components/Picture
 *
 * And the icons: app/icon.svg, app/apple-icon.png, public/icons/*.png.
 *
 * Originals are downloaded once into .cache/originals/ (git-ignored).
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { PHOTOS, WIDTHS, HERO_WIDTHS } from './images.config.mjs';
import { iconSvg } from './brand.mjs';

const CACHE = '.cache/originals';
const IMG = 'public/img';
const OG = 'public/og';
const ICONS = 'public/icons';
const MANIFEST = 'content/images.json';
const QUALITY = 72;

for (const dir of [CACHE, IMG, OG, ICONS]) fs.mkdirSync(dir, { recursive: true });

async function original(photo) {
  if (!/^https?:/.test(photo.src)) return photo.src;
  const file = path.join(CACHE, `${photo.id}.jpg`);
  if (!fs.existsSync(file)) {
    const res = await fetch(photo.src, { headers: { 'User-Agent': 'Mozilla/5.0 (gent-city-bb image build)' } });
    if (!res.ok) throw new Error(`${photo.id}: ${res.status} downloading ${photo.src}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return file;
}

/* Clear what an earlier run wrote, so a renamed photo leaves nothing behind. */
for (const dir of [IMG, OG]) {
  for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
}

const manifest = {};
let total = 0;

for (const photo of PHOTOS) {
  const src = await original(photo);
  const { width: W, height: H } = await sharp(src).metadata();
  const wanted = photo.hero ? HERO_WIDTHS : WIDTHS;
  const widths = [...new Set([...wanted.filter((w) => w < W), Math.min(W, wanted.at(-1))])];
  const [fx, fy] = photo.focus ?? [0.5, 0.5];

  const sizes = [];
  for (const w of widths) {
    const file = path.join(IMG, `${photo.id}-${w}.webp`);
    await sharp(src).resize({ width: w }).webp({ quality: QUALITY, effort: 6 }).toFile(file);
    const bytes = fs.statSync(file).size;
    total += bytes;
    sizes.push(`${w}:${Math.round(bytes / 1024)}K`);
  }

  /* 24px wide and blurred by the browser — the damla-group blur-up, without
     a second request */
  const blur = await sharp(src).resize({ width: 24 }).webp({ quality: 40 }).toBuffer();

  if (photo.og) {
    const box = { width: 1200, height: 630 };
    const scale = Math.max(box.width / W, box.height / H);
    const sw = Math.round(W * scale);
    const sh = Math.round(H * scale);
    const left = Math.round(Math.min(Math.max(fx * sw - box.width / 2, 0), sw - box.width));
    const top = Math.round(Math.min(Math.max(fy * sh - box.height / 2, 0), sh - box.height));
    await sharp(src)
      .resize({ width: sw, height: sh })
      .extract({ left, top, ...box })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(OG, `${photo.id}.jpg`));
  }

  const top = widths.at(-1);
  manifest[photo.id] = {
    widths,
    width: top,
    height: Math.round((top * H) / W),
    focus: [fx, fy],
    blur: `data:image/webp;base64,${blur.toString('base64')}`,
    ...(photo.og && { og: true }),
  };
  console.log(`  ✓ ${photo.id.padEnd(24)} ${sizes.join('  ')}${photo.og ? '  + og' : ''}`);
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

/* ------------------------------------------------------------------ icons */
fs.writeFileSync('app/icon.svg', iconSvg() + '\n');
await sharp(Buffer.from(iconSvg({ size: 180, rounded: false }))).png().toFile('app/apple-icon.png');
await sharp(Buffer.from(iconSvg({ size: 192 }))).png().toFile(path.join(ICONS, 'icon-192.png'));
await sharp(Buffer.from(iconSvg({ size: 512 }))).png().toFile(path.join(ICONS, 'icon-512.png'));
await sharp(Buffer.from(iconSvg({ size: 512, rounded: false }))).png().toFile(path.join(ICONS, 'icon-maskable-512.png'));

console.log(`\nimages — ✓ ${PHOTOS.length} photos, ${Math.round(total / 1024)} KB of webp. ${MANIFEST} and the icons written.`);
