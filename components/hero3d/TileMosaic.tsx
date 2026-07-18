"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// Brand tile colors (muted sage + antique sand families, echoing the logo mosaic)
const SAGE = "#6d988d";
const MIST = "#a6c2ba";
const SAND = "#c7a57b";
const CREAM = "#e0cca6";

// Each "plank" of the diamond mosaic: position (in the diamond's local, unrotated
// space), size, and color. Four quadrants of parallel planks, colors alternating
// per quadrant like the logo mark.
type Plank = { pos: [number, number]; size: [number, number]; color: string };

const GAP = 0.06;
const PLANKS: Plank[] = [];
// Build a 2x2 quadrant grid; each quadrant has 3 planks running parallel.
// Quadrant colors (checkerboard of the two families):
const quadrants: { ox: number; oy: number; colors: [string, string]; horizontal: boolean }[] = [
  { ox: -1, oy: 1, colors: [CREAM, SAND], horizontal: true }, // top-left
  { ox: 1, oy: 1, colors: [MIST, SAGE], horizontal: false }, // top-right
  { ox: -1, oy: -1, colors: [SAGE, MIST], horizontal: false }, // bottom-left
  { ox: 1, oy: -1, colors: [SAND, CREAM], horizontal: true }, // bottom-right
];

const HALF = 1.0; // quadrant half-size
for (const q of quadrants) {
  const cx = q.ox * (HALF + GAP);
  const cy = q.oy * (HALF + GAP);
  for (let i = 0; i < 3; i++) {
    const t = (i - 1) * (2 * HALF) * 0.32; // offset within quadrant
    const color = q.colors[i % 2];
    if (q.horizontal) {
      PLANKS.push({ pos: [cx, cy + t], size: [2 * HALF, (2 * HALF) * 0.28], color });
    } else {
      PLANKS.push({ pos: [cx + t, cy], size: [(2 * HALF) * 0.28, 2 * HALF], color });
    }
  }
}

export default function TileMosaic({
  progress,
}: {
  progress: RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const lerped = useRef(0);

  useFrame((state) => {
    // Smooth (lerped) scroll value for a weighted feel
    lerped.current = THREE.MathUtils.lerp(lerped.current, progress.current ?? 0, 0.08);
    const p = lerped.current;
    const g = group.current;
    if (!g) return;

    const t = state.clock.elapsedTime;
    // Base diamond orientation (45deg) + gentle idle sway + scroll-driven rotation
    g.rotation.z = Math.PI / 4;
    g.rotation.y = p * Math.PI * 1.1 + Math.sin(t * 0.3) * 0.12;
    g.rotation.x = -0.15 + p * 0.5 + Math.cos(t * 0.25) * 0.06;

    // Per-plank depth "assembly": planks lift toward the camera as you scroll
    g.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const phase = i / g.children.length;
      const targetZ = p * (0.35 + phase * 0.5);
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, targetZ, 0.1);
    });

    // Subtle float
    g.position.y = Math.sin(t * 0.5) * 0.06;
  });

  return (
    <>
      <ambientLight intensity={0.7} color="#f3ead9" />
      <directionalLight position={[4, 6, 5]} intensity={1.7} color="#fff3df" castShadow />
      <directionalLight position={[-5, -2, 3]} intensity={0.5} color="#a6c2ba" />
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
            <meshStandardMaterial
              color={plank.color}
              roughness={0.55}
              metalness={0.12}
            />
          </RoundedBox>
        ))}
      </group>

      <ContactShadows
        position={[0, -2.6, 0]}
        opacity={0.35}
        scale={12}
        blur={2.6}
        far={4}
        color="#1a1712"
      />
    </>
  );
}
