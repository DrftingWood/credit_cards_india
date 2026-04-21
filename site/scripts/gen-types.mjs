#!/usr/bin/env node
// Regenerates site/lib/generated-types.ts from ../schema/card.schema.json.
// Run manually with `npm run gen-types`. Keep site/lib/types.ts as the
// hand-authored facade that re-exports from generated-types.ts once wired in.

import { compileFromFile } from "json-schema-to-typescript";
import { writeFileSync } from "node:fs";
import path from "node:path";

const schemaPath = path.resolve("..", "schema", "card.schema.json");
const outPath = path.resolve("lib", "generated-types.ts");

const ts = await compileFromFile(schemaPath, {
  bannerComment: "/* eslint-disable */\n// Generated from schema/card.schema.json — do not edit by hand.\n",
  style: { semi: true, singleQuote: false },
});
writeFileSync(outPath, ts, "utf8");
console.log(`Wrote ${outPath}`);
