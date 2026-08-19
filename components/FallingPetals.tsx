"use client";

import { useMemo } from "react";
import styles from "./FallingPetals.module.css";

const COLORS = ["#c9a876", "#a3855c", "#b8896f", "#9caf88", "#d9c39e"];
const PETAL_COUNT = 16;

type Petal = {
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  swayDuration: number;
  rotateStart: number;
};

// Tiny drifting tile-chip/petal shapes, site-wide -- purely decorative
// ambience layered over every section (not per-section), so it lives once
// in the root layout rather than inside individual sections. Pure CSS
// keyframe animation (transform only, GPU-composited) so it costs nothing
// per-frame in JS -- the randomized per-petal values are the only thing
// computed in React, once, on mount.
export default function FallingPetals() {
  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: PETAL_COUNT }, (_, i) => ({
      left: Math.random() * 100,
      size: 6 + Math.random() * 8,
      color: COLORS[i % COLORS.length],
      duration: 14 + Math.random() * 12,
      delay: -Math.random() * 24,
      swayDuration: 3 + Math.random() * 3,
      rotateStart: Math.random() * 360,
    }));
  }, []);

  return (
    <div className={styles.wrap} aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className={styles.sway}
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.swayDuration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <span
            className={styles.petal}
            style={{
              width: p.size,
              height: p.size * 1.3,
              background: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              // @ts-expect-error -- CSS custom property, not a known style key
              "--rotate-start": `${p.rotateStart}deg`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
