"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export type TiltTarget = { x: number; y: number; facing: 1 | -1 };

const WORLD_HEIGHT = 2.3;

// Orthographic zoom is world-units-per-pixel -- a fixed zoom tuned for the
// desktop canvas (168px) showed a heavily cropped slice of the plane on
// mobile's smaller canvas (96px), which combined with rotation looked like
// a mangled close-up rather than the whole character. Computed from the
// canvas's actual pixel size instead, so it fits correctly at any size.
function FitCamera() {
  const { size, camera } = useThree();
  useEffect(() => {
    const ortho = camera as THREE.OrthographicCamera;
    ortho.zoom = (size.height * 0.94) / WORLD_HEIGHT;
    ortho.updateProjectionMatrix();
  }, [size.height, camera]);
  return null;
}

// Real WebGL turning instead of a CSS rotateX/rotateY trick on a flat <img>:
// an actual perspective/orthographic camera + lit material means the
// specular highlight genuinely shifts as the plane turns, which a CSS
// transform can't do (it's just a flat compositor layer, no lighting).
// It's still a textured plane, not a volumetric mesh -- true "see the back
// of the character" 3D would need an actual GLB model (e.g. via Higgsfield's
// image-to-3D), which isn't available without generation credits. This is
// the honest middle ground: real lighting response, modest rotation range
// so it never looks like a paper-thin card edge-on.
function MascotMesh({ targetRef }: { targetRef: React.RefObject<TiltTarget> }) {
  const texture = useTexture("/images/mascot.png");
  const meshRef = useRef<THREE.Mesh>(null);
  const idleT = useRef(Math.random() * 10);

  const img = texture.image as HTMLImageElement | undefined;
  const aspect = img?.width && img?.height ? img.width / img.height : 520 / 790;
  const height = WORLD_HEIGHT;
  const width = height * aspect;

  useFrame((_, delta) => {
    idleT.current += delta;
    const mesh = meshRef.current;
    if (!mesh) return;

    // Slow autonomous turn (as if idly looking around) layered under the
    // mouse-driven turn, plus a small facing bias toward whichever way
    // Tilo last walked.
    const idleY = Math.sin(idleT.current * 0.55) * 0.16;
    const idleX = Math.sin(idleT.current * 0.4 + 1.3) * 0.04;
    const target = targetRef.current;
    const targetY = target.y + idleY + target.facing * 0.12;
    const targetX = target.x + idleX;

    mesh.rotation.y += (targetY - mesh.rotation.y) * 0.07;
    mesh.rotation.x += (targetX - mesh.rotation.x) * 0.07;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={texture}
        transparent
        alphaTest={0.1}
        roughness={0.4}
        metalness={0.08}
      />
    </mesh>
  );
}

export default function Mascot3D({ targetRef }: { targetRef: React.RefObject<TiltTarget> }) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 5] }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
    >
      <FitCamera />
      <ambientLight intensity={0.85} />
      <directionalLight position={[2.5, 3, 4]} intensity={1.15} />
      <pointLight position={[-2, -1.5, 3]} intensity={0.35} color="#a3855c" />
      <Suspense fallback={null}>
        <MascotMesh targetRef={targetRef} />
      </Suspense>
    </Canvas>
  );
}
