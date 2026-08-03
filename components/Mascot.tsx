"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { TiltTarget } from "./Mascot3D";
import styles from "./Mascot.module.css";

// Mascot renders in the root layout on every single page, so its JS is
// always on the critical path -- three.js is a large library, and loading
// it eagerly would add real weight to first paint sitewide for a small
// decorative widget. Loaded async instead (no SSR, since it's WebGL/canvas
// anyway); the CSS float/shadow/bounce layers already show up immediately,
// the 3D card itself just pops in a beat later.
const Mascot3D = dynamic(() => import("./Mascot3D"), { ssr: false });

const SECTION_LINES: {
  id: string;
  text: string;
  pos: { x: number; y: number };
  mobilePos: { x: number; y: number };
}[] = [
  { id: "about", text: "This is where our story began — real craft, real trust.", pos: { x: 10, y: 80 }, mobilePos: { x: 22, y: 76 } },
  { id: "gallery", text: "Take a look around — spaces we've helped bring to life.", pos: { x: 90, y: 78 }, mobilePos: { x: 78, y: 72 } },
  { id: "collections", text: "30+ collections in here. Take your time, I'll wait.", pos: { x: 90, y: 24 }, mobilePos: { x: 80, y: 22 } },
  { id: "rewards", text: "Psst — you earn real points just by browsing. Try it!", pos: { x: 10, y: 80 }, mobilePos: { x: 22, y: 76 } },
  { id: "reviews", text: "Don't just take it from me — hear from our customers.", pos: { x: 90, y: 78 }, mobilePos: { x: 78, y: 72 } },
  { id: "contact", text: "Ready to visit the showroom? Let's talk.", pos: { x: 10, y: 82 }, mobilePos: { x: 22, y: 68 } },
];
const DEFAULT_LINE = "Hey! I'm Tilo — need help finding your perfect tile?";
// Shown on tap/click instead of the scroll-tied section line -- a direct
// interaction deserves a direct reaction, not just passive commentary.
const TAP_TIPS = [
  "Tap the filter chips to narrow things down — try 'Textured' for outdoor spaces.",
  "Every scroll and search earns real Tile Points. Check the Rewards section!",
  "Marble, Moroccan, or matte — I don't play favorites. I love them all.",
  "Same-day delivery across Chennai. Just WhatsApp me the details.",
  "Psst — favoriting a tile earns you points too.",
  "Go on, keep tapping. I've got nowhere to be.",
];
const DEFAULT_POS = { x: 92, y: 86 };
// Kept clear of MobileHome's fixed bottom Call/WhatsApp tab bar (~80-90px).
const MOBILE_DEFAULT_POS = { x: 50, y: 78 };
const WALK_MS = 1400;

