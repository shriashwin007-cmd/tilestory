import styles from "./Marquee.module.css";

const ITEMS = [
  "Same-Day Delivery",
  "Imported Italian Marble",
  "Handcrafted Moroccan",
  "Large Format Slabs",
  "Expert Guidance",
  "Anti-Slip Outdoor",
  "Designer Collections",
  "Bathroom & Elevation",
];

export default function Marquee() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.track}>
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <span className={styles.dot}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
