"use client";

import { useRef, useState } from "react";
import styles from "./MobileReviews.module.css";
import type { Review } from "@/lib/data";

export default function MobileReviews({ reviews }: { reviews: Review[] }) {
  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLDivElement | null>(null);

  const onScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const idx = Math.round(rail.scrollLeft / rail.clientWidth);
    setActive(idx);
  };

  return (
    <section className={styles.section} id="reviews">
      <span className={styles.label}>Customer Stories</span>
      <h2 className={styles.title}>What Our Clients Say</h2>

      <div className={styles.rail} ref={railRef} onScroll={onScroll}>
        {reviews.map((r) => (
          <div key={r.id} className={styles.card}>
            <div className={styles.stars}>★★★★★</div>
            <p className={styles.text}>&quot;{r.text}&quot;</p>
            <div className={styles.name}>{r.name}</div>
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {reviews.map((r, i) => (
          <span key={r.id} className={`${styles.dot} ${i === active ? styles.dotActive : ""}`} />
        ))}
      </div>
    </section>
  );
}
