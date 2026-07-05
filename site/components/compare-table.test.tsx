// site/components/compare-table.test.ts
import { describe, test, expect } from "vitest";
import { winners } from "./compare-table";

describe("winners()", () => {
  test("flags the single lowest value when lower wins (fee comparison)", () => {
    expect(winners([500, 1000, 750], false)).toEqual([true, false, false]);
  });

  test("flags the single highest value when higher wins (value-% comparison)", () => {
    expect(winners([1.5, 3.3, 2.0], true)).toEqual([false, true, false]);
  });

  test("flags all matching columns on a tie for first, but not others", () => {
    expect(winners([500, 500, 750], false)).toEqual([true, true, false]);
  });

  test("returns all-false when every numeric value ties", () => {
    expect(winners([500, 500, 500], false)).toEqual([false, false, false]);
  });

  test("returns all-false with fewer than 2 numeric values", () => {
    expect(winners([500], false)).toEqual([false]);
    expect(winners([null, null], false)).toEqual([false, false]);
    expect(winners([500, null], false)).toEqual([false, false]);
  });

  test("nulls are never flagged and don't count toward the tie check", () => {
    expect(winners([500, null, 750], false)).toEqual([true, false, false]);
  });
});
