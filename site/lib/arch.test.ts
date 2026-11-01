// Architecture guard (docs/CODING_STANDARDS.md ST-3): lib/ is the inner layer
// and never imports from app/ or components/. Uses dependency-cruiser's JS API
// with the same layer rule as .dependency-cruiser.cjs, but at severity "error".
import { cruise } from "dependency-cruiser";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const SITE_ROOT = resolve(import.meta.dirname, "..");

/** Known violations that predate this guard. Must only shrink; new ones fail. */
const ALLOWLIST: readonly string[] = [];

async function layerViolations(baseDir: string): Promise<string[]> {
  // dependency-cruiser resolves its file arguments against the cwd.
  const previous = process.cwd();
  process.chdir(baseDir);
  try {
    return await runCruise();
  } finally {
    process.chdir(previous);
  }
}

async function runCruise(): Promise<string[]> {
  const result = await cruise(["lib"], {
    validate: true,
    ruleSet: {
      forbidden: [
        {
          name: "lib-not-to-app-or-components",
          severity: "error",
          from: { path: "^lib/" },
          to: { path: "^(app|components)/" },
        },
      ],
    },
    tsPreCompilationDeps: true,
    // Project files only: node_modules is not followed.
    doNotFollow: { path: "node_modules" },
  });
  if (typeof result.output === "string") throw new Error("expected object output");
  return result.output.summary.violations.map((v) => `${v.from} -> ${v.to}`);
}

describe("architecture: lib/ is the inner layer", () => {
  it("detects a lib/ file importing from app/ (fixture)", async () => {
    const dir = mkdtempSync(join(tmpdir(), "arch-fixture-"));
    try {
      mkdirSync(join(dir, "lib"));
      mkdirSync(join(dir, "app"));
      mkdirSync(join(dir, "components"));
      writeFileSync(join(dir, "app", "page.ts"), "export const page = 1;\n");
      writeFileSync(join(dir, "components", "Card.ts"), "export const card = 1;\n");
      writeFileSync(
        join(dir, "lib", "bad.ts"),
        'import { page } from "../app/page";\nimport { card } from "../components/Card";\nexport const x = page + card;\n',
      );
      const found = await layerViolations(dir);
      expect(found.sort()).toEqual([
        "lib/bad.ts -> app/page.ts",
        "lib/bad.ts -> components/Card.ts",
      ]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("lib/ imports nothing from app/ or components/ beyond the allowlist", async () => {
    const found = await layerViolations(SITE_ROOT);
    const unexpected = found.filter((v) => !ALLOWLIST.includes(v));
    expect(unexpected).toEqual([]);
  });
});
