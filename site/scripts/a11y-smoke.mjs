#!/usr/bin/env node
/**
 * Report-only accessibility smoke check (`npm run a11y [base-url]`).
 *
 * Starts nothing itself: point it at a running site (`npm run build && npm start`).
 * Runs axe-core (WCAG 2.0/2.1/2.2 A + AA tags) via Playwright on a few routes
 * and prints the violation count per page. It ALWAYS exits 0: it is a report,
 * not a gate. One-time browser install: `npx playwright install chromium`.
 */
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = (process.argv[2] ?? process.env.A11Y_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const ROUTES = ["/", "/browse", "/compare", "/calculator"];
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function checkRoute(page, route) {
  try {
    await page.goto(base + route, { waitUntil: "networkidle" });
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    console.log(`${route}: ${violations.length} violation(s)`);
    for (const v of violations) {
      console.log(`  - ${v.id} (${v.impact ?? "n/a"}): ${v.nodes.length} node(s) - ${v.help}`);
    }
  } catch (err) {
    console.log(`${route}: could not be checked (${err instanceof Error ? err.message : err})`);
  }
}

async function main() {
  const browser = await chromium.launch();
  try {
    const page = await (await browser.newContext()).newPage();
    for (const route of ROUTES) await checkRoute(page, route);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.log(`a11y: skipped (${err instanceof Error ? err.message : err})`);
});
process.on("exit", () => {
  process.exitCode = 0;
});
