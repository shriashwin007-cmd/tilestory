import Reveal from "./Reveal";
import ArrowButton from "./ArrowButton";
import ScoreOnView from "./Rewards/ScoreOnView";
import KineticText from "./KineticText";
import { waLink } from "@/lib/store";
import styles from "./Gallery.module.css";

const SHOTS = [
  { num: "01", tag: "Living Room · Large Slab" },
  { num: "02", tag: "Bathroom · Moroccan" },
  { num: "03", tag: "Villa Exterior · Elevation" },
];

export default function Gallery() {
  return (
    <section className={styles.section} id="gallery">
      <ScoreOnView
        sectionId="gallery"
        pointsKey="viewed_gallery"
        points={10}
        label="Viewed Craftsmanship"
      />
      <div className={styles.inner}>
        <Reveal>
          <div className={styles.head}>
            <div>
              <div className={styles.label}>
                <span className="s-index">02</span>Behind the Tiles
              </div>
              <KineticText
                as="h2"
                className={styles.title}
                segments={[{ text: "Spaces That Feel\nConsidered, Not Decorated" }]}
              />
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

        <Reveal delay={120} className={styles.railWrap}>
          <div className={styles.rail}>
            {SHOTS.map((s) => (
              <div key={s.tag} className={styles.card}>
                <div className={styles.cardImg}>{s.tag}</div>
                <div className={styles.cardShade} />
                <span className={styles.cardNum}>{s.num}</span>
                <div className={styles.cardTag}>{s.tag}</div>
              </div>
            ))}
            <div className={styles.railEnd} aria-hidden="true" />
          </div>
          <div className={styles.railHint}>
            <span className={styles.railHintLine} />
            Scroll for more
          </div>
        </Reveal>
      </div>
    </section>
  );
}
