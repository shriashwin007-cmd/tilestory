import { STORE, waLink } from "@/lib/store";
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
      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowLine} />
          Nungambakkam, Chennai
          <span className={styles.eyebrowLine} />
        </div>

        <h1 className={styles.title}>
          Where <em>Design</em>
          <br />
          Meets
        </h1>
        <span className={styles.accent}>Craftsmanship</span>

        <p className={styles.sub}>
          Premium designer tiles curated from across the world. Experience
          luxury flooring, Moroccan art, and grand slabs — with same-day
          delivery across Chennai.
        </p>

        <div className={styles.ctas}>
          <a href="#collections" className={styles.btnPrimary}>
            Explore Collection
          </a>
          <a
            href={waLink("Hi Tile Story! I'd like to know more about your tiles.")}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnOutline}
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{STORE.rating} ★</div>
            <div className={styles.statLabel}>Rating</div>
          </div>
          <div className={styles.statDiv} />
          <div className={styles.stat}>
            <div className={styles.statValue}>30+</div>
            <div className={styles.statLabel}>Collections</div>
          </div>
          <div className={styles.statDiv} />
          <div className={styles.stat}>
            <div className={styles.statValue}>Same-Day</div>
            <div className={styles.statLabel}>Delivery</div>
          </div>
        </div>
      </div>
    </section>
  );
}
