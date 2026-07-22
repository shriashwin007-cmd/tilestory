"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DepthObject({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const img = imgRef.current;
      if (!wrap || !img) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // Subtle, editorial depth drift rather than the dramatic tumble of a
      // typical scroll-scrub demo — small enough to read as atmosphere, not
      // a gimmick.
      gsap.fromTo(
        img,
        { y: -36, rotateX: 7, rotateZ: -2.5, scale: 0.96 },
        {
          y: 36,
          rotateX: -5,
          rotateZ: 2.5,
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
    <div ref={wrapRef} className={className} style={{ perspective: "1200px", overflow: "hidden" }}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover", transformStyle: "preserve-3d", willChange: "transform" }}
      />
    </div>
  );
}
