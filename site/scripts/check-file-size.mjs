#!/usr/bin/env node
// File-size gate (docs/CODING_STANDARDS.md ST-1).
//
// Hand-written source (ts, tsx, mjs, py) under site/, scripts/ and
// booking-savings/ must stay at or under 800 physical lines. Generated types,
// node_modules, .next, dist, tests and data are not counted.
//
// Existing oversize files sit in site/scripts/file-size-allowlist.json with a
// `max` (their line count when allowlisted), a `since` date and a `reason`. An
// allowlisted file fails if it grows past its `max`; an oversize file that is
// not listed fails. Shrinking is fine: lower `max`, or delete the entry once
// the file is at 800 lines or fewer.
//
// Usage: node scripts/check-file-size.mjs   (run from site/; `npm run file-size`)

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const LIMIT = 800;
export const SCAN_DIRS = ["site", "scripts", "booking-savings"];

const SOURCE_EXT = /\.(ts|tsx|mjs|py)$/;
const EXCLUDED = [
  /(^|\/)node_modules\//,
  /(^|\/)\.next\//,
  /(^|\/)dist\//,
  /^data\//,
  /(^|\/)generated-types\.ts$/,
  /\.d\.ts$/,
  /\.(test|spec)\.(ts|tsx|mjs)$/,
  /(^|\/)test_[^/]*\.py$/,
  /_test\.py$/,
  /(^|\/)__tests__\//,
];

export function isCountedFile(path) {
  const p = path.split("\\").join("/");
  return SOURCE_EXT.test(p) && !EXCLUDED.some((re) => re.test(p));
}

/** Physical line count; a trailing newline does not add a line. */
export function countLines(text) {
  if (text === "") return 0;
  const n = text.split("\n").length;
  return text.endsWith("\n") ? n - 1 : n;
}

export function validateAllowlist(allowlist) {
  const problems = [];
  for (const [path, e] of Object.entries(allowlist)) {
    if (!e || !Number.isInteger(e.max) || e.max <= LIMIT) {
      problems.push(`${path}: max must be an integer over ${LIMIT}`);
    }
    if (!e || !/^\d{4}-\d{2}-\d{2}$/.test(e.since ?? "")) problems.push(`${path}: missing since date`);
    if (!e || typeof e.reason !== "string" || !e.reason.trim()) problems.push(`${path}: missing reason`);
  }
  return problems;
}

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    if (["node_modules", ".next", ".git", "dist"].includes(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Scan `root` (the repo root) and compare with the allowlist. */
export function checkFileSize({ root, allowlist }) {
  const violations = [];
  const problems = validateAllowlist(allowlist);
  const seen = new Set();
  for (const d of SCAN_DIRS) {
    let paths;
    try {
      paths = walk(join(root, d), []);
    } catch {
      continue; // directory absent
    }
    for (const p of paths) {
      const rel = relative(root, p).split("\\").join("/");
      if (!isCountedFile(rel)) continue;
      const lines = countLines(readFileSync(p, "utf8"));
      seen.add(rel);
      if (lines <= LIMIT) continue;
      const entry = allowlist[rel];
      if (!entry) violations.push({ path: rel, kind: "over limit, not allowlisted", lines });
      else if (lines > entry.max) {
        violations.push({ path: rel, kind: `grew past allowlisted max ${entry.max}`, lines });
      }
    }
  }
  for (const path of Object.keys(allowlist)) {
    if (!seen.has(path)) problems.push(`${path}: allowlisted but missing or not a counted file; remove the entry`);
  }
  return { exitCode: violations.length || problems.length ? 1 : 0, violations, problems };
}

function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const root = resolve(here, "..", "..");
  const allowlist = JSON.parse(readFileSync(join(here, "file-size-allowlist.json"), "utf8"));
  const r = checkFileSize({ root, allowlist });
  for (const p of r.problems) console.error(`  allowlist problem: ${p}`);
  for (const v of r.violations) console.error(`  FAIL ${v.path}: ${v.kind}, ${v.lines} lines`);
  if (r.exitCode) {
    console.error(
      `\nFile-size check failed. Split the file (limit ${LIMIT}). An existing oversize file may not grow; see site/scripts/file-size-allowlist.json.`,
    );
  } else {
    console.log(`file-size: ok (limit ${LIMIT}, ${Object.keys(allowlist).length} allowlisted)`);
  }
  return r.exitCode;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
