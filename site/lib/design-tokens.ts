/**
 * Design-token helpers: parse the colour tokens out of styles/tokens.css and
 * compute WCAG 2.2 contrast ratios for the text/background pairings the UI
 * actually uses. Consumed by design-tokens.test.ts (and handy in a REPL).
 *
 * Contrast maths per WCAG 2.2 "relative luminance" (sRGB threshold 0.04045)
 * and "contrast ratio" = (L1 + 0.05) / (L2 + 0.05).
 */

export type Rgb = [number, number, number];
export type Palette = Record<string, Rgb>;
export type Theme = "light" | "dark";

/** Ratio thresholds. WCAG thresholds are not rounded: 4.499 fails 4.5. */
export const MIN_BODY_TEXT = 4.5; // SC 1.4.3, normal text
export const MIN_LARGE_OR_UI = 3; // SC 1.4.3 large text (≥24px or ≥18.66px bold) and SC 1.4.11 non-text

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance([r, g, b]: Rgb): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Extract `--color-*: R G B;` declarations from one CSS block body. */
function parseColorVars(block: string): Palette {
  const out: Palette = {};
  const re = /--color-([a-z0-9-]+)\s*:\s*(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})\s*;/g;
  for (const m of block.matchAll(re)) {
    out[m[1]] = [Number(m[2]), Number(m[3]), Number(m[4])];
  }
  return out;
}

/** Body of the first `{ … }` block following `selector` (one nesting level). */
function blockAfter(css: string, selector: string): string {
  const at = css.indexOf(selector);
  if (at < 0) throw new Error(`selector not found in tokens.css: ${selector}`);
  const open = css.indexOf("{", at);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return css.slice(open + 1, i);
  }
  throw new Error(`unterminated block after ${selector}`);
}

export interface ParsedTokens {
  light: Palette;
  dark: Palette;
  /** The dark palette as declared inside @media (prefers-color-scheme: dark). */
  darkMedia: Palette;
}

export function parseTokens(rawCss: string): ParsedTokens {
  // Comments mention the selectors too; strip them so lookups hit real rules.
  const css = rawCss.replace(/\/\*[\s\S]*?\*\//g, "");
  const light = parseColorVars(blockAfter(css, ":root {"));
  const mediaBody = blockAfter(css, "@media (prefers-color-scheme: dark)");
  const darkMedia = { ...light, ...parseColorVars(mediaBody) };
  const dark = { ...light, ...parseColorVars(blockAfter(css, ':root[data-theme="dark"]')) };
  return { light, dark, darkMedia };
}

export type PairKind = "body" | "large-ui";

export interface Pair {
  fg: string;
  bg: string;
  kind: PairKind;
  /** Where this pairing appears, for humans reading a failure. */
  note?: string;
}

const PAGE_BGS = ["canvas", "surface", "surface-subtle", "surface-muted"];

/**
 * Every foreground/background pairing the components use. When you add a
 * token or put a token on a new background, add the pair here.
 */
export const PAIRS: Pair[] = [
  // Neutral text on every neutral background.
  ...["fg", "fg-secondary", "fg-muted", "accent-fg"].flatMap((fg) =>
    PAGE_BGS.map((bg): Pair => ({ fg, bg, kind: "body" })),
  ),
  // Accent.
  { fg: "on-accent", bg: "accent", kind: "body", note: "primary button label" },
  { fg: "on-accent", bg: "accent-hover", kind: "body", note: "primary button hover" },
  { fg: "accent-fg", bg: "accent-subtle", kind: "body", note: "selected chip" },
  { fg: "accent-strong", bg: "accent-subtle", kind: "body", note: "highlight band text" },
  { fg: "accent-strong", bg: "surface", kind: "body" },
  { fg: "fg", bg: "accent-subtle", kind: "body" },
  { fg: "fg-secondary", bg: "accent-subtle", kind: "body" },
  { fg: "fg-muted", bg: "accent-subtle", kind: "body" },
  // Placeholder text is text (SC 1.4.3): inputs sit on surface, disabled ones on surface-subtle.
  { fg: "fg-placeholder", bg: "surface", kind: "body", note: "input placeholder" },
  { fg: "fg-placeholder", bg: "surface-subtle", kind: "body", note: "disabled input placeholder" },
  // Disabled primary button: WCAG-exempt (inactive), but we hold the label
  // to body contrast so it stays legible while reading as disabled.
  { fg: "on-accent-disabled", bg: "accent-disabled", kind: "body", note: "disabled primary button label" },
  // Inverse feature band (home "why trust the numbers").
  { fg: "on-inverse", bg: "inverse", kind: "body" },
  { fg: "on-inverse-muted", bg: "inverse", kind: "body" },
  { fg: "on-inverse-accent", bg: "inverse", kind: "body" },
  // Status: text on its tint, on plain surface, and neutral text on the tint.
  ...(["success", "warn", "danger"] as const).flatMap((s): Pair[] => [
    { fg: s, bg: `${s}-subtle`, kind: "body" },
    { fg: s, bg: "surface", kind: "body" },
    { fg: s, bg: "surface-subtle", kind: "body" },
    { fg: "fg", bg: `${s}-subtle`, kind: "body" },
    { fg: "fg-secondary", bg: `${s}-subtle`, kind: "body" },
  ]),
  // Non-text: control boundaries, focus ring, active indicators (SC 1.4.11).
  ...["canvas", "surface", "surface-subtle"].flatMap((bg): Pair[] => [
    { fg: "line-strong", bg, kind: "large-ui", note: "input / control border" },
    { fg: "focus", bg, kind: "large-ui", note: "focus ring" },
    { fg: "accent", bg, kind: "large-ui", note: "selected border / filled control" },
  ]),
  { fg: "success", bg: "surface", kind: "large-ui", note: "success border / icon" },
  // Chart series must read against the surfaces they sit on.
  ...[1, 2, 3, 4, 5, 6].flatMap((n): Pair[] => [
    { fg: `chart-${n}`, bg: "surface", kind: "large-ui" },
    { fg: `chart-${n}`, bg: "canvas", kind: "large-ui" },
  ]),
];

export interface PairResult extends Pair {
  theme: Theme;
  ratio: number;
  min: number;
  pass: boolean;
}

export function evaluate(palette: Palette, theme: Theme, pairs: Pair[] = PAIRS): PairResult[] {
  return pairs.map((p) => {
    const f = palette[p.fg];
    const b = palette[p.bg];
    if (!f || !b) throw new Error(`token missing in ${theme}: ${!f ? p.fg : p.bg}`);
    const ratio = contrastRatio(f, b);
    const min = p.kind === "body" ? MIN_BODY_TEXT : MIN_LARGE_OR_UI;
    return { ...p, theme, ratio, min, pass: ratio >= min };
  });
}
