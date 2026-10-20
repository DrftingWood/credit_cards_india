import { describe, test, expect, beforeEach } from "vitest";
import { DEFAULT_SPEND, MAX_MONTHLY_SPEND, readSpend, writeSpend, subscribe } from "./use-spend-profile";

describe("spend store core", () => {
  beforeEach(() => { writeSpend(() => ({ ...DEFAULT_SPEND })); });

  test("readSpend returns the default before any write", () => {
    expect(readSpend()).toEqual(DEFAULT_SPEND);
  });
  test("writeSpend updates and notifies subscribers", () => {
    let notified = 0;
    const unsub = subscribe(() => { notified++; });
    writeSpend((s) => ({ ...s, dining: 12345 }));
    expect(readSpend().dining).toBe(12345);
    expect(notified).toBeGreaterThan(0);
    unsub();
  });
  test("a later write is visible to a fresh read (shared single store)", () => {
    writeSpend((s) => ({ ...s, travel: 50000 }));
    expect(readSpend().travel).toBe(50000);
  });
});

describe("spend store ceiling", () => {
  beforeEach(() => { writeSpend(() => ({ ...DEFAULT_SPEND })); });

  test("MAX_MONTHLY_SPEND is one crore", () => {
    expect(MAX_MONTHLY_SPEND).toBe(1_00_00_000);
  });
  test("writeSpend clamps a value above the ceiling", () => {
    writeSpend((s) => ({ ...s, online: 5_00_00_000 }));
    expect(readSpend().online).toBe(MAX_MONTHLY_SPEND);
  });
  test("writeSpend leaves a value at or below the ceiling alone", () => {
    writeSpend((s) => ({ ...s, online: 99_00_000 }));
    expect(readSpend().online).toBe(99_00_000);
  });
});
