import { describe, test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AcceleratorRow, baseRowCutNote, breakdownLayers } from "./acceleration-breakdown";
import type { AcceleratorExplain, ScoringContext } from "@/lib/calculator";

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

// The panel embedded under a /calculator row must reconcile with that row. It can only do
// that if it scores with the SAME ScoringContext the host ranked with, rather than inventing
// its own. breakdownLayers is the pure seam: a host hands in its ctx, that becomes the
// primary (default-selected) layer; standalone keeps the self-contained Realistic/Absolute pair.
describe("breakdownLayers — host context wins when one is supplied", () => {
  test("standalone offers Realistic then Absolute", () => {
    const layers = breakdownLayers();
    expect(layers.map((l) => l.id)).toEqual(["realistic", "absolute"]);
    expect(layers[0].ctx.applyApplicability).toBe(true);
    expect(layers[0].ctx.valueBasis).toBe("realized");
    expect(layers[1].ctx.valueBasis).toBe("face");
  });

  test("a host ctx becomes the primary layer, passed through by identity", () => {
    const hostCtx: ScoringContext = { enabledEcosystems: new Set(["Tata Neu"]) };
    const layers = breakdownLayers(hostCtx, "Realistic");
    expect(layers[0].id).toBe("host");
    expect(layers[0].ctx).toBe(hostCtx); // identity — not a reconstruction that can drift
    expect(layers[0].label).toBe("Realistic");
  });

  test("the Absolute comparison layer is still offered alongside a host ctx", () => {
    const layers = breakdownLayers({}, "Best-case");
    expect(layers.map((l) => l.id)).toEqual(["host", "absolute"]);
    expect(layers[1].ctx.valueBasis).toBe("face");
  });
});
