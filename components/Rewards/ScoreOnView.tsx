"use client";

import { useEffect } from "react";
import { useRewards } from "./RewardsContext";

// Drop this into any server-rendered section to award points the first
// time it scrolls into view, without converting the whole section to a
// client component.
export default function ScoreOnView({
  sectionId,
  pointsKey,
  points,
  label,
}: {
  sectionId: string;
  pointsKey: string;
  points: number;
  label: string;
}) {
  const { addPoints } = useRewards();

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          addPoints(pointsKey, points, label);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sectionId, pointsKey, points, label, addPoints]);

  return null;
}
