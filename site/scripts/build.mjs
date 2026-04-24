#!/usr/bin/env node
/**
 * site/scripts/build.mjs — compile data/**\/*.yaml into ../dist/*.json
 *
 * Node port of the original scripts/build.py. Runs entirely within the
 * site's Node toolchain so the Vercel deploy no longer needs Python.
 *
 * Output is designed to be diff-identical to the Python version (except
 * for the `generated_at` timestamp): same sort order, same key order in
 * objects, same 4-decimal rounding on headline_rate_pct, same
 * count-descending ordering on index.json maps.
 */

import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const DATA_DIR = path.join(REPO_ROOT, "data");
const OUT_DIR = path.join(REPO_ROOT, "dist");

// --- YAML → JSON normalisation -------------------------------------------

/** Convert js-yaml Date objects to ISO date strings so the output is pure JSON. */
function normalize(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (Array.isArray(value)) {
    return value.map(normalize);
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value)) out[k] = normalize(value[k]);
    return out;
  }
  return value;
}

function loadYaml(p) {
  return normalize(yaml.load(readFileSync(p, "utf8")));
}

function loadMany(dir) {
  const out = {};
  const files = readdirSync(dir).filter((f) => f.endsWith(".yaml")).sort();
  for (const f of files) {
    const doc = loadYaml(path.join(dir, f));
    out[doc.id] = doc;
  }
  return out;
}

function listCardFiles(dir) {
  const entries = readdirSync(dir, { recursive: true });
  return entries
    .filter((f) => typeof f === "string" && f.endsWith(".yaml"))
    .map((f) => path.join(dir, f))
    .sort();
}

// --- Enrichment ----------------------------------------------------------

/**
 * Returns the "current" dated record. For active cards that's the open-ended
 * record (effective_until: null). For discontinued cards — which have no
 * open-ended record — it falls back to the record with the latest
 * effective_until, so downstream consumers can still render "the state of
 * the card when it was last issued" rather than a blank shell.
 */
function openRecord(records) {
  const list = records ?? [];
  for (const r of list) {
    if (r.effective_until === null || r.effective_until === undefined) {
      return r;
    }
  }
  if (list.length === 0) return null;
  let latest = list[0];
  for (const r of list.slice(1)) {
    if ((r.effective_until ?? "") > (latest.effective_until ?? "")) latest = r;
  }
  return latest;
}

function computeHeadlineRatePct(rewards) {
  if (!rewards) return null;
  const b = rewards.base ?? {};
  const { rate, per_inr, unit_value_inr } = b;
  if (rate == null || !per_inr || unit_value_inr == null) return null;
  const pct = (Number(rate) * Number(unit_value_inr) / Number(per_inr)) * 100;
  if (!Number.isFinite(pct)) return null;
  return Math.round(pct * 10000) / 10000;
}

function enrichCard(card, issuers, networks) {
  const issuer = issuers[card.issuer] ?? null;
  const network = networks[card.network] ?? null;
  const currentFees = openRecord(card.fees);
  const currentRewards = openRecord(card.rewards);
  const currentBenefits = openRecord(card.benefits);

  const annualFee = currentFees?.annual_fee_inr ?? null;
  const joiningFee = currentFees?.joining_fee_inr ?? null;
  const feeWaiver = currentFees?.fee_waiver ?? null;

  return {
    ...card,
    issuer_detail: issuer,
    network_detail: network,
    current_fees: currentFees,
    current_rewards: currentRewards,
    current_benefits: currentBenefits,
    computed: {
      is_active: card.status === "active" || card.status === "invite-only",
      is_invite_only: card.status === "invite-only",
      is_lifetime_free: annualFee === 0 && joiningFee === 0,
      has_fee_waiver: feeWaiver !== null && feeWaiver !== undefined,
      fee_waiver_spend_inr: feeWaiver?.spend_inr ?? null,
      primary_reward_currency: currentRewards?.currency ?? null,
      headline_rate_pct: computeHeadlineRatePct(currentRewards),
      has_domestic_lounge: !!(currentBenefits?.lounge_access?.domestic),
      has_international_lounge: !!(currentBenefits?.lounge_access?.international),
      co_brand_partner: card.co_brand?.partner ?? null,
      co_brand_category: card.co_brand?.category ?? null,
    },
  };
}

