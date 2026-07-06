import { describe, test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AcceleratorRow, baseRowCutNote } from "./acceleration-breakdown";
import type { AcceleratorExplain } from "@/lib/calculator";

const capped: AcceleratorExplain = {
  category: "travel", label: "Travel & hotels", monthly_spend: 200000, rate_pct: 33.3,
  uncapped_value_inr: 60000, cap_monthly_inr: 15000, cap_bound: true,
  lost_to_cap_inr: 45000, base_spillover_inr: 3000, net_value_inr: 18000,
  factors: ["Cap ₹15,000/mo reached — extra spend earns base", "Requires booking via smartbuy"],
};

describe("AcceleratorRow renders the cap story", () => {
  const html = renderToStaticMarkup(<AcceleratorRow item={capped} />);
  test("shows the uncapped, the cap, the ₹ lost, and the net", () => {
    expect(html).toContain("60,000");   // uncapped
    expect(html).toContain("15,000");   // cap
    expect(html).toContain("45,000");   // lost to cap
    expect(html).toContain("18,000");   // net
  });
  test("lists the factors and has no emoji", () => {
    expect(html).toContain("Cap ₹15,000/mo reached");
    expect(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(html)).toBe(false);
  });
});

// FIX 1 / FIX 4: in Realistic, a channel-locked accelerator (e.g. HDFC Infinia
// SmartBuy) is dropped to base and its bucket lands in ex.base_spend with no
// explanation. baseRowCutNote pulls the reason back out of the Absolute layer's
// own factor list so the Realistic viewer sees a fact instead of the row just
// vanishing. It's a pure function, so it's tested directly without rendering
// the (hook-driven) AccelerationBreakdown component.
describe("baseRowCutNote — sources the Realistic cut reason from the Absolute layer", () => {
  const channelLockedAbsolute: AcceleratorExplain = {
    category: "travel", label: "Travel & hotels", monthly_spend: 200000, rate_pct: 33.3,
    uncapped_value_inr: 60000, cap_monthly_inr: 15000, cap_bound: false,
    lost_to_cap_inr: 0, base_spillover_inr: 0, net_value_inr: 60000,
    factors: ["Requires booking via smartbuy", "Assumes 100% of this bucket qualifies"],
  };

  test("returns a factual note naming the booking channel when the Absolute row is channel-locked", () => {
    const note = baseRowCutNote("travel", [channelLockedAbsolute]);
    expect(note).toBe("Travel & hotels — earns base; accelerated rate needs booking via smartbuy");
    expect(note && /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(note)).toBe(false);
  });

  test("falls back to the applicability constraint when there's no channel factor", () => {
    const narrowAbsolute: AcceleratorExplain = {
      ...channelLockedAbsolute,
      factors: ["Assumes 100% of this bucket qualifies"],
    };
    const note = baseRowCutNote("travel", [narrowAbsolute]);
    expect(note).toBe("Travel & hotels — earns base; accelerated rate needs 100% of this bucket qualifies");
  });

  test("returns null when the category never accelerates in Absolute either", () => {
    expect(baseRowCutNote("dining", [channelLockedAbsolute])).toBeNull();
  });

  test("returns null when the Absolute row exists but carries no requires/assumes factor", () => {
    const noConstraint: AcceleratorExplain = { ...channelLockedAbsolute, factors: ["Capped at ₹15,000/mo"] };
    expect(baseRowCutNote("travel", [noConstraint])).toBeNull();
  });
});
