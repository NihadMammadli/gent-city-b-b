import { paragraphs } from '@/lib/text';

/**
 * The only formatting the content understands, deliberately: `*stars*` for
 * the bronze accent inside a heading, and blank lines between paragraphs.
 */

/** "Welcome to *Gent City B&B*" → Welcome to <span class="accent">Gent City B&B</span> */
export function Em({ text }: { text: string }) {
  return (
    <>
      {text.split(/\*([^*]+)\*/g).map((part, i) =>
        i % 2 ? (
          <span className="accent" key={i}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Blank-line separated text → one <p> each. */
export function Paragraphs({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      {paragraphs(text).map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  );
}
