// Channel-aware "how should I actually book this?" model.
//
// SEPARATE from the card reward calculator — it consumes reward rates as inputs and
// never re-derives them or touches lib/calculator.ts. TS port of booking-savings/holistic.py,
// with portal markups expressed as {lo, mid, hi} ranges (see booking-savings/MARKUPS.md for
// the sourced calibration + confidence). Net cost, not highest reward, is the ranking key:
//   net = P·(1+markup)·(1−cappedDiscount) − rewardValue        [pay cash]
//   net = pointsBurned · pointAltValue                          [pay with points]

export type RouteKey = "dom-flight" | "intl-flight" | "dom-hotel" | "intl-hotel";

export interface Route {
  key: RouteKey;
  label: string;
  P: number; // typical baseline (cheapest-aggregator) price
  sb: [number, number, number]; // SmartBuy markup {lo, mid, hi}
  edge: [number, number, number]; // Axis Travel EDGE markup
  ota: number; // priciest-OTA (MMT) sticker premium over cheapest
  inst: number; // bank instant-discount rate on OTAs
  cap: number; // instant-discount cap ₹
  mmtEarn: number; // MMT×ICICI myCash %
  direct: boolean; // is airline/hotel-direct a channel here
}

// Calibrated to booking-savings/MARKUPS.md (2026-07 research). Markups are estimates;
// dynamic pricing means any single booking varies — hence ranges, and quote overrides in the UI.
export const ROUTES: Record<RouteKey, Route> = {
  "dom-flight": { key: "dom-flight", label: "Domestic flight", P: 8000, sb: [0.02, 0.03, 0.05], edge: [0.05, 0.055, 0.06], ota: 0.04, inst: 0.1, cap: 1750, mmtEarn: 0.03, direct: true },
  "intl-flight": { key: "intl-flight", label: "International flight", P: 45000, sb: [0.03, 0.08, 0.08], edge: [0.06, 0.12, 0.12], ota: 0.04, inst: 0.1, cap: 5000, mmtEarn: 0.03, direct: true },
  "dom-hotel": { key: "dom-hotel", label: "Domestic hotel", P: 12000, sb: [0.05, 0.1, 0.12], edge: [0.25, 0.3, 0.4], ota: 0.12, inst: 0.1, cap: 3000, mmtEarn: 0.06, direct: false },
  "intl-hotel": { key: "intl-hotel", label: "International hotel", P: 60000, sb: [0.1, 0.2, 0.2], edge: [0.25, 0.32, 0.4], ota: 0.15, inst: 0.1, cap: 10000, mmtEarn: 0.06, direct: false },
};

// Point alternative values (what a burned point is worth elsewhere) — user-overridable in the UI.
export interface PointValues {
  rp: number; // HDFC/SBI Reward Points ≈ ₹1 (SmartBuy)
  atlasFloor: number; // EDGE Miles floor ≈ ₹1
  atlasXfer: number; // EDGE Miles best transfer ≈ ₹2
  mmtMyCash: number; // MMT myCash = ₹1 but closed-loop (MMT only)
}
export const DEFAULT_PT: PointValues = { rp: 1.0, atlasFloor: 1.0, atlasXfer: 2.0, mmtMyCash: 1.0 };

type EarnFn = (spend: number) => number;
const flat = (pct: number, ptval = 1.0): EarnFn => (s) => s * pct * ptval;
const capped = (acc: number, capSpend: number, base: number, ptval = 1.0): EarnFn =>
  (s) => (Math.min(s, capSpend) * acc + Math.max(0, s - capSpend) * base) * ptval;

export interface Channel {
  name: string;
  card: string; // representative card, or "" for card-agnostic
  markupLevel: "sb" | "edge" | "none"; // which route markup range applies
  discPct: number;
  discCap: number;
  mode: "cash" | "points";
  earn?: EarnFn;
  pointAlt?: number; // for points mode: value per point elsewhere
  closedLoopNote?: string;
  note?: string;
  requiresDirect?: boolean; // only offered when route.direct
}

