import { describe, expect, it } from "vitest";
import { compareToBaseline, countEscapeHatches, countLintWarnings, countSetStateInEffect, runRatchet } from "./check-ratchet.mjs";

const base = { any: 2, asUnknownAs: 1, nonNull: 3, eslintDisable: 1, lintWarnings: 10, setStateInEffect: 4 };

describe("compareToBaseline", () => {
  it("exits 1 when any count is above baseline", () => {
    const r = compareToBaseline({ ...base, nonNull: 4 }, base);
    expect(r.exitCode).toBe(1);
    expect(r.lines.join("\n")).toMatch(/nonNull.*FAIL/);
  });
  it("exits 0 when all counts equal baseline", () => {
    const r = compareToBaseline(base, base);
    expect(r.exitCode).toBe(0);
    expect(r.lines.join("\n")).not.toMatch(/lower the baseline/);
  });
  it("exits 0 and says to lower the baseline when a count fell", () => {
    const r = compareToBaseline({ ...base, any: 1 }, base);
    expect(r.exitCode).toBe(0);
    expect(r.lines.join("\n")).toMatch(/lower the baseline/);
  });
  it("fails on a missing baseline key", () => {
    expect(compareToBaseline(base, { any: 2 }).exitCode).toBe(1);
  });
});

describe("countEscapeHatches", () => {
  it("counts the four patterns and ignores comments and strings", () => {
    const src = [
      "const a: any = 1;",
      "const b = x as unknown as Foo;",
      "const c = y!.z;",
      "// eslint-disable-next-line no-console",
      "const d = 'any row: any'; // a: any in a comment",
      "if (a != b) {}",
    ].join("\n");
    expect(countEscapeHatches([{ path: "lib/a.ts", text: src }])).toEqual({
      any: 1,
      asUnknownAs: 1,
      nonNull: 1,
      eslintDisable: 1,
    });
  });
});

describe("countLintWarnings", () => {
  it("counts only the five size/complexity rules", () => {
    const json = [
      { messages: [{ ruleId: "max-lines" }, { ruleId: "complexity" }, { ruleId: "@typescript-eslint/no-unused-vars" }] },
      { messages: [{ ruleId: "max-params" }, { ruleId: "max-depth" }, { ruleId: "max-lines-per-function" }] },
    ];
    expect(countLintWarnings(json)).toBe(5);
  });
});

describe("setStateInEffect", () => {
  it("counts only react-hooks/set-state-in-effect and leaves lintWarnings alone", () => {
    const json = [
      { messages: [{ ruleId: "react-hooks/set-state-in-effect" }, { ruleId: "max-lines" }] },
      { messages: [{ ruleId: "react-hooks/set-state-in-effect" }, { ruleId: "react-hooks/exhaustive-deps" }] },
    ];
    expect(countSetStateInEffect(json)).toBe(2);
    expect(countLintWarnings(json)).toBe(1);
  });
  it("fails above baseline and says to lower it below", () => {
    expect(compareToBaseline({ ...base, setStateInEffect: 5 }, base).lines.join("\n")).toMatch(/setStateInEffect.*FAIL/);
    expect(compareToBaseline({ ...base, setStateInEffect: 3 }, base).lines.join("\n")).toMatch(/lower the baseline/);
  });
});

describe("runRatchet", () => {
  it("returns the comparison exit code using injected counts", () => {
    const counts = { any: 0, asUnknownAs: 0, nonNull: 0, eslintDisable: 0, lintWarnings: 11, setStateInEffect: 4 };
    expect(runRatchet({ counts, baseline: base }).exitCode).toBe(1);
  });
});
