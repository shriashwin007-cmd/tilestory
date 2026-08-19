import styles from "./AmbientBg.module.css";

// CSS-only ambient backdrop for sections that don't have a generated video
// background -- large, slow-drifting blurred color blobs (pure CSS
// animation, no JS per-frame cost) so every section still feels "alive"
// and not just a flat fill, without needing another Higgsfield generation.
export default function AmbientBg({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div className={`${styles.wrap} ${tone === "light" ? styles.light : ""}`} aria-hidden="true">
      <span className={`${styles.blob} ${styles.blobA}`} />
      <span className={`${styles.blob} ${styles.blobB}`} />
      <span className={`${styles.blob} ${styles.blobC}`} />
    </div>
  );
}
