import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const read = (...p: string[]) => readFileSync(join(__dirname, "..", ...p), "utf8");
const tokens = read("styles", "tokens.css");
const globals = read("styles", "globals.css");
const theme = read("styles", "theme.css");
const layout = read("app", "layout.tsx");

/** Declarations inside the first rule whose selector matches `selector`. */
function ruleBody(css: string, selector: RegExp): string {
  const m = selector.exec(css);
  if (!m) return "";
  const open = css.indexOf("{", m.index);
  return css.slice(open + 1, css.indexOf("}", open));
}

/** The literal tokens: declared once, in the `@theme static` block of theme.css. */
const literalTokens = ruleBody(theme, /^@theme static\s*\{/m);
const colourMap = ruleBody(theme, /^@theme inline\s*\{/m);

describe("layout and typography tokens (docs/DESIGN_INSTRUCTIONS.md)", () => {
  test.each(["--container-page", "--container-prose", "--tracking-label", "--tracking-heading"])(
    "%s is defined in theme.css (@theme static)",
    (name) => {
      expect(literalTokens).toMatch(new RegExp(`${name}\\s*:\\s*[^;]+;`));
    },
  );
  test("page container keeps the old max-w-6xl width (72rem)", () => {
    expect(literalTokens).toMatch(/--container-page:\s*72rem;/);
  });
  test("prose measure is 65ch", () => {
    expect(literalTokens).toMatch(/--container-prose:\s*65ch;/);
  });
  test("tracking roles keep the old tracking-wide / tracking-tight values", () => {
    expect(literalTokens).toMatch(/--tracking-label:\s*0\.025em;/);
    expect(literalTokens).toMatch(/--tracking-heading:\s*-0\.025em;/);
  });
  test("every type-scale step sets size and line-height (text-xs … text-4xl)", () => {
    for (const k of ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"]) {
      expect(literalTokens).toMatch(new RegExp(`--text-${k}:\\s*[0-9.]+rem;`));
      expect(literalTokens).toMatch(new RegExp(`--text-${k}--line-height:\\s*[0-9.]+rem;`));
    }
  });
  test("radius scale keeps the old names and values", () => {
    for (const [k, v] of [["sm", "0.125rem"], ["md", "0.375rem"], ["lg", "0.5rem"], ["xl", "0.75rem"], ["2xl", "1rem"], ["full", "9999px"]]) {
      expect(literalTokens).toMatch(new RegExp(`--radius-${k}:\\s*${v};`));
    }
    expect(literalTokens).toMatch(/--radius:\s*0\.25rem;/);
  });
});

describe("theme.css maps every token onto Tailwind (replaces tailwind.config.ts)", () => {
  const channelNames = [...tokens.matchAll(/^\s*--rgb-([a-z0-9-]+)\s*:/gm)].map((m) => m[1]);
  test("tokens.css defines colour channels", () => {
    expect(channelNames.length).toBeGreaterThan(30);
  });
  test("every --rgb-<name> channel has a --color-<name> utility mapping", () => {
    const unmapped = [...new Set(channelNames)].filter(
      (n) => !colourMap.includes(`--color-${n}: rgb(var(--rgb-${n}));`),
    );
    expect(unmapped).toEqual([]);
  });
  test("the mapping does not point at colours that are not tokens", () => {
    const mapped = [...colourMap.matchAll(/--color-([a-z0-9-]+):\s*rgb\(var\(--rgb-([a-z0-9-]+)\)\)/g)];
    for (const m of mapped) expect(m[1]).toBe(m[2]);
    expect(mapped.length).toBe(new Set(channelNames).size);
  });
  test("spacing aliases and elevation scale are mapped", () => {
    for (const k of ["inline", "stack", "card", "section"]) {
      expect(colourMap).toContain(`--spacing-${k}: var(--space-${k});`);
    }
    expect(colourMap).toContain("--shadow-none: var(--elevation-0);");
    expect(colourMap).toContain("--shadow-sm: var(--elevation-1);");
    expect(colourMap).toContain("--shadow: var(--elevation-2);");
    expect(colourMap).toContain("--shadow-md: var(--elevation-3);");
    expect(colourMap).toContain("--shadow-lg: var(--elevation-4);");
  });
  test("tokens.css does not redeclare names that Tailwind 4 reads as theme variables (they would form a cycle)", () => {
    const root = ruleBody(tokens, /^:root\s*\{/m);
    expect(root).not.toMatch(/--(text|leading|radius|container|tracking|font-sans|font-mono|color)[-:]/);
  });
  test("globals.css scans exactly app, components and lib (the old `content` list) and keeps the dark selector", () => {
    expect(globals).toContain('@import "tailwindcss" source(none);');
    expect(globals).toContain('@source "../app/**/*.{ts,tsx,mdx}";');
    expect(globals).toContain('@source "../components/**/*.{ts,tsx,mdx}";');
    expect(globals).toContain('@source "../lib/**/*.{ts,tsx}";');
    expect(globals).toContain('@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));');
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
    expect(literalTokens).toMatch(/--font-sans:\s*var\(--font-inter[^)]*\),[^;]*system-ui/);
  });
});
