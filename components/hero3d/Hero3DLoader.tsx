"use client";

import dynamic from "next/dynamic";
import styles from "./Hero3D.module.css";
import spin from "./Spinner.module.css";

function PremiumSpinner() {
  return (
    <section className={styles.wrap} id="hero">
      <div className={styles.sticky}>
        <div className={styles.bg} />
        <div className={spin.center}>
          <span className={spin.ring} />
          <span className={spin.label}>Tile Story</span>
        </div>
      </div>
    </section>
  );
}

// Isolate the R3F Canvas in a client-only dynamic import to avoid SSR
// "Canvas not found" / WebGL-on-server issues.
const Hero3D = dynamic(() => import("./Hero3D"), {
  ssr: false,
  loading: () => <PremiumSpinner />,
});

export default function Hero3DLoader() {
  return <Hero3D />;
}
