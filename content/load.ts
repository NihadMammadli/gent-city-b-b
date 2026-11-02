/**
 * Loads the content from wherever it lives and holds it to the contract.
 *
 * With CONTENT_API_URL set the content comes from the API; without it, from
 * content/site.json. Either way it is validated against content/schema.ts,
 * and a document that does not match stops the build with a list of what is
 * wrong — a broken API response can never publish a broken page.
 */
import { z } from 'zod';
import { SiteSchema, type Site } from './schema';
import { fromApi } from './sources/api';
import { fromFile } from './sources/file';

export function contentSource(): string {
  const url = process.env.CONTENT_API_URL?.trim();
  return url ? url : 'content/site.json';
}

export async function loadContent(): Promise<Site> {
  const url = process.env.CONTENT_API_URL?.trim();
  const raw = url ? await fromApi(url) : await fromFile();
  const result = SiteSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(`The content from ${contentSource()} does not match content/schema.ts:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
