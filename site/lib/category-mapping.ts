/**
 * Maps the freeform `accelerated.category` strings in the dataset to a small
 * set of canonical user-facing buckets used by the calculator.
 *
 * This is intentionally heuristic — the correct long-term fix is to add a
 * `canonical_category` field to the schema and tag every accelerated entry.
 * Until then, substring rules cover the 91 distinct strings that exist today.
 */

export const CANONICAL_CATEGORIES = [
  "online",
  "groceries",
  "dining",
  "fuel",
  "travel",
  "utilities",
  "rent",
  "international",
] as const;

export type CanonicalCategory = (typeof CANONICAL_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<CanonicalCategory, string> = {
  online: "Online shopping",
  groceries: "Groceries",
  dining: "Dining & food delivery",
  fuel: "Fuel",
  travel: "Travel & hotels",
  utilities: "Utilities & bills",
  rent: "Rent",
  international: "International / forex",
};

const RULES: Array<{ match: RegExp; buckets: CanonicalCategory[] }> = [
  { match: /amazon|flipkart|myntra|ajio|tata-?cliq|shopping|online/, buckets: ["online"] },
  { match: /grocery|groceries|bigbasket|supermarket|departmental/, buckets: ["groceries"] },
  { match: /dining|restaurant|swiggy|zomato|eazydiner|food-delivery|instamart/, buckets: ["dining"] },
  { match: /fuel|bpcl|hpcl|indianoil|ioc|petrol|diesel/, buckets: ["fuel"] },
  { match: /travel|flight|hotel|airline|makemytrip|mmt|yatra|cleartrip|ixigo|goibibo|easemytrip|edge-portal|ticket|indigo|air-india|vistara|irctc|marriott|taj|fine-hotels/, buckets: ["travel"] },
  { match: /utility|bill-payments|recharge|airtel-thanks|utilities/, buckets: ["utilities"] },
  { match: /rent/, buckets: ["rent"] },
  { match: /international|forex/, buckets: ["international"] },
  { match: /entertainment|movies|bookmyshow|pvr|cinema|gaming/, buckets: ["online"] }, // map entertainment into online for v0
];

/** Returns the canonical buckets an accelerated-category string maps to. */
export function classifyCategory(raw: string): CanonicalCategory[] {
  const s = raw.toLowerCase();
  const out = new Set<CanonicalCategory>();
  for (const { match, buckets } of RULES) {
    if (match.test(s)) {
      for (const b of buckets) out.add(b);
    }
  }
  return [...out];
}
