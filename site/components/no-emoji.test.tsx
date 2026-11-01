import { describe, test, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

// UI-2 / UX-2 / DI-21: no decorative emoji in product UI. Labels first; an icon from the
// @/components/icons barrel (Phosphor) supports a label.
//
// Allowlist: text symbols that are NOT emoji but that Unicode marks Extended_Pictographic.
// They are plain typographic glyphs in our UI, never colour-emoji:
//   star (U+2605) rank/cheapest marker, up-right arrow (U+2197) external-link hint,
//   check (U+2713) and cross (U+2715) status marks, arrows (U+2190-2193), bullet, dot.
// Keep this list minimal; add a symbol only if it is a text glyph with a text fallback.
const ALLOWED = new Set(["\u2605", "\u2197", "\u2713", "\u2715", "\u2190", "\u2191", "\u2192", "\u2193", "\u2022", "\u00b7"]);
// Variation selector 16 forces emoji presentation of a text symbol, so it is itself a violation.
const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}|\uFE0F/u;

const ROOTS = ["app", "components"].map((d) => resolve(__dirname, "..", d));

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return files(p);
    return /\.tsx$/.test(name) && !/\.test\.tsx$/.test(name) ? [p] : [];
  });
}

describe("no decorative emoji in product UI", () => {
  test("no .tsx under site/app or site/components contains an emoji", () => {
    const hits: string[] = [];
    for (const f of ROOTS.flatMap(files)) {
      readFileSync(f, "utf8").split("\n").forEach((line, i) => {
        for (const ch of line) {
          if (EMOJI.test(ch) && !ALLOWED.has(ch)) hits.push(`${f.split("site")[1]}:${i + 1} U+${ch.codePointAt(0)!.toString(16).toUpperCase()}`);
        }
      });
    }
    expect(hits).toEqual([]);
  });
});
