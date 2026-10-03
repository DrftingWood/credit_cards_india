import { describe, test, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CardTile } from "./card-tile";
import { CompareTable } from "./compare-table";
import { BestPickCard } from "./recommend/best-pick-card";
import { RankedRow } from "./recommend/ranked-row";
import { AccelerationBreakdown } from "./detail/acceleration-breakdown";
import { toClientCard } from "@/lib/client-card";
import { scoreDecoupled } from "@/lib/scorer-decoupled";
import { pickHighlights } from "@/lib/present";
import type { RecommendPayload } from "@/lib/recommender";
import type { EnrichedCard, LoyaltyProgram } from "@/lib/types";

// Markup rendered from the trimmed client card must match the full card's,
// so no field the components read was left out of the allowlist.

async function load() {
  const { default: cards } = await import("../../dist/cards.json", { with: { type: "json" } });
  const { default: progs } = await import("../../dist/loyalty_programs.json", { with: { type: "json" } });
  const full = (cards as unknown as EnrichedCard[]).filter((c) => c.computed.is_active);
  return {
    full,
    slim: full.map(toClientCard),
    programs: Object.fromEntries((progs as unknown as LoyaltyProgram[]).map((p) => [p.id, p])),
  };
}

describe("client components render identically from the trimmed card", () => {
  test("CardTile, AccelerationBreakdown and CompareTable", async () => {
    const { full, slim } = await load();
    full.forEach((card, i) => {
      expect(renderToStaticMarkup(<CardTile card={slim[i]} />)).toBe(renderToStaticMarkup(<CardTile card={card} />));
      expect(renderToStaticMarkup(<AccelerationBreakdown card={slim[i]} />)).toBe(
        renderToStaticMarkup(<AccelerationBreakdown card={card} />),
      );
    });
    for (let i = 0; i < full.length; i += 4) {
      expect(renderToStaticMarkup(<CompareTable cards={slim.slice(i, i + 4)} />)).toBe(
        renderToStaticMarkup(<CompareTable cards={full.slice(i, i + 4)} />),
      );
    }
  });

  test("BestPickCard and RankedRow", async () => {
    const { full, slim, programs } = await load();
    const p: RecommendPayload = {
      income_band: "75k-1.5L",
      goals: ["cashback"],
      monthly_spend: { online: "15k-30k", travel: "5k-15k", dining: "5k-15k", groceries: "lt-5k", fuel: "lt-5k" },
      brand_preferences: { shopping: ["amazon"], airline: null, food_ecosystem: null, fuel_station: null },
      lifestyle: { lounge_pref: null, recurring: [] },
    };
    const a = scoreDecoupled(full, programs, p, { topN: 400 });
    const b = scoreDecoupled(slim, programs, p, { topN: 400 });
    a.forEach((s, i) => {
      expect(renderToStaticMarkup(<RankedRow rank={i + 1} score={b[i]} />)).toBe(
        renderToStaticMarkup(<RankedRow rank={i + 1} score={s} />),
      );
    });
    const ha = pickHighlights(a, p);
    const hb = pickHighlights(b, p);
    ha.forEach((h, i) => {
      expect(renderToStaticMarkup(<BestPickCard highlight={hb[i]} />)).toBe(renderToStaticMarkup(<BestPickCard highlight={h} />));
    });
  });
});
