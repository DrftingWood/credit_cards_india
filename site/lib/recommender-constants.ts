/**
 * Heuristic constants used by the /recommend scorer. Each value is an
 * authoring decision documented in SESSION_NOTES.md (Q10/Q11). Centralised
 * here so the assumptions are reviewable in one place rather than buried in
 * scoring code.
 */

import type { IncomeBand } from "./recommender";

/** Fair-market value of one complimentary domestic lounge visit (per industry-standard pay-per-visit rates). */
export const LOUNGE_VALUE_DOMESTIC_INR = 1500;

/** Fair-market value of one international lounge visit (Priority Pass-equivalent). */
export const LOUNGE_VALUE_INTERNATIONAL_INR = 2500;

/** Welcome bonuses are amortised over this many years to avoid over-rewarding bonus-heavy cards on the long-term ranking. */
export const WELCOME_AMORTIZATION_YEARS = 2;

/** Floor monthly spend (₹) below which a welcome bonus condition like "₹50,000 in 90 days" is presumed unmet. */
export const WELCOME_SPEND_FLOOR_INR_PER_MONTH = 17000;

/** Proxy international spend per month (₹) used when the user signals high-forex but we don't ask for an amount. */
export const PROXY_INTL_SPEND_INR_PER_MONTH = 15000;

/** Income-band upper bounds (₹/year), used to gate cards by stated minimum income. Typed exhaustively against IncomeBand so a band added in one place fails compile in the other. */
export const INCOME_BAND_ANNUAL_INR: Record<IncomeBand, number> = {
  "lt-30k": 360000,
  "30k-75k": 900000,
  "75k-1.5L": 1800000,
  "1.5L-3L": 3600000,
  "gt-3L": Number.POSITIVE_INFINITY,
};

/**
 * Maps a user's brand-preference pick to the merchant tokens they're willing
 * to transact through. Issuer-portal tokens (smartbuy/edge-travel/ishop)
 * are intentionally NOT included by default — those go through the
 * "willing to use bank portals" toggle (lifestyle.recurring or future).
 */
export const BRAND_PREF_TO_CHANNELS: {
  airline: Record<string, string[]>;
  shopping: Record<string, string[]>;
  food: Record<string, string[]>;
  fuel: Record<string, string[]>;
} = {
  airline: {
    indigo: ["indigo-app", "indigo-web"],
    "air-india-vistara": ["air-india-direct", "vistara-direct"],
    ota: ["mmt", "easemytrip", "cleartrip", "yatra", "ixigo", "ota-any"],
  },
  shopping: {
    amazon: ["amazon-pay"],
    flipkart: ["flipkart"],
    "tata-neu": ["tata-neu"],
    myntra: ["myntra"],
    nykaa: [],
    others: [],
  },
  food: {
    swiggy: ["swiggy", "instamart"],
    "zomato-blinkit": ["zomato", "blinkit"],
    "bigbasket-zepto": ["bigbasket", "zepto"],
    offline: [],
  },
  fuel: {
    iocl: ["iocl"],
    bpcl: ["bpcl"],
    hpcl: ["hpcl"],
    none: [],
  },
};
