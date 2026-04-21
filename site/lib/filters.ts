import type { EnrichedCard } from "./types";

export interface FilterState {
  q: string;
  issuers: string[];
  networks: string[];
  tiers: string[];
  currencies: string[];
  lifetimeFree: boolean;
  domesticLounge: boolean;
  intlLounge: boolean;
  inviteOnly: boolean | null;
  coBrandOnly: boolean;
}

export const EMPTY_FILTERS: FilterState = {
  q: "",
  issuers: [],
  networks: [],
  tiers: [],
  currencies: [],
  lifetimeFree: false,
  domesticLounge: false,
  intlLounge: false,
  inviteOnly: null,
  coBrandOnly: false,
};

export function filterCards(cards: EnrichedCard[], f: FilterState): EnrichedCard[] {
  return cards.filter((c) => {
    if (f.issuers.length && !f.issuers.includes(c.issuer)) return false;
    if (f.networks.length && !f.networks.includes(c.network)) return false;
    if (f.tiers.length && !f.tiers.includes(c.tier)) return false;
    if (f.currencies.length) {
      const cur = c.computed.primary_reward_currency;
      if (!cur || !f.currencies.includes(cur)) return false;
    }
    if (f.lifetimeFree && !c.computed.is_lifetime_free) return false;
    if (f.domesticLounge && !c.computed.has_domestic_lounge) return false;
    if (f.intlLounge && !c.computed.has_international_lounge) return false;
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
  if (f.lifetimeFree) p.set("ltf", "1");
  if (f.domesticLounge) p.set("dlounge", "1");
  if (f.intlLounge) p.set("ilounge", "1");
  if (f.inviteOnly === true) p.set("invite", "1");
  if (f.inviteOnly === false) p.set("invite", "0");
  if (f.coBrandOnly) p.set("cobrand", "1");
  return p;
}

export function paramsToState(params: URLSearchParams): FilterState {
  const csv = (k: string) => (params.get(k)?.split(",").filter(Boolean) ?? []);
  const invite = params.get("invite");
  return {
    q: params.get("q") ?? "",
    issuers: csv("issuer"),
    networks: csv("network"),
    tiers: csv("tier"),
    currencies: csv("currency"),
    lifetimeFree: params.get("ltf") === "1",
    domesticLounge: params.get("dlounge") === "1",
    intlLounge: params.get("ilounge") === "1",
    inviteOnly: invite === "1" ? true : invite === "0" ? false : null,
    coBrandOnly: params.get("cobrand") === "1",
  };
}
