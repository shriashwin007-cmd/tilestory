"use client";

import { useEffect, useRef, useState } from "react";
import { waLink } from "@/lib/store";
import MagneticButton from "./MagneticButton";
import CountUp from "./CountUp";
import { useRewards } from "./Rewards/RewardsContext";
import styles from "./Hero.module.css";

const FRAME_COUNT = 150;
const FRAME_PATH = (i: number) =>
  `/scroll-frames/frame-${String(i + 1).padStart(4, "0")}.webp`;

// Larger = more scroll distance = a calmer, slower scrub.
const SCROLL_LENGTH_VH = 320;
// Lower = more lag behind the scroll target = smoother, more "eased" motion.
const SMOOTHING = 0.08;
// Fraction of the pinned scroll over which the headline fades/lifts away.
const CONTENT_FADE_RANGE = 0.32;

const CATEGORY_ROW = [
  { num: "01", label: "Flooring" },
  { num: "02", label: "Moroccan" },
  { num: "03", label: "Large Slab" },
  { num: "04", label: "Bathroom" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fadeRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const targetOpacityRef = useRef(1);
  const currentOpacityRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const { addPoints } = useRewards();

  useEffect(() => {
    let cancelled = false;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    imagesRef.current = images;

    const loadFrame = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = FRAME_PATH(i);
        images[i] = img;
      });

    (async () => {
      await loadFrame(0);
      if (cancelled) return;
      setReady(true);
      for (let i = 1; i < FRAME_COUNT; i++) {
        if (cancelled) return;
        await loadFrame(i);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const fadeEl = fadeRef.current;
    if (!canvas || !section || !fadeEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (frame: number) => {
      const img = imagesRef.current[Math.round(frame)];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      draw(currentFrameRef.current);
    };

    // Read real scroll progress fresh every animation frame instead of
    // relying on 'scroll' events + an IntersectionObserver to start/stop the
    // loop — that combo could get stuck (loop never (re)started) around
    // fullscreen transitions or other edge cases, leaving the hero frozen
    // no matter how much the page was actually scrolled.
    //
    // The loop itself never stops (that's what fixed the freeze), but once
    // the frame/opacity have converged to their targets it skips the actual
    // canvas redraw and style writes — otherwise this would burn a full
    // clearRect+drawImage 60x/sec for the entire session, even scrolled deep
    // into the rest of the site, which is what made everything feel laggy.
    let lastDrawnFrame = -1;
    let lastOpacity = -1;

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? -rect.top / total : 0;
      const clamped = Math.min(1, Math.max(0, progress));
      targetFrameRef.current = clamped * (FRAME_COUNT - 1);
      targetOpacityRef.current = 1 - Math.min(1, clamped / CONTENT_FADE_RANGE);

      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += Math.abs(diff) > 0.02 ? diff * SMOOTHING : diff;
      const frameIndex = Math.round(currentFrameRef.current);
      if (frameIndex !== lastDrawnFrame) {
        draw(currentFrameRef.current);
        lastDrawnFrame = frameIndex;
      }

      const diffO = targetOpacityRef.current - currentOpacityRef.current;
      currentOpacityRef.current += Math.abs(diffO) > 0.002 ? diffO * SMOOTHING : diffO;
      const roundedOpacity = Math.round(currentOpacityRef.current * 1000) / 1000;
      if (roundedOpacity !== lastOpacity) {
        fadeEl.style.opacity = String(roundedOpacity);
        fadeEl.style.transform = `translateY(${(1 - roundedOpacity) * -36}px)`;
        fadeEl.style.pointerEvents = roundedOpacity < 0.4 ? "none" : "auto";
        lastOpacity = roundedOpacity;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  return (
    <section
      className={styles.hero}
      ref={sectionRef}
      id="hero"
      style={{ height: `${SCROLL_LENGTH_VH}vh` }}
    >
      <div className={styles.sticky}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.overlay} />
        {!ready && <div className={styles.loader} />}

        <div className={styles.fadeGroup} ref={fadeRef}>
          <div className={styles.content}>
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
