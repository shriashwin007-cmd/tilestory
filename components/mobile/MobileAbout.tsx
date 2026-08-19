import { STORE } from "@/lib/store";
import SectionBgVideo from "../SectionBgVideo";
import styles from "./MobileAbout.module.css";

const TAGS = ["Flooring", "Bathroom", "Moroccan", "Large Slab", "Imported", "Elevation"];

export default function MobileAbout() {
  return (
    <section className={styles.about} id="about">
      <SectionBgVideo src="/videos/about-section-bg.mp4" tint="light" />
      <div className={styles.imgBox}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/showroom.webp" alt="Tile Story showroom" className={styles.img} />
        <div className={styles.badge}>
          <span className={styles.badgeStars}>★★★★★</span>
          <span className={styles.badgeNum}>{STORE.rating}</span>
        </div>
      </div>

      <div className={styles.body}>
        <span className={styles.label}>Our Story</span>
        <h2 className={styles.title}>A Showroom Built on Craft &amp; Trust</h2>
        <p className={styles.desc}>
          Tile Story is Chennai&apos;s destination for premium designer tiles —
          from handcrafted Moroccan patterns to grand imported marble slabs,
          hand-picked with same-day delivery across the city.
        </p>
        <div className={styles.tags}>
          {TAGS.map((t) => (
            <span key={t} className={styles.tag}>
              {t}
            </span>
          ))}
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <span>📍</span>
            <span>{STORE.address}</span>
          </div>
          <div className={styles.infoRow}>
            <span>🕒</span>
            <span>{STORE.hours}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
