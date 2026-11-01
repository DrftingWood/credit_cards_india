#!/usr/bin/env node
// Escape-hatch and lint-warning ratchet (docs/CODING_STANDARDS.md TE-2, ST-2).
//
// Counts, in non-test site code (app, components, lib, scripts):
//   any            explicit `any` types
//   asUnknownAs    double casts through unknown
//   nonNull        postfix `!` assertions
//   eslintDisable  eslint-disable directives with no ` -- reason`
// plus lintWarnings: warnings from the five size/complexity rules in
// eslint.config.mjs (max-lines, max-lines-per-function, complexity, max-params,
// max-depth) over app, components and lib.
//
// Each count must stay at or below site/ratchet-baseline.json. When a count
// falls, lower the baseline in the same PR so the ratchet only tightens.
// Raising a number needs a reason in the PR body.
//
// The pattern scan is a text scan, not type-aware: comments and one-line string
// literals are stripped first. The trend is what matters.
//
// Usage: node scripts/check-ratchet.mjs   (run from site/; `npm run ratchet`)

import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const KEYS = ["any", "asUnknownAs", "nonNull", "eslintDisable", "lintWarnings"];
export const SCAN_DIRS = ["app", "components", "lib", "scripts"];
export const LINT_DIRS = ["app", "components", "lib"];
export const LINT_RULES = new Set([
  "max-lines",
  "max-lines-per-function",
  "complexity",
  "max-params",
  "max-depth",
]);

const SOURCE = /\.(ts|tsx|mjs)$/;
const SKIP_FILE = /(\.test\.|\.spec\.|\.d\.ts$|(^|\/)generated-types\.ts$)/;
const SKIP_DIR = new Set(["node_modules", ".next", "dist"]);

// Built piecewise so this file does not count itself.
const DISABLE = new RegExp("(?:\\/\\/|\\/\\*)\\s*eslint-" + "disable");
const DISABLE_EXPLAINED = new RegExp("eslint-" + "disable[^\\n]*\\s--\\s*\\S");

const PATTERNS = {
  any: /(?::\s*any\b|\bas\s+any\b|<any\b|\bany\[\]|,\s*any\s*>)/g,
  asUnknownAs: /\bas\s+unknown\s+as\b/g,
  // Postfix `!` before member access, index, call close, comma, semicolon or
  // closing brace. `!=` and `!==` never match.
  nonNull: /[\w)\]]!(?=[.[),;}])/g,
};

function strip(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/g, '""')
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

/** @param files [{ path, text }] */
export function countEscapeHatches(files) {
  const counts = { any: 0, asUnknownAs: 0, nonNull: 0, eslintDisable: 0 };
  for (const { text } of files) {
    for (const line of text.split("\n")) {
      if (DISABLE.test(line) && !DISABLE_EXPLAINED.test(line)) counts.eslintDisable++;
    }
    const code = strip(text);
    for (const [key, re] of Object.entries(PATTERNS)) {
      counts[key] += [...code.matchAll(re)].length;
    }
  }
  return counts;
}

/** @param eslintJson parsed `eslint -f json` output */
export function countLintWarnings(eslintJson) {
  let n = 0;
  for (const f of eslintJson) for (const m of f.messages) if (LINT_RULES.has(m.ruleId)) n++;
  return n;
}

export function compareToBaseline(counts, baseline) {
  const lines = [];
  let failed = false;
  for (const key of KEYS) {
    const base = baseline[key];
    const n = counts[key];
    if (typeof base !== "number") {
      failed = true;
      lines.push(`${key.padEnd(14)} ${n} / (no baseline)  FAIL: key missing from ratchet-baseline.json`);
      continue;
    }
    const note =
      n > base ? "  FAIL: above baseline" : n < base ? "  (below baseline: lower the baseline)" : "";
    if (n > base) failed = true;
    lines.push(`${key.padEnd(14)} ${String(n).padStart(4)} / ${base}${note}`);
  }
  return { exitCode: failed ? 1 : 0, lines };
}

export function runRatchet({ counts, baseline }) {
  const result = compareToBaseline(counts, baseline);
  const out = [...result.lines];
  if (result.exitCode) {
    out.push(
      "\nRatchet failed: a new escape hatch or lint warning was added. Remove it, or explain why in the PR and raise the baseline.",
    );
  }
  return { exitCode: result.exitCode, lines: out };
}

// ---- filesystem / process glue ----

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIR.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

export function collectFiles(root) {
  const files = [];
  for (const d of SCAN_DIRS) {
    for (const p of walk(join(root, d), [])) {
      const rel = relative(root, p).split("\\").join("/");
      if (SOURCE.test(rel) && !SKIP_FILE.test(rel)) {
        files.push({ path: rel, text: readFileSync(p, "utf8") });
      }
    }
  }
  return files;
}

function lintWarningCount(root) {
  let stdout;
  try {
    stdout = execFileSync(
      process.execPath,
      [join(root, "node_modules/eslint/bin/eslint.js"), ...LINT_DIRS, "-f", "json"],
      {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 256 * 1024 * 1024,
        stdio: ["ignore", "pipe", "ignore"],
      },
    );
  } catch (e) {
    // ESLint exits 1 when it reports errors but still prints the JSON.
    stdout = e.stdout;
    if (!stdout) throw e;
  }
  return countLintWarnings(JSON.parse(stdout));
}

function main() {
  const root = process.cwd();
  const baseline = JSON.parse(readFileSync(resolve(root, "ratchet-baseline.json"), "utf8"));
  const counts = { ...countEscapeHatches(collectFiles(root)), lintWarnings: lintWarningCount(root) };
  const { exitCode, lines } = runRatchet({ counts, baseline });
  for (const l of lines) (exitCode ? console.error : console.log)(l);
  return exitCode;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}
