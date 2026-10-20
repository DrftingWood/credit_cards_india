import { createPersistedStore } from "./persisted-store";
import { DEFAULT_VALUE_PREFS, MAX_TENURE_YEARS, type ValuePrefs } from "./value-components";

export { MAX_TENURE_YEARS };

/** Sanity ceilings: more lounge visits than days in a year, or a ₹1 lakh visit, is input noise. */
export const MAX_LOUNGE_VISITS = 365;
export const MAX_LOUNGE_VALUE_INR = 1_00_000;

const clamp = (v: unknown, lo: number, hi: number, fallback: number): number => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;
};

/** Coerces anything (a stale localStorage blob, a bad input) into valid ValuePrefs. */
export function sanitizeValuePrefs(raw: unknown): ValuePrefs {
  const p = (raw && typeof raw === "object" ? raw : {}) as Partial<ValuePrefs>;
  const d = DEFAULT_VALUE_PREFS;
  const pair = (o: unknown, hi: number, def: { domestic: number; international: number }) => {
    const x = (o && typeof o === "object" ? o : {}) as Partial<Record<"domestic" | "international", unknown>>;
    return { domestic: clamp(x.domestic, 0, hi, def.domestic), international: clamp(x.international, 0, hi, def.international) };
  };
  return {
    tenure_years: Math.round(clamp(p.tenure_years, 1, MAX_TENURE_YEARS, d.tenure_years)),
    lounge_visits: pair(p.lounge_visits, MAX_LOUNGE_VISITS, d.lounge_visits),
    lounge_value_inr: pair(p.lounge_value_inr, MAX_LOUNGE_VALUE_INR, d.lounge_value_inr),
  };
}

const store = createPersistedStore<ValuePrefs>("cc-value-prefs-v1", DEFAULT_VALUE_PREFS, sanitizeValuePrefs);

export const readValuePrefs = store.read;
export const writeValuePrefs = store.write;
export const subscribeValuePrefs = store.subscribe;
/** React hook: shared, persisted valuation inputs (tenure, lounge usage) across all calculators. */
export const useValuePrefs = store.use;
