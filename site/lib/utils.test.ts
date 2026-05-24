import { describe, test, expect } from "vitest";
import { formatInr, formatFeeInr } from "./utils";
import { cardHref, cardSlug } from "./data";

describe("formatInr — strict numeric formatter", () => {
  test("0 renders as '₹0', not 'Free'", () => {
    expect(formatInr(0)).toBe("₹0");
  });
  test("positive number renders with en-IN locale grouping", () => {
    expect(formatInr(150000)).toBe("₹1,50,000");
  });
  test("null and undefined render as '—'", () => {
    expect(formatInr(null)).toBe("—");
    expect(formatInr(undefined)).toBe("—");
  });
});

describe("formatFeeInr — annual/joining fee formatter", () => {
  test("0 renders as 'Free' (matches consumer expectation for LTF cards)", () => {
    expect(formatFeeInr(0)).toBe("Free");
  });
  test("positive number renders as ₹X", () => {
    expect(formatFeeInr(2500)).toBe("₹2,500");
  });
  test("nullish renders as '—'", () => {
    expect(formatFeeInr(null)).toBe("—");
  });
});

describe("cardSlug / cardHref — URL helpers (B6-SF7)", () => {
  test("strips the redundant {issuer}- prefix from id", () => {
    expect(cardSlug({ id: "hdfc-infinia", issuer: "hdfc" })).toBe("infinia");
  });
  test("preserves id when it doesn't start with issuer prefix", () => {
    expect(cardSlug({ id: "infinia", issuer: "hdfc" })).toBe("infinia");
  });
  test("cardHref returns /card/<issuer>/<slug>", () => {
    expect(cardHref({ id: "hdfc-infinia", issuer: "hdfc" })).toBe("/card/hdfc/infinia");
  });
});
