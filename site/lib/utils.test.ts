import { describe, test, expect } from "vitest";
import { cycleNoun, formatDate, formatFeeInr, formatFeeWithGst, formatInr, formatInrSigned, waiverLabel } from "./utils";
import { cardHref, cardSlug } from "./card-href";

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

describe("display helpers", () => {
  test("cycleNoun turns data adjectives into prose nouns", () => {
    expect(cycleNoun("quarterly")).toBe("quarter");
    expect(cycleNoun("annual")).toBe("year");
    expect(cycleNoun("statement")).toBe("statement cycle");
    expect(cycleNoun(undefined)).toBe("year");
    expect(cycleNoun(null, "month")).toBe("month");
  });

  test("formatInrSigned puts the sign before the rupee symbol", () => {
    expect(formatInrSigned(1234.4)).toBe("₹1,234");
    expect(formatInrSigned(-1234.4)).toBe("−₹1,234");
    expect(formatInrSigned(0)).toBe("₹0");
  });

  test("formatFeeWithGst and waiverLabel", () => {
    expect(formatFeeWithGst(1500)).toBe("₹1,500 + GST");
    expect(formatFeeWithGst(1500, false)).toBe("₹1,500");
    expect(formatFeeWithGst(0)).toBe("Free");
    expect(formatFeeWithGst(null)).toBe("—");
    expect(waiverLabel({ spend_inr: 300000, cycle: "annual" })).toBe("waived on ₹3,00,000 spend/year");
    expect(waiverLabel({ spend_inr: 0, cycle: "quarterly" })).toBe("waived with card usage");
    expect(waiverLabel(null)).toBeNull();
  });

  test("formatDate is timezone-independent for calendar dates", () => {
    expect(formatDate("2026-07-06")).toBe("6 Jul 2026");
  });
});
