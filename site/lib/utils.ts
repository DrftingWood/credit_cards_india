import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's stock scales. The names that
 * styles/theme.css adds (tracking-label, tracking-heading, max-w-page,
 * p-card …) must be declared here too, or `cn("tracking-wide", "tracking-label")`
 * keeps both classes and the winner is decided by stylesheet order instead of
 * argument order. Keep this list in step with theme.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      tracking: ["label", "heading"],
      container: ["page"],
      spacing: ["inline", "stack", "card", "section"],
    },
  },
});

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

export function formatPct(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(digits)}%`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
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
