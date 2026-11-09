import type { LoyaltyProgram } from "./types";
import type { CanonicalCategory } from "./category-mapping";

export type SpendProfile = Record<Exclude<CanonicalCategory, "telecom">, number> & { telecom?: number };

/** Which sourced unit value to score with. Both are researched per card, not invented:
 *  "realized" = unit_value_inr_realized (the floor, e.g. Adani's ₹0.90 closed-loop);
 *  "face"     = unit_value_inr          (the best documented redemption, the ceiling). */
export type ValueBasis = "realized" | "face";

export interface ScoringContext {
  /** Merchant tokens the user is willing to transact through. When omitted, the calculator is "optimistic" — channel-locked accelerators fire as if the user always books on the right channel. */
  channelMix?: Set<string>;
  /** program-id → tier-id (e.g. {"indigo-bluchip": "silver"}). Stacked INTO the rate (and so the
   *  rank) when `programs` is set. Only the /recommend wizard uses this (D-7). */
  tierMap?: Record<string, string | null>;
  /**
   * program-id → tier-id the user declared on a card page or /calculator (D-24). Valued ONLY
   * as a separate value-components line (explainCard); never stacked into rates or the rank,
   * even when `programs` is set (D-27).
   */
  tierLine?: Record<string, string>;
  /** Programme records used to value `tierLine` tiers. Never change unit values, rates or the rank. */
  tierPrograms?: Record<string, LoyaltyProgram>;
  /** id → loyalty program record. Supplies programme unit values (unitValueFor) and, unless
   *  stackProgramEarn is false, D-9 stacking of programme earn into stacks_with_program rates. */
  programs?: Record<string, LoyaltyProgram>;
  /**
   * false = use `programs` for unit values only; never add programme baseline / channel / tier
   * earn to a card's rate or rank. Card pages and /calculator set this (D-27): that earn comes
   * from programme membership, not the card (D-8, D-24). Omitted = stack (the /recommend wizard).
   */
  stackProgramEarn?: boolean;
  /**
   * When true (realistic /recommend mode), a merchant/MCC/co-brand-specific
   * accelerator is applied to only a fraction of a broad spend bucket — the
   * rest earns the base rate. When false/omitted (optimistic /calculator), the
   * accelerator covers the whole bucket as if all category spend qualifies (A2).
   */
  applyApplicability?: boolean;
  /**
   * Ecosystems the individual actually uses (by ecosystem_label, e.g. "Adani One").
   * A closed-loop card's points are real ₹1 money ONLY if the user redeems in that
   * ecosystem — so when a card's ecosystem is NOT in this set, its accelerators are
   * dropped and it earns base rate only. `undefined` = optimistic (all ecosystems
   * assumed used), preserving the default calculator behaviour.
   */
  enabledEcosystems?: Set<string>;
  /** "realized" (default, honest floor) or "face" (optimistic ceiling) unit value
   *  for points/miles. Passed to unitValueFor so the Absolute layer can value at face. */
  valueBasis?: ValueBasis;
  /**
   * The user's OWN statement of what share (0–1) of a bucket goes through a merchant
   * token (e.g. {"amazon": 0.4}). Realistic layer only (needs applyApplicability). This is
   * the authored evidence D-18 asks for — supplied by the person whose spend it is — so a
   * narrow accelerator listing that token earns its rate on that share, base on the rest.
   * Alias tokens of one merchant (amazon / amazon-pay) take the MAX, never the sum.
   */
  merchantShares?: Record<string, number>;
}
