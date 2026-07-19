import Reveal from "./Reveal";
import styles from "./Reviews.module.css";
import type { Review } from "@/lib/data";

export default function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <section className={styles.section} id="reviews">
      <div className={styles.glow} />
      <div className={styles.inner}>
        <span className="ghost-num on-dark">04</span>
        <Reveal>
          <div className={styles.label}>
            <span className="s-index">04</span>Customer Stories
          </div>
          <h2 className={styles.title}>
            What Our <em>Clients Say</em>
          </h2>
        </Reveal>

        <div className={styles.grid}>
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 120}>
              <div className={styles.card}>
                <div className={styles.stars}>★★★★★</div>
                <p className={styles.text}>&quot;{r.text}&quot;</p>
                <div className={styles.name}>{r.name}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
