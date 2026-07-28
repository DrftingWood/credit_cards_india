import { describe, test, expect } from "vitest";
import { allocatePortfolio } from "./portfolio";
import { scoreCard, type SpendProfile } from "./calculator";
import type { EnrichedCard, LoyaltyProgram } from "./types";

async function load() {
  const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
  return cards as unknown as EnrichedCard[];
}
function spend(o: Partial<SpendProfile>): SpendProfile {
  return { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0, ...o };
}
const byId = (cards: EnrichedCard[], ids: string[]) => cards.filter((c) => ids.includes(c.id));

// The food-delivery stack that motivated this module: ₹1.5L/month of dining
// against 10% rates that cap at ₹1,000–1,500 of cashback per month.
const HEAVY_DINING = spend({ dining: 150_000 });
const STACKABLE = ["hdfc-swiggy-hdfc", "hsbc-live-plus", "yes-paisabazaar-rupay", "sbi-cashback", "axis-cashback"];

describe("cap-aware portfolio allocation", () => {
  test("stacks several cards when one card's cap cannot absorb the spend", async () => {
    const cards = await load();
    const p = allocatePortfolio(byId(cards, STACKABLE), HEAVY_DINING);

    expect(p.slots.length).toBeGreaterThan(1);
    // Every card in the stack is doing real work.
    for (const s of p.slots) expect(s.monthly_value_inr).toBeGreaterThan(0);
    // The stack beats the single best card scored alone — the whole point.
    const best = Math.max(
      ...byId(cards, STACKABLE).map((c) => scoreCard(c, HEAVY_DINING).annual_gross_inr),
    );
    expect(p.annual_value_inr).toBeGreaterThan(best);
  });

  test("a rising slab schedule is ranked by the blended rate it actually delivers", async () => {
    const cards = await load();
    // axis-cashback climbs 2% -> 5% -> 7% over cumulative monthly spend and caps at
    // Rs 4,000, reached at Rs 70,714. Its 7% top slab is NOT an offer the allocator
    // can take on its own, so the card must be ranked at its blended ~5.66%, and no
    // spend should be routed past the point where it stops earning.
    const solo = allocatePortfolio(byId(cards, ["axis-cashback"]), spend({ online: 150_000 }), {}, { dropFeeNegative: false });
    expect(solo.slots.length).toBe(1);
    const slot = solo.slots[0];
    expect(slot.monthly_value_inr).toBeCloseTo(4000, 0);
    // Base is scoped to travel only (E4), so online overflow earns nothing and must
    // spill to another card rather than sitting on this one.
    expect(slot.monthly_spend_inr).toBeCloseTo(70_714, -2);
    expect(slot.effective_rate_pct).toBeCloseTo(5.66, 1);
    expect(slot.cap_bound).toBe(true);
    expect(solo.unallocated_monthly_spend_inr).toBeGreaterThan(0);
  });

  test("a channel-scoped accelerator covers food delivery, not just the online bucket", async () => {
    const cards = await load();
    // axis-cashback's accelerator is scoped by CHANNEL (card-not-present), not by
    // merchant category: the member T&C defines online qualifying spend as "all
    // online spends (card not present) except travel MCCs", and its worked example
    // routes an ONLINE grocery purchase into the accelerated tier while an OFFLINE
    // dining purchase falls to base. Food delivery is card-not-present dining, so it
    // qualifies — the record was previously tagged [online] only, which silently
    // zeroed the card for exactly the spend profile it is best at.
    const [axis] = byId(cards, ["axis-cashback"]);
    expect(axis.current_rewards?.accelerated?.[0]?.canonical_categories).toContain("dining");
    const onDining = scoreCard(axis, HEAVY_DINING).annual_gross_inr;
    const onOnline = scoreCard(axis, spend({ online: 150_000 })).annual_gross_inr;
    expect(onDining).toBeCloseTo(onOnline, 0);
    // Cap binds either way, so the card is worth exactly its ₹4,000/month ceiling.
    expect(onDining / 12).toBeCloseTo(4000, 0);
  });

  test("reports which categories ran out of capacity rather than silently dropping spend", async () => {
    const cards = await load();
    const p = allocatePortfolio(byId(cards, ["hdfc-swiggy-hdfc"]), HEAVY_DINING, {}, { dropFeeNegative: false });
    expect(p.cap_constrained_categories).toContain("dining");
    // Allocated + unallocated must reconcile to the spend put in — no leakage.
    const allocated = p.slots.reduce((t, s) => t + s.monthly_spend_inr, 0);
    expect(allocated + p.unallocated_monthly_spend_inr).toBeCloseTo(150_000, 0);
  });

  test("never stacks two cards the issuer will not co-issue", async () => {
    const cards = await load();
    const swiggyFamily = byId(cards, ["hdfc-swiggy-hdfc", "hdfc-swiggy-blck", "hdfc-swiggy-ornge"]);
    expect(swiggyFamily.length).toBe(3);
    for (const c of swiggyFamily) expect(c.metadata?.exclusive_group).toBe("hdfc-swiggy");

    const p = allocatePortfolio(swiggyFamily, HEAVY_DINING, {}, { dropFeeNegative: false });
    expect(p.slots.length).toBe(1);
  });

  test("a held card blocks the rest of its exclusive group from entering the stack", async () => {
    const cards = await load();
    const swiggyFamily = byId(cards, ["hdfc-swiggy-hdfc", "hdfc-swiggy-blck", "hdfc-swiggy-ornge"]);
    // Holding Swiggy HDFC makes Swiggy BLCK unobtainable, so the stack must not
    // propose it even though BLCK carries an independent ₹1,500/month cap.
    const p = allocatePortfolio(swiggyFamily, HEAVY_DINING, {}, {
      heldCardIds: ["hdfc-swiggy-hdfc"],
      dropFeeNegative: false,
    });
    expect(p.slots.some((s) => s.card.id === "hdfc-swiggy-blck")).toBe(false);
    expect(p.slots.some((s) => s.card.id === "hdfc-swiggy-ornge")).toBe(false);
    // ...but the held card itself must still be USED. Pre-claiming its group has
    // to exempt the holder, or holding the best card silently removes it.
    expect(p.slots.some((s) => s.card.id === "hdfc-swiggy-hdfc")).toBe(true);
  });

  test("honours maxCards", async () => {
    const cards = await load();
    const p = allocatePortfolio(byId(cards, STACKABLE), HEAVY_DINING, {}, { maxCards: 2, dropFeeNegative: false });
    expect(p.slots.length).toBeLessThanOrEqual(2);
  });

  test("allocation is monotonic — higher-rate cards are filled before lower-rate ones", async () => {
    const cards = await load();
    const p = allocatePortfolio(byId(cards, STACKABLE), HEAVY_DINING, {}, { dropFeeNegative: false });
    const capBound = p.slots.filter((s) => s.cap_bound);
    // Any card that is NOT cap-bound must earn no more than the worst cap-bound
    // rate: greedy fills the best rates to their caps first.
    if (capBound.length > 0) {
      const worstCapBoundRate = Math.min(...capBound.map((s) => s.effective_rate_pct));
      for (const s of p.slots.filter((x) => !x.cap_bound)) {
        expect(s.effective_rate_pct).toBeLessThanOrEqual(worstCapBoundRate + 0.001);
      }
    }
  });

  test("drops a card whose annual fee exceeds what it contributes", async () => {
    const cards = await load();
    const p = allocatePortfolio(byId(cards, STACKABLE), spend({ dining: 500 }));
    for (const s of p.slots) expect(s.monthly_value_inr * 12).toBeGreaterThan(s.annual_fee_inr);
  });

  test("empty spend yields an empty portfolio rather than throwing", async () => {
    const cards = await load();
    const p = allocatePortfolio(byId(cards, STACKABLE), spend({}));
    expect(p.slots).toEqual([]);
    expect(p.annual_net_inr).toBe(0);
  });

  test("a cap shared across buckets is not re-offered in each bucket", async () => {
    const cards = await load();
    // axis-cashback's ₹4,000 cap and slab schedule are shared by dining and online.
    // Measuring tranche widths PER BUCKET made it look like it had fresh capacity in
    // each, so it absorbed ₹70,709 of dining AND ₹20,000 of online while saturating
    // at ₹70,714 total — the extra ₹20,000 earned nothing and never spilled to a card
    // that would have paid for it.
    const p = allocatePortfolio(byId(cards, ["axis-cashback"]), spend({ dining: 150_000, online: 20_000 }), {}, { dropFeeNegative: false });
    const axis = p.slots.find((s) => s.card.id === "axis-cashback")!;
    // Before the fix this was ₹90,709 — the full dining tranche PLUS the whole
    // online bucket. The marginal-value clamp brings it back to roughly the
    // ₹70,714 saturation point (bisection leaves a few thousand of slack, which
    // costs nothing because the value is already capped).
    expect(axis.monthly_spend_inr).toBeLessThan(80_000);
    expect(axis.monthly_value_inr).toBeCloseTo(4000, 0);
    // The spend it cannot pay for must be reported as unallocated, not absorbed.
    expect(p.unallocated_monthly_spend_inr).toBeGreaterThan(90_000);
  });

  test("prunes a card that clears its own fee but still shrinks the stack", async () => {
    const cards = await load();
    // Greedy fills by rate and never looks back, so it can admit a card whose fee
    // is covered by its own earnings yet whose spend would have paid more sitting
    // on a card already in the stack. At ₹50k dining the unconstrained greedy
    // returned ₹63,120 where a smaller stack was worth ₹66,420.
    const pool = byId(cards, ["hdfc-swiggy-hdfc","hsbc-live-plus","hsbc-rupay-cashback",
                              "yes-paisabazaar","axis-cashback","hdfc-millennia","kotak-cashback-plus"]);
    const p = allocatePortfolio(pool, spend({ dining: 50_000, online: 20_000 }), {}, {
      heldCardIds: ["hdfc-swiggy-hdfc"],
    });
    // No slot may lose money, and the reported net must equal the sum of the parts.
    for (const s of p.slots) expect(s.monthly_value_inr * 12).toBeGreaterThan(s.annual_fee_inr);
    const summed = p.slots.reduce((t, s) => t + s.monthly_value_inr * 12 - s.annual_fee_inr, 0);
    expect(p.annual_net_inr).toBeCloseTo(summed, 0);
    // Dropping any single non-held card must not improve the net — the stack is
    // locally optimal, which is what the prune pass exists to guarantee.
    for (const s of p.slots) {
      if (s.card.id === "hdfc-swiggy-hdfc") continue;
      const without = allocatePortfolio(pool.filter((c) => c.id !== s.card.id),
        spend({ dining: 50_000, online: 20_000 }), {}, { heldCardIds: ["hdfc-swiggy-hdfc"] });
      expect(without.annual_net_inr).toBeLessThanOrEqual(p.annual_net_inr + 1);
    }
  });
});
