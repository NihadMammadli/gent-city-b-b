/**
 * The content from an API: one GET that returns the whole document described
 * by content/schema.ts (the shape of content/site.json).
 *
 *   CONTENT_API_URL    the endpoint, e.g. https://api.damla-group.com/sites/gent-city-bb
 *   CONTENT_API_TOKEN  optional; sent as "Authorization: Bearer <token>"
 *
 * The site is exported as static files, so this runs at build time: publish
 * new content by rebuilding (the deploy workflow can be triggered by the
 * API's webhook — see README).
 */
export async function fromApi(url: string): Promise<unknown> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = process.env.CONTENT_API_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(url, { headers, cache: 'force-cache' });
  } catch (error) {
    throw new Error(`content: could not reach ${url} (${(error as Error).message})`);
  }
  if (!res.ok) throw new Error(`content: ${url} answered ${res.status} ${res.statusText}`);
  return res.json();
}
