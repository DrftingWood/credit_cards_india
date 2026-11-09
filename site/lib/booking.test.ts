import { describe, test, expect } from "vitest";
import { DEFAULT_PT, ROUTES, rankChannels } from "./booking";

const find = (rows: ReturnType<typeof rankChannels>, start: string) => {
  const row = rows.find((r) => r.channel.name.startsWith(start));
  if (!row) throw new Error(`no channel starting "${start}"`);
  return row;
};

describe("booking channel ranking", () => {
  // The numbers are booking-savings/holistic.py's own output for the same route: the two
  // are one model in two languages, and the TS port had dropped MakeMyTrip's sticker
  // premium, so MakeMyTrip won every route in the UI.
  test.each([
    ["dom-flight", 7263.36, 7092],
    ["intl-flight", 40856.4, 39892.5],
    ["dom-hotel", 11370.24, 10638],
    ["intl-hotel", 58374, 53190],
  ] as const)("%s: MakeMyTrip carries its premium, as in holistic.py", (key, mmtNet, cheapestOtaNet) => {
    const rows = rankChannels(ROUTES[key], ROUTES[key].P, DEFAULT_PT);
    expect(find(rows, "MakeMyTrip").netMid).toBeCloseTo(mmtNet, 1);
    expect(find(rows, "Cheapest OTA + bank").netMid).toBeCloseTo(cheapestOtaNet, 1);
  });

  test("a user's real quote overrides the estimated premium", () => {
    const r = ROUTES["dom-flight"];
    const quoted = rankChannels(r, r.P, DEFAULT_PT, { "MakeMyTrip + myCash + MMT 10% off": 0 });
    // At par with the cheapest OTA, MakeMyTrip's 3% myCash beats 1.5% cashback.
    expect(find(quoted, "MakeMyTrip").netMid).toBeLessThan(find(quoted, "Cheapest OTA + bank").netMid);
  });
});
