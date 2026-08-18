"use client";

import { useEffect, useRef } from "react";

// React's `muted` JSX attribute doesn't reliably set the underlying DOM
// property before the browser's autoplay-policy check runs in every
// engine -- when that race is lost, autoplay is silently blocked and the
// video sits on its first frame with a native play button, instead of
// looping. Setting `.muted` and calling `.play()` imperatively closes
// that race.
export default function LoopVideo({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    />
  );
}
