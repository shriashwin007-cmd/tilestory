"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// Brand tile colors (muted sage + antique sand families, echoing the logo mosaic)
const SAGE = "#6d988d";
const MIST = "#a6c2ba";
const SAND = "#c7a57b";
const CREAM = "#e0cca6";

type Plank = { pos: [number, number]; size: [number, number]; color: string };

const GAP = 0.06;
const PLANKS: Plank[] = [];
const quadrants: { ox: number; oy: number; colors: [string, string]; horizontal: boolean }[] = [
  { ox: -1, oy: 1, colors: [CREAM, SAND], horizontal: true },
  { ox: 1, oy: 1, colors: [MIST, SAGE], horizontal: false },
  { ox: -1, oy: -1, colors: [SAGE, MIST], horizontal: false },
  { ox: 1, oy: -1, colors: [SAND, CREAM], horizontal: true },
];

const HALF = 1.0;
for (const q of quadrants) {
  const cx = q.ox * (HALF + GAP);
  const cy = q.oy * (HALF + GAP);
  for (let i = 0; i < 3; i++) {
    const t = (i - 1) * (2 * HALF) * 0.32;
    const color = q.colors[i % 2];
    if (q.horizontal) {
      PLANKS.push({ pos: [cx, cy + t], size: [2 * HALF, (2 * HALF) * 0.28], color });
    } else {
      PLANKS.push({ pos: [cx + t, cy], size: [(2 * HALF) * 0.28, 2 * HALF], color });
    }
  }
}

export default function TileMosaic() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // Continuous gentle auto-rotation — this sits in a small panel, not a
    // full-screen scroll section, so it idles rather than tracking scroll.
    g.rotation.z = Math.PI / 4;
    g.rotation.y = t * 0.22;
    g.rotation.x = -0.12 + Math.sin(t * 0.3) * 0.08;
    g.position.y = Math.sin(t * 0.5) * 0.08;

    // Subtle per-plank depth breathing
    g.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const phase = i / g.children.length;
      mesh.position.z = Math.sin(t * 0.6 + phase * 4) * 0.06;
    });
  });

  return (
    <>
      <ambientLight intensity={0.75} color="#f3ead9" />
      <directionalLight position={[4, 6, 5]} intensity={1.8} color="#fff3df" castShadow />
      <directionalLight position={[-5, -2, 3]} intensity={0.55} color="#a6c2ba" />
      <pointLight position={[0, 0, 4]} intensity={0.6} color="#e0cca6" />

      <group ref={group}>
        {PLANKS.map((plank, i) => (
          <RoundedBox
            key={i}
            args={[plank.size[0], plank.size[1], 0.32]}
            radius={0.05}
            smoothness={4}
            position={[plank.pos[0], plank.pos[1], 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={plank.color} roughness={0.55} metalness={0.12} />
          </RoundedBox>
        ))}
      </group>

      <ContactShadows
        position={[0, -1.7, 0]}
        opacity={0.4}
        scale={8}
        blur={2.4}
        far={3}
        color="#1a1712"
      />
    </>
  );
}
