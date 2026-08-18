"use client";

import { useRef, useState } from "react";
import SectionBgVideo from "../SectionBgVideo";
import LoopVideo from "../LoopVideo";
import styles from "./MobileGallery.module.css";

const SHOTS = [
  { tag: "Living Room · Large Slab", video: "/videos/gallery-living-room.mp4" },
  { tag: "Bathroom · Moroccan", video: "/videos/gallery-bathroom.mp4" },
  { tag: "Villa Exterior · Elevation", video: "/videos/gallery-villa.mp4" },
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
      <SectionBgVideo src="/videos/gallery-section-bg.mp4" />
      <div className={styles.head}>
        <span className={styles.label}>Behind the Tiles</span>
        <h2 className={styles.title}>Spaces That Feel Considered</h2>
      </div>

      <div className={styles.rail} ref={railRef} onScroll={onScroll}>
        {SHOTS.map((s, i) => (
          <div key={s.tag} className={styles.card}>
            <LoopVideo className={styles.cardVideo} src={s.video} />
            <div className={styles.cardShade} />
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
