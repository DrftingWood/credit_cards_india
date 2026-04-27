// Hand-authored TypeScript mirror of schema/card.schema.json.
// Replace with output of `npm run gen-types` once json-schema-to-typescript is wired up.

export type Network = "visa" | "mastercard" | "rupay" | "amex" | "diners";
export type RewardCurrency = "points" | "cashback" | "miles";
export type CardTier = "entry" | "mid" | "premium" | "super-premium" | "invite-only";
export type CardStatus = "active" | "invite-only" | "on-hold" | "discontinued";
export type CardType = "credit" | "charge" | "secured";
export type Cycle = "monthly" | "quarterly" | "annual" | "statement" | "per-txn";

export interface Source {
  url: string;
  retrieved_on: string;
  notes?: string;
}

export interface NetworkRecord {
  id: Network;
  name: string;
  tiers: string[];
  website?: string;
  logo_path?: string | null;
  notes?: string;
}

export interface IssuerRecord {
  id: string;
  name: string;
  short_name?: string;
  legal_name: string;
  website: string;
  customer_care?: { phone?: string; email?: string };
  type?: string;
  logo_path?: string | null;
  brand_color?: string | null;
  notes?: string;
}

export interface FeeWaiver {
  spend_inr: number;
  cycle: Cycle;
  conditions?: string;
}

export interface FeeRecord {
  effective_from: string;
  effective_until: string | null;
  joining_fee_inr: number;
  annual_fee_inr: number;
  renewal_fee_inr?: number | null;
  fee_waiver?: FeeWaiver | null;
  forex_markup_pct?: number | null;
  finance_charge_monthly_pct?: number | null;
  cash_advance_fee?: { pct?: number; min_inr?: number } | null;
  late_payment_slabs?: Array<{ up_to_inr: number | "any"; fee_inr: number }> | null;
  overlimit_fee?: { pct?: number; min_inr?: number; max_inr?: number } | null;
  gst_applicable?: boolean;
  emi_conversion?: {
    interest_pct_annual?: number | null;
    processing_fee_pct?: number | null;
    processing_fee_min_inr?: number | null;
    notes?: string;
  } | null;
  balance_transfer?: {
    interest_pct?: number | null;
    processing_fee_pct?: number | null;
    processing_fee_min_inr?: number | null;
    tenure_months?: number | null;
    notes?: string;
  } | null;
  foreign_atm_inr?: number | null;
  supplementary_card_fee_inr?: number | null;
  source: Source;
  notes?: string;
}

export interface RewardBase {
  rate: number;
  per_inr: number;
  unit_value_inr?: number | null;
}

export interface AcceleratedReward {
  category: string;
  canonical_categories?: string[] | null;
  multiplier: number;
  effective_rate?: number | null;
  cap_per_cycle?: number | "unlimited";
  cap_unit?: "points" | "cashback-inr" | "miles" | "spend-inr";
  cycle?: Cycle;
  merchants?: string[];
  mcc_list?: string[];
  notes?: string;
}

export interface RedemptionOption {
  type: "statement-credit" | "catalog" | "airmiles" | "hotel-points" | "voucher" | "cashback-bank" | "product" | "other";
  program?: string;
  rate_inr_per_unit?: number | null;
  ratio?: string | null;
  min_units?: number | null;
  fee_inr?: number | null;
  constraints?: string;
}

export interface TransferPartner {
  program: string;
  category?: "airline" | "hotel" | "other";
  ratio?: string | null;
  min_transfer?: number | null;
  fee_inr?: number | null;
  notes?: string;
}

export interface RewardRecord {
  effective_from: string;
  effective_until: string | null;
  currency: RewardCurrency;
  currency_name?: string | null;
  base: RewardBase;
  accelerated?: AcceleratedReward[];
  exclusions?: string[];
  capping_rules?: string[];
  redemption?: RedemptionOption[];
  transfer_partners?: TransferPartner[];
  source: Source;
  notes?: string;
}

export interface LoungeDetails {
  visits_per_cycle?: number | "unlimited";
  cycle?: Cycle;
  guests_per_visit?: number | "unlimited";
  via?: string[];
  spend_threshold_inr?: number | null;
  spend_threshold_cycle?: Cycle;
  notes?: string;
}

