"use client";

import { useState } from "react";
import { TIERS, nextTier, tierForPoints } from "@/lib/rewards";
import { waLink } from "@/lib/store";
import { useRewards } from "../Rewards/RewardsContext";
import styles from "./MobileRewards.module.css";

export default function MobileRewards() {
  const { points, code } = useRewards();
  const [copied, setCopied] = useState(false);

  const tier = tierForPoints(points);
  const next = nextTier(points);
  const span = next ? next.min - tier.min : 1;
  const into = next ? points - tier.min : span;
  const progress = next ? Math.min(1, into / span) : 1;

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <section className={styles.section} id="rewards">
      <span className={styles.label}>Tile Points</span>
      <h2 className={styles.title}>Explore More, Save More</h2>

      <div className={styles.card}>
        <div className={styles.pointsRow}>
          <div>
            <div className={styles.pointsValue}>{points}</div>
            <div className={styles.pointsLabel}>Tile Points</div>
          </div>
          <div className={styles.tierBadge}>
            {tier.icon} {tier.name}
          </div>
        </div>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${progress * 100}%` }} />
        </div>
        <div className={styles.trackLabel}>
          {next ? `${next.min - points} points to ${next.name} · ${next.discount}% off` : "Maximum tier reached!"}
        </div>

        <div className={styles.tierScroll}>
          {TIERS.map((t) => (
            <div key={t.name} className={`${styles.tierStep} ${points >= t.min ? styles.tierStepActive : ""}`}>
              <span>{t.icon}</span>
              <span className={styles.tierStepName}>{t.name}</span>
            </div>
          ))}
        </div>

        {code ? (
          <div className={styles.codeBox}>
            <div className={styles.codeLabel}>Your {tier.name} code · {tier.discount}% off</div>
            <div className={styles.codeRow}>
              <code className={styles.code}>{code}</code>
              <button type="button" className={styles.copyBtn} onClick={copyCode}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <a
              className={styles.redeemBtn}
              href={waLink(`Hi Tile Story! I'd like to redeem my ${tier.name} reward code ${code} for ${tier.discount}% off my order.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Redeem on WhatsApp
            </a>
          </div>
        ) : (
          <div className={styles.codeEmpty}>Reach Bronze (20 points) to unlock your first discount code.</div>
        )}
      </div>
    </section>
  );
}
