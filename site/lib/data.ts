import type {
  ClientCard,
  ClientIssuer,
  EnrichedCard,
  IssuerRecord,
  NetworkRecord,
  DatasetIndex,
  LoyaltyProgram,
} from "./types";

/**
 * Data layer. The build artefact under ../dist/*.json is imported directly
 * so Next's bundler embeds it at build time — runtime-safe, CWD-independent.
 *
 * Build order: `npm run prebuild` (site/scripts/prebuild.mjs → build.mjs)
 * regenerates ../dist/*.json from data/**\/*.yaml, then `next build` sees
 * the fresh JSON via these imports.
 */

// Static imports require site/scripts/prebuild.mjs to have run.
// JSON imports widen to a permissive inferred type; cast to the schema shape
// at the boundary so downstream code is strongly typed.
import cardsData from "../../dist/cards.json";
import issuersData from "../../dist/issuers.json";
import networksData from "../../dist/networks.json";
import indexData from "../../dist/index.json";
import loyaltyData from "../../dist/loyalty_programs.json";

import { cardSlug } from "./card-href";
import { toClientCard } from "./client-card";

export { cardHref, cardSlug } from "./card-href";

const cards = cardsData as unknown as EnrichedCard[];
const issuers = issuersData as unknown as IssuerRecord[];
const networks = networksData as unknown as NetworkRecord[];
const datasetIndex = indexData as unknown as DatasetIndex;
const loyaltyPrograms = loyaltyData as unknown as LoyaltyProgram[];

export function getAllCards(): EnrichedCard[] {
  return cards;
}

export function getAllIssuers(): IssuerRecord[] {
  return issuers;
}

export function getAllNetworks(): NetworkRecord[] {
  return networks;
}

export function getIndex(): DatasetIndex {
  return datasetIndex;
}

export function getCardById(id: string): EnrichedCard | null {
  return cards.find((c) => c.id === id) ?? null;
}

export function getCardByIssuerAndSlug(
  issuer: string,
  slug: string,
): EnrichedCard | null {
  return getCardById(`${issuer}-${slug}`);
}

/** Route params for SSG of /card/[issuer]/[slug] */
export function allCardRouteParams(): Array<{ issuer: string; slug: string }> {
  return cards.map((c) => ({ issuer: c.issuer, slug: cardSlug(c) }));
}

/** Active (including invite-only) cards only. */
export function getActiveCards(): EnrichedCard[] {
  return cards.filter((c) => c.computed.is_active);
}

let activeClientCards: ClientCard[] | null = null;

/** Active cards in the trimmed shape the interactive (client) pages receive. */
export function getActiveClientCards(): ClientCard[] {
  activeClientCards ??= getActiveCards().map(toClientCard);
  return activeClientCards;
}

/** Issuers in the trimmed shape client components need (logo + names). */
export function getAllClientIssuers(): ClientIssuer[] {
  return issuers.map(({ id, name, short_name, logo_path, brand_color }) => ({
    id,
    name,
    short_name,
    logo_path,
    brand_color,
  }));
}

export function getAllLoyaltyPrograms(): LoyaltyProgram[] {
  return loyaltyPrograms;
}

export function getLoyaltyProgramsById(): Record<string, LoyaltyProgram> {
  return Object.fromEntries(loyaltyPrograms.map((p) => [p.id, p]));
}
