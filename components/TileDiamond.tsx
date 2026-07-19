import styles from "./TileDiamond.module.css";

// Brand tile colors (muted sage + antique sand families, echoing the logo mosaic)
const SAGE = "#6d988d";
const MIST = "#a6c2ba";
const SAND = "#c7a57b";
const CREAM = "#e0cca6";

type Plank = {
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
  vertical: boolean;
  color: string;
};

const HALF = 46; // px, half the base unit
const GAP = 3;
const PLANK_LONG = HALF * 2;
const PLANK_SHORT = PLANK_LONG * 0.28;

const QUADRANTS: { ox: number; oy: number; colors: [string, string]; horizontal: boolean }[] = [
  { ox: -1, oy: 1, colors: [CREAM, SAND], horizontal: true },
  { ox: 1, oy: 1, colors: [MIST, SAGE], horizontal: false },
  { ox: -1, oy: -1, colors: [SAGE, MIST], horizontal: false },
  { ox: 1, oy: -1, colors: [SAND, CREAM], horizontal: true },
];

const PLANKS: Plank[] = [];
QUADRANTS.forEach((q, qi) => {
  const cx = q.ox * (HALF + GAP);
  const cy = q.oy * (HALF + GAP);
  for (let i = 0; i < 3; i++) {
    const t = (i - 1) * PLANK_LONG * 0.32;
    const color = q.colors[i % 2];
    const z = ((qi * 3 + i) % 4) * 8 - 12; // gentle depth stagger, -12..12
    if (q.horizontal) {
      PLANKS.push({ x: cx, y: cy + t, z, w: PLANK_LONG, h: PLANK_SHORT, vertical: false, color });
    } else {
      PLANKS.push({ x: cx + t, y: cy, z, w: PLANK_SHORT, h: PLANK_LONG, vertical: true, color });
    }
  }
});

export default function TileDiamond() {
  return (
    <div className={styles.panel}>
      <div className={styles.stage}>
        <div className={styles.sway}>
          <div className={styles.diamond}>
            {PLANKS.map((p, i) => (
              <div
                key={i}
                className={styles.plank}
                style={{
                  width: p.w,
                  height: p.h,
                  background: p.color,
                  transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px) translate(-50%, -50%)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.shade} />
    </div>
  );
}
