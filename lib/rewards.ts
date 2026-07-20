export type Tier = {
  name: string;
  min: number;
  discount: number;
  icon: string;
};

export const TIERS: Tier[] = [
  { name: "Explorer", min: 0, discount: 0, icon: "◇" },
  { name: "Bronze", min: 20, discount: 5, icon: "◆" },
  { name: "Silver", min: 50, discount: 10, icon: "✦" },
  { name: "Gold", min: 85, discount: 15, icon: "✧" },
  { name: "Platinum", min: 120, discount: 20, icon: "✪" },
];

export function tierForPoints(points: number): Tier {
  let current = TIERS[0];
  for (const t of TIERS) {
    if (points >= t.min) current = t;
  }
  return current;
}

export function nextTier(points: number): Tier | null {
  return TIERS.find((t) => t.min > points) ?? null;
}

export const STORAGE_KEY = "ts_rewards_v1";

export type RewardsState = {
  points: number;
  earned: string[];
  code: string | null;
  codeTier: string | null;
};

export function makeCode(tierName: string) {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TILESTORY-${tierName.toUpperCase()}-${rand}`;
}