export interface BenefitRecord {
  effective_from: string;
  effective_until: string | null;
  lounge_access?: {
    domestic?: LoungeDetails;
    international?: LoungeDetails;
  } | null;
  golf?: {
    rounds_per_cycle?: number | "unlimited";
    lessons_per_cycle?: number | "unlimited";
    cycle?: Cycle;
    notes?: string;
  } | null;
  milestones?: Array<{
    spend_inr: number;
    cycle: Cycle;
    benefit: string;
    value_inr?: number | null;
  }>;
  welcome?: Array<{
    condition?: string;
    benefit: string;
    value_inr?: number | null;
    window_days?: number | null;
  }>;
  insurance?: Array<{
    type: string;
    sum_insured_inr: number;
    conditions?: string;
  }>;
  fuel_surcharge_waiver?: {
    pct: number;
    min_txn_inr?: number | null;
    max_txn_inr?: number | null;
    cap_per_cycle_inr?: number | null;
    cycle?: Cycle;
    notes?: string;
  } | null;
  dining?: {
    program?: string;
    discount_pct?: number | null;
    notes?: string;
  } | null;
  movies?: {
    type: "bogo" | "discount" | "free";
    partner?: string;
    max_per_cycle?: number | null;
    cycle?: Cycle;
    cap_inr?: number | null;
    notes?: string;
  } | null;
  concierge?: boolean;
  surcharge_waivers?: Array<{
    category: "railway" | "utilities" | "telecom" | "education" | "online" | "wallet-loads" | "rent" | "other";
    pct: number;
    min_txn_inr?: number | null;
    max_txn_inr?: number | null;
    cap_per_cycle_inr?: number | null;
    cycle?: Cycle;
    notes?: string;
  }>;
  other?: Array<{ name: string; description: string; value_inr?: number | null }>;
  source: Source;
  notes?: string;
}

export interface Eligibility {
  min_age?: number | null;
  max_age?: number | null;
  income_inr_annual?: {
    salaried?: number | null;
    self_employed?: number | null;
  };
  credit_score_min?: number | null;
  residency?: "resident-indian" | "nri" | "either";
  notes?: string;
}

export interface CardMetadata {
  last_verified_on: string;
  tags?: string[];
}

export interface CardRecord {
  id: string;
  name: string;
  issuer: string;
  network: Network;
  network_tier?: string | null;
  tier: CardTier;
  card_type?: CardType;
  co_brand?: {
    partner: string;
    category: string;
    partner_website?: string;
  } | null;
  status: CardStatus;
  launched_on?: string | null;
  discontinued_on?: string | null;
  image_path?: string | null;
  fees: FeeRecord[];
  rewards: RewardRecord[];
  benefits: BenefitRecord[];
  eligibility: Eligibility;
  application?: {
    apply_url?: string | null;
    pre_approval_check_url?: string | null;
    replaces_card?: string | null;
  };
  metadata: CardMetadata;
}

/** Enriched shape produced by scripts/build.py under dist/cards.json. */
export interface EnrichedCard extends CardRecord {
  issuer_detail: IssuerRecord;
  network_detail: NetworkRecord;
  current_fees: FeeRecord | null;
  current_rewards: RewardRecord | null;
  current_benefits: BenefitRecord | null;
  computed: {
    is_active: boolean;
    is_invite_only: boolean;
    is_lifetime_free: boolean;
    has_fee_waiver: boolean;
    fee_waiver_spend_inr: number | null;
    primary_reward_currency: RewardCurrency | null;
    headline_rate_pct: number | null;
    has_domestic_lounge: boolean;
    has_international_lounge: boolean;
    co_brand_partner: string | null;
    co_brand_category: string | null;
  };
}

export interface DatasetIndex {
  generated_at: string;
  counts: {
    cards_total: number;
    cards_active: number;
    cards_invite_only: number;
    cards_lifetime_free: number;
    issuers: number;
    networks: number;
  };
  by_status: Record<string, number>;
  by_tier: Record<string, number>;
  by_issuer: Record<string, number>;
  by_network: Record<string, number>;
  by_reward_currency: Record<string, number>;
  tags: Record<string, number>;
}
