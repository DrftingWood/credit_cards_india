// Flat ESLint config (docs/CODING_STANDARDS.md TE-3).
//
// eslint-config-next 15.x ships only legacy (eslintrc) presets, so FlatCompat
// from @eslint/eslintrc wraps `next/core-web-vitals` and `next/typescript`.
// Next's own docs show this pattern for ESLint 9 on Next 15:
// https://nextjs.org/docs/app/api-reference/config/eslint (Next 16 ships
// native flat exports; drop FlatCompat when upgrading).
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  {
    ignores: [".next/**", "node_modules/**", "dist/**", "lib/generated-types.ts", "next-env.d.ts", "coverage/**", ".reports/**"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
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