export default function Mascot() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [line, setLine] = useState(DEFAULT_LINE);
  const [bubbleKey, setBubbleKey] = useState(0);
  const [bounce, setBounce] = useState(false);
  const [pos, setPos] = useState(DEFAULT_POS);
  const [walking, setWalking] = useState(false);
  const remeasureRef = useRef<() => void>(() => {});
  const walkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasPositionedRef = useRef(false);
  // Read every frame by the Three.js scene in Mascot3D -- a plain mutable
  // ref rather than React state, since it updates continuously (mousemove,
  // scroll, idle turn) and none of that needs a re-render.
  const tiltTarget = useRef<TiltTarget>({ x: 0, y: 0, facing: 1 });

  // Active-section tracking drives BOTH the speech bubble text and where
  // Tilo actually stands -- whichever observed section has the most visible
  // area wins (avoids flicker at boundaries), and each section maps to a
  // waypoint on screen so he "walks over" to a new spot as you scroll,
  // landing right as the bubble text changes. Roams on mobile too now (a
  // tighter, tab-bar-aware set of waypoints), not just desktop.
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 700px)").matches;

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
        const section = SECTION_LINES.find((s) => s.id === bestId);
        const next = section?.text ?? DEFAULT_LINE;
        setLine((prev) => {
          if (prev === next) return prev;
          setBubbleKey((k) => k + 1);
          return next;
        });

        const fallback = isDesktop ? DEFAULT_POS : MOBILE_DEFAULT_POS;
        const nextPos = section ? (isDesktop ? section.pos : section.mobilePos) : fallback;

        // The very first position resolution (SSR-safe DEFAULT_POS ->
        // wherever it actually belongs on this device/scroll position)
        // isn't a "walk" -- it's just correcting for not knowing the
        // viewport at render time. With the transition now applying on
        // every screen size, animating that correction would look like an
        // unwanted slide-in from the desktop corner on every mobile page
        // load. Snap it instantly, then let every real walk after that
        // animate normally.
        if (!hasPositionedRef.current) {
          hasPositionedRef.current = true;
          if (wrapRef.current) wrapRef.current.style.transition = "none";
          setPos(nextPos);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (wrapRef.current) wrapRef.current.style.transition = "";
            });
          });
          return;
        }

        setPos((prev) => {
          if (prev.x === nextPos.x && prev.y === nextPos.y) return prev;
          tiltTarget.current.facing = nextPos.x < prev.x ? -1 : 1;
          setWalking(true);
          if (walkTimerRef.current) clearTimeout(walkTimerRef.current);
          walkTimerRef.current = setTimeout(() => {
            setWalking(false);
            remeasureRef.current();
          }, WALK_MS + 60);
          return nextPos;
        });
      },
      { threshold: [0, 0.12, 0.25, 0.5, 0.75, 1] }
    );

    SECTION_LINES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (walkTimerRef.current) clearTimeout(walkTimerRef.current);
    };
  }, []);

  // Mouse-proximity turn (turns toward the cursor when it's nearby) and
  // scroll-direction lean, written straight into tiltTarget for Mascot3D's
  // Three.js scene to read and smooth itself every render frame -- no DOM
  // style writes here at all now that the turning happens in WebGL.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let scrollTiltTarget = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // position:fixed, so its center only changes on resize or when it walks
    // to a new waypoint -- reading getBoundingClientRect() on every
    // mousemove (a very high-frequency event) would force a layout on every
    // one of them, the same forced-layout pattern already found and fixed
    // several times elsewhere in this project. Measured on demand instead.
    const measureCenter = () => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
    };
    let centerX = 0;
    let centerY = 0;
    measureCenter();
    remeasureRef.current = measureCenter;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);
      const radius = 360;
      if (dist > radius) {
        tiltTarget.current.y = scrollTiltTarget;
        tiltTarget.current.x = 0;
        return;
      }
      // Straight linear falloff to the edge of the radius -- no extra
      // proximity multiplier here (an earlier version multiplied by BOTH
      // dx/radius and a separate 1-dist/radius proximity term, which fight
      // each other and made the turn barely perceptible at any distance).
      const normX = Math.max(-1, Math.min(1, dx / radius));
      const normY = Math.max(-1, Math.min(1, dy / radius));
      tiltTarget.current.y = normX * 0.5 + scrollTiltTarget;
      tiltTarget.current.x = -normY * 0.35;
    };

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(16, now - lastT);
      const velocity = (y - lastY) / dt; // px/ms
      scrollTiltTarget = Math.max(-0.22, Math.min(0.22, velocity * 1.1));
      lastY = y;
      lastT = now;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        scrollTiltTarget = 0;
      }, 140);
    };

    if (hasFinePointer) window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measureCenter);

    return () => {
      if (hasFinePointer) window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureCenter);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  const tapTipIndex = useRef(0);

  const triggerBounce = () => {
    setBounce(true);
    window.setTimeout(() => setBounce(false), 650);
  };

  // A real interaction, not just decoration: tapping/clicking Tilo (or the
  // bubble itself) bounces him AND swaps in a tip -- cycled in order so
  // repeated taps don't repeat the same line, distinct from the passive
  // scroll-tied section commentary (which will naturally take back over on
  // the next section change).
  const handleTap = () => {
    triggerBounce();
    tapTipIndex.current = (tapTipIndex.current + 1) % TAP_TIPS.length;
    setLine(TAP_TIPS[tapTipIndex.current]);
    setBubbleKey((k) => k + 1);
  };

  return (
    <div
      className={styles.wrap}
      ref={wrapRef}
      style={{ transform: `translate3d(${pos.x}vw, ${pos.y}vh, 0) translate(-50%, -50%)` }}
    >
      <button type="button" className={styles.bubbleWrap} onClick={handleTap} aria-label="Show a tip">
        <div key={bubbleKey} className={styles.bubble}>
          {line}
        </div>
      </button>

      <div className={`${styles.float} ${walking ? styles.walking : ""}`}>
        <div className={styles.shadow} aria-hidden="true" />
        <div className={`${styles.bounceLayer} ${bounce ? styles.bouncing : ""}`}>
          <button
            type="button"
            className={styles.pulseLayer}
            onClick={handleTap}
            onMouseEnter={triggerBounce}
            aria-label="Tile Story assistant"
          >
            <Mascot3D targetRef={tiltTarget} />
          </button>
        </div>
      </div>
    </div>
  );
}
