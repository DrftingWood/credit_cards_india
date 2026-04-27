import type { EnrichedCard } from "./types";

export type ForexBand = "low" | "mid" | "high";

export interface FilterState {
  q: string;
  issuers: string[];
  networks: string[];
  tiers: string[];
  currencies: string[];
  coBrandCategories: string[];
  tags: string[];
  forexBand: ForexBand | null;
  lifetimeFree: boolean;
  feeWaiver: boolean;
  domesticLounge: boolean;
  intlLounge: boolean;
  hasMilestones: boolean;
  hasWelcomeBonus: boolean;
  inviteOnly: boolean | null;
  coBrandOnly: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  q: "",
  issuers: [],
  networks: [],
  tiers: [],
  currencies: [],
  coBrandCategories: [],
  tags: [],
  forexBand: null,
  lifetimeFree: false,
  feeWaiver: false,
  domesticLounge: false,
  intlLounge: false,
  hasMilestones: false,
  hasWelcomeBonus: false,
  inviteOnly: null,
  coBrandOnly: false,
};

function bandOf(forex: number | null | undefined): ForexBand | null {
  if (forex === null || forex === undefined) return null;
  if (forex < 2) return "low";
  if (forex < 3) return "mid";
  return "high";
}

export function filterCards(cards: EnrichedCard[], f: FilterState): EnrichedCard[] {
  return cards.filter((c) => {
    if (f.issuers.length && !f.issuers.includes(c.issuer)) return false;
    if (f.networks.length && !f.networks.includes(c.network)) return false;
    if (f.tiers.length && !f.tiers.includes(c.tier)) return false;
    if (f.currencies.length) {
      const cur = c.computed.primary_reward_currency;
      if (!cur || !f.currencies.includes(cur)) return false;
    }
    if (f.coBrandCategories.length) {
      const cat = c.co_brand?.category ?? null;
      if (!cat || !f.coBrandCategories.includes(cat)) return false;
    }
    if (f.tags.length) {
      const cardTags = c.metadata.tags ?? [];
      if (!f.tags.some((t) => cardTags.includes(t))) return false;
    }
    if (f.forexBand) {
      if (bandOf(c.current_fees?.forex_markup_pct) !== f.forexBand) return false;
    }
    if (f.lifetimeFree && !c.computed.is_lifetime_free) return false;
    if (f.feeWaiver && !c.computed.has_fee_waiver) return false;
    if (f.domesticLounge && !c.computed.has_domestic_lounge) return false;
    if (f.intlLounge && !c.computed.has_international_lounge) return false;
    if (f.hasMilestones && !(c.current_benefits?.milestones ?? []).length) return false;
    if (f.hasWelcomeBonus && !(c.current_benefits?.welcome ?? []).length) return false;
    if (f.inviteOnly === true && !c.computed.is_invite_only) return false;
    if (f.inviteOnly === false && c.computed.is_invite_only) return false;
    if (f.coBrandOnly && !c.co_brand) return false;
    return true;
  });
}

/** URL <-> filter state helpers. Keep params short and stable. */
export function stateToParams(f: FilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.issuers.length) p.set("issuer", f.issuers.join(","));
  if (f.networks.length) p.set("network", f.networks.join(","));
  if (f.tiers.length) p.set("tier", f.tiers.join(","));
  if (f.currencies.length) p.set("currency", f.currencies.join(","));
  if (f.coBrandCategories.length) p.set("cobcat", f.coBrandCategories.join(","));
  if (f.tags.length) p.set("tag", f.tags.join(","));
  if (f.forexBand) p.set("forex", f.forexBand[0]); // l/m/h
  if (f.lifetimeFree) p.set("ltf", "1");
  if (f.feeWaiver) p.set("fwv", "1");
  if (f.domesticLounge) p.set("dlounge", "1");
  if (f.intlLounge) p.set("ilounge", "1");
  if (f.hasMilestones) p.set("mst", "1");
  if (f.hasWelcomeBonus) p.set("wlc", "1");
  if (f.inviteOnly === true) p.set("invite", "1");
  if (f.inviteOnly === false) p.set("invite", "0");
  if (f.coBrandOnly) p.set("cobrand", "1");
  return p;
}

export function paramsToState(params: URLSearchParams): FilterState {
  const csv = (k: string) => (params.get(k)?.split(",").filter(Boolean) ?? []);
  const invite = params.get("invite");
  const forexCode = params.get("forex");
  const forexBand: ForexBand | null =
    forexCode === "l" ? "low" : forexCode === "m" ? "mid" : forexCode === "h" ? "high" : null;
  return {
    q: params.get("q") ?? "",
    issuers: csv("issuer"),
    networks: csv("network"),
    tiers: csv("tier"),
    currencies: csv("currency"),
    coBrandCategories: csv("cobcat"),
    tags: csv("tag"),
    forexBand,
    lifetimeFree: params.get("ltf") === "1",
    feeWaiver: params.get("fwv") === "1",
    domesticLounge: params.get("dlounge") === "1",
    intlLounge: params.get("ilounge") === "1",
    hasMilestones: params.get("mst") === "1",
    hasWelcomeBonus: params.get("wlc") === "1",
    inviteOnly: invite === "1" ? true : invite === "0" ? false : null,
    coBrandOnly: params.get("cobrand") === "1",
  };
}