export function channelsFor(r: Route, pt: PointValues): Channel[] {
  return [
    { name: "Cheapest OTA + bank 10% off + 1.5% cashback", card: "", markupLevel: "none", discPct: r.inst, discCap: r.cap, mode: "cash", earn: flat(0.015) },
    { name: "Cheapest OTA + Atlas base + bank 10% off", card: "axis-atlas", markupLevel: "none", discPct: r.inst, discCap: r.cap, mode: "cash", earn: flat(0.02, pt.atlasFloor) },
    { name: "MakeMyTrip + myCash + MMT 10% off", card: "icici-mmt", markupLevel: "none", discPct: r.inst, discCap: r.cap, mode: "cash", earn: flat(r.mmtEarn, pt.mmtMyCash), closedLoopNote: "myCash is spendable only on MakeMyTrip — counted at ₹1 only if you'll book there again." },
    { name: "HDFC SmartBuy + Infinia 10X + 10% off (cap ₹500)", card: "hdfc-infinia", markupLevel: "sb", discPct: 0.1, discCap: 500, mode: "cash", earn: capped(0.3333, 22500, 0.0333, pt.rp), note: "10X ≈ 33% up to ₹22,500/mo, then ~3.33%." },
    { name: "HDFC SmartBuy · pay with points (Infinia)", card: "hdfc-infinia", markupLevel: "sb", discPct: 0.1, discCap: 500, mode: "points", pointAlt: pt.rp, note: "Burns Reward Points worth ₹1 each — a leak if the portal is marked up." },
    { name: "Axis Travel EDGE + Atlas 5X (miles @ floor)", card: "axis-atlas", markupLevel: "edge", discPct: 0, discCap: 0, mode: "cash", earn: flat(0.05, pt.atlasFloor) },
    { name: "Axis Travel EDGE + Atlas 5X (miles @ transfer)", card: "axis-atlas", markupLevel: "edge", discPct: 0, discCap: 0, mode: "cash", earn: flat(0.05, pt.atlasXfer), note: "Only if you'll transfer EDGE Miles 1:2 to a partner." },
    { name: r.direct ? "Airline direct + Atlas base" : "Direct", card: "axis-atlas", markupLevel: "none", discPct: 0, discCap: 0, mode: "cash", earn: flat(0.02, pt.atlasFloor), note: "No coupon, but no portal markup/fee.", requiresDirect: true },
  ];
}

export interface ChannelResult {
  channel: Channel;
  netLo: number;
  netMid: number;
  netHi: number;
  priceMid: number;
  discount: number;
  reward: number;
  pointsBurned: number;
}

/** markup for a channel at a given band index (0=lo,1=mid,2=hi); firm channels return 0. */
function markupAt(ch: Channel, r: Route, band: 0 | 1 | 2, override?: number): number {
  if (override != null) return override;
  if (ch.markupLevel === "sb") return r.sb[band];
  if (ch.markupLevel === "edge") return r.edge[band];
  return 0;
}

function netAt(ch: Channel, r: Route, P: number, band: 0 | 1 | 2, override?: number): { net: number; price: number; disc: number; reward: number; pts: number } {
  const price0 = P * (1 + markupAt(ch, r, band, override));
  const disc = ch.discPct ? Math.min(price0 * ch.discPct, ch.discCap) : 0;
  const price = price0 - disc;
  if (ch.mode === "cash") {
    const reward = ch.earn ? ch.earn(price) : 0;
    return { net: price - reward, price, disc, reward, pts: 0 };
  }
  const pts = price / 1.0; // redeem at ₹1 face on the portal
  return { net: pts * (ch.pointAlt ?? 1.0), price, disc, reward: 0, pts };
}

/**
 * Rank channels for a route by net cost (ascending, using the mid markup).
 * `markupOverrides` maps a channel name → a user-supplied firm markup (from a real quote).
 */
export function rankChannels(
  r: Route,
  P: number,
  pt: PointValues = DEFAULT_PT,
  markupOverrides: Record<string, number> = {},
): ChannelResult[] {
  const chans = channelsFor(r, pt).filter((c) => !c.requiresDirect || r.direct);
  const rows = chans.map((ch) => {
    const ov = markupOverrides[ch.name];
    const lo = netAt(ch, r, P, 0, ov);
    const mid = netAt(ch, r, P, 1, ov);
    const hi = netAt(ch, r, P, 2, ov);
    return {
      channel: ch,
      netLo: Math.min(lo.net, hi.net),
      netMid: mid.net,
      netHi: Math.max(lo.net, hi.net),
      priceMid: mid.price,
      discount: mid.disc,
      reward: mid.reward,
      pointsBurned: mid.pts,
    };
  });
  return rows.sort((a, b) => a.netMid - b.netMid);
}

/** True when two net ranges overlap → the ranking between them is "too close to call". */
export function isTie(a: ChannelResult, b: ChannelResult): boolean {
  return a.netLo <= b.netHi && b.netLo <= a.netHi;
}
