/**
 * The small grammar the content is written in: `{placeholders}` in labels,
 * blank lines between paragraphs, `*stars*` for the accent (see Rich.tsx).
 */

/** "Up to {n} guests" + { n: 4 } → "Up to 4 guests". Unknown names are left as written. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** Blank-line separated text → paragraphs. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** `*stars*` removed — for places that take plain text, like a page title or alt. */
export function plain(text: string): string {
  return text.replace(/\*([^*]+)\*/g, '$1');
}

/** A score as the content writes it: 9.4, 10, 9.0 → "9.4", "10", "9.0". */
export function score(value: number, decimals = 1): string {
  return Number.isInteger(value) && decimals === 0 ? String(value) : value.toFixed(decimals);
}
