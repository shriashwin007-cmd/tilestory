"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Mascot.module.css";

const SECTION_LINES: { id: string; text: string }[] = [
  { id: "about", text: "This is where our story began — real craft, real trust." },
  { id: "gallery", text: "Take a look around — spaces we've helped bring to life." },
  { id: "collections", text: "30+ collections in here. Take your time, I'll wait." },
  { id: "rewards", text: "Psst — you earn real points just by browsing. Try it!" },
  { id: "reviews", text: "Don't just take it from me — hear from our customers." },
  { id: "contact", text: "Ready to visit the showroom? Let's talk." },
];
const DEFAULT_LINE = "Hey! I'm Tilo — need help finding your perfect tile?";

export default function Mascot() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const [line, setLine] = useState(DEFAULT_LINE);
  const [bubbleKey, setBubbleKey] = useState(0);
  const [bounce, setBounce] = useState(false);

  // Active-section speech bubble: whichever observed section has the most
  // visible area wins, so the bubble doesn't flicker between two sections
  // near a boundary.
  useEffect(() => {
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        let bestId: string | null = null;
        let bestRatio = 0.12;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        const next = SECTION_LINES.find((s) => s.id === bestId)?.text ?? DEFAULT_LINE;
        setLine((prev) => {
          if (prev === next) return prev;
          setBubbleKey((k) => k + 1);
          return next;
        });
      },
      { threshold: [0, 0.12, 0.25, 0.5, 0.75, 1] }
    );

    SECTION_LINES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Mouse-proximity tilt (looks toward the cursor when it's nearby) and
  // scroll-direction lean, combined on one element via rAF. Each is on its
  // own rotation axis (mouse -> X/Y, scroll -> Z) so they add up instead of
  // overwriting each other, and this element is the ONLY thing that ever
  // writes its inline transform -- the idle float/breathing/bounce
  // animations all live on separate CSS-only ancestor/descendant elements.
  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mouseRotX = 0;
    let mouseRotY = 0;
    let curMouseRotX = 0;
    let curMouseRotY = 0;

    let scrollTiltTarget = 0;
    let curScrollTilt = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // The mascot is position:fixed, so its center only actually changes on
    // resize -- reading getBoundingClientRect() on every mousemove (a very
    // high-frequency event) would force a layout on every one of them, the
    // same forced-layout pattern already found and fixed several times
    // elsewhere in this project. Measured from .wrap (untouched by the
    // idle-float transform) so it doesn't need to track that bobbing.
    let centerX = 0;
    let centerY = 0;
    const measureCenter = () => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
    };
    measureCenter();

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);
      const radius = 360;
      if (dist > radius) {
        mouseRotY = 0;
        mouseRotX = 0;
        return;
      }
      const proximity = 1 - dist / radius;
      mouseRotY = (dx / radius) * 18 * proximity;
      mouseRotX = -(dy / radius) * 14 * proximity;
    };

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(16, now - lastT);
      const velocity = (y - lastY) / dt; // px/ms
      scrollTiltTarget = Math.max(-10, Math.min(10, velocity * 55));
      lastY = y;
      lastT = now;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        scrollTiltTarget = 0;
      }, 140);
    };

    let raf = 0;
    const loop = () => {
      curMouseRotX += (mouseRotX - curMouseRotX) * 0.12;
      curMouseRotY += (mouseRotY - curMouseRotY) * 0.12;
      curScrollTilt += (scrollTiltTarget - curScrollTilt) * 0.08;

      el.style.transform = `perspective(700px) rotateX(${curMouseRotX.toFixed(2)}deg) rotateY(${curMouseRotY.toFixed(2)}deg) rotateZ(${curScrollTilt.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };

    if (hasFinePointer) window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measureCenter);
    raf = requestAnimationFrame(loop);

    return () => {
      if (hasFinePointer) window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureCenter);
      if (idleTimer) clearTimeout(idleTimer);
      cancelAnimationFrame(raf);
    };
  }, []);

  const triggerBounce = () => {
    setBounce(true);
    window.setTimeout(() => setBounce(false), 650);
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.bubbleWrap}>
        <div key={bubbleKey} className={styles.bubble}>
          {line}
        </div>
      </div>

      <div className={styles.float}>
        <div className={styles.shadow} aria-hidden="true" />
        <div className={`${styles.bounceLayer} ${bounce ? styles.bouncing : ""}`}>
          <div ref={tiltRef} className={styles.tiltLayer}>
            <button
              type="button"
              className={styles.pulseLayer}
              onClick={triggerBounce}
              onMouseEnter={triggerBounce}
              aria-label="Tile Story assistant"
            >
              <img src="/images/mascot.png" alt="" className={styles.img} draggable={false} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
