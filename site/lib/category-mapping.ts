/**
 * Canonical spend buckets used by the reward calculator.
 *
 * The schema's `accelerated.canonical_categories` field (see
 * schema/card.schema.json) is the authoritative tag source — the calculator
 * prefers it when present. For older/untagged entries, `classifyCategory()`
 * falls back to heuristic substring matching on the freeform `category`
 * string so the site still scores something reasonable.
 */

/**
 * User-facing bucket set exposed by the calculator form. Must be a subset of
 * the schema's `canonical_categories` enum — tags outside this set (e.g.
 * "government", "insurance", "education", "wallet-loads", "emi", "other") are
 * recognised by the schema but not surfaced in the calculator UI for v0.
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

/** Schema-level canonical categories (superset). */
export const SCHEMA_CANONICAL_CATEGORIES = [
  ...CANONICAL_CATEGORIES,
  "entertainment",
  "government",
  "insurance",
  "education",
  "wallet-loads",
  "emi",
  "other",
] as const;

export type SchemaCanonicalCategory = (typeof SCHEMA_CANONICAL_CATEGORIES)[number];

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

/**
 * Heuristic fallback: maps freeform accelerated-category strings to
 * calculator buckets via keyword rules. Only consulted when the schema
 * entry has no `canonical_categories` array.
 *
 * Rules come from scripts/category_rules.yaml — the same file
 * scripts/validate.py and scripts/tag_canonical_categories.py read.
 * site/scripts/build.mjs surfaces it into dist/category_rules.json so
 * this module can import it at build time.
 */
import categoryRulesData from "../../dist/category_rules.json";

interface RawRule {
  match: string;
  buckets: string[];
}

const ALLOWED = new Set<string>(CANONICAL_CATEGORIES);
const RULES: Array<{ match: RegExp; buckets: CanonicalCategory[] }> = (
  (categoryRulesData as { rules?: RawRule[] }).rules ?? []
).map((r) => ({
  match: new RegExp(r.match),
  buckets: r.buckets.filter((b): b is CanonicalCategory => ALLOWED.has(b)),
}));

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

/**
 * Resolves the buckets an accelerated entry applies to. Schema-tagged
 * `canonical_categories` wins; falls back to heuristic on the `category`
 * string. Tags outside the calculator UI's bucket set are dropped.
 */
export function resolveBuckets(
  categoryString: string,
  schemaTags?: readonly string[] | null,
): CanonicalCategory[] {
  if (schemaTags && schemaTags.length > 0) {
    const allowed = new Set<string>(CANONICAL_CATEGORIES);
    return schemaTags.filter((t): t is CanonicalCategory => allowed.has(t));
  }
  return classifyCategory(categoryString);
}
