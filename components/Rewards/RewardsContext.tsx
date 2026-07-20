"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { STORAGE_KEY, makeCode, tierForPoints, type RewardsState } from "@/lib/rewards";

type Toast = { id: number; label: string; points: number };

type RewardsContextValue = {
  points: number;
  earned: string[];
  code: string | null;
  toasts: Toast[];
  addPoints: (key: string, points: number, label: string) => void;
  hasEarned: (key: string) => boolean;
};

const RewardsContext = createContext<RewardsContextValue | null>(null);

const EMPTY_STATE: RewardsState = { points: 0, earned: [], code: null, codeTier: null };

export function RewardsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RewardsState>(EMPTY_STATE);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const loaded = useRef(false);
  const toastId = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable (private mode etc.) — points just won't persist
    }
  }, [state]);

  const addPoints = useCallback((key: string, points: number, label: string) => {
    setState((prev) => {
      if (prev.earned.includes(key)) return prev;
      const nextPoints = prev.points + points;
      const tier = tierForPoints(nextPoints);
      const shouldMintCode = tier.discount > 0 && prev.codeTier !== tier.name;
      return {
        points: nextPoints,
        earned: [...prev.earned, key],
        code: shouldMintCode ? makeCode(tier.name) : prev.code,
        codeTier: shouldMintCode ? tier.name : prev.codeTier,
      };
    });
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, label, points }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const hasEarned = useCallback((key: string) => state.earned.includes(key), [state.earned]);

  return (
    <RewardsContext.Provider
      value={{ points: state.points, earned: state.earned, code: state.code, toasts, addPoints, hasEarned }}
    >
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error("useRewards must be used within RewardsProvider");
  return ctx;
}
