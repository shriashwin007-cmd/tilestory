"use client";

import { useRewards } from "./RewardsContext";
import styles from "./PointToasts.module.css";

export default function PointToasts() {
  const { toasts } = useRewards();

  return (
    <div className={styles.wrap} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={styles.toast}>
          <span className={styles.badge}>+{t.points}</span>
          <span className={styles.label}>{t.label}</span>
        </div>
      ))}
    </div>
  );
}
