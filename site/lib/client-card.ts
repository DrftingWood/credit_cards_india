import type {
  ClientBenefits,
  ClientCard,
  ClientFees,
  ClientRewards,
  EnrichedCard,
} from "./types";

/*
 * Server-side projection of an EnrichedCard onto the ClientCard allowlist
 * (see lib/types.ts). Every level is an explicit pick rather than a
 * rest-spread, so a field added to the dataset stays server-side until it
 * is deliberately added here and to the ClientCard type.
 */

/** Drops undefined-valued keys: RSC serialises each one as "$undefined". */
function defined<T extends object>(o: T): T {
  for (const k of Object.keys(o) as Array<keyof T>) if (o[k] === undefined) delete o[k];
  return o;
}

function clientFees(f: EnrichedCard["current_fees"]): ClientFees | null {
  if (!f) return null;
  return defined({
    annual_fee_inr: f.annual_fee_inr,
    joining_fee_inr: f.joining_fee_inr,
    fee_waiver: f.fee_waiver,
    gst_applicable: f.gst_applicable,
    forex_markup_pct: f.forex_markup_pct,
    finance_charge_monthly_pct: f.finance_charge_monthly_pct,
    cash_advance_fee: f.cash_advance_fee,
  });
}

function clientRewards(r: EnrichedCard["current_rewards"]): ClientRewards | null {
  if (!r) return null;
  return defined({
    currency: r.currency,
    currency_name: r.currency_name,
    redemption_scope: r.redemption_scope,
    ecosystem_label: r.ecosystem_label,
    loyalty_program: r.loyalty_program,
    base: r.base,
    accelerated: r.accelerated,
    exclusions: r.exclusions,
    mcc_exclusions: r.mcc_exclusions,
    reward_cap: r.reward_cap,
    capping_rules: r.capping_rules,
    redemption: r.redemption,
  });
}

function clientBenefits(b: EnrichedCard["current_benefits"]): ClientBenefits | null {
  if (!b) return null;
  return defined({
    lounge_access: b.lounge_access,
    golf: b.golf,
    milestones: b.milestones,
    welcome: b.welcome,
    insurance: b.insurance,
    fuel_surcharge_waiver: b.fuel_surcharge_waiver,
    concierge: b.concierge,
  });
}

export function toClientCard(card: EnrichedCard): ClientCard {
  const { issuer_detail: i, network_detail: n } = card;
  return defined({
    id: card.id,
    name: card.name,
    issuer: card.issuer,
    network: card.network,
    tier: card.tier,
    status: card.status,
    co_brand: card.co_brand,
    image_path: card.image_path,
    metadata: defined({
      last_verified_on: card.metadata.last_verified_on,
      tags: card.metadata.tags,
      exclusive_group: card.metadata.exclusive_group,
    }),
    eligibility: defined({
      credit_score_min: card.eligibility.credit_score_min,
      income_inr_annual: card.eligibility.income_inr_annual,
    }),
    issuer_detail: defined({
      id: i.id,
      name: i.name,
      short_name: i.short_name,
      logo_path: i.logo_path,
      brand_color: i.brand_color,
    }),
    network_detail: defined({ id: n.id, name: n.name, logo_path: n.logo_path }),
    current_fees: clientFees(card.current_fees),
    current_rewards: clientRewards(card.current_rewards),
    current_benefits: clientBenefits(card.current_benefits),
    computed: card.computed,
  });
}
