"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ScrollTrigger caches each trigger's pixel position and only recalculates on
 * an explicit refresh() or window resize. Lazy-loaded images, uploaded product
 * photos, and web fonts swapping in all change the document's height *after*
 * triggers were first measured, silently invalidating those positions — the
 * symptom is content that never reveals because the trigger point it's
 * waiting for no longer lines up with where that element actually is.
 */
export default function ScrollTriggerRefresher() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    window.addEventListener("load", refresh);

    let timeout: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(() => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(refresh, 120);
    });
    ro.observe(document.body);

    return () => {
      window.removeEventListener("load", refresh);
      if (timeout) clearTimeout(timeout);
      ro.disconnect();
    };
  }, []);

  return null;
}
