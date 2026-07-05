/**
 * Presentation-layer grouping for /recommend results.
 * PURE LABELLING: each highlight is the first entry of the already-ranked list
 * that satisfies a factual predicate. No re-ranking, no invented value.
 */
import type { DecoupledScore } from "./scorer-decoupled";
import type { RecommendPayload } from "./recommender";
import { CATEGORY_LABELS, type CanonicalCategory } from "./category-mapping";

export interface Highlight {
  key: "best-overall" | "best-no-fee" | "best-for-top-category" | "premium-pick";
  label: string;
  score: DecoupledScore;
}

// SpendBand is ordered by MONEY, not alphabetically: higher ordinal = larger spend.
const BAND_ORDER: Record<string, number> = { "0": 0, "lt-5k": 1, "5k-15k": 2, "15k-30k": 3, "gt-30k": 4 };

export function pickHighlights(scores: DecoupledScore[], payload: RecommendPayload): Highlight[] {
  if (scores.length === 0) return [];
  const used = new Set<string>();
  const out: Highlight[] = [];
  const take = (
    key: Highlight["key"],
    label: string,
    s: DecoupledScore | undefined,
    allowNonPositive = false,
  ) => {
    if (!s || used.has(s.card.id) || (!allowNonPositive && s.net_rewards_inr <= 0)) return;
    used.add(s.card.id);
    out.push({ key, label, score: s });
  };

  // best-overall ALWAYS surfaces ranked #1; its displayed value tells the truth even if low.
  take("best-overall", "Best overall for your spend", scores[0], true);
  take("best-no-fee", "Best lifetime-free pick",
    scores.find((s) => s.card.computed.is_lifetime_free));

  const spend = (payload.monthly_spend ?? {}) as Record<string, string>;
  const top = (Object.entries(spend) as [CanonicalCategory, string][])
    .filter(([, band]) => (BAND_ORDER[band] ?? 0) > 0)
    .sort((a, b) => (BAND_ORDER[b[1]] ?? 0) - (BAND_ORDER[a[1]] ?? 0))[0]?.[0];
  if (top) {
    take("best-for-top-category", `Best for ${CATEGORY_LABELS[top] ?? top}`,
      scores.find((s) => s.reason.toLowerCase().includes(String(top))));
  }
  take("premium-pick", "Premium pick (fee justified by rewards)",
    scores.find((s) => s.annual_fee_inr > 0 && s.net_rewards_inr > 0));
  return out;
}
