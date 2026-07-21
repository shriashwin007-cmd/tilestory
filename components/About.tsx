import { STORE } from "@/lib/store";
import Reveal from "./Reveal";
import ScoreOnView from "./Rewards/ScoreOnView";
import KineticText from "./KineticText";
import styles from "./About.module.css";

const TAGS = ["Flooring", "Bathroom", "Moroccan", "Large Slab", "Imported", "Elevation"];

export default function About() {
  return (
    <section className={styles.about} id="about">
      <ScoreOnView
        sectionId="about"
        pointsKey="explored_story"
        points={10}
        label="Explored Our Story"
      />
      <div className={styles.inner}>
        <Reveal className={styles.imgWrap}>
          <div className={styles.imgBox}>Showroom Photo</div>
          <div className={styles.delBadge}>
            <div className={styles.delIcon}>🚚</div>
            <div className={styles.delTxt}>Same-Day Delivery</div>
          </div>
          <div className={styles.badge}>
            <div className={styles.badgeStars}>★★★★★</div>
            <div className={styles.badgeNum}>{STORE.rating}</div>
            <div className={styles.badgeTxt}>Google Rating</div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="s-label">
            <span className="s-index">01</span>Our Story
          </div>
          <KineticText
            as="h2"
            className="s-title"
            segments={[{ text: "A Showroom Built on " }, { text: "Craft & Trust", em: true }]}
          />
          <p className={styles.desc}>
            Tile Story is Chennai&apos;s destination for premium designer
            tiles — from handcrafted Moroccan patterns to grand imported
            marble slabs. Every collection is hand-picked for homes and
            projects that demand more than the ordinary, backed by expert
            guidance and same-day delivery across the city.
          </p>

          <div className={styles.tags}>
            {TAGS.map((t) => (
              <span key={t} className={styles.tag}>
                {t}
              </span>
            ))}
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.infoRow}>
              <span className={styles.infoIc}>📍</span>
              <span>{STORE.address}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoIc}>🕒</span>
              <span>{STORE.hours}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoIc}>📞</span>
              <span>{STORE.phoneDisplay}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
