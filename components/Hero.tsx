"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { waLink } from "@/lib/store";
import MagneticButton from "./MagneticButton";
import CountUp from "./CountUp";
import KineticText from "./KineticText";
import { useRewards } from "./Rewards/RewardsContext";
import styles from "./Hero.module.css";

const FRAME_COUNT = 150;
const FRAME_PATH = (i: number) =>
  `/scroll-frames/frame-${String(i + 1).padStart(4, "0")}.webp`;

// Larger = more scroll distance = a calmer, slower scrub. (448 = 320 * 1.4)
const SCROLL_LENGTH_VH = 448;
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

// Right-side captions that each reveal then disappear at their own point in
// the scroll, one after another, filling the rest of the scrub after the
// headline has faded away — timed to finish right as the video ends.
const STORY_BEATS = [
  { tag: "01", title: "Flooring", desc: "Wood-look porcelain to polished marble, for every room." },
  { tag: "02", title: "Moroccan", desc: "Handcrafted encaustic patterns, laid one tile at a time." },
  { tag: "03", title: "Large Slab", desc: "Book-matched marble in dramatic, seamless format." },
  { tag: "04", title: "Bathroom", desc: "Spa-grade finishes for statement walls and floors." },
];

function beatWindow(index: number, count: number, rangeStart: number) {
  const span = (1 - rangeStart) / count;
  const gap = span * 0.12;
  const start = rangeStart + index * span;
  return { start, end: start + span - gap };
}

// Trapezoid: fades in over the first slice of the window, holds, fades out
// over the last slice — 0 outside the window entirely.
function beatOpacity(progress: number, start: number, end: number) {
  if (progress <= start || progress >= end) return 0;
  const span = end - start;
  const fadeIn = start + span * 0.25;
  const fadeOut = end - span * 0.25;
  if (progress < fadeIn) return (progress - start) / (fadeIn - start);
  if (progress > fadeOut) return 1 - (progress - fadeOut) / (end - fadeOut);
  return 1;
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fadeRef = useRef<HTMLDivElement | null>(null);
  const storyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(ImageBitmap | null)[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const targetOpacityRef = useRef(1);
  const currentOpacityRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const { addPoints } = useRewards();

  // Parallax drift on the headline itself, independent of the fadeGroup's
  // own opacity/lift (that's handled imperatively in the rAF loop below).
  // The scale/translate here composes on top of the parent's transform
  // rather than fighting it, since they're on different DOM nodes.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  useEffect(() => {
    let cancelled = false;
    const images: (ImageBitmap | null)[] = new Array(FRAME_COUNT).fill(null);
    imagesRef.current = images;

    // createImageBitmap decodes off the main thread and hands back a bitmap
    // the compositor can use directly — plain Image()+decode() still paid a
    // real decode/resample cost on drawImage (measured ~0.6-2s spread across
    // a scroll pass, i.e. actual jank), because that path decodes for
    // *display*, not specifically for canvas compositing.
    const loadFrame = async (i: number) => {
      try {
        const res = await fetch(FRAME_PATH(i));
        const blob = await res.blob();
        if (cancelled) return;
        images[i] = await createImageBitmap(blob);
      } catch {
        // frame just won't be drawable — draw() already guards on null.
      }
    };

    // Loading the remaining 149 frames one at a time (await in a loop) kept
    // a network request continuously in flight for ~30s total — which not
    // only delayed the frames themselves, it starved every other request on
    // the page (fonts, Catalog product images, etc.) of connection slots
    // for that whole window. A handful of parallel workers pulling from a
    // shared queue finishes in a fraction of the time and shares bandwidth
    // properly with the rest of the page.
    const CONCURRENCY = 6;
    (async () => {
      await loadFrame(0);
      if (cancelled) return;
      setReady(true);

      let next = 1;
      const worker = async () => {
        while (next < FRAME_COUNT) {
          const i = next++;
          if (cancelled) return;
          await loadFrame(i);
        }
      };
      await Promise.all(Array.from({ length: CONCURRENCY }, worker));
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
      const bitmap = imagesRef.current[Math.round(frame)];
      if (!bitmap) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = bitmap.width;
      const ih = bitmap.height;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(bitmap, dx, dy, dw, dh);
    };

    const resize = () => {
      // Capped lower than the usual 2x: at 448vh of scroll this canvas is
      // redrawn continuously while scrolling, and rendering it at full
      // retina resolution measurably added to scroll jank for a background
      // element that's already softened by a gradient overlay.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
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
    const lastBeatOpacity = STORY_BEATS.map(() => -1);
    const beatWindows = STORY_BEATS.map((_, i) => beatWindow(i, STORY_BEATS.length, CONTENT_FADE_RANGE));

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

      // Directly track the (already-smooth) trapezoid target with no extra
      // lerp — the beatOpacity() curve itself changes gradually with scroll,
      // so adding lag on top just made adjacent beats overlap and blend into
      // illegible double-exposed text during the crossfade.
      STORY_BEATS.forEach((_, i) => {
        const { start, end } = beatWindows[i];
        const roundedB = Math.round(beatOpacity(clamped, start, end) * 1000) / 1000;
        if (roundedB !== lastBeatOpacity[i]) {
          const el = storyRefs.current[i];
          if (el) {
            el.style.opacity = String(roundedB);
            el.style.transform = `translateY(${(1 - roundedB) * 22}px)`;
          }
          lastBeatOpacity[i] = roundedB;
        }
      });

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

        <div className={styles.storyBeats} aria-hidden="true">
          {STORY_BEATS.map((beat, i) => (
            <div
              key={beat.tag}
              ref={(el) => {
                storyRefs.current[i] = el;
              }}
              className={styles.storyBeat}
              style={{ opacity: 0 }}
            >
              <span className={styles.storyTag}>{beat.tag}</span>
              <h3 className={styles.storyTitle}>{beat.title}</h3>
              <p className={styles.storyDesc}>{beat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
