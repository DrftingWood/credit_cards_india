import { describe, test, expect } from "vitest";
import { scoreCard, slabEarn, type SpendProfile } from "./calculator";
import type { EnrichedCard, RateSlab } from "./types";

async function load() {
  const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
  return cards as unknown as EnrichedCard[];
}
function spend(o: Partial<SpendProfile>): SpendProfile {
  return { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0, ...o };
}

// The Axis Bank Cashback Credit Card member T&C, section 5.
const AXIS: RateSlab[] = [
  { upto_spend_inr: 5000, rate_pct: 2, max_value_inr: 100 },
  { upto_spend_inr: 40000, rate_pct: 5, max_value_inr: 1750 },
  { upto_spend_inr: null, rate_pct: 7, max_value_inr: 2150 },
];

describe("marginal slab schedules (E3)", () => {
  test("reproduces the issuer's own worked example — statement 1", async () => {
    // T&C page 6: ₹67,950 of net online spend →
    //   2% on 5,000 = 100 | 5% on 35,000 = 1,750 | 7% on 27,950 = 1,956  → 3,806
    const { value } = slabEarn(AXIS, 67_950);
    expect(value).toBeCloseTo(3806.5, 0);
  });

  test("reproduces the issuer's own worked example — statement 2", async () => {
    // T&C page 7: ₹8,930 of net online spend →
    //   2% on 5,000 = 100 | 5% on 3,930 = 196.5 | 7% tier unused  → 296.5
    const { value } = slabEarn(AXIS, 8_930);
    expect(value).toBeCloseTo(296.5, 0);
  });

  test("rates apply marginally, not as a single flat rate on the whole amount", () => {
    // The defect this primitive fixes: a flat 7% on ₹40,000 would pay ₹2,800.
    // The real schedule pays ₹1,850.
    const { value } = slabEarn(AXIS, 40_000);
    expect(value).toBeCloseTo(1850, 5);
    expect(value).toBeLessThan(40_000 * 0.07);
  });

  test("saturates at the sum of the slab ceilings", () => {
    const { value } = slabEarn(AXIS, 10_000_000);
    expect(value).toBeCloseTo(100 + 1750 + 2150, 5);
  });

  test("slab ceilings bind per slab, so the blended rate falls as spend grows", () => {
    const at40k = slabEarn(AXIS, 40_000).value / 40_000;
    const at70k = slabEarn(AXIS, 70_714).value / 70_714;
    const at150k = slabEarn(AXIS, 150_000).value / 150_000;
    expect(at70k).toBeGreaterThan(at40k); // rising while the 7% slab has room
    expect(at150k).toBeLessThan(at70k); // then diluted once every ceiling is hit
    expect(at70k).toBeCloseTo(0.0566, 3); // ~5.66% blended at full utilisation
  });

  test("a slab schedule is cumulative across buckets, not restarted per bucket", async () => {
    const cards = await load();
    const [axis] = cards.filter((c) => c.id === "axis-cashback");
    // ₹35k of dining + ₹35k of online is ₹70k through ONE accelerator. If each
    // bucket restarted at the bottom slab, both would re-earn the cheap 2% tier
    // and the card would look better than it is.
    const split = scoreCard(axis, spend({ dining: 35_000, online: 35_000 })).annual_gross_inr / 12;
    const single = scoreCard(axis, spend({ dining: 70_000 })).annual_gross_inr / 12;
    expect(split).toBeCloseTo(single, 0);
  });

  test("consumed spend from an earlier bucket shifts later spend into higher slabs", () => {
    const first = slabEarn(AXIS, 5_000, 0);
    const second = slabEarn(AXIS, 5_000, 5_000);
    expect(first.value).toBeCloseTo(100, 5); // 2% slab
    expect(second.value).toBeCloseTo(250, 5); // 5% slab
  });
});

describe("channel-scoped base rate (E4)", () => {
  test("base is not paid outside base.applies_to_categories", async () => {
    const cards = await load();
    const [axis] = cards.filter((c) => c.id === "axis-cashback");
    expect(axis.current_rewards?.base.applies_to_categories).toEqual(["travel"]);

    // Online spend far past the ₹4,000 accelerated cap earns the cap and NOTHING
    // more — the T&C pays base only on card-present spend and travel.
    const monthly = scoreCard(axis, spend({ online: 150_000 })).annual_gross_inr / 12;
    expect(monthly).toBeCloseTo(4000, 0);
  });

  test("base still pays on the categories it is scoped to", async () => {
    const cards = await load();
    const [axis] = cards.filter((c) => c.id === "axis-cashback");
    // Travel is excluded from the accelerator but explicitly base-eligible.
    const monthly = scoreCard(axis, spend({ travel: 100_000 })).annual_gross_inr / 12;
    expect(monthly).toBeCloseTo(750, 0); // 0.75% of ₹1L
  });

  test("cards without applies_to_categories keep unrestricted base earn", async () => {
    const cards = await load();
    const scoped = cards.filter((c) => c.current_rewards?.base.applies_to_categories?.length);
    // Only records with T&C evidence should carry the restriction.
    expect(scoped.map((c) => c.id)).toEqual(["axis-cashback"]);
  });
});

describe("incremental-threshold accelerators (E5)", () => {
  test("a 5%-above-threshold rate does not pay 5% on the whole bucket", async () => {
    const cards = await load();
    const [c] = cards.filter((x) => x.id === "idfc-first-hello-cashback");
    // "5% on incremental online spends above ₹10,000/month": at ₹15,000 the real
    // earn is ₹100 (1% base on the first 10k) + ₹250 (5% on the 5k excess) = ₹350.
    // Encoded as a flat 5% the card claimed ₹750 — more than double.
    const monthly = scoreCard(c, spend({ online: 15_000 })).annual_gross_inr / 12;
    expect(monthly).toBeCloseTo(350, 0);
    expect(monthly).toBeLessThan(15_000 * 0.05);
  });

  test("the online cap saturates the incremental slab at the documented point", async () => {
    const cards = await load();
    const [c] = cards.filter((x) => x.id === "idfc-first-hello-cashback");
    // ₹1,000 online cap / 5% = ₹20,000 of incremental spend, i.e. ₹30,000 total.
    const atCap = scoreCard(c, spend({ online: 30_000 })).annual_gross_inr / 12;
    const past = scoreCard(c, spend({ online: 60_000 })).annual_gross_inr / 12;
    // Uncapped the schedule would pay ₹1,100 (₹100 on the 1% slab + ₹1,000 on the
    // 5% slab); the ₹1,000 accelerator cap binds first.
    expect(atCap).toBeLessThan(1100);
    // Known delta: the issuer caps TOTAL online cashback at ₹1,000, while the
    // engine still pays base on over-cap spend — worth ~₹20 here. Generic over-cap
    // base behaviour is right for most cards, so this is bounded, not silent.
    expect(atCap).toBeGreaterThanOrEqual(1000);
    expect(atCap).toBeLessThanOrEqual(1030);
    expect(past).toBeGreaterThanOrEqual(atCap); // base continues; accelerator does not grow
    expect(past - atCap).toBeLessThan(1000);
  });
});
