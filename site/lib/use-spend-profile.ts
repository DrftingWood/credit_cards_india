import { createPersistedStore } from "./persisted-store";
import type { SpendProfile } from "./calculator";
import type { CanonicalCategory } from "./category-mapping";

export const DEFAULT_SPEND: SpendProfile = {
  online: 15000, groceries: 8000, dining: 8000, fuel: 4000, travel: 10000,
  utilities: 5000, rent: 0, international: 0,
};

/**
 * Sanity ceiling per category (₹1 crore/month) — beyond any real cardholder, and stops a
 * stray value like `1e21` from producing meaningless sextillion-rupee output. Lives here,
 * with the store every view writes through, so the two calculators cannot drift apart on
 * it: `sanitize` enforces it on every write and on values loaded from localStorage.
 */
export const MAX_MONTHLY_SPEND = 1_00_00_000;

function sanitize(raw: unknown): SpendProfile {
  const p = (raw && typeof raw === "object" ? raw : {}) as Partial<SpendProfile>;
  const out = { ...DEFAULT_SPEND };
  (Object.keys(out) as CanonicalCategory[]).forEach((k) => {
    const v = Number(p[k]);
    // merge over defaults so a new category key is never undefined
    out[k] = p[k] !== undefined && Number.isFinite(v) && v >= 0 ? Math.min(MAX_MONTHLY_SPEND, v) : DEFAULT_SPEND[k];
  });
  return out;
}

const store = createPersistedStore<SpendProfile>("cc-spend-profile-v1", DEFAULT_SPEND, sanitize);

export const readSpend = store.read;
export const writeSpend = store.write;
export const subscribe = store.subscribe;

/** React hook: shared, persisted spend profile. `getServerSnapshot` returns the
 *  default so SSR + first paint are stable; the store hydrates from localStorage
 *  on the client (load ran at module init in the browser). */
export const useSpendProfile = store.use;
