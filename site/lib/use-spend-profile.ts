import { useSyncExternalStore } from "react";
import type { SpendProfile } from "./calculator";
import type { CanonicalCategory } from "./category-mapping";

export const DEFAULT_SPEND: SpendProfile = {
  online: 15000, groceries: 8000, dining: 8000, fuel: 4000, travel: 10000,
  utilities: 5000, rent: 0, international: 0,
};

const KEY = "cc-spend-profile-v1";
const listeners = new Set<() => void>();
let current: SpendProfile = load();

function load(): SpendProfile {
  if (typeof window === "undefined") return { ...DEFAULT_SPEND };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SPEND };
    const parsed = JSON.parse(raw) as Partial<SpendProfile>;
    // merge over defaults so a new category key is never undefined
    return { ...DEFAULT_SPEND, ...sanitize(parsed) };
  } catch {
    return { ...DEFAULT_SPEND };
  }
}

function sanitize(p: Partial<SpendProfile>): SpendProfile {
  const out = { ...DEFAULT_SPEND };
  (Object.keys(out) as CanonicalCategory[]).forEach((k) => {
    const v = Number(p[k]);
    out[k] = Number.isFinite(v) && v >= 0 ? v : DEFAULT_SPEND[k];
  });
  return out;
}

export function readSpend(): SpendProfile { return current; }

export function writeSpend(updater: (s: SpendProfile) => SpendProfile): void {
  current = sanitize(updater(current));
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(KEY, JSON.stringify(current)); } catch { /* storage full/blocked — keep in-memory */ }
  }
  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** React hook: shared, persisted spend profile. `getServerSnapshot` returns the
 *  default so SSR + first paint are stable; the store hydrates from localStorage
 *  on the client (load() ran at module init in the browser). */
export function useSpendProfile(): [SpendProfile, (updater: (s: SpendProfile) => SpendProfile) => void] {
  const spend = useSyncExternalStore(subscribe, readSpend, () => DEFAULT_SPEND);
  return [spend, writeSpend];
}
