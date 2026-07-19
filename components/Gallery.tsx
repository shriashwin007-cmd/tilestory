import Reveal from "./Reveal";
import ArrowButton from "./ArrowButton";
import { waLink } from "@/lib/store";
import styles from "./Gallery.module.css";

const SHOTS = [
  { tag: "Living Room · Large Slab" },
  { tag: "Bathroom · Moroccan" },
  { tag: "Villa Exterior · Elevation" },
];

export default function Gallery() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Reveal>
          <div className={styles.head}>
            <div>
              <div className={styles.label}>
                <span className="s-index">02</span>Behind the Tiles
              </div>
              <h2 className={styles.title}>
                Spaces That Feel
                <br />
                Considered, Not Decorated
              </h2>
            </div>
            <div className={styles.right}>
              <p className={styles.desc}>
                Every collection is chosen the way we&apos;d choose it for our
                own home — for how it wears, ages, and feels underfoot.
              </p>
              <ArrowButton
                as="a"
                href={waLink("Hi Tile Story! I'd like to see more installation photos.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                See More Work
              </ArrowButton>
            </div>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {SHOTS.map((s, i) => (
            <Reveal key={s.tag} delay={i * 110} className={i === 1 ? styles.drop : ""}>
              <div className={styles.card}>
                <div className={styles.cardImg}>{s.tag}</div>
                <div className={styles.cardShade} />
                <div className={styles.cardTag}>{s.tag}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
