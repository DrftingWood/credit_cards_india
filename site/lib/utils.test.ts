import { describe, test, expect } from "vitest";
import { cn, formatInr, formatFeeInr } from "./utils";
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

describe("cn — tailwind-merge knows the site's custom theme names", () => {
  test("later tracking role replaces an earlier stock or custom one", () => {
    expect(cn("tracking-wide", "tracking-label")).toBe("tracking-label");
    expect(cn("tracking-label", "tracking-heading")).toBe("tracking-heading");
    expect(cn("tracking-heading", "tracking-tight")).toBe("tracking-tight");
  });
  test("max-w-page and max-w-prose dedupe against each other and stock widths", () => {
    expect(cn("max-w-page", "max-w-prose")).toBe("max-w-prose");
    expect(cn("max-w-prose", "max-w-page")).toBe("max-w-page");
    expect(cn("max-w-2xl", "max-w-page")).toBe("max-w-page");
  });
  test("spacing aliases behave like spacing steps", () => {
    expect(cn("p-4", "p-card")).toBe("p-card");
    expect(cn("gap-2", "gap-stack")).toBe("gap-stack");
    expect(cn("py-section", "py-2")).toBe("py-2");
  });
  test("different groups are kept; semantic colours dedupe among themselves", () => {
    expect(cn("tracking-label", "text-sm", "max-w-page")).toBe("tracking-label text-sm max-w-page");
    expect(cn("text-fg", "text-fg-muted")).toBe("text-fg-muted");
    expect(cn("text-sm", "text-fg")).toBe("text-sm text-fg");
    expect(cn("bg-surface", "bg-surface-subtle")).toBe("bg-surface-subtle");
  });
  test("the site's shadow and radius scales (shadow-sm, shadow, rounded) still dedupe", () => {
    expect(cn("shadow-sm", "shadow-lg")).toBe("shadow-lg");
    expect(cn("rounded", "rounded-md")).toBe("rounded-md");
  });
});
