"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { waLink } from "@/lib/store";
import MagneticButton from "../MagneticButton";
import CountUp from "../CountUp";
import TileMosaic from "./TileMosaic";
import heroStyles from "../Hero.module.css";
import styles from "./Hero3D.module.css";

export default function Hero3D() {
  const wrapRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const progress = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      progress.current = p;

      // Fade + parallax the overlay out over the second half of the scroll,
      // so the 3D mosaic gets its own moment before the page continues.
      const ov = overlayRef.current;
      if (ov) {
        const fade = Math.min(Math.max((p - 0.5) / 0.4, 0), 1);
        ov.style.opacity = String(1 - fade);
        ov.style.transform = `translateY(${-p * 40}px)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className={styles.wrap} id="hero" ref={wrapRef}>
      <div className={styles.sticky}>
        <div className={styles.bg} />
        <Canvas
          className={styles.canvas}
          camera={{ position: [0, 0, 9], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <TileMosaic progress={progress} />
          </Suspense>
        </Canvas>

        <div className={styles.overlay} ref={overlayRef}>
          <div className={styles.content}>
            <div className={heroStyles.eyebrow}>
              <span className={heroStyles.eyebrowLine} />
              Nungambakkam, Chennai
              <span className={heroStyles.eyebrowLine} />
            </div>

            <h1 className={heroStyles.title}>
              Where <em>Design</em>
              <br />
              Meets
            </h1>
            <span className={heroStyles.accent}>Craftsmanship</span>

            <p className={heroStyles.sub}>
              Premium designer tiles curated from across the world. Experience
              luxury flooring, Moroccan art, and grand slabs — with same-day
              delivery across Chennai.
            </p>

            <div className={heroStyles.ctas}>
              <MagneticButton as="a" href="#collections" className={heroStyles.btnPrimary}>
                Explore Collection
              </MagneticButton>
              <MagneticButton
                as="a"
                href={waLink("Hi Tile Story! I'd like to know more about your tiles.")}
                target="_blank"
                rel="noopener noreferrer"
                className={heroStyles.btnOutline}
              >
                Chat on WhatsApp
              </MagneticButton>
            </div>

            <div className={heroStyles.stats}>
              <div className={heroStyles.stat}>
                <div className={heroStyles.statValue}>
                  <CountUp end={4.85} decimals={2} /> ★
                </div>
                <div className={heroStyles.statLabel}>Rating</div>
              </div>
              <div className={heroStyles.statDiv} />
              <div className={heroStyles.stat}>
                <div className={heroStyles.statValue}>
                  <CountUp end={30} suffix="+" />
                </div>
                <div className={heroStyles.statLabel}>Collections</div>
              </div>
              <div className={heroStyles.statDiv} />
              <div className={heroStyles.stat}>
                <div className={heroStyles.statValue}>Same-Day</div>
                <div className={heroStyles.statLabel}>Delivery</div>
              </div>
            </div>
          </div>

          <div className={heroStyles.scrollCue}>
            Scroll
            <span className={heroStyles.scrollCueLine} />
          </div>
        </div>
      </div>
    </section>
  );
}
