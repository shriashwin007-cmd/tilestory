import { STORE } from "@/lib/store";
import styles from "./About.module.css";

const TAGS = ["Flooring", "Bathroom", "Moroccan", "Large Slab", "Imported", "Elevation"];

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.inner}>
        <div className={styles.imgWrap}>
          <div className={styles.imgBox}>Showroom Photo</div>
          <div className={styles.delBadge}>
            <div className={styles.delIcon}>🚚</div>
            <div className={styles.delTxt}>Same-Day Delivery</div>
          </div>
          <div className={styles.badge}>
            <div className={styles.badgeStars}>★★★★★</div>
            <div className={styles.badgeNum}>{STORE.rating}</div>
            <div className={styles.badgeTxt}>Google Rating</div>
          </div>
        </div>

        <div>
          <div className="s-label">Our Story</div>
          <h2 className="s-title">
            A Showroom Built on <em>Craft &amp; Trust</em>
          </h2>
          <p className={styles.desc}>
            Tile Story is Chennai&apos;s destination for premium designer
            tiles — from handcrafted Moroccan patterns to grand imported
            marble slabs. Every collection is hand-picked for homes and
            projects that demand more than the ordinary, backed by expert
            guidance and same-day delivery across the city.
          </p>

          <div className={styles.tags}>
            {TAGS.map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.infoRow}>
              <span className={styles.infoIc}>📍</span>
              <span>{STORE.address}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoIc}>🕒</span>
              <span>{STORE.hours}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoIc}>📞</span>
              <span>{STORE.phoneDisplay}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
