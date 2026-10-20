import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  contrastRatio,
  evaluate,
  parseTokens,
  PAIRS,
  type PairResult,
} from "./design-tokens";

const css = readFileSync(join(__dirname, "..", "styles", "tokens.css"), "utf8");
const tokens = parseTokens(css);

describe("contrast maths (WCAG 2.2 relative luminance)", () => {
  test("black on white is 21:1, same colour is 1:1", () => {
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 5);
    expect(contrastRatio([119, 119, 119], [119, 119, 119])).toBe(1);
  });
  test("#767676 on white is the canonical 4.54:1", () => {
    expect(contrastRatio([118, 118, 118], [255, 255, 255])).toBeCloseTo(4.54, 2);
  });
});

describe("token file structure", () => {
  test("dark palette is identical in the media query and the manual override", () => {
    expect(tokens.darkMedia).toEqual(tokens.dark);
  });
  test("dark palette actually differs from light (parser sanity)", () => {
    expect(tokens.dark.canvas).not.toEqual(tokens.light.canvas);
    expect(tokens.dark.fg).not.toEqual(tokens.light.fg);
  });
  test("both themes define the same colour tokens", () => {
    expect(Object.keys(tokens.dark).sort()).toEqual(Object.keys(tokens.light).sort());
  });
  test("every token named in PAIRS exists", () => {
    for (const p of PAIRS) {
      expect(tokens.light, p.fg).toHaveProperty([p.fg]);
      expect(tokens.light, p.bg).toHaveProperty([p.bg]);
    }
  });
});

const fmt = (r: PairResult) =>
  `${r.theme}: ${r.fg} on ${r.bg} = ${r.ratio.toFixed(2)}:1 (needs ${r.min}:1, ${r.kind})`;

for (const theme of ["light", "dark"] as const) {
  describe(`WCAG contrast — ${theme} theme`, () => {
    const results = evaluate(tokens[theme], theme);

    if (process.env.CONTRAST_REPORT) {
      // CONTRAST_REPORT=1 npx vitest run lib/design-tokens.test.ts
      console.log(results.map((r) => `${r.pass ? "PASS" : "FAIL"}  ${fmt(r)}`).join("\n"));
    }

    test.each(results.map((r) => [fmt(r), r] as const))("%s", (_label, r) => {
      expect(r.ratio).toBeGreaterThanOrEqual(r.min);
    });
  });
}
