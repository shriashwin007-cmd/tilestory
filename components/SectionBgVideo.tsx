"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./SectionBgVideo.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Full-bleed, scroll-scrubbed ambient backdrop for a whole section (as
// opposed to the sharp foreground card videos, which stay static) -- makes
// the section itself feel "alive" while you scroll through it, not just the
// thumbnails inside it. Decorative only, so aria-hidden.
export default function SectionBgVideo({ src }: { src: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const video = videoRef.current;
      if (!wrap || !video) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Same safe-transform convention as DepthObject.tsx -- translate/scale
      // only, no rotate/perspective. That combination is a known Chromium
      // bug inside an overflow:hidden ancestor (rounded clip stops being
      // respected, image bleeds past its own box). Scale never dips to 1.0
      // so the cover-fit video keeps fully covering the section even at the
      // extremes of the vertical drift -- otherwise the parallax would peek
      // past the video's edge and reveal a gap.
      gsap.fromTo(
        video,
        { y: -60, scale: 1.18 },
        {
          y: 60,
          scale: 1.05,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    },
    { scope: wrapRef }
  );

  return (
    <div className={styles.bgWrap} ref={wrapRef} aria-hidden="true">
      <video
        ref={videoRef}
        className={styles.bgVideo}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />
      <div className={styles.bgShade} />
    </div>
  );
}
