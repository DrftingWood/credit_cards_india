import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type {
  EnrichedCard,
  IssuerRecord,
  NetworkRecord,
  DatasetIndex,
} from "./types";

/**
 * Data layer. Reads the build artefact produced by `python scripts/build.py`.
 * Called at build time from server components and generateStaticParams.
 *
 * Artifacts live at <repoRoot>/dist/*.json. `site/scripts/prebuild.mjs` runs
 * build.py automatically before `next dev` / `next build`.
 */

const DIST = path.resolve(process.cwd(), "..", "dist");

function readJson<T>(file: string): T {
  const fp = path.join(DIST, file);
  if (!existsSync(fp)) {
    throw new Error(
      `Build artefact missing: ${fp}\n  Run 'python ../scripts/build.py' from site/ (or 'npm run dev' which does it automatically).`,
    );
  }
  return JSON.parse(readFileSync(fp, "utf8")) as T;
}

let _cards: EnrichedCard[] | null = null;
let _issuers: IssuerRecord[] | null = null;
let _networks: NetworkRecord[] | null = null;
let _index: DatasetIndex | null = null;

export function getAllCards(): EnrichedCard[] {
  if (!_cards) _cards = readJson<EnrichedCard[]>("cards.json");
  return _cards;
}

export function getAllIssuers(): IssuerRecord[] {
  if (!_issuers) _issuers = readJson<IssuerRecord[]>("issuers.json");
  return _issuers;
}

export function getAllNetworks(): NetworkRecord[] {
  if (!_networks) _networks = readJson<NetworkRecord[]>("networks.json");
  return _networks;
}

export function getIndex(): DatasetIndex {
  if (!_index) _index = readJson<DatasetIndex>("index.json");
  return _index;
}

export function getCardById(id: string): EnrichedCard | null {
  return getAllCards().find((c) => c.id === id) ?? null;
}

export function getCardByIssuerAndSlug(
  issuer: string,
  slug: string,
): EnrichedCard | null {
  const id = `${issuer}-${slug}`;
  return getCardById(id);
}

/** Route params for SSG of /card/[issuer]/[slug] */
export function allCardRouteParams(): Array<{ issuer: string; slug: string }> {
  return getAllCards().map((c) => {
    const issuer = c.issuer;
    const slug = c.id.startsWith(`${issuer}-`) ? c.id.slice(issuer.length + 1) : c.id;
    return { issuer, slug };
  });
}

/** Active (including invite-only) cards only. */
export function getActiveCards(): EnrichedCard[] {
  return getAllCards().filter((c) => c.computed.is_active);
}
