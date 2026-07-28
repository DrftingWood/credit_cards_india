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

  test("a cap-bound card's payout does not depend on its headline rate — only on how much spend it absorbs", async () => {
    const cards = await load();
    // axis-cashback caps at ₹4,000/month of cashback on ONLINE spend. Whether the
    // encoded rate is 7% or 5%, ₹1.5L/month is far past the cap, so the payout is
    // identical either way; what the rate changes is how much spend the card soaks
    // up, and therefore how much spills to the next card in the stack.
    const solo = allocatePortfolio(byId(cards, ["axis-cashback"]), spend({ online: 150_000 }), {}, { dropFeeNegative: false });
    expect(solo.slots.length).toBe(1);
    const slot = solo.slots[0];
    expect(slot.cap_bound).toBe(true);
    // ₹4,000 from the capped 7% tranche, then 0.75% base on the ₹92,857 overflow.
    // Getting this right is the whole reason tranches replaced a single (rate, cap)
    // pair: the naive model reads uncapped base earnings as accelerator headroom
    // and reports ₹10,500.
    expect(slot.monthly_value_inr).toBeCloseTo(4000 + (150_000 - 4000 / 0.07) * 0.0075, 0);
    // Base is uncapped, so the card still absorbs the overflow — at a far worse rate.
    expect(slot.monthly_spend_inr).toBeCloseTo(150_000, 0);
    expect(slot.effective_rate_pct).toBeLessThan(7);
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
    // Cap binds either way, so the card is worth its ₹4,000/month ceiling.
    expect(onDining / 12).toBeGreaterThan(4000);
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
});
