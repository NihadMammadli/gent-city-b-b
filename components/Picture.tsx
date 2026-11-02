import type { CSSProperties } from 'react';
import type { PhotoSource } from '@/content';
import { asset } from '@/lib/paths';

type Props = {
  photo: PhotoSource;
  /** How wide the picture is drawn, so a phone fetches the 480px file. */
  sizes: string;
  className?: string;
  /** The first screen's picture: fetched first and never lazily. */
  priority?: boolean;
  /** Paint the tiny blurred version underneath while the file arrives. */
  placeholder?: boolean;
};

/**
 * A photo, offered at every width `npm run images` cut it to. width and
 * height carry its shape so nothing jumps while it loads; the focus point
 * from scripts/images.config.mjs decides what a cropping frame keeps.
 * A remote photo (from an API) is drawn as given.
 */
export function Picture({ photo, sizes, className, priority, placeholder }: Props) {
  const loading = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? 'high' : 'auto';

  if (photo.kind === 'remote') {
    return (
      <img
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        style={{ objectPosition: photo.position }}
      />
    );
  }

  const url = (w: number) => asset(`/img/${photo.id}-${w}.webp`);
  const fallback = photo.widths.find((w) => w >= 1200) ?? photo.widths[photo.widths.length - 1];
  const style: CSSProperties = { objectPosition: photo.position };
  if (placeholder) {
    style.backgroundImage = `url(${photo.blur})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = photo.position;
  }

  return (
    <img
      src={url(fallback)}
      srcSet={photo.widths.map((w) => `${url(w)} ${w}w`).join(', ')}
      sizes={sizes}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      className={className}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding={priority ? 'sync' : 'async'}
      style={style}
    />
  );
}
