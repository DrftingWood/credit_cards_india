import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LIMIT, checkFileSize, isCountedFile, validateAllowlist } from "./check-file-size.mjs";

const lines = (n) => Array.from({ length: n }, (_, i) => `const x${i} = ${i};`).join("\n") + "\n";
let root;
beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "fsize-"));
  mkdirSync(join(root, "site", "lib"), { recursive: true });
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("checkFileSize", () => {
  it("fails an 801-line file that is not allowlisted", () => {
    writeFileSync(join(root, "site/lib/big.ts"), lines(LIMIT + 1));
    const r = checkFileSize({ root, allowlist: {} });
    expect(r.exitCode).toBe(1);
    expect(r.violations[0].path).toBe("site/lib/big.ts");
  });
  it("passes an 800-line file", () => {
    writeFileSync(join(root, "site/lib/ok.ts"), lines(LIMIT));
    expect(checkFileSize({ root, allowlist: {} }).exitCode).toBe(0);
  });
  it("passes an allowlisted file at its recorded max and fails when it grows", () => {
    writeFileSync(join(root, "site/lib/big.ts"), lines(850));
    const allowlist = { "site/lib/big.ts": { max: 850, since: "2026-11-01", reason: "legacy" } };
    expect(checkFileSize({ root, allowlist }).exitCode).toBe(0);
    writeFileSync(join(root, "site/lib/big.ts"), lines(851));
    const r = checkFileSize({ root, allowlist });
    expect(r.exitCode).toBe(1);
    expect(r.violations[0].kind).toMatch(/grew/);
  });
  it("ignores generated-types.ts and tests", () => {
    writeFileSync(join(root, "site/lib/generated-types.ts"), lines(2000));
    writeFileSync(join(root, "site/lib/big.test.ts"), lines(2000));
    expect(checkFileSize({ root, allowlist: {} }).exitCode).toBe(0);
  });
  it("rejects allowlist entries without since/reason/max", () => {
    expect(validateAllowlist({ "a.ts": { max: 900 } }).length).toBeGreaterThan(0);
    expect(validateAllowlist({ "a.ts": { max: 900, since: "2026-11-01", reason: "x" } })).toEqual([]);
  });
});

describe("isCountedFile", () => {
  it("covers ts, tsx, mjs, py and excludes data and tests", () => {
    expect(isCountedFile("scripts/a.py")).toBe(true);
    expect(isCountedFile("site/scripts/a.mjs")).toBe(true);
    expect(isCountedFile("data/cards/a.yaml")).toBe(false);
    expect(isCountedFile("scripts/test_validate.py")).toBe(false);
    expect(isCountedFile("site/node_modules/x/a.ts")).toBe(false);
  });
});
