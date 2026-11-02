import Link from 'next/link';
import { photo, roomPath, type Room, type Site } from '@/content';
import { fill } from '@/lib/text';
import { Icon } from './Icon';
import { Picture } from './Picture';
import styles from './RoomCard.module.css';

/**
 * A room as a damla-group project card: the photo zooms on hover, the bronze
 * name, a short summary and the three facts guests compare first.
 */
export function RoomCard({ site, room, index = 0 }: { site: Site; room: Room; index?: number }) {
  const cover = photo(site, room.cover);
  const { ui } = site;

  return (
    <article className={styles.card} data-reveal="up" style={{ '--i': index } as React.CSSProperties}>
      <Link href={roomPath(room)} className={styles.link}>
        <div className={styles.media}>
          {cover && <Picture photo={cover} sizes="(max-width: 768px) 92vw, 580px" className={styles.image} placeholder />}
          {room.tag && <span className={styles.tag}>{room.tag}</span>}
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{room.name}</h3>
          <ul className={styles.facts}>
            <li>
              <Icon name="size" size={18} />
              {fill(ui.sizeValue, { n: room.sizeM2 })}
            </li>
            <li>
              <Icon name="guests" size={18} />
              {fill(ui.guestsValue, { n: room.maxGuests })}
            </li>
            <li>
              <Icon name="bed" size={18} />
              {room.beds}
            </li>
          </ul>
          <p className={styles.summary}>{room.summary}</p>
          <span className="link-arrow">
            {ui.viewRoom}
            <Icon name="arrowRight" />
          </span>
        </div>
      </Link>
    </article>
  );
}
