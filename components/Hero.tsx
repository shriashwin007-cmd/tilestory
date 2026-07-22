"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { waLink } from "@/lib/store";
import MagneticButton from "./MagneticButton";
import CountUp from "./CountUp";
import KineticText from "./KineticText";
import { useRewards } from "./Rewards/RewardsContext";
import styles from "./Hero.module.css";

const CATEGORY_ROW = [
  { num: "01", label: "Flooring" },
  { num: "02", label: "Moroccan" },
  { num: "03", label: "Large Slab" },
  { num: "04", label: "Bathroom" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardLeftRef = useRef<HTMLDivElement | null>(null);
  const cardRightRef = useRef<HTMLDivElement | null>(null);
  const tileRef = useRef<HTMLDivElement | null>(null);
  const { addPoints } = useRewards();

  // Gentle parallax drift on the headline as you scroll past the hero
  // (a normal single-viewport section now, not a pinned scroll-scrub).
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  // Mouse-driven parallax on the floating cards + tile — depth cue that
  // makes them read as objects sitting in space rather than flat pasted-on
  // rectangles. Each target gets its own lerped position (smoothed toward
  // the cursor rather than snapping) and its own strength, so the tile
  // (closer/bigger) drifts further than the two edge cards. Kept on a
  // separate transform-only element from the CSS idle-float animation
  // (see .heroCard/.heroTile in the CSS) so the two never fight over the
  // same inline `transform`.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const targets = [
      { el: cardLeftRef.current, strength: 14 },
      { el: cardRightRef.current, strength: 14 },
      { el: tileRef.current, strength: 26 },
    ].filter((t): t is { el: HTMLDivElement; strength: number } => !!t.el);
    if (!targets.length) return;

    let mouseX = 0;
    let mouseY = 0;
    const current = targets.map(() => ({ x: 0, y: 0 }));
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };

    const loop = () => {
      targets.forEach((t, i) => {
        const c = current[i];
        c.x += (mouseX * t.strength - c.x) * 0.06;
        c.y += (mouseY * t.strength - c.y) * 0.06;
        t.el.style.transform = `translate(${c.x.toFixed(2)}px, ${c.y.toFixed(2)}px)`;
      });
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className={styles.hero} ref={sectionRef} id="hero">
      <div className={styles.sticky}>
        <div className={styles.bg} />
        <div className={styles.overlay} />

        <svg className={styles.orbitLine} viewBox="0 0 800 800" aria-hidden="true">
          <ellipse cx="400" cy="400" rx="380" ry="300" />
        </svg>

        <div
          className={`${styles.parallaxItem} ${styles.heroCardWrap} ${styles.heroCardWrapLeft}`}
          ref={cardLeftRef}
          aria-hidden="true"
        >
          <div className={`${styles.heroCard} ${styles.heroCardLeft}`}>
            <img src="/images/hero-card-left.webp" alt="" />
          </div>
        </div>
        <div
          className={`${styles.parallaxItem} ${styles.heroCardWrap} ${styles.heroCardWrapRight}`}
          ref={cardRightRef}
          aria-hidden="true"
        >
          <div className={`${styles.heroCard} ${styles.heroCardRight}`}>
            <img src="/images/hero-card-right.webp" alt="" />
          </div>
        </div>

        <div className={styles.fadeGroup}>
          <div className={`${styles.parallaxItem} ${styles.heroTileWrap}`} ref={tileRef} aria-hidden="true">
            <div className={styles.heroTile}>
              <img src="/images/hero-tile.webp" alt="" className={styles.heroTileImg} />
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              Nungambakkam, Chennai
            </div>

            <motion.div className={styles.titleWrap} style={{ y: titleY, scale: titleScale }}>
              <KineticText
                as="h1"
                className={styles.title}
                inView={false}
                segments={[{ text: "Where " }, { text: "Design", em: true }, { text: "\nMeets" }]}
              />
            </motion.div>
            <span className={styles.accent}>Craftsmanship</span>

            <p className={styles.subtitle}>
              Great tiles should feel effortless — from flooring to facades,
              curated collections with same-day delivery across Chennai.
            </p>

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
                onClick={() => addPoints("whatsapp_click", 15, "Chatted on WhatsApp")}
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

          <div className={styles.categoryRow}>
            {CATEGORY_ROW.map((c) => (
              <a key={c.num} href="#collections" className={styles.categoryItem}>
                <span className={styles.categoryNum}>#{c.num}</span>
                <span className={styles.categoryLabel}>{c.label}</span>
              </a>
            ))}
          </div>

          <div className={styles.scrollHint} aria-hidden="true">
            <span className={styles.scrollHintDot} />
            Scroll
          </div>
        </div>
      </div>
    </section>
  );
}
