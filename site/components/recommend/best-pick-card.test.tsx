// site/components/recommend/best-pick-card.test.tsx
import { describe, test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BestPickCard } from "./best-pick-card";
import type { Highlight } from "@/lib/present";

const card = {
  id: "hdfc-infinia", issuer: "hdfc", name: "HDFC Infinia",
  network_detail: { name: "Visa Infinite" }, tier: "super-premium",
  current_fees: { annual_fee_inr: 12500 },
  current_rewards: { currency: "points" },
  computed: { is_lifetime_free: false, headline_rate_pct: 3.3, fee_waiver_spend_inr: 1000000, has_domestic_lounge: true, has_international_lounge: true },
  metadata: { last_verified_on: "2026-07-06" },
} as never;
const highlight: Highlight = {
  key: "best-overall", label: "Best overall for your spend",
  score: { card, net_rewards_inr: 51600, annual_rewards_inr: 64100, annual_fee_inr: 12500,
           first_year_bonus_inr: 0, milestone_value_inr: 0,
           lounge_visits: { domestic: "unlimited", international: "unlimited" },
           reason: "Best on your dining + travel", flags: [] } as never,
};

const nullFeeCard = {
  id: "some-issuer-card", issuer: "some-issuer", name: "Some Card",
  network_detail: { name: "Visa" }, tier: "entry-level",
  current_fees: null,
  current_rewards: { currency: "points" },
  computed: { is_lifetime_free: false, headline_rate_pct: 1.5, fee_waiver_spend_inr: null, has_domestic_lounge: false, has_international_lounge: false },
  metadata: { last_verified_on: "2026-07-06" },
} as never;
const nullFeeHighlight: Highlight = {
  key: "best-overall", label: "Best overall for your spend",
  score: { card: nullFeeCard, net_rewards_inr: 1000, annual_rewards_inr: 1000, annual_fee_inr: 0,
           first_year_bonus_inr: 0, milestone_value_inr: 0,
           lounge_visits: { domestic: "none", international: "none" },
           reason: "Best on your dining + travel", flags: [] } as never,
};

describe("BestPickCard — facts + tagged estimate", () => {
  const html = renderToStaticMarkup(<BestPickCard highlight={highlight} />);
  test("shows the highlight label and card name", () => {
    expect(html).toContain("Best overall for your spend");
    expect(html).toContain("HDFC Infinia");
  });
  test("net ₹/yr is present and tagged as an estimate", () => {
    expect(html).toContain("51,600");
    expect(html.toLowerCase()).toContain("est");
  });
  test("links to the card detail page for the breakdown", () => {
    expect(html).toContain("/card/hdfc/infinia");
  });
  test("shows the verified date (trust), not a star rating", () => {
    expect(html).toContain("2026-07-06");
    expect(html).not.toContain("★");
  });
  test("shows '—' (not 'Lifetime free') for a card with a null/missing fee record", () => {
    const nullFeeHtml = renderToStaticMarkup(<BestPickCard highlight={nullFeeHighlight} />);
    expect(nullFeeHtml).toContain("—");
    expect(nullFeeHtml).not.toContain("Lifetime free");
  });
});
