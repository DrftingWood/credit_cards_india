#!/usr/bin/env node
/**
 * Runs before `next dev` / `next build`. Regenerates ../dist/*.json by
 * invoking the Node build script so the YAML dataset stays in sync with
 * the JSON artefact the site reads. CWD-independent.
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

for (const script of ["gen-types.mjs", "build.mjs"]) {
  const res = spawnSync(process.execPath, [path.join(here, script)], { stdio: "inherit" });
  if (res.status !== 0) {
    process.exit(res.status ?? 1);
  }
}
