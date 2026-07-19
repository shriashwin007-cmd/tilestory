"use client";

import dynamic from "next/dynamic";
import styles from "./TilePanel.module.css";
import spin from "./Spinner.module.css";

function PanelSpinner() {
  return (
    <div className={styles.panel}>
      <div className={spin.center}>
        <span className={spin.ring} />
      </div>
    </div>
  );
}

// Isolate the R3F Canvas in a client-only dynamic import to avoid SSR
// "Canvas not found" / WebGL-on-server issues.
const TilePanel = dynamic(() => import("./TilePanel"), {
  ssr: false,
  loading: () => <PanelSpinner />,
});

export default function TilePanelLoader() {
  return <TilePanel />;
}
