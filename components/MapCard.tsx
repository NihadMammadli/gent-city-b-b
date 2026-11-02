'use client';

import { useState } from 'react';
import { Icon } from './Icon';
import styles from './MapCard.module.css';

type Props = {
  lat: number;
  lng: number;
  title: string;
  address: string[];
  mapsUrl: string;
  labels: { button: string; note: string; open: string; newTab: string };
};

/**
 * The map stays a card until it is asked for: OpenStreetMap is only
 * contacted when the visitor presses the button, so the page loads nothing
 * from a third party by default.
 */
export function MapCard({ lat, lng, title, address, mapsUrl, labels }: Props) {
  const [shown, setShown] = useState(false);
  const bbox = [lng - 0.009, lat - 0.0045, lng + 0.009, lat + 0.0045].map((n) => n.toFixed(5)).join('%2C');
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className={styles.card} data-reveal="up">
      {shown ? (
        <iframe className={styles.frame} src={src} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className={styles.placeholder}>
          <span className={styles.pin}>
            <Icon name="pin" size={34} />
          </span>
          <address className={styles.address}>
            {address.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <button type="button" className="btn btn-primary" onClick={() => setShown(true)}>
            <Icon name="pin" />
            {labels.button}
          </button>
          {labels.note && <p className={styles.note}>{labels.note}</p>}
        </div>
      )}
      {mapsUrl && (
        <a className={styles.open} href={mapsUrl} target="_blank" rel="noopener noreferrer">
          {labels.open}
          <Icon name="external" size={16} />
          <span className="visually-hidden"> {labels.newTab}</span>
        </a>
      )}
    </div>
  );
}
