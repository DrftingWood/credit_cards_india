import { describe, test, expect } from "vitest";
import { pickHighlights } from "./present";
import type { DecoupledScore } from "./scorer-decoupled";

const mk = (id: string, net: number, fee: number, reason = ""): DecoupledScore =>
  ({ card: { id, issuer: "x", computed: { is_lifetime_free: fee === 0 } },
     net_rewards_inr: net, annual_rewards_inr: net + fee, annual_fee_inr: fee,
     first_year_bonus_inr: 0, milestone_value_inr: 0,
     lounge_visits: { domestic: 0, international: 0 }, reason, flags: [] }) as unknown as DecoupledScore;

describe("pickHighlights — labels the ranked list, never re-ranks", () => {
  const scores = [mk("a", 9000, 5000, "Best on your dining spend"), mk("b", 8000, 0), mk("c", 7000, 0)];
  const payload = { monthly_spend: { dining: "gt-30k", online: "0", travel: "0", groceries: "0", fuel: "0" } } as never;

  test("best-overall is scores[0]; best-no-fee is the first lifetime-free card", () => {
    const h = pickHighlights(scores, payload);
    expect(h.find((x) => x.key === "best-overall")!.score.card.id).toBe("a");
    expect(h.find((x) => x.key === "best-no-fee")!.score.card.id).toBe("b");
  });

  test("no highlight points at a card not present in the ranked list", () => {
    const h = pickHighlights(scores, payload);
    for (const x of h) expect(scores.indexOf(x.score)).toBeGreaterThanOrEqual(0);
  });

  test("no duplicate card across highlights", () => {
    const h = pickHighlights(scores, payload);
    const ids = h.map((x) => x.score.card.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("empty scores → empty highlights", () => {
    expect(pickHighlights([], payload)).toEqual([]);
  });
});
