"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import TileMosaic from "./TileMosaic";
import styles from "./TilePanel.module.css";

export default function TilePanel() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={wrapRef} className={styles.panel}>
      <Canvas
        className={styles.canvas}
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <TileMosaic />
        </Suspense>
      </Canvas>
      <div className={styles.shade} />
    </div>
  );
}
