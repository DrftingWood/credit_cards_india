import { describe, test, expect, beforeEach } from "vitest";
import {
  DEFAULT_USAGE,
  sanitizeUsage,
  usageContext,
  withoutUsage,
  cardUsageGroups,
  setFamilyShare,
  familySharePct,
  toggleEcosystem,
  usageDelta,
  tokenLabel,
  type UsageProfile,
} from "./usage";
import { readUsage, writeUsage } from "./use-usage-profile";
import { explainCard, type SpendProfile } from "./calculator";
import type { EnrichedCard, AcceleratedReward } from "./types";

const SOURCE = { url: "https://example.test", retrieved_on: "2024-01-01" };
const ZERO: SpendProfile = { online: 0, groceries: 0, dining: 0, fuel: 0, travel: 0, utilities: 0, rent: 0, international: 0 };

function makeCard(accelerated: AcceleratedReward[], extra: Record<string, unknown> = {}): EnrichedCard {
  const rewards = {
    effective_from: "2024-01-01", effective_until: null, currency: "cashback",
    base: { rate: 1, per_inr: 100, unit_value_inr: 1 }, accelerated, source: SOURCE, ...extra,
  };
  return {
    id: "usage-test", name: "Usage Test", current_rewards: rewards, current_benefits: null,
    current_fees: { effective_from: "2024-01-01", effective_until: null, joining_fee_inr: 0, annual_fee_inr: 0, source: SOURCE },
    computed: { fee_waiver_spend_inr: null, is_active: true },
  } as unknown as EnrichedCard;
}

const AMAZON: AcceleratedReward = {
  category: "amazon", canonical_categories: ["online"], multiplier: 0, effective_rate: 5,
  channel: { class: "cobrand-merchant", merchants: ["amazon-pay", "amazon"] },
};
const FOOD: AcceleratedReward = {
  category: "food apps", canonical_categories: ["dining"], multiplier: 0, effective_rate: 10, merchants: ["swiggy", "zomato"],
};
const ANY_ONLINE: AcceleratedReward = {
  category: "online", canonical_categories: ["online"], multiplier: 0, effective_rate: 2,
  channel: { class: "online-any", merchants: ["online-any"] },
};

describe("sanitizeUsage", () => {
  test("defaults: nothing declared, calculator gating off", () => {
    expect(sanitizeUsage(null)).toEqual(DEFAULT_USAGE);
  });
  test("shares are clamped 0..100, zero/garbage entries dropped, bad keys rejected", () => {
    const u = sanitizeUsage({ merchant_share_pct: { amazon: 150, swiggy: 0, zomato: "x", "Bad Key!": 50, flipkart: 30 } });
    expect(u.merchant_share_pct).toEqual({ amazon: 100, flipkart: 30 });
  });
  test("ecosystems are deduped strings", () => {
    expect(sanitizeUsage({ ecosystems: ["Tata Neu", "Tata Neu", 3, ""] }).ecosystems).toEqual(["Tata Neu"]);
  });
});

describe("usageContext — turns the profile into ScoringContext fields", () => {
  const u: UsageProfile = { ...DEFAULT_USAGE, merchant_share_pct: { amazon: 40 }, ecosystems: ["Tata Neu"] };
  test("declared tokens become the channel mix, shares become fractions", () => {
    const c = usageContext(u);
    expect([...c.channelMix]).toEqual(["amazon"]);
    expect(c.merchantShares).toEqual({ amazon: 0.4 });
    expect([...c.enabledEcosystems]).toEqual(["Tata Neu"]);
  });
  test("withoutUsage strips exactly the usage fields", () => {
    const c = withoutUsage({ applyApplicability: true, valueBasis: "realized", ...usageContext(u) });
    expect(c.applyApplicability).toBe(true);
    expect(c.valueBasis).toBe("realized");
    expect(c.channelMix!.size).toBe(0);
    expect(c.merchantShares).toBeUndefined();
    expect(c.enabledEcosystems!.size).toBe(0);
  });
});

