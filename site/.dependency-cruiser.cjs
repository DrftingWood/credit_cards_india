// Architecture rules (docs/CODING_STANDARDS.md ST-3). Report-only in CI: every
// rule is `warn`, so `npm run arch` prints violations but exits 0. The layer
// rule is also enforced by lib/arch.test.ts. Rules reference:
// https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      comment:
        'An import cycle means neither module can be understood, tested or split on its own. ' +
        'Move the shared piece into a third module.',
      severity: 'warn',
      from: {},
      to: { circular: true },
    },
    {
      name: 'lib-not-to-app-or-components',
      comment:
        'lib/ is the inner layer (calculator, recommender, data): app/ and components/ depend ' +
        'on it, never the reverse, so engines stay testable and usable from build scripts.',
      severity: 'warn',
      from: { path: '^lib/' },
      to: { path: '^(app|components)/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '^(\.next|dist)/' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.cjs', '.d.ts'],
    },
  },
};
