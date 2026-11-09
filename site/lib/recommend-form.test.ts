import { describe, test, expect } from "vitest";
import { INITIAL_STATE, buildPayload, impliedProgramIds, type FormState } from "./recommend-form";
import type { LoyaltyProgram } from "./types";

async function programs() {
  const { default: progs } = await import("../../dist/loyalty_programs.json", { with: { type: "json" } });
  return progs as unknown as LoyaltyProgram[];
}

describe("/recommend wizard answers", () => {
  // Travel at ₹30k+, IndiGo picked, a BluChip tier declared.
  const answered: FormState = {
    ...INITIAL_STATE,
    income: "gt-3L",
    goals: ["travel"],
    spend: { ...INITIAL_STATE.spend, travel: "gt-30k" },
    airline: "indigo",
    loyaltyTiers: { "indigo-bluchip": "silver" },
  };

  test("a visible brand answer reaches the scorer with its programme tier", async () => {
    const progs = await programs();
    expect(impliedProgramIds(answered, progs)).toContain("indigo-bluchip");
    const payload = buildPayload(answered, progs);
    expect(payload.brand_preferences.airline).toBe("indigo");
    expect(payload.loyalty_tiers).toEqual({ "indigo-bluchip": "silver" });
  });

  test("lowering the spend band hides the question and drops its answer and tier", async () => {
    const progs = await programs();
    const lowered: FormState = { ...answered, spend: { ...answered.spend, travel: "0", online: "gt-30k" }, shoppingPlatforms: ["amazon"] };
    expect(impliedProgramIds(lowered, progs)).not.toContain("indigo-bluchip");
    const payload = buildPayload(lowered, progs);
    expect(payload.brand_preferences.airline).toBeNull();
    expect(payload.brand_preferences.shopping).toEqual(["amazon"]);
    expect(payload.loyalty_tiers).toEqual({});
  });
});
