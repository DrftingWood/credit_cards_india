// ─────────────────────────────────────────────────────────────────────────
// Usage profile — roadmap Phase 3 ("usage inputs").
//
// Which merchants, portals and ecosystems the user ACTUALLY uses, and what share
// of a bucket goes through each merchant. It feeds the Realistic layer's
// ScoringContext (channelMix + merchantShares + enabledEcosystems), so the
// Realistic number is personal rather than "every co-brand rate dropped".
//
// Shares are the user's own estimate. Nothing here supplies a default share: an
// undeclared merchant stays at base, exactly as D-18 requires.
// ─────────────────────────────────────────────────────────────────────────

import type { AcceleratedReward, EnrichedCard } from "./types";
import { acceleratorTokens, type CardExplanation, type ScoringContext } from "./calculator";
import { resolveBuckets, type CanonicalCategory } from "./category-mapping";

export interface UsageProfile {
  /** merchant token → % (1–100) of the matching bucket the user routes through it. */
  merchant_share_pct: Record<string, number>;
  /** Closed-loop ecosystems the user redeems in (by ecosystem_label). */
  ecosystems: string[];
  /** /calculator opt-in: rank co-brand & portal rates only on the shares declared here. */
  gate_calculator: boolean;
}

export const DEFAULT_USAGE: UsageProfile = { merchant_share_pct: {}, ecosystems: [], gate_calculator: false };

const TOKEN_RE = /^[a-z0-9][a-z0-9-]{0,39}$/;
const MAX_ECOSYSTEMS = 50;

export function sanitizeUsage(raw: unknown): UsageProfile {
  const p = (raw && typeof raw === "object" ? raw : {}) as Partial<Record<keyof UsageProfile, unknown>>;
  const shares: Record<string, number> = {};
  if (p.merchant_share_pct && typeof p.merchant_share_pct === "object") {
    for (const [k, v] of Object.entries(p.merchant_share_pct as Record<string, unknown>)) {
      const n = Number(v);
      if (!TOKEN_RE.test(k) || typeof v === "boolean" || !Number.isFinite(n) || n <= 0) continue;
      shares[k] = Math.min(100, Math.round(n));
    }
  }
  const ecos = Array.isArray(p.ecosystems)
    ? [...new Set(p.ecosystems.filter((e): e is string => typeof e === "string" && e.length > 0 && e.length <= 60))].slice(0, MAX_ECOSYSTEMS)
    : [];
  return { merchant_share_pct: shares, ecosystems: ecos, gate_calculator: p.gate_calculator === true };
}

/** The ScoringContext fields this profile contributes. */
export function usageContext(u: UsageProfile): Required<Pick<ScoringContext, "channelMix" | "merchantShares" | "enabledEcosystems">> {
  const merchantShares: Record<string, number> = {};
  for (const [k, v] of Object.entries(u.merchant_share_pct)) if (v > 0) merchantShares[k] = v / 100;
  return {
    channelMix: new Set(Object.keys(merchantShares)),
    merchantShares,
    enabledEcosystems: new Set(u.ecosystems),
  };
}

/** Same context with every usage field emptied — the "you declared nothing" baseline. */
export function withoutUsage(ctx: ScoringContext): ScoringContext {
  return { ...ctx, channelMix: new Set(), merchantShares: undefined, enabledEcosystems: new Set() };
}

/** Tokens that name the SAME merchant through different channels. One share covers all of them. */
export const TOKEN_FAMILIES: Record<string, string[]> = {
  amazon: ["amazon", "amazon-pay"],
  indigo: ["indigo-app", "indigo-web"],
  swiggy: ["swiggy", "swiggy-one"],
  hpcl: ["hpcl", "hp-pay"],
  irctc: ["irctc-direct", "irctc-rail"],
};
const FAMILY_OF: Record<string, string> = Object.fromEntries(
  Object.entries(TOKEN_FAMILIES).flatMap(([fam, toks]) => toks.map((t) => [t, fam])),
);
export const familyOf = (token: string): string => FAMILY_OF[token] ?? token;
const familyTokens = (family: string): string[] => TOKEN_FAMILIES[family] ?? [family];

