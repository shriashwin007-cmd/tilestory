"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ScrollVideo.module.css";

const FRAME_COUNT = 151;
const FRAME_PATH = (i: number) =>
  `/scroll-frames/frame-${String(i + 1).padStart(4, "0")}.webp`;

// Larger = more scroll distance per frame = the scrub feels slower/calmer.
const SCROLL_LENGTH_VH = 350;
// Lower = the drawn frame lags further behind the scroll target = smoother, more "eased" motion.
const SMOOTHING = 0.07;

export default function ScrollVideo() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(false);
  const [ready, setReady] = useState(false);

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
    if (!canvas || !section) return;
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

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress = total > 0 ? -rect.top / total : 0;
      const clamped = Math.min(1, Math.max(0, progress));
      targetFrameRef.current = clamped * (FRAME_COUNT - 1);
    };

    const tick = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.02) {
        currentFrameRef.current += diff * SMOOTHING;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }
      draw(currentFrameRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting;
        if (entry.isIntersecting && rafRef.current === null) {
          rafRef.current = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      },
      { rootMargin: "200px 0px 200px 0px" }
    );
    io.observe(section);

    resize();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      io.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  return (
    <section className={styles.section} ref={sectionRef} id="craft">
      <div className={styles.sticky}>
        <canvas ref={canvasRef} className={styles.canvas} />
        <div className={styles.overlay} />
        <div className={`${styles.caption} ${ready ? styles.captionReady : ""}`}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowLine} />
            Craft in Motion
          </div>
          <h2 className={styles.heading}>
            Every tile, <em>set by hand.</em>
          </h2>
        </div>
        {!ready && <div className={styles.loader} />}
      </div>
    </section>
  );
}
