"use client";

import { useRef, useState } from "react";
import styles from "./MobileGallery.module.css";

const SHOTS = [
  { tag: "Living Room · Large Slab" },
  { tag: "Bathroom · Moroccan" },
  { tag: "Villa Exterior · Elevation" },
];

export default function MobileGallery() {
  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const idx = Math.round(rail.scrollLeft / rail.clientWidth);
    setActive(idx);
  };

  return (
    <section className={styles.section} id="gallery">
      <div className={styles.head}>
        <span className={styles.label}>Behind the Tiles</span>
        <h2 className={styles.title}>Spaces That Feel Considered</h2>
      </div>

      <div className={styles.rail} ref={railRef} onScroll={onScroll}>
        {SHOTS.map((s, i) => (
          <div key={s.tag} className={styles.card}>
            <div className={styles.cardImg} />
            <span className={styles.cardNum}>0{i + 1}</span>
            <div className={styles.cardTag}>{s.tag}</div>
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {SHOTS.map((s, i) => (
          <span key={s.tag} className={`${styles.dot} ${i === active ? styles.dotActive : ""}`} />
        ))}
      </div>
    </section>
  );
}
