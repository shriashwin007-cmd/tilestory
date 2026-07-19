import { waLink } from "@/lib/store";
import MagneticButton from "./MagneticButton";
import CountUp from "./CountUp";
import TileDiamond from "./TileDiamond";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.videoWrap}>
        <video autoPlay muted loop playsInline preload="auto">
          <source src="/video/hero_bg.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={styles.overlay} />

      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            Nungambakkam, Chennai
          </div>

          <h1 className={styles.title}>
            Where <em>Design</em>
            <br />
            Meets
          </h1>
          <span className={styles.accent}>Craftsmanship</span>

          <div className={styles.ctas}>
            <MagneticButton as="a" href="#collections" className={styles.btnPrimary}>
              Explore Collection
            </MagneticButton>
            <MagneticButton
              as="a"
              href={waLink("Hi Tile Story! I'd like to know more about your tiles.")}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnOutline}
            >
              Chat on WhatsApp
            </MagneticButton>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statValue}>
                <CountUp end={4.85} decimals={2} /> ★
              </div>
              <div className={styles.statLabel}>Rating</div>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <div className={styles.statValue}>
                <CountUp end={30} suffix="+" />
              </div>
              <div className={styles.statLabel}>Collections</div>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <div className={styles.statValue}>Same-Day</div>
              <div className={styles.statLabel}>Delivery</div>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <p className={styles.tagline}>
            Great tiles should
            <br />
            feel effortless.
          </p>
          <p className={styles.taglineSub}>
            From flooring to facades, we curate collections that connect and
            last — with same-day delivery across Chennai.
          </p>

          <TileDiamond />
        </div>
      </div>

      <div className={styles.categoryRow}>
        {CATEGORY_ROW.map((c) => (
          <a key={c.num} href="#collections" className={styles.categoryItem}>
            <span className={styles.categoryNum}>#{c.num}</span>
            <span className={styles.categoryLabel}>{c.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

const CATEGORY_ROW = [
  { num: "01", label: "Flooring" },
  { num: "02", label: "Moroccan" },
  { num: "03", label: "Large Slab" },
  { num: "04", label: "Bathroom" },
];
