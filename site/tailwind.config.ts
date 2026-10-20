import type { Config } from "tailwindcss";

/**
 * Tailwind theme = thin mapping onto the CSS variables in styles/tokens.css.
 * Light/dark switching happens entirely in CSS (the variables change), so
 * components need no `dark:` variants. Use the semantic names below rather
 * than raw palette colours (slate-500, blue-600 …).
 */
const c = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx}",
  ],
  // Theme is driven by data-theme / prefers-color-scheme in tokens.css. This
  // selector only matters if someone adds an explicit `dark:` variant.
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: c("canvas"),
        surface: {
          DEFAULT: c("surface"),
          subtle: c("surface-subtle"),
          muted: c("surface-muted"),
        },
        inverse: c("inverse"),
        fg: {
          DEFAULT: c("fg"),
          secondary: c("fg-secondary"),
          muted: c("fg-muted"),
          disabled: c("fg-disabled"),
          placeholder: c("fg-placeholder"),
        },
        on: {
          accent: c("on-accent"),
          inverse: c("on-inverse"),
          "inverse-muted": c("on-inverse-muted"),
          "inverse-accent": c("on-inverse-accent"),
          "accent-disabled": c("on-accent-disabled"),
        },
        line: {
          DEFAULT: c("line"),
          strong: c("line-strong"),
        },
        accent: {
          DEFAULT: c("accent"),
          hover: c("accent-hover"),
          fg: c("accent-fg"),
          strong: c("accent-strong"),
          subtle: c("accent-subtle"),
          line: c("accent-line"),
          disabled: c("accent-disabled"),
        },
        focus: c("focus"),
        success: { DEFAULT: c("success"), subtle: c("success-subtle"), line: c("success-line") },
        warn: { DEFAULT: c("warn"), subtle: c("warn-subtle"), line: c("warn-line") },
        danger: { DEFAULT: c("danger"), subtle: c("danger-subtle"), line: c("danger-line") },
        chart: {
          1: c("chart-1"),
          2: c("chart-2"),
          3: c("chart-3"),
          4: c("chart-4"),
          5: c("chart-5"),
          6: c("chart-6"),
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      // Same keys as Tailwind's defaults (so tailwind-merge and existing
      // classes keep working); values come from the type-scale tokens.
      fontSize: {
        xs: ["var(--text-xs)", { lineHeight: "var(--leading-xs)" }],
        sm: ["var(--text-sm)", { lineHeight: "var(--leading-sm)" }],
        base: ["var(--text-base)", { lineHeight: "var(--leading-base)" }],
        lg: ["var(--text-lg)", { lineHeight: "var(--leading-lg)" }],
        xl: ["var(--text-xl)", { lineHeight: "var(--leading-xl)" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "var(--leading-2xl)" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "var(--leading-3xl)" }],
        "4xl": ["var(--text-4xl)", { lineHeight: "var(--leading-4xl)" }],
      },
      spacing: {
        inline: "var(--space-inline)",
        stack: "var(--space-stack)",
        card: "var(--space-card)",
        section: "var(--space-section)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        none: "var(--elevation-0)",
        sm: "var(--elevation-1)",
        DEFAULT: "var(--elevation-2)",
        md: "var(--elevation-3)",
        lg: "var(--elevation-4)",
      },
      ringColor: {
        DEFAULT: c("focus"),
      },
    },
  },
  plugins: [],
};

export default config;
