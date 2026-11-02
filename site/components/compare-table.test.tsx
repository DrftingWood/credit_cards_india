// @vitest-environment jsdom
import { afterEach, describe, test, expect } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { getAllCards } from "@/lib/data";
import { CompareTable, winners } from "./compare-table";

afterEach(cleanup);

describe("CompareTable scroll wrapper", () => {
  test("is a focusable, named region so keyboard users can scroll it", () => {
    const { getByRole } = render(<CompareTable cards={getAllCards().slice(0, 2)} />);
    const region = getByRole("region", { name: "Comparison table, scrolls horizontally" });
    expect(region.getAttribute("tabindex")).toBe("0");
    expect(region.querySelector("table")).not.toBeNull();
  });
});

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
