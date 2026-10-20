import { describe, test, expect, beforeEach } from "vitest";
import { readValuePrefs, writeValuePrefs, subscribeValuePrefs, sanitizeValuePrefs, MAX_LOUNGE_VISITS, MAX_LOUNGE_VALUE_INR } from "./use-value-prefs";
import { DEFAULT_VALUE_PREFS } from "./value-components";

describe("value-prefs store", () => {
  beforeEach(() => { writeValuePrefs(() => DEFAULT_VALUE_PREFS); });

  test("starts at the defaults — no lounge usage, so lounge is valued at ₹0", () => {
    expect(readValuePrefs()).toEqual(DEFAULT_VALUE_PREFS);
  });
  test("writes are shared and notify subscribers", () => {
    let n = 0;
    const unsub = subscribeValuePrefs(() => { n++; });
    writeValuePrefs((p) => ({ ...p, lounge_visits: { ...p.lounge_visits, domestic: 6 } }));
    expect(readValuePrefs().lounge_visits.domestic).toBe(6);
    expect(n).toBeGreaterThan(0);
    unsub();
  });
});

describe("sanitizeValuePrefs — hostile/legacy localStorage can't produce nonsense", () => {
  test("tenure is an integer in 1..10", () => {
    expect(sanitizeValuePrefs({ tenure_years: 0 }).tenure_years).toBe(1);
    expect(sanitizeValuePrefs({ tenure_years: 99 }).tenure_years).toBe(10);
    expect(sanitizeValuePrefs({ tenure_years: 2.6 }).tenure_years).toBe(3);
    expect(sanitizeValuePrefs({ tenure_years: "x" as unknown as number }).tenure_years).toBe(DEFAULT_VALUE_PREFS.tenure_years);
  });
  test("visits and per-visit value are clamped to non-negative ceilings", () => {
    const p = sanitizeValuePrefs({ lounge_visits: { domestic: -3, international: 1e9 }, lounge_value_inr: { domestic: 1e12, international: Number.NaN } });
    expect(p.lounge_visits).toEqual({ domestic: 0, international: MAX_LOUNGE_VISITS });
    expect(p.lounge_value_inr).toEqual({ domestic: MAX_LOUNGE_VALUE_INR, international: 0 });
  });
  test("missing keys fall back to defaults", () => {
    expect(sanitizeValuePrefs({})).toEqual(DEFAULT_VALUE_PREFS);
    expect(sanitizeValuePrefs(null)).toEqual(DEFAULT_VALUE_PREFS);
  });
});