describe("cardUsageGroups — which merchants this card cares about", () => {
  test("alias tokens collapse into one family; broad channel classes are not usage questions", () => {
    const groups = cardUsageGroups(makeCard([AMAZON, FOOD, ANY_ONLINE]));
    expect(groups.map((g) => g.family).sort()).toEqual(["amazon", "swiggy", "zomato"]);
    const amazon = groups.find((g) => g.family === "amazon")!;
    expect(amazon.tokens.sort()).toEqual(["amazon", "amazon-pay"]);
    expect(amazon.categories).toEqual(["online"]);
  });
  test("labels are human readable", () => {
    expect(tokenLabel("amazon-pay")).toBe("Amazon");
    expect(tokenLabel("some-new-store")).toBe("Some New Store");
  });
});

describe("setFamilyShare / familySharePct", () => {
  test("writing a family share writes every alias token, so other cards listing either token match", () => {
    const u = setFamilyShare(DEFAULT_USAGE, "amazon", 40);
    expect(u.merchant_share_pct).toEqual({ amazon: 40, "amazon-pay": 40 });
    expect(familySharePct(u, "amazon")).toBe(40);
  });
  test("zero removes the family", () => {
    const u = setFamilyShare(setFamilyShare(DEFAULT_USAGE, "amazon", 40), "amazon", 0);
    expect(u.merchant_share_pct).toEqual({});
  });
  test("toggleEcosystem adds then removes", () => {
    const on = toggleEcosystem(DEFAULT_USAGE, "Tata Neu");
    expect(on.ecosystems).toEqual(["Tata Neu"]);
    expect(toggleEcosystem(on, "Tata Neu").ecosystems).toEqual([]);
  });
});

describe("usageDelta — what the user's usage unlocked or dropped", () => {
  const card = makeCard([AMAZON, FOOD]);
  const sp: SpendProfile = { ...ZERO, online: 20000, dining: 10000 };
  const realistic = { applyApplicability: true, valueBasis: "realized" as const };

  test("declaring Amazon at 40% unlocks the online accelerator and reports the ₹ change", () => {
    const u = setFamilyShare(DEFAULT_USAGE, "amazon", 40);
    const ctx = { ...realistic, ...usageContext(u) };
    const d = usageDelta(explainCard(card, sp, ctx), explainCard(card, sp, withoutUsage(ctx)));
    expect(d).toHaveLength(1);
    expect(d[0].category).toBe("online");
    expect(d[0].change).toBe("unlocked");
    // with: 40% at 5% + 60% at 1% = ₹520/mo; without: 1% = ₹200/mo
    expect(Math.round(d[0].delta_inr_monthly)).toBe(320);
  });

  test("no usage → no delta", () => {
    const ctx = { ...realistic, ...usageContext(DEFAULT_USAGE) };
    expect(usageDelta(explainCard(card, sp, ctx), explainCard(card, sp, withoutUsage(ctx)))).toEqual([]);
  });

  test("a closed-loop card's ecosystem toggle shows up as unlocked", () => {
    const eco = makeCard([{ category: "online", canonical_categories: ["online"], multiplier: 0, effective_rate: 5 }], {
      redemption_scope: "closed-loop", ecosystem_label: "Tata Neu",
    });
    const ctx = { ...realistic, ...usageContext(toggleEcosystem(DEFAULT_USAGE, "Tata Neu")) };
    const d = usageDelta(explainCard(eco, sp, ctx), explainCard(eco, sp, withoutUsage(ctx)));
    expect(d.map((x) => x.change)).toEqual(["unlocked"]);
  });
});

describe("usage store", () => {
  beforeEach(() => { writeUsage(() => DEFAULT_USAGE); });
  test("persists through the shared sanitizer", () => {
    writeUsage((u) => setFamilyShare(u, "swiggy", 250));
    expect(readUsage().merchant_share_pct.swiggy).toBe(100);
  });
});
