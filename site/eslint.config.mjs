// Flat ESLint config (docs/CODING_STANDARDS.md TE-3).
//
// eslint-config-next 16 ships native flat presets, so they are imported
// directly (no FlatCompat / @eslint/eslintrc, which Next 15 needed). Docs:
// https://nextjs.org/docs/app/api-reference/config/eslint
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "lib/generated-types.ts", "next-env.d.ts", "coverage/**", ".reports/**"],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Same file scope as the next presets, so the react-hooks plugin is in scope for this rule.
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    rules: {
      // Deferred owner decision (D-31): eslint-config-next 16 (react-hooks 7) added this as an
      // error. Four existing client components set state inside an effect on purpose (read
      // localStorage / URL after hydration to avoid a server-client mismatch): browse-client,
      // compare-client, beta-banner, theme-toggle. Kept as a warning, not rewritten, so the
      // upgrade changes no behaviour. Fix by moving to useSyncExternalStore or derived state.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    rules: {
      // Size and complexity, as warnings. The count is baselined in
      // ratchet-baseline.json (lintWarnings) and may only fall.
      "max-lines": ["warn", { max: 400, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["warn", { max: 60, skipBlankLines: true, skipComments: true, IIFEs: true }],
      complexity: ["warn", { max: 15 }],
      "max-params": ["warn", { max: 3 }],
      "max-depth": ["warn", { max: 3 }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      // Icons come from one barrel in components/icons/ (Task 9).
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@phosphor-icons/react",
              message: "Import icons from @/components/icons (the icons barrel), not directly from @phosphor-icons/react.",
            },
          ],
          patterns: [
            {
              group: ["@phosphor-icons/react/*"],
              message: "Import icons from @/components/icons (the icons barrel).",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["components/icons/**"],
    rules: { "no-restricted-imports": "off" },
  },
];

export default config;
