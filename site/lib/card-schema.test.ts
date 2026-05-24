import { describe, test, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import type { ValidateFunction } from "ajv";

let validate: ValidateFunction;

beforeAll(() => {
  const schemaPath = resolve(import.meta.dirname, "../../schema/card.schema.json");
  const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
  const ajv = new Ajv2020({ strict: false, allErrors: true });
  addFormats(ajv);
  validate = ajv.compile(schema);
});

const validBaseCard = {
  id: "test-card",
  name: "Test Card",
  issuer: "test",
  network: "visa",
  tier: "mid",
  status: "active",
  fees: [
    {
      effective_from: "2024-01-01",
      effective_until: null,
      joining_fee_inr: 0,
      annual_fee_inr: 0,
      source: { url: "https://example.com", retrieved_on: "2024-01-01" },
    },
  ],
  rewards: [
    {
      effective_from: "2024-01-01",
      effective_until: null,
      currency: "cashback",
      base: { rate: 1, per_inr: 100, unit_value_inr: 1 },
      source: { url: "https://example.com", retrieved_on: "2024-01-01" },
    },
  ],
  benefits: [
    {
      effective_from: "2024-01-01",
      effective_until: null,
      source: { url: "https://example.com", retrieved_on: "2024-01-01" },
    },
  ],
  eligibility: {},
  metadata: { last_verified_on: "2024-01-01" },
};

describe("card schema — B2-BL3 discontinued_on if/then", () => {
  test("status=active with discontinued_on=null is accepted", () => {
    const card = { ...validBaseCard, status: "active", discontinued_on: null };
    expect(validate(card)).toBe(true);
  });
  test("status=discontinued WITHOUT discontinued_on is rejected", () => {
    const card = { ...validBaseCard, status: "discontinued" };
    expect(validate(card)).toBe(false);
  });
  test("status=discontinued with discontinued_on=null is rejected", () => {
    const card = { ...validBaseCard, status: "discontinued", discontinued_on: null };
    expect(validate(card)).toBe(false);
  });
  test("status=discontinued with discontinued_on='2024-06-01' is accepted", () => {
    const card = { ...validBaseCard, status: "discontinued", discontinued_on: "2024-06-01" };
    expect(validate(card)).toBe(true);
  });
});

describe("card schema — B2-BL1 LoungeDetails ghost rejection", () => {
  function cardWithLounge(d: Record<string, unknown>) {
    return {
      ...validBaseCard,
      benefits: [
        {
          ...validBaseCard.benefits[0],
          lounge_access: { domestic: d },
        },
      ],
    };
  }
  test("lounge with visits_per_cycle is accepted", () => {
    expect(validate(cardWithLounge({ visits_per_cycle: 8, cycle: "annual" }))).toBe(true);
  });
  test("lounge with spend_threshold_inr is accepted (visit-count optional)", () => {
    expect(validate(cardWithLounge({ spend_threshold_inr: 50000 }))).toBe(true);
  });
  test("empty lounge object {} is rejected (ghost badge)", () => {
    expect(validate(cardWithLounge({}))).toBe(false);
  });
  test("lounge with only cycle/via (no visits, no threshold) is rejected", () => {
    expect(validate(cardWithLounge({ cycle: "annual", via: ["priority-pass"] }))).toBe(false);
  });
});

describe("card schema — B2-BL2 co_brand.category enum expansion", () => {
  function cardWithCobrand(category: string) {
    return {
      ...validBaseCard,
      co_brand: { partner: "Test Partner", category },
    };
  }
  test("new categories accepted", () => {
    for (const cat of ["food-delivery", "quick-commerce", "conglomerate", "automotive", "healthcare"]) {
      expect(validate(cardWithCobrand(cat)), `expected '${cat}' to be valid`).toBe(true);
    }
  });
  test("existing categories still accepted", () => {
    for (const cat of ["airline", "hotel", "ecommerce", "fuel"]) {
      expect(validate(cardWithCobrand(cat))).toBe(true);
    }
  });
  test("nonsense category still rejected", () => {
    expect(validate(cardWithCobrand("made-up-category"))).toBe(false);
  });
});
