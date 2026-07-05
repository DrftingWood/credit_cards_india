import { describe, test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AcceleratorRow } from "./acceleration-breakdown";
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
