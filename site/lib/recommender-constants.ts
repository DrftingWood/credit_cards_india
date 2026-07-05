/**
 * Constants for the /recommend scorer. The former fabricated value/spend proxies
 * (per-visit lounge ₹, welcome amortisation, proxy international spend) were
 * removed with the old scoring engine — the decoupled scorer invents no such
 * numbers. What remains is factual: income-band boundaries and a brand→merchant
 * token map.
 */

import type { IncomeBand } from "./recommender";

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
    // Include both the channel token (amazon-pay) and the plain merchant token
    // (amazon) — merchant-only accelerators gate on accelerated[].merchants.
    amazon: ["amazon-pay", "amazon"],
    flipkart: ["flipkart"],
    "tata-neu": ["tata-neu"],
    myntra: ["myntra"],
    nykaa: ["nykaa"],
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
