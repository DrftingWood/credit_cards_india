import type {
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

/** Slug portion of a card's URL — the part after /card/<issuer>/. Strips the redundant "{issuer}-" prefix from the id when present so /card/hdfc/infinia matches what generateStaticParams produces. */
export function cardSlug(card: { id: string; issuer: string }): string {
  return card.id.startsWith(`${card.issuer}-`) ? card.id.slice(card.issuer.length + 1) : card.id;
}

/** Canonical detail-page href for a card. Single source of truth — use everywhere instead of inlining the slug math, which is duplicated easily and breaks when the slug convention shifts. */
export function cardHref(card: { id: string; issuer: string }): string {
  return `/card/${card.issuer}/${cardSlug(card)}`;
}

/** Route params for SSG of /card/[issuer]/[slug] */
export function allCardRouteParams(): Array<{ issuer: string; slug: string }> {
  return cards.map((c) => ({ issuer: c.issuer, slug: cardSlug(c) }));
}

/** Active (including invite-only) cards only. */
export function getActiveCards(): EnrichedCard[] {
  return cards.filter((c) => c.computed.is_active);
}

export function getAllLoyaltyPrograms(): LoyaltyProgram[] {
  return loyaltyPrograms;
}

export function getLoyaltyProgramsById(): Record<string, LoyaltyProgram> {
  return Object.fromEntries(loyaltyPrograms.map((p) => [p.id, p]));
}