// --- Index aggregation ---------------------------------------------------

/** Mimics Python's Counter.most_common(): sort by count desc, stable on ties. */
function sortedByCountDesc(map) {
  const entries = [...map.entries()];
  entries.sort((a, b) => b[1] - a[1]);
  return Object.fromEntries(entries);
}

function buildIndex(cards, issuers, networks) {
  const tiers = new Map();
  const statuses = new Map();
  const byIssuer = new Map();
  const byNetwork = new Map();
  const byCurrency = new Map();
  const tags = new Map();

  for (const c of cards) {
    tiers.set(c.tier, (tiers.get(c.tier) ?? 0) + 1);
    statuses.set(c.status, (statuses.get(c.status) ?? 0) + 1);
    byIssuer.set(c.issuer, (byIssuer.get(c.issuer) ?? 0) + 1);
    byNetwork.set(c.network, (byNetwork.get(c.network) ?? 0) + 1);
    const cur = c.computed?.primary_reward_currency;
    if (cur) byCurrency.set(cur, (byCurrency.get(cur) ?? 0) + 1);
    for (const t of c.metadata?.tags ?? []) {
      tags.set(t, (tags.get(t) ?? 0) + 1);
    }
  }

  const active = cards.filter((c) => c.computed?.is_active).length;
  const inviteOnly = cards.filter((c) => c.computed?.is_invite_only).length;
  const lifetimeFree = cards.filter((c) => c.computed?.is_lifetime_free).length;

  return {
    generated_at: new Date().toISOString().replace(/\.\d+Z$/, "+00:00"),
    counts: {
      cards_total: cards.length,
      cards_active: active,
      cards_invite_only: inviteOnly,
      cards_lifetime_free: lifetimeFree,
      issuers: Object.keys(issuers).length,
      networks: Object.keys(networks).length,
    },
    by_status: sortedByCountDesc(statuses),
    by_tier: sortedByCountDesc(tiers),
    by_issuer: sortedByCountDesc(byIssuer),
    by_network: sortedByCountDesc(byNetwork),
    by_reward_currency: sortedByCountDesc(byCurrency),
    tags: sortedByCountDesc(tags),
  };
}

// --- Write ---------------------------------------------------------------

function writeJson(p, data) {
  writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const networks = loadMany(path.join(DATA_DIR, "networks"));
  const issuers = loadMany(path.join(DATA_DIR, "issuers"));

  const cardFiles = listCardFiles(path.join(DATA_DIR, "cards"));
  const cards = cardFiles
    .map((p) => enrichCard(loadYaml(p), issuers, networks))
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  writeJson(path.join(OUT_DIR, "cards.json"), cards);
  writeJson(
    path.join(OUT_DIR, "issuers.json"),
    Object.values(issuers).sort((a, b) =>
      a.id < b.id ? -1 : a.id > b.id ? 1 : 0,
    ),
  );
  writeJson(
    path.join(OUT_DIR, "networks.json"),
    Object.values(networks).sort((a, b) =>
      a.id < b.id ? -1 : a.id > b.id ? 1 : 0,
    ),
  );
  writeJson(
    path.join(OUT_DIR, "index.json"),
    buildIndex(cards, issuers, networks),
  );

  const relOut = path.relative(REPO_ROOT, OUT_DIR);
  console.log(
    `Wrote ${cards.length} cards, ${Object.keys(issuers).length} issuers, ${Object.keys(networks).length} networks to ${relOut}/`,
  );
}

main();
