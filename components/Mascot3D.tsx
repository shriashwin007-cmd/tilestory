"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export type TiltTarget = {
  x: number;
  y: number;
  facing: 1 | -1;
  // Bumped (not toggled) on every tap -- MascotMesh diffs it against a ref
  // to know a fresh tap happened and kick off one full playful spin, without
  // needing React state/re-renders for something read every WebGL frame.
  spinTrigger: number;
};

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
    ortho.zoom = (size.height * 0.9) / WORLD_HEIGHT;
    ortho.updateProjectionMatrix();
  }, [size.height, camera]);
  return null;
}

// Real WebGL turning instead of a CSS rotateX/rotateY trick on a flat <img>:
// an actual camera + lit, curved geometry means the specular highlight
// genuinely sweeps across a surface as it turns, which a CSS transform on a
// flat compositor layer can't do. Wider rotation range + a position orbit
// now, so Tilo visibly turns and drifts rather than just idling in place.
function MascotMesh({ targetRef }: { targetRef: React.RefObject<TiltTarget> }) {
  const texture = useTexture("/images/mascot.png");

  // Mipmapping downsamples the texture for oblique/receding angles, and on
  // a hard cutout PNG that blends semi-opaque edge pixels with neighbors --
  // the cream suit sits close in tone to the removed background, so at
  // generated mip levels its alpha can drop below the alphaTest cutoff and
  // get discarded entirely. Wasn't visible before the rotation range was
  // widened (barely any oblique sampling happened), but the wider turn and
  // full spin now sample steep angles constantly. Disabling mipmaps keeps
  // every angle sampling the same full-resolution, correct-alpha texture.
  useEffect(() => {
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
  }, [texture]);

  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const idleT = useRef(Math.random() * 10);
  const lastSpinTrigger = useRef(0);
  const spinProgress = useRef(0); // 0 = not spinning, >0 = radians left to add

  const img = texture.image as HTMLImageElement | undefined;
  const aspect = img?.width && img?.height ? img.width / img.height : 520 / 790;
  const height = WORLD_HEIGHT;
  const width = height * aspect;

  useFrame((_, delta) => {
    idleT.current += delta;
    const mesh = meshRef.current;
    const group = groupRef.current;
    if (!mesh || !group) return;

    const target = targetRef.current;

    // A fresh tap queues up one full extra turn on top of whatever's
    // already happening -- a clear, playful "he spun around!" reaction.
    if (target.spinTrigger !== lastSpinTrigger.current) {
      lastSpinTrigger.current = target.spinTrigger;
      spinProgress.current += Math.PI * 2 * target.facing;
    }
    if (spinProgress.current !== 0) {
      const step = Math.sign(spinProgress.current) * Math.min(Math.abs(spinProgress.current), delta * 9);
      mesh.rotation.y += step;
      spinProgress.current -= step;
    }

    // Bigger, more visible idle turn+drift (as if idly looking around and
    // shifting weight) layered under the mouse-driven turn and the walk
    // facing bias.
    const idleY = Math.sin(idleT.current * 0.5) * 0.34;
    const idleX = Math.sin(idleT.current * 0.38 + 1.3) * 0.09;
    const idleZ = Math.sin(idleT.current * 0.33 + 0.6) * 0.06;

    const targetY = target.y * 1.4 + idleY + target.facing * 0.18;
    const targetX = target.x * 1.3 + idleX;

    if (spinProgress.current === 0) {
      mesh.rotation.y += (targetY - mesh.rotation.y) * 0.08;
    }
    mesh.rotation.x += (targetX - mesh.rotation.x) * 0.08;
    mesh.rotation.z += (idleZ + target.x * -0.12 - mesh.rotation.z) * 0.06;

    // Small circular drift in space on top of the rotation, so the whole
    // figure gently orbits rather than pinning dead center -- the "move
    // even more" ask, kept subtle enough not to clip the canvas.
    group.position.x = Math.sin(idleT.current * 0.42) * 0.09;
    group.position.y = Math.sin(idleT.current * 0.6 + 0.8) * 0.07;
  });

  return (
    <group ref={groupRef}>
      {/* Flat plane, not the earlier bowed/curved geometry -- that Z-bulge
          combined with DoubleSide made the front and back faces sit close
          enough in depth to z-fight at some angles, and the losing face
          (wrong-facing normal, lit only by ambient) rendered dark enough to
          read as a hole punched straight through the shirt. Confirmed by
          screenshot: the "missing" pixels exactly matched the page
          background color, not a lighter/grayed shirt -- genuine
          transparency, not just poor contrast. A flat plane can't
          self-z-fight with itself. */}
      <mesh ref={meshRef}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.1}
          roughness={0.38}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
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
      <ambientLight intensity={0.75} />
      <directionalLight position={[2.5, 3, 4]} intensity={1.3} />
      <directionalLight position={[-2.5, 1.5, 2]} intensity={0.4} color="#fff3df" />
      <pointLight position={[-2, -1.5, 3]} intensity={0.4} color="#a3855c" />
      <Suspense fallback={null}>
        <MascotMesh targetRef={targetRef} />
      </Suspense>
    </Canvas>
  );
}
