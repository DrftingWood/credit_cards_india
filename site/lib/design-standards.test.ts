import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const read = (...p: string[]) => readFileSync(join(__dirname, "..", ...p), "utf8");
const tokens = read("styles", "tokens.css");
const globals = read("styles", "globals.css");
const tailwind = read("tailwind.config.ts");
const layout = read("app", "layout.tsx");

/** Declarations inside the first rule whose selector matches `selector`. */
function ruleBody(css: string, selector: RegExp): string {
  const m = selector.exec(css);
  if (!m) return "";
  const open = css.indexOf("{", m.index);
  return css.slice(open + 1, css.indexOf("}", open));
}

describe("layout and typography tokens (docs/DESIGN_INSTRUCTIONS.md)", () => {
  test.each(["--container-page", "--container-prose", "--tracking-label", "--tracking-heading"])(
    "%s is defined in :root",
    (name) => {
      const root = ruleBody(tokens, /^:root\s*\{/m);
      expect(root).toMatch(new RegExp(`${name}\s*:\s*[^;]+;`));
    },
  );
  test("page container keeps the old max-w-6xl width (72rem)", () => {
    expect(ruleBody(tokens, /^:root\s*\{/m)).toMatch(/--container-page:\s*72rem;/);
  });
  test("Tailwind maps the tokens (max-w-page, max-w-prose, tracking-label, tracking-heading)", () => {
    expect(tailwind).toContain('page: "var(--container-page)"');
    expect(tailwind).toContain('prose: "var(--container-prose)"');
    expect(tailwind).toContain('label: "var(--tracking-label)"');
    expect(tailwind).toContain('heading: "var(--tracking-heading)"');
  });
});

describe("numerals and scrollbar", () => {
  test(".num sets tabular figures", () => {
    expect(ruleBody(globals, /\.num\s*\{/)).toMatch(/font-variant-numeric:\s*tabular-nums/);
  });
  test(".num-prop sets proportional figures", () => {
    expect(ruleBody(globals, /\.num-prop\s*\{/)).toMatch(/font-variant-numeric:\s*proportional-nums/);
  });
  test("html reserves the scrollbar gutter", () => {
    expect(ruleBody(globals, /\bhtml\s*\{/)).toMatch(/scrollbar-gutter:\s*stable/);
  });
});

describe("Inter font", () => {
  test("layout loads Inter via next/font with swap and latin + latin-ext (U+20B9 rupee lives in latin-ext)", () => {
    expect(layout).toMatch(/from "next\/font\/google"/);
    expect(layout).toMatch(/Inter\(/);
    expect(layout).toMatch(/display:\s*"swap"/);
    expect(layout).toMatch(/subsets:\s*\["latin",\s*"latin-ext"\]/);
    expect(layout).toMatch(/variable:\s*"--font-inter"/);
  });
  test("--font-sans leads with Inter and keeps the system stack as fallback", () => {
    expect(ruleBody(tokens, /^:root\s*\{/m)).toMatch(/--font-sans:\s*var\(--font-inter[^)]*\),[^;]*system-ui/);
  });
});
