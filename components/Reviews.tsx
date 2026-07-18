import Reveal from "./Reveal";
import styles from "./Reviews.module.css";

const REVIEWS = [
  {
    text: "Absolutely stunning collection. Found the perfect Moroccan tiles for my living room — quality unmatched in Chennai.",
    name: "Priya Krishnan",
  },
  {
    text: "Same-day delivery is real! Ordered large slab tiles in the morning, ready by afternoon. Exceptional service.",
    name: "Arjun Mehta",
  },
  {
    text: "Team helped us select perfect bathroom tiles matching our exact vision. The imported collection is breathtaking.",
    name: "Divya Raman",
  },
];

export default function Reviews() {
  return (
    <section className={styles.section} id="reviews">
      <div className={styles.glow} />
      <div className={styles.inner}>
        <Reveal>
          <div className={styles.label}>Customer Stories</div>
          <h2 className={styles.title}>
            What Our <em>Clients Say</em>
          </h2>
        </Reveal>

        <div className={styles.grid}>
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 120}>
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
