import Reveal from "./Reveal";
import ScoreOnView from "./Rewards/ScoreOnView";
import styles from "./Reviews.module.css";
import type { Review } from "@/lib/data";

export default function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <section className={styles.section} id="reviews">
      <ScoreOnView
        sectionId="reviews"
        pointsKey="viewed_reviews"
        points={10}
        label="Read Customer Reviews"
      />
      <div className={styles.glow} />
      <div className={styles.inner}>
        <span className="ghost-num on-dark">05</span>
        <Reveal>
          <div className={styles.label}>
            <span className="s-index">05</span>Customer Stories
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
