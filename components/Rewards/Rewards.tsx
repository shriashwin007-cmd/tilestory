"use client";

import { useEffect, useRef, useState } from "react";
import { TIERS, nextTier, tierForPoints } from "@/lib/rewards";
import { waLink } from "@/lib/store";
import Reveal from "../Reveal";
import { useRewards } from "./RewardsContext";
import styles from "./Rewards.module.css";

const EARN_ACTIONS = [
  { label: "Chat with us on WhatsApp", points: 15 },
  { label: "Send us your project details", points: 20 },
  { label: "Search or filter the collection", points: 10 },
  { label: "Open a tile's details", points: 5 },
  { label: "Favorite a tile you love", points: 8 },
  { label: "Explore our craftsmanship story", points: 10 },
  { label: "Read customer reviews", points: 10 },
];

export default function Rewards() {
  const { points, code, addPoints } = useRewards();
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const tier = tierForPoints(points);
  const next = nextTier(points);
  const span = next ? next.min - tier.min : 1;
  const into = next ? points - tier.min : span;
  const progress = next ? Math.min(1, into / span) : 1;

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          addPoints("discovered_rewards", 5, "Discovered Tile Points");
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [addPoints]);

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — the code is still selectable text
    }
  };

  return (
    <section className={styles.section} id="rewards" ref={sectionRef}>
      <div className={styles.inner}>
        <span className="ghost-num on-dark">04</span>
        <Reveal>
          <div className={styles.label}>
            <span className="s-index">04</span>Tile Points
          </div>
          <h2 className={styles.title}>
            Explore More, <em>Save More</em>
          </h2>
          <p className={styles.intro}>
            Browse the site, favorite tiles, and get in touch — every action
            earns Tile Points. Climb the tiers and unlock a real discount
            code to use on your order.
          </p>
        </Reveal>

        <div className={styles.grid}>
          <Reveal className={styles.dashboard} delay={100}>
            <div className={styles.pointsRow}>
              <div>
                <div className={styles.pointsValue}>{points}</div>
                <div className={styles.pointsLabel}>Tile Points</div>
              </div>
              <div className={styles.tierBadge}>
                <span className={styles.tierIcon}>{tier.icon}</span>
                {tier.name}
              </div>
            </div>

            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${progress * 100}%` }} />
            </div>
            <div className={styles.trackLabel}>
              {next
                ? `${next.min - points} points to ${next.name} · ${next.discount}% off`
                : "Maximum tier reached — enjoy your discount!"}
            </div>

            <div className={styles.tierRow}>
              {TIERS.map((t) => (
                <div
                  key={t.name}
                  className={`${styles.tierStep} ${points >= t.min ? styles.tierStepActive : ""}`}
                >
                  <span className={styles.tierStepIcon}>{t.icon}</span>
                  <span className={styles.tierStepName}>{t.name}</span>
                  <span className={styles.tierStepDiscount}>
                    {t.discount > 0 ? `${t.discount}%` : "—"}
                  </span>
                </div>
              ))}
            </div>

            {code ? (
              <div className={styles.codeBox}>
                <div className={styles.codeLabel}>
                  Your {tier.name} code · {tier.discount}% off
                </div>
                <div className={styles.codeRow}>
                  <code className={styles.code}>{code}</code>
                  <button className={styles.copyBtn} onClick={copyCode} type="button">
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <a
                  className={styles.claimBtn}
                  href={waLink(
                    `Hi Tile Story! I'd like to redeem my ${tier.name} reward code ${code} for ${tier.discount}% off my order.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Redeem on WhatsApp
                </a>
              </div>
            ) : (
              <div className={styles.codeBoxEmpty}>
                Reach Bronze (20 points) to unlock your first discount code.
              </div>
            )}
          </Reveal>

          <Reveal className={styles.earnBox} delay={200}>
            <div className={styles.earnTitle}>Ways to Earn Points</div>
            <ul className={styles.earnList}>
              {EARN_ACTIONS.map((a) => (
                <li key={a.label} className={styles.earnItem}>
                  <span className={styles.earnPoints}>+{a.points}</span>
                  {a.label}
                </li>
              ))}
            </ul>
            <div className={styles.earnNote}>
              Points are saved in this browser — no account needed.
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
