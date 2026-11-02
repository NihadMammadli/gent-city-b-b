/**
 * Checks the content before anything is built.
 *
 *   npm run content:check                                  # content/site.json
 *   CONTENT_API_URL=https://… npm run content:check        # what the API returns
 *
 * Runs the same validation the build does (content/schema.ts), then checks
 * what the schema cannot: that every photo has a file to show. Exits non-zero
 * on the first problem, so `npm run build` never starts on bad content.
 */
import { hasCut } from '../content';
import { contentSource, loadContent } from '../content/load';

async function main() {
  const site = await loadContent().catch((error: Error) => {
    console.error(`✗ ${error.message}`);
    return process.exit(1);
  });

  const problems: string[] = [];
  for (const p of site.photos) {
    if (!hasCut(p.id) && !p.src) {
      problems.push(`photo "${p.id}" has no cut in content/images.json and no src — run \`npm run images\` or give it a src`);
    }
  }

  if (problems.length) {
    for (const p of problems) console.error(`✗ ${p}`);
    console.error(`\ncontent:check — ${problems.length} problem${problems.length > 1 ? 's' : ''} in ${contentSource()}.`);
    process.exit(1);
  }

  console.log(
    `content:check — ✓ ${contentSource()}: ${site.rooms.length} rooms, ${site.photos.length} photos, ` +
      `${site.reviews.length} reviews, ${site.faq.length} questions, ${site.places.length} places.`,
  );
}

main();
