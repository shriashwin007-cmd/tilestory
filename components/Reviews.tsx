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
      <div className={styles.inner}>
        <div className="s-label" style={{ justifyContent: "center" }}>
          Customer Stories
        </div>
        <h2 className="s-title">
          What Our <em>Clients Say</em>
        </h2>

        <div className={styles.grid}>
          {REVIEWS.map((r) => (
            <div key={r.name} className={styles.card}>
              <div className={styles.stars}>★★★★★</div>
              <p className={styles.text}>&quot;{r.text}&quot;</p>
              <div className={styles.name}>{r.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
