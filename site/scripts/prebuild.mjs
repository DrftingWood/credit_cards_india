#!/usr/bin/env node
// Runs before `next dev` / `next build`. Invokes the Python build step so
// dist/*.json is fresh. Non-fatal if python isn't on PATH and the artefact
// already exists.

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd(), "..");
const distDir = path.join(repoRoot, "dist");
const buildScript = path.join(repoRoot, "scripts", "build.py");

function tryRun(cmd) {
  try {
    execSync(cmd, { stdio: "inherit", cwd: repoRoot });
    return true;
  } catch {
    return false;
  }
}

if (existsSync(buildScript)) {
  const ok = tryRun("python3 scripts/build.py") || tryRun("python scripts/build.py");
  if (!ok) {
    if (existsSync(path.join(distDir, "cards.json"))) {
      console.warn("[prebuild] python unavailable; using existing dist/*.json");
    } else {
      console.error("[prebuild] python unavailable and no existing artefact. Install Python 3 or run build.py manually.");
      process.exit(1);
    }
  }
} else {
  console.warn("[prebuild] ../scripts/build.py not found; skipping");
}
