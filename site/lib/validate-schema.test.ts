import { describe, test, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const VALIDATOR = resolve(import.meta.dirname, "../scripts/validate-schema.mjs");

describe("schema validator smoke (PR 4)", () => {
  test("passes against the current real dataset", () => {
    const result = spawnSync(process.execPath, [VALIDATOR], {
      encoding: "utf8",
      timeout: 60000,
    });
    if (result.status !== 0) {
      // surface real errors when this test fails
      throw new Error(
        `validator exited ${result.status}\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
      );
    }
    expect(result.stdout).toMatch(/Schema validation OK: \d+ files/);
  });
});
