"use client";

import { useEffect, useState } from "react";
import styles from "./ScrollProgress.module.css";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // document.documentElement.scrollHeight forces a synchronous layout —
    // reading it on every native "scroll" event (which fires continuously
    // while Lenis smooth-scrolls, i.e. ~every frame) meant this component
    // alone was triggering a full-page layout recalculation 60x/sec while
    // scrolling. The page height only actually changes on resize/content
    // shifts, so it's cached and only the cheap scrollTop read happens per
    // scroll event.
    let height = 0;
    const measure = () => {
      height = document.documentElement.scrollHeight - window.innerHeight;
    };
    const onScroll = () => {
      setProgress(height > 0 ? (window.scrollY / height) * 100 : 0);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className={styles.track}>
      <div className={styles.bar} style={{ width: `${progress}%` }} />
    </div>
  );
}