const LABELS: Record<string, string> = {
  amazon: "Amazon", "amazon-pay": "Amazon", indigo: "IndiGo", "indigo-app": "IndiGo", "indigo-web": "IndiGo",
  swiggy: "Swiggy", "swiggy-one": "Swiggy", hpcl: "HPCL", "hp-pay": "HPCL", irctc: "IRCTC", "irctc-direct": "IRCTC", "irctc-rail": "IRCTC",
  smartbuy: "HDFC SmartBuy", "edge-travel": "Axis Travel EDGE", "edge-mall": "Axis EDGE Mall", ishop: "ICICI iShop",
  "sbi-rewardz": "SBI Rewardz", "amex-travel": "Amex Travel", "kotak-unbox": "Kotak Unbox",
  "air-india-direct": "Air India", "vistara-direct": "Vistara", "tata-neu": "Tata Neu", "tata-cliq": "Tata CLiQ", "tata-1mg": "Tata 1mg",
  mmt: "MakeMyTrip", iocl: "IndianOil", bpcl: "BPCL", bookmyshow: "BookMyShow", jiomart: "JioMart", pvr: "PVR",
  "paytm-app": "Paytm", "phonepe-app": "PhonePe", "airtel-thanks-app": "Airtel Thanks", "apollo-24-7": "Apollo 24/7",
  "scapia-app": "Scapia", "adani-one": "Adani One", "etihad-direct": "Etihad", "marriott-direct": "Marriott", oyo: "OYO", igp: "IGP",
};
export function tokenLabel(token: string): string {
  return LABELS[token] ?? token.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export interface UsageGroup {
  family: string;
  label: string;
  /** Tokens THIS card lists for the family. */
  tokens: string[];
  categories: CanonicalCategory[];
}

const BROAD_CLASSES = new Set(["online-any", "physical"]);
const isUsageQuestion = (a: AcceleratedReward) => !(a.channel && BROAD_CLASSES.has(a.channel.class));

/** The merchants this card's narrow accelerators are scoped to — the usage questions worth asking for it. */
export function cardUsageGroups(card: EnrichedCard): UsageGroup[] {
  const out = new Map<string, UsageGroup>();
  for (const a of card.current_rewards?.accelerated ?? []) {
    if (!isUsageQuestion(a)) continue;
    const cats = resolveBuckets(a.category, a.canonical_categories);
    for (const t of acceleratorTokens(a)) {
      const fam = familyOf(t);
      const g = out.get(fam) ?? { family: fam, label: tokenLabel(fam), tokens: [], categories: [] };
      if (!g.tokens.includes(t)) g.tokens.push(t);
      for (const c of cats) if (!g.categories.includes(c)) g.categories.push(c);
      out.set(fam, g);
    }
  }
  return [...out.values()].sort((x, y) => x.label.localeCompare(y.label));
}

/** Writes one share to every alias token of a family (0 removes it). */
export function setFamilyShare(u: UsageProfile, family: string, pct: number): UsageProfile {
  const next = { ...u.merchant_share_pct };
  for (const t of familyTokens(family)) {
    if (pct > 0) next[t] = Math.min(100, Math.round(pct));
    else delete next[t];
  }
  return { ...u, merchant_share_pct: next };
}

export function familySharePct(u: UsageProfile, family: string): number {
  return Math.max(0, ...familyTokens(family).map((t) => u.merchant_share_pct[t] ?? 0));
}

export function toggleEcosystem(u: UsageProfile, eco: string): UsageProfile {
  const has = u.ecosystems.includes(eco);
  return { ...u, ecosystems: has ? u.ecosystems.filter((e) => e !== eco) : [...u.ecosystems, eco] };
}

export interface UsageDelta {
  category: CanonicalCategory;
  label: string;
  change: "unlocked" | "dropped" | "changed";
  delta_inr_monthly: number;
}

/** Per bucket: what declaring usage changed, comparing an explanation with usage against one without. */
export function usageDelta(withUsage: CardExplanation, without: CardExplanation): UsageDelta[] {
  const index = (ex: CardExplanation) => {
    const m = new Map<CanonicalCategory, { accel: boolean; value: number; label: string }>();
    for (const a of ex.accelerators) m.set(a.category, { accel: true, value: a.net_value_inr, label: a.label });
    for (const b of ex.base_spend) m.set(b.category, { accel: false, value: b.value_inr, label: b.label });
    return m;
  };
  const w = index(withUsage);
  const wo = index(without);
  const out: UsageDelta[] = [];
  for (const [cat, x] of w) {
    const y = wo.get(cat);
    if (!y) continue;
    const delta = x.value - y.value;
    if (x.accel && !y.accel) out.push({ category: cat, label: x.label, change: "unlocked", delta_inr_monthly: delta });
    else if (!x.accel && y.accel) out.push({ category: cat, label: x.label, change: "dropped", delta_inr_monthly: delta });
    else if (Math.abs(delta) >= 0.5) out.push({ category: cat, label: x.label, change: "changed", delta_inr_monthly: delta });
  }
  return out;
}
