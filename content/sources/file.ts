/**
 * The content as committed: content/site.json. Edits arrive as readable git
 * diffs, and the file doubles as the reference document for an API — it is
 * exactly what `CONTENT_API_URL` must return.
 */
import data from '../site.json';

export async function fromFile(): Promise<unknown> {
  return data;
}
