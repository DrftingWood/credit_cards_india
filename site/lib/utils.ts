import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Strict INR formatter — always renders ₹X for any number, "—" for nullish. Use formatFeeInr() instead when 0 should read as "Free" (annual/joining fee contexts). */
export function formatInr(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `₹${value.toLocaleString("en-IN")}`;
}

/** Fee-row formatter — renders 0 as "Free" (matches consumer expectation for lifetime-free cards), nullish as "—". Don't use in unit-priced contexts where ₹0 is a real value. */
export function formatFeeInr(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (value === 0) return "Free";
  return `₹${value.toLocaleString("en-IN")}`;
}

/** List-price fee: "Free", "—", or "₹1,500 + GST" (no suffix when GST doesn't apply). */
export function formatFeeWithGst(value: number | null | undefined, gstApplicable?: boolean): string {
  const base = formatFeeInr(value);
  if (value === null || value === undefined || value === 0) return base;
  return gstApplicable === false ? base : `${base} + GST`;
}

/** Short fee-waiver condition: "waived on ₹3,00,000 spend/year", "waived with card usage". */
export function waiverLabel(waiver: { spend_inr: number; cycle: string } | null | undefined): string | null {
  if (!waiver) return null;
  if (waiver.spend_inr <= 0) return "waived with card usage";
  return `waived on ${formatInr(waiver.spend_inr)} spend/${cycleNoun(waiver.cycle)}`;
}

/**
 * Whole-rupee amount with the sign before the ₹: "₹1,234", "−₹1,234".
 * (Template-literal `₹${n}` renders a loss as "₹-1,234".)
 */
export function formatInrSigned(value: number): string {
  const n = Math.round(value);
  const abs = `₹${Math.abs(n).toLocaleString("en-IN")}`;
  return n < 0 ? `−${abs}` : abs;
}

const CYCLE_NOUNS: Record<string, string> = {
  monthly: "month",
  quarterly: "quarter",
  annual: "year",
  statement: "statement cycle",
  "per-txn": "transaction",
};

/** Data cycles are adjectives ("quarterly"); prose needs the noun ("per quarter"). */
export function cycleNoun(cycle: string | null | undefined, fallback = "year"): string {
  if (!cycle) return fallback;
  return CYCLE_NOUNS[cycle] ?? cycle;
}

export function formatPct(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(digits)}%`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  // Dataset dates are calendar dates (parsed as UTC midnight); format in UTC
  // so a viewer west of UTC doesn't see the previous day.
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

/** Host (e.g. "www.hdfcbank.com") from a URL. */
export function hostOf(url: string | null | undefined): string {
  if (!url) return "";
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}
