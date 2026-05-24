#!/usr/bin/env node
/**
 * Schema-only validation of YAML data files against their JSON Schemas.
 *
 * Runs in prebuild so `npm run dev`, `npm run build`, and Vercel deploys all
 * catch structural data bugs (missing required fields, invalid enums, malformed
 * records) before build.mjs consumes them. Cross-file lints (no-overlap dated
 * arrays, channel-token vocabulary, replaces_card refs, source staleness) live
 * in scripts/validate.py and only run in CI on PR — that one source of richer
 * rules is intentionally not duplicated here.
 *
 * Exits 1 on any validation failure so prebuild fails fast.
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, "..", "..");
const SCHEMA_DIR = path.join(REPO_ROOT, "schema");
const DATA_DIR = path.join(REPO_ROOT, "data");

// Mirrors build.mjs:normalize — js-yaml turns bare YAML dates into Date
// objects, but the schemas declare them as `string` with `format: date`.
// Coerce to ISO date strings before validating so the validator sees what
// build.mjs eventually writes to dist/.
function normalize(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return value.map(normalize);
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

function loadSchema(name) {
  return JSON.parse(readFileSync(path.join(SCHEMA_DIR, name), "utf8"));
}

function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function walkYamls(dir) {
  if (!isDir(dir)) return [];
  const out = [];
  for (const f of readdirSync(dir, { recursive: true })) {
    if (typeof f !== "string" || !f.endsWith(".yaml")) continue;
    out.push(path.join(dir, f));
  }
  return out.sort();
}

const ajv = new Ajv2020({ strict: false, allErrors: true });
addFormats(ajv);

const validators = {
  card: ajv.compile(loadSchema("card.schema.json")),
  issuer: ajv.compile(loadSchema("issuer.schema.json")),
  network: ajv.compile(loadSchema("network.schema.json")),
  loyalty_program: ajv.compile(loadSchema("loyalty_program.schema.json")),
};

const targets = [
  { dir: path.join(DATA_DIR, "cards"), schema: "card" },
  { dir: path.join(DATA_DIR, "issuers"), schema: "issuer" },
  { dir: path.join(DATA_DIR, "networks"), schema: "network" },
  { dir: path.join(DATA_DIR, "loyalty_programs"), schema: "loyalty_program" },
];

let errorCount = 0;
let fileCount = 0;

for (const t of targets) {
  const validate = validators[t.schema];
  for (const file of walkYamls(t.dir)) {
    fileCount++;
    const rel = path.relative(REPO_ROOT, file);
    let doc;
    try {
      doc = loadYaml(file);
    } catch (e) {
      console.error(`FAIL ${rel}\n  YAML parse error: ${e.message}`);
      errorCount++;
      continue;
    }
    if (!validate(doc)) {
      console.error(`FAIL ${rel}`);
      for (const err of validate.errors ?? []) {
        const at = err.instancePath || "/";
        console.error(`  ${at} ${err.message}`);
      }
      errorCount++;
    }
  }
}

if (errorCount > 0) {
  console.error(
    `\nSchema validation failed: ${errorCount} of ${fileCount} files invalid.`,
  );
  console.error(
    "Cross-file lints (no-overlap, channel vocab, source staleness) only run in CI via scripts/validate.py.",
  );
  process.exit(1);
}

console.log(`Schema validation OK: ${fileCount} files.`);
