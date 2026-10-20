import { describe, test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { UsagePanel, DeclaredUsageSummary } from "./usage-panel";
import { DEFAULT_USAGE, setFamilyShare, setLoyaltyTier, toggleEcosystem, type UsageGroup, type UsageDelta } from "@/lib/usage";
import type { LoyaltyProgram } from "@/lib/types";
import type { LoyaltyTierItem } from "@/lib/value-components";

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const GROUPS: UsageGroup[] = [
  { family: "amazon", label: "Amazon", tokens: ["amazon-pay"], categories: ["online"] },
  { family: "smartbuy", label: "HDFC SmartBuy", tokens: ["smartbuy"], categories: ["travel"] },
];

describe("UsagePanel", () => {
  test("asks one share question per merchant, naming the bucket it applies to", () => {
    const html = renderToStaticMarkup(<UsagePanel groups={GROUPS} usage={setFamilyShare(DEFAULT_USAGE, "amazon", 40)} ecosystem={null} deltas={[]} />);
    expect(html).toContain("Amazon");
    expect(html).toContain("HDFC SmartBuy");
    expect(html).toMatch(/Online shopping/);
    expect(html).toContain('value="40"');
    expect(EMOJI.test(html)).toBe(false);
  });

  test("a closed-loop card asks whether the user redeems in its ecosystem", () => {
    const html = renderToStaticMarkup(<UsagePanel groups={[]} usage={toggleEcosystem(DEFAULT_USAGE, "Tata Neu")} ecosystem="Tata Neu" deltas={[]} />);
    expect(html).toMatch(/I redeem in Tata Neu/);
    expect(html).toContain("checked");
  });

  test("lists what the usage unlocked, with the ₹ change", () => {
    const deltas: UsageDelta[] = [{ category: "online", label: "Online shopping", change: "unlocked", delta_inr_monthly: 320 }];
    const html = renderToStaticMarkup(<UsagePanel groups={GROUPS} usage={DEFAULT_USAGE} ecosystem={null} deltas={deltas} />);
    expect(html).toMatch(/Unlocked/);
    expect(html).toContain("+₹320/mo");
  });

  const PROG = {
    id: "test-air", name: "Test Air Club",
    earn: { tiers: [{ id: "silver", name: "Silver", bonus_rate: 2, bonus_per_inr: 100 }, { id: "gold", name: "Gold", bonus_rate: 4, bonus_per_inr: 100 }] },
  } as unknown as LoyaltyProgram;
  const BONUS: LoyaltyTierItem = {
    program_id: "test-air", program_name: "Test Air Club", tier_id: "gold", tier_name: "Gold",
    qualifying_spend_annual_inr: 120000, annual_inr: 2160,
  };

  test("a card that stacks with a tiered programme asks for the user's tier, even with no other questions", () => {
    const u = setLoyaltyTier(DEFAULT_USAGE, "test-air", "gold");
    const html = renderToStaticMarkup(<UsagePanel groups={[]} usage={u} ecosystem={null} deltas={[]} tier={{ program: PROG, bonus: BONUS }} />);
    expect(html).toMatch(/Your Test Air Club tier/);
    expect(html).toContain(">None<");
    expect(html).toContain(">Silver<");
    expect(html).toMatch(/<option value="gold" selected="">Gold<\/option>/);
    expect(html).toContain("+₹2,160/yr");
    expect(html).toContain("₹1,20,000");
    expect(EMOJI.test(html)).toBe(false);
  });

  test("a tier with no qualifying spend says so instead of showing ₹0", () => {
    const u = setLoyaltyTier(DEFAULT_USAGE, "test-air", "gold");
    const html = renderToStaticMarkup(<UsagePanel groups={[]} usage={u} ecosystem={null} deltas={[]} tier={{ program: PROG, bonus: null }} />);
    expect(html).toMatch(/no spend through this card(?:'|&#x27;)s Test Air Club bookings yet/i);
  });

  test("an entry tier with no bonus says it earns no bonus, not that spend is missing", () => {
    const prog = { ...PROG, earn: { tiers: [{ id: "base", name: "Base", bonus_rate: 0, bonus_per_inr: 100 }] } } as unknown as LoyaltyProgram;
    const u = setLoyaltyTier(DEFAULT_USAGE, "test-air", "base");
    const html = renderToStaticMarkup(<UsagePanel groups={[]} usage={u} ecosystem={null} deltas={[]} tier={{ program: prog, bonus: null }} />);
    expect(html).toMatch(/Base earns no tier bonus/);
    expect(html).not.toMatch(/no spend through/i);
  });

  test("renders nothing when the card has no usage questions", () => {
    expect(renderToStaticMarkup(<UsagePanel groups={[]} usage={DEFAULT_USAGE} ecosystem={null} deltas={[]} />)).toBe("");
  });
});

describe("DeclaredUsageSummary", () => {
  test("one entry per merchant family, not per alias token", () => {
    const u = setFamilyShare(setFamilyShare(DEFAULT_USAGE, "amazon", 40), "swiggy", 60);
    const html = renderToStaticMarkup(<DeclaredUsageSummary usage={u} />);
    expect(html.match(/Amazon/g)).toHaveLength(1);
    expect(html).toContain("40%");
    expect(html).toContain("Swiggy");
  });
  test("says how to declare when nothing is", () => {
    expect(renderToStaticMarkup(<DeclaredUsageSummary usage={DEFAULT_USAGE} />)).toMatch(/No merchant shares declared/);
  });
});
