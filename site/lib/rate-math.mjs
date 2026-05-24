/**
 * Canonical points/miles → percentage primitive.
 *
 * Returns the value scaled so the calculator's `(amount * rate) / 100` formula
 * produces the correct rupee yield. A card earning 1 point per ₹100 worth ₹1
 * each ⇒ pointsToPct(1, 100, 1) === 1 (meaning 1%), NOT 0.01.
 *
 * Returns 0 when perInr is non-positive — guards against a YAML typo
 * (`per_inr: 0`) producing Infinity and sorting that card to rank 1 in the
 * recommender / calculator output.
 *
 * Shared by site/lib/calculator.ts, site/lib/detail-derivations.ts, and
 * site/scripts/build.mjs so the arithmetic can never silently drift across
 * languages again. The PR-2 "100x base-rate" bug was a direct consequence of
 * three copies of this math disagreeing on units.
 *
 * @param {number} rate
 * @param {number} perInr
 * @param {number} unitValue
 * @returns {number}
 */
export function pointsToPct(rate, perInr, unitValue) {
  if (perInr <= 0) return 0;
  return ((rate * unitValue) / perInr) * 100;
}
