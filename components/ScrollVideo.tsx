"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollVideo.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAME_COUNT = 151;
const FRAME_PATH = (i: number) =>
  `/scroll-frames/frame-${String(i + 1).padStart(4, "0")}.webp`;

export default function ScrollVideo() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      let cancelled = false;
      let started = false;
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

      const startLoading = () => {
        if (started) return;
        started = true;
        (async () => {
          await loadFrame(0);
          if (cancelled) return;
          setReady(true);
          // Fire the rest in parallel (the browser queues/multiplexes them)
          // instead of round-tripping one at a time.
          await Promise.all(
            Array.from({ length: FRAME_COUNT - 1 }, (_, i) => loadFrame(i + 1))
          );
          if (cancelled) return;
          ScrollTrigger.refresh();
        })();
      };

      // Only start pulling 151 frames once this section is actually close to
      // view, so it doesn't compete with the rest of the page on initial load.
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            startLoading();
            io.disconnect();
          }
        },
        { rootMargin: "800px 0px 800px 0px" }
      );
      io.observe(section);

      return () => {
        cancelled = true;
        io.disconnect();
      };
    },
    { scope: sectionRef }
  );

  useGSAP(
    () => {
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

      const state = { frame: 0 };
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        draw(state.frame);
      };
      resize();
      window.addEventListener("resize", resize);

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const tween = gsap.to(state, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        onUpdate: () => draw(state.frame),
        scrollTrigger: reduced
          ? undefined
          : {
              trigger: section,
              start: "top top",
              end: () => `+=${window.innerHeight * 2.5}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
      });

      return () => {
        window.removeEventListener("resize", resize);
        tween.kill();
      };
    },
    { scope: sectionRef, dependencies: [ready] }
  );

  return (
    <section className={styles.section} ref={sectionRef} id="craft">
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
    </section>
  );
}
