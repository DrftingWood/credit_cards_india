import { describe, test, expect } from "vitest";
import { pointsToPct } from "./rate-math.mjs";

describe("pointsToPct", () => {
  test("cashback baseline: 1 unit per ₹100 at ₹1 = 1%", () => {
    expect(pointsToPct(1, 100, 1)).toBe(1);
  });
  test("points card: 5 pts per ₹150 at ₹0.70 ≈ 2.33%", () => {
    expect(pointsToPct(5, 150, 0.7)).toBeCloseTo(2.3333, 4);
  });
  test("perInr === 0 returns 0 (not Infinity)", () => {
    expect(pointsToPct(1, 0, 0.25)).toBe(0);
  });
  test("perInr negative returns 0", () => {
    expect(pointsToPct(1, -1, 0.25)).toBe(0);
  });
  test("unitValue === 0 returns 0", () => {
    expect(pointsToPct(1, 100, 0)).toBe(0);
  });
  test("realistic points: 2 pts per ₹100 at ₹0.25 = 0.5%", () => {
    expect(pointsToPct(2, 100, 0.25)).toBe(0.5);
  });
});
