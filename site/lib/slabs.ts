import type { RateSlab } from "./types";

/**
 * Value earned on the spend segment [`consumed`, `consumed + amount`] under a
 * marginal slab schedule, plus the spend that segment actually consumed.
 *
 * Slabs behave like tax brackets over CUMULATIVE qualifying spend in the cycle,
 * so a bucket scored after another bucket already pushed ₹40k through the same
 * accelerator must start where that left off — hence `consumed`. Rates may rise
 * (Axis Cashback: 2% → 5% → 7%) or fall; nothing here assumes a direction.
 */
export function slabEarn(
  slabs: RateSlab[],
  amount: number,
  consumed = 0,
): { value: number; spend: number } {
  let value = 0;
  let spend = 0;
  let cursor = consumed;
  let left = amount;
  for (const s of slabs) {
    if (left <= 0) break;
    const ceiling = s.upto_spend_inr ?? Number.POSITIVE_INFINITY;
    if (cursor >= ceiling) continue;
    const width = Math.min(left, ceiling - cursor);
    let earned = (width * s.rate_pct) / 100;
    if (s.max_value_inr != null) {
      // This slab's own ceiling may already be partly spent by earlier buckets.
      const priorInSlab = Math.max(0, Math.min(cursor, ceiling) - slabFloor(slabs, s));
      const alreadyEarned = (priorInSlab * s.rate_pct) / 100;
      earned = Math.max(0, Math.min(earned, s.max_value_inr - alreadyEarned));
    }
    value += earned;
    spend += width;
    cursor += width;
    left -= width;
  }
  return { value, spend };
}

/** Spend needed to earn `target` value under a slab schedule, starting from `consumed`. */
export function slabSpendForValue(slabs: RateSlab[], target: number, consumed = 0): number {
  let spend = 0;
  let remaining = target;
  let cursor = consumed;
  for (const s of slabs) {
    if (remaining <= 0) break;
    const ceiling = s.upto_spend_inr ?? Number.POSITIVE_INFINITY;
    if (cursor >= ceiling) continue;
    const width = ceiling - cursor;
    if (s.rate_pct <= 0) {
      // A 0% slab buys no value; it still consumes spend before the next slab.
      if (!Number.isFinite(width)) break;
      spend += width;
      cursor += width;
      continue;
    }
    const valueHere = Math.min(remaining, (width * s.rate_pct) / 100);
    const spendHere = (valueHere * 100) / s.rate_pct;
    spend += spendHere;
    cursor += spendHere;
    remaining -= valueHere;
  }
  return spend;
}

/** Cumulative spend at which a slab begins (the previous slab's ceiling, or 0). */
function slabFloor(slabs: RateSlab[], target: RateSlab): number {
  let floor = 0;
  for (const s of slabs) {
    if (s === target) return floor;
    floor = s.upto_spend_inr ?? floor;
  }
  return floor;
}

/** Blended percentage a slab schedule yields over `amount` of spend starting from `consumed`. */
export function slabRatePct(slabs: RateSlab[], amount: number, consumed = 0): number | null {
  if (amount <= 0) return null;
  const { value } = slabEarn(slabs, amount, consumed);
  return (value / amount) * 100;
}
