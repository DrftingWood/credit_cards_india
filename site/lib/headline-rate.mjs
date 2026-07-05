/**
 * Headline reward-rate badge math, shared with the build pipeline.
 *
 * Lives next to rate-math.mjs (not inside site/scripts/build.mjs) so it is
 * importable by tests — build.mjs runs main() at import time. The consistency
 * tests in headline-rate.test.ts assert this, the calculator, and
 * detail-derivations produce the same percent for the same record.
 */
import { pointsToPct } from "./rate-math.mjs";

export function computeHeadlineRatePct(rewards, programsById) {
  if (!rewards) return null;
  const b = rewards.base ?? {};
  const { rate, per_inr } = b;
  // Unit-value preference mirrors site/lib/calculator.ts unitValueFor —
  // programme realized > base realized > base face — so the listing badge
  // and the recommender score the same card on the same basis.
  const program = rewards.loyalty_program ? programsById?.[rewards.loyalty_program] : null;
  const unitValue =
    program?.unit_value_inr?.realized ?? b.unit_value_inr_realized ?? b.unit_value_inr;
  // KEEP this guard — pointsToPct returns 0 for per_inr <= 0, but this
  // caller's contract is to return null (so the site renders "—" not "0.00%").
  if (rate == null || !per_inr || unitValue == null) return null;
  const pct = pointsToPct(Number(rate), Number(per_inr), Number(unitValue));
  if (!Number.isFinite(pct)) return null;
  return Math.round(pct * 10000) / 10000;
}
