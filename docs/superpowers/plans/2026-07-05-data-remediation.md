# Data & Evidence Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every open data-quality, evidence, and coverage item on the TODO board (D1–D16, D20, D29–D31) so the dataset's numbers, sources, and coverage are as trustworthy as the engines that consume them.

**Architecture:** Research-driven YAML remediation in priority order (ranking-distorting numbers first, provenance second, coverage third, automation last). Every value change is sourced from issuer evidence, applied with the ruamel round-trip protocol, and gated on `validate.py` + the full site/engine test suites. The crawl-diff tool (D29) lands last so it can immediately re-verify everything the earlier phases touched.

**Tech Stack:** Python 3.14 (`C:\Python314\python.exe`), ruamel.yaml, Playwright (via the playwright MCP or `pip install playwright`), vitest (site), existing `scripts/validate.py`.

## Global Constraints

- Branch: create `data-remediation-2026-07` from `engine-dive-2026-07` (or from `main` after that branch merges). Never commit to `main`/`master`. Never push without being asked.
- Windows: every Python invocation needs `$env:PYTHONIOENCODING='utf-8'; $env:PYTHONUTF8='1'`.
- YAML edits: ruamel round-trip ONLY — `yaml.preserve_quotes = True`, `yaml.indent(mapping=2, sequence=4, offset=2)`, None→`'null'` representer (`dumper.represent_scalar("tag:yaml.org,2002:null", "null")`), every `ratio`/`transfer_ratio` wrapped in `DoubleQuotedScalarString`. After ANY script edit, eyeball `git diff` — if unrelated lines churn, revert and fix the dump settings.
- Value changes: close-and-append effective-dated records (set `effective_until`, append new open record). Never edit history in place. Stamp `source.retrieved_on` = today, `source.confidence`, and `metadata.last_verified_on` = today only when fields were actually diffed against the cited source.
- NEVER fabricate a rate, cap, fee, or unit value. Unverifiable after research → add `capping_rules`/notes prose + log to TODO, don't guess.
- Gate before every commit: `python scripts/validate.py` prints `OK`; `npm.cmd --prefix site test -- --run` all pass; `npm.cmd --prefix site run prebuild` succeeds. Stage explicit paths only (never `git add -A`).
- Research standard: ≥2 independent sources for values, issuer-owned source preferred; issuer T&C/MITC PDF is authoritative for caps and fees.
- Commit trailer convention: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` + `Claude-Session:` link.

---

### Task 1: Uncapped-accelerator audit tool (D20 groundwork)

**Files:**
- Create: `scripts/audit_uncapped.py`

**Interfaces:**
- Produces: `python scripts/audit_uncapped.py` → table of `card_id | category | rate | eff_pct | cap | channel_class` for every ACTIVE card's open reward record where an accelerator has `cap_per_cycle` null/`"unlimited"` and effective value-% ≥ 3. Tasks 2–3 consume this list.

- [ ] **Step 1: Write the script**

```python
#!/usr/bin/env python3
"""List active-card accelerators that are uncapped at >=3% effective value.

These distort rankings for any user who unlocks them (docs/TODO.md D20).
Read-only; run before and after each D20 remediation chunk.
"""
import glob
import yaml

THRESHOLD_PCT = 3.0

rows = []
for fp in glob.glob(r"data\cards\**\*.yaml", recursive=True):
    d = yaml.safe_load(open(fp, encoding="utf-8"))
    if not d or d.get("status") not in ("active", "invite-only"):
        continue
    for rec in d.get("rewards") or []:
        if rec.get("effective_until") is not None:
            continue
        b = rec.get("base") or {}
        uv = b.get("unit_value_inr_realized") or b.get("unit_value_inr") or (
            1.0 if rec.get("currency") == "cashback" else None)
        if not uv or not b.get("per_inr"):
            continue
        for a in rec.get("accelerated") or []:
            cap = a.get("cap_per_cycle")
            if isinstance(cap, (int, float)):
                continue  # capped
            rate = a.get("card_attributable_rate") or a.get("effective_rate")
            per = (a.get("card_attributable_per_inr") if a.get("card_attributable_rate") is not None
                   else a.get("effective_per_inr")) or b["per_inr"]
            if rate is None:
                continue
            pct = rate / per * uv * 100
            if pct >= THRESHOLD_PCT:
                ch = (a.get("channel") or {}).get("class") if isinstance(a.get("channel"), dict) else None
                rows.append((d["id"], a.get("category"), rate, round(pct, 1), cap, ch))

rows.sort(key=lambda r: -r[3])
print(f"{len(rows)} uncapped accelerators >= {THRESHOLD_PCT}% on active cards")
for r in rows:
    print(f"  {r[0]:35} {str(r[1])[:35]:37} rate={r[2]:>6} ~{r[3]:>5}% cap={r[4]} channel={r[5]}")
```

- [ ] **Step 2: Run it and record the baseline**

Run: `$env:PYTHONIOENCODING='utf-8'; $env:PYTHONUTF8='1'; & C:\Python314\python.exe scripts/audit_uncapped.py`
Expected: ~60–66 rows (the 2026-07-05 audit counted 66 of 304; channel gating since then may have changed the mix, not the count). Save the output to `docs/drift/uncapped-baseline-2026-07.txt` (`New-Item -ItemType Directory -Force docs/drift`).

- [ ] **Step 3: Commit**

```powershell
git add scripts/audit_uncapped.py docs/drift/uncapped-baseline-2026-07.txt
git commit -m "audit: add uncapped-accelerator scanner + D20 baseline"
```

---

### Task 2: D20 cap remediation — top-10 worst offenders

**Files:**
- Modify: the 10 card YAMLs at the top of Task 1's output (2026-07-05 list: `axis/airtel.yaml` ~25%, `hdfc/phonepe-*.yaml`, `hsbc/live-plus.yaml`, `yes/byoc.yaml`, `idfc-first/gaj.yaml` ~10%, and peers — use the fresh baseline, not this list)

**Interfaces:**
- Consumes: Task 1's baseline list.
- Produces: each remediated card has either a sourced `cap_per_cycle`+`cap_unit`+`cycle` on the accelerator, or a `capping_rules` prose note + unchanged flag if the issuer genuinely documents no cap.

- [ ] **Step 1: Research caps for the top 10** — spawn 2–4 parallel research subagents, one per 3-ish cards. Each must find the issuer's T&C/MITC (issuer-owned URL) and report: cap value, cap unit (points / cashback-inr / spend-inr), cycle (monthly/statement/quarterly/annual), and the source URL + retrieval date. Refuse aggregator-only evidence for a value change.
- [ ] **Step 2: Apply sourced caps with a ruamel script** (pattern identical to Task 1 of the 2026-07-05 gating chunks — explicit per-file SPEC dict mapping accelerator `category` → cap fields; script must error if a category matches nothing). Close-and-append is NOT needed for adding a missing cap that was always in the T&C — add the fields to the open record and stamp `source.retrieved_on`; a cap that CHANGED at a known date gets close-and-append.
- [ ] **Step 3: Re-run the audit** — `python scripts/audit_uncapped.py`; expected: top-10 rows gone or annotated. Diff against baseline in the commit message.
- [ ] **Step 4: Full gates** — `validate.py` OK, `npm.cmd --prefix site test -- --run` (86+ tests) pass, prebuild OK.
- [ ] **Step 5: Commit** — one commit per issuer group, message `data(D20): cap <issuer> accelerators from T&C — <card list>`.

---

### Task 3: D20 cap remediation — remaining offenders (repeat until dry)

**Files:** remaining card YAMLs from the Task 1 list.

- [ ] **Step 1–5:** Repeat Task 2's cycle in chunks of ~10 cards, worst-first, until `audit_uncapped.py` reports only rows that carry an explicit `capping_rules` note documenting "no cap per issuer T&C dated YYYY-MM-DD". Then flip `docs/TODO.md` D20 to Done citing the final audit output, and commit.

---

### Task 4: D16 — SmartBuy multiplier/cap freshness

**Files:**
- Modify: `data/cards/hdfc/infinia.yaml`, `data/cards/hdfc/diners-black.yaml`
- Modify: `docs/TODO.md` (flip D16)

- [ ] **Step 1: Fetch current SmartBuy T&C** — Playwright-render `https://offers.smartbuy.hdfcbank.com` T&C pages (JS-rendered; plain fetch will miss content). Capture: multiplier for flights/hotels (modelled: 10X), monthly RP caps (modelled: 15,000 Infinia / 7,500 Diners Black), category exclusions.
- [ ] **Step 2: Compare against the YAML** — `Select-String -Path data/cards/hdfc/infinia.yaml -Pattern 'smartbuy|cap_per_cycle|multiplier'` and read the matching accelerated entries.
- [ ] **Step 3: If changed:** close-and-append the reward record with the new values effective from the T&C's stated date; if unchanged: bump `metadata.last_verified_on` + `source.retrieved_on` on those entries only.
- [ ] **Step 4: Gates + commit** — `data(D16): verify SmartBuy 10X + caps against live T&C — <changed|confirmed>`.

---

### Task 5: D14 remainder — Scapia coin realized value

**Files:**
- Modify: `data/cards/bob/scapia.yaml`, `data/cards/federal/scapia.yaml`
- Modify: `docs/TODO.md` (flip D14)

- [ ] **Step 1: Research** — 2+ independent 2026 sources for Scapia Coins redemption value (coins are travel-app-only; 5 coins = ₹1 was the historically reported rate — verify, do not assume). Distinguish face (marketing) vs realized (what a booking actually yields).
- [ ] **Step 2: Apply** — set `base.unit_value_inr` (face) and `base.unit_value_inr_realized` per the research via ruamel; `realized_source.method` + references. Close-and-append only if the value changed at a known date; otherwise correct-in-place counts as fixing an error (log it in the commit message).
- [ ] **Step 3: Sanity replay** — `python booking-savings/engine_v2.py travel` — bob-scapia/federal-scapia must no longer top travel with ₹1 coins unless the research supports it.
- [ ] **Step 4: Gates + commit.**

---

### Task 6: D1 + D2 + D30 — small verification batch

**Files:**
- Modify: `data/cards/boi/select.yaml`, `data/cards/south-indian/sbi-platinum.yaml` (or actual slug), `data/cards/kvb/honour.yaml`, `data/cards/axis/google-pay-flex.yaml`
- Modify: `docs/TODO.md` (flip D1, D2, D30)

- [ ] **Step 1: Research (parallel subagents)** — (a) BOI Select ₹800 fee / ₹2L waiver and South Indian SBI Platinum ₹2,999 against issuer Schedule-of-Charges PDFs; (b) whether KVB still offers "Honour" (the .bank.in site no longer exposes its page — check KVB's card listing + archived page); (c) axis google-pay-flex network (issuer page or MITC — "likely RuPay/UPI" per the audit, unconfirmed).
- [ ] **Step 2: Apply** — fee confirms: raise `source.confidence` to `high` + stamp; KVB Honour withdrawn: set `status: discontinued` + `discontinued_on` (best-evidence date, noted); google-pay-flex: set `network` + UPI fields from evidence.
- [ ] **Step 3: Gates + commit** per item.

---

### Task 7: D4 — stale-URL sweep beyond HDFC

**Files:**
- Modify: card YAMLs with dead/redirecting `source.url` or `application.apply_url` (list produced in Step 1)
- Modify: `docs/TODO.md` (flip D4)

- [ ] **Step 1: Detect** — run the existing reachability checker: `python scripts/validate.py --check-urls 2>&1 | Select-String 'HTTP|unreachable' > docs/drift/url-health-2026-07.txt`. This is slow (network); run once per issuer batch if needed.
- [ ] **Step 2: Fix per issuer** — for each flagged URL: find the current issuer-owned page (Playwright-verify it renders the product), update the URL, stamp `source.retrieved_on`. A URL that redirects to a `.bank.in` equivalent is a rewrite; a page that's GONE downgrades `source.confidence` and gets a note.
- [ ] **Step 3: Gates + commit** per issuer: `data(D4): re-point <issuer> stale source URLs (Playwright-verified)`.

---

### Task 8: D3 — scale machine-readable evidence fields

**Files:**
- Modify: card YAMLs for issuers with local PDF archives, one issuer per commit — order: `hdfc`, `axis`, `icici`, `sbi` (largest manifests first; ~9 cards carry the fields today)
- Modify: `docs/TODO.md` (flip D3 when all PDF-backed issuers are covered)

- [ ] **Step 1: Per issuer, map PDFs to fields** — read `docs/sources/<issuer>/_manifest.json`; for each card with an archived PDF, add to the open records' `source`: `type: issuer-pdf`, `confidence: high`, `local_refs: [docs/sources/<issuer>/<file>.pdf]`, `fields_verified:` listing the dotted paths the PDF actually evidences (e.g. `fees.annual_fee_inr`, `rewards.base.rate`) — only fields someone actually diffed (the audit docs record which).
- [ ] **Step 2: Validate** — `validate.py` checks `local_refs` existence warn-only; output must stay `OK` with no new warns on CI-visible paths.
- [ ] **Step 3: Commit per issuer** — `data(D3): machine-readable evidence refs for <issuer> (<n> cards)`.

---

### Task 9: D8 — verification-stamp reconciliation

**Files:**
- Create: `scripts/audit_stamps.py` (compare `metadata.last_verified_on` vs max nested `source.retrieved_on`; print mismatches)
- Modify: the ~31 mismatched card YAMLs
- Modify: `docs/TODO.md` (flip D8)

- [ ] **Step 1: Write + run the scanner** (same read-only pattern as Task 1: walk cards, collect both dates, print where `last_verified_on` > newest `retrieved_on`).
- [ ] **Step 2: Reconcile** — where the bulk sweep moved the stamp without field diffs: move that date to `metadata.last_swept_on` and restore `last_verified_on` to the newest genuinely-verified date (the per-issuer audit docs record these). Never backdate a real verification.
- [ ] **Step 3: Gates + commit.**

---

### Task 10: D7 — normalize the four audit-note manifests

**Files:**
- Modify: `docs/sources/bob/_manifest.json`, `docs/sources/idfc-first/_manifest.json`, `docs/sources/rbl/_manifest.json`, `docs/sources/standard-chartered/_manifest.json`
- Modify: `docs/TODO.md` (flip D7)

- [ ] **Step 1:** Restructure each into the per-card-PDF-map shape used by `docs/sources/axis/_manifest.json` (open it first and mirror its keys exactly). Do NOT touch any PDF file.
- [ ] **Step 2:** `git status --short` must show only the four JSONs; commit.

---

### Task 11: D15 — model iShop and Amex Travel portals

**Files:**
- Modify: relevant `data/cards/icici/*.yaml` (Emeralde, Sapphiro, Coral tier — whichever the portal T&C names) and `data/cards/amex/*.yaml` (MRCC, Platinum Travel, Platinum)
- Modify: `docs/TODO.md` (flip D15)

- [ ] **Step 1: Research** — ICICI iShop earn rates + caps per card tier, Amex Travel portal earn, from issuer portal T&C (subagents).
- [ ] **Step 2: Author accelerators** — `channel: {class: issuer-portal, merchants: [ishop]}` / `[amex-travel]` (tokens already in `data/channels/known.yaml`), with sourced rate + cap. These are channel-gated so the engines treat them exactly like SmartBuy (ceiling layer in engine_v2; wizard-gated on the site).
- [ ] **Step 3: Gates + engine replay** (`python booking-savings/engine_v2.py travel` — absolute column should now show ICICI/Amex portal value, closing the HDFC-only-portal bias) + commit.

---

### Task 12: D5 + D11 — coverage expansion

**Files:**
- Create: new card YAMLs via `python scripts/new_card.py <issuer> <slug> "<name>"` — first pass: `pnb rupay-platinum`, `pnb rakshak`, `pnb luxura`, `union nexteria`, `union unicorn`, `union divaa`; then D11 verifications (Axis Burgundy Private, ICICI Mine, Kotak Mojo Platinum)
- Modify: `docs/TODO.md`, `docs/PORTFOLIO-GAPS.md`

- [ ] **Step 1:** For each candidate, research terms from issuer evidence (docs/PSU-BANK-PORTFOLIOS-2026-07.md lists the known sources). The no-unsourced-data rule is absolute: no evidence → stays a documented candidate, not a YAML.
- [ ] **Step 2:** Scaffold with `new_card.py`, fill from evidence, tag canonical categories (`python scripts/tag_canonical_categories.py --apply`).
- [ ] **Step 3:** Gates + one commit per issuer.

---

### Task 13: D12 — authored applicability for high-traffic co-brands

**Files:**
- Modify: `data/cards/icici/amazon-pay.yaml`, `data/cards/hdfc/swiggy-hdfc.yaml`, `data/cards/sbi/cashback.yaml`, tata-neu cards (whichever have evidence)
- Modify: `docs/TODO.md` (flip D12)

- [ ] **Step 1:** Only author `applicability_pct` where a published spend-share estimate exists (e.g. issuer investor decks, RBI/industry e-commerce share data with a citable method). D-18 forbids invented fractions — if no evidence, skip and note.
- [ ] **Step 2:** Add `applicability_pct: <value>` + a `notes:` line citing the method; run `npm.cmd --prefix site test -- --run lib/calculator.test.ts` (the authored-applicability tests already exist) + gates; commit.

---

### Task 14: D6 + D31 — clear warnings, promote lint

**Files:**
- Modify: `data/cards/bob/irctc.yaml`, `data/cards/sbi/air-india-signature.yaml`, `data/cards/sbi/air-india-platinum.yaml` (or actual second slug), `data/cards/sbi/tata-neu-infinity.yaml`, `data/cards/sbi/tata-neu-plus.yaml`, `data/cards/sbi/aurum.yaml`
- Modify: `scripts/validate.py` (promotion)
- Modify: `docs/TODO.md` (flip D6, D31), `docs/ROADMAP.md` (promotion note)

- [ ] **Step 1:** Add `loyalty_program: <id>` to the five co-brand reward records (the programmes exist: `irctc-loyalty`, `air-india-flying-returns`, `tata-neu-points`) — decompose with `card_attributable_rate` if the >5 lint fires. For sbi-aurum: add `www.aurumcreditcard.com` to the issuer allowlist as a documented exception (it IS SBI Card's official microsite — comment why).
- [ ] **Step 2:** Run `validate.py` → expect ZERO warnings. Then promote the co-brand alias lint from `warnings.append` to `errors.append` in `scripts/validate.py` (the block is commented "Warning-tier per the validator-promotion pattern" at ~line 407).
- [ ] **Step 3:** Verify promotion — temporarily remove one `loyalty_program` line, run validate, expect exit 1 with the `[lint]` error; restore; run clean. Gates + commit.

---

### Task 15: D29 — crawl-diff drift detection tool

**Files:**
- Create: `scripts/crawl_diff.py`
- Create: `scripts/test_crawl_diff.py` (plain asserts, same style as `booking-savings/test_engine_v2.py`)
- Create: `docs/drift/README.md` (how to run, how to read a report)
- Modify: `docs/TODO.md` (flip D29)

**Interfaces:**
- Produces: `python scripts/crawl_diff.py --issuer hdfc` → `docs/drift/hdfc-YYYY-MM-DD.md`; exit 0 if only MATCHED/NOT-FOUND, exit 1 if any CONFLICTING-NUMBER-NEARBY.

- [ ] **Step 1: Write the failing test for the pure core** — the presence-checker takes page TEXT (already rendered) + a card's expectations and needs no network:

```python
"""scripts/test_crawl_diff.py — presence-checker unit tests (no network)."""
from crawl_diff import expectations_for, check_page

CARD = {
    "id": "test-card",
    "fees": [{"effective_until": None, "annual_fee_inr": 2999, "joining_fee_inr": 2999,
              "forex_markup_pct": 3.5, "source": {"url": "https://x"}}],
    "rewards": [{"effective_until": None, "base": {"rate": 4, "per_inr": 150}}],
}

exp = expectations_for(CARD)
assert ("annual_fee_inr", "2999") in [(e.field, e.needle) for e in exp]
assert any(e.field == "base_rate" for e in exp)

page = "Annual fee: Rs. 2,999 (plus GST). Earn 4 Reward Points per Rs. 150. Forex markup 3.5%."
res = check_page(page, exp)
assert all(r.status == "MATCHED" for r in res), res

conflict = "Annual fee: Rs. 3,499. Earn 4 Reward Points per Rs. 150."
res2 = {r.field: r.status for r in check_page(conflict, exp)}
assert res2["annual_fee_inr"] == "CONFLICTING-NUMBER-NEARBY"
print("OK: crawl_diff core tests passed")
```

- [ ] **Step 2: Run to verify it fails** — `python scripts/test_crawl_diff.py` → ImportError (module doesn't exist).
- [ ] **Step 3: Implement the core** — `expectations_for(card)` extracts literal needles from the open records (annual/joining fee digits with Indian-comma tolerance `2,?999`, base "X ... per ... Y" proximity pattern, forex pct, cap numbers); `check_page(text, exps)` returns MATCHED (needle found), CONFLICTING-NUMBER-NEARBY (needle absent but the field's keyword — "annual fee"/"joining fee"/"forex" — appears within 80 chars of a different number), or NOT-FOUND. Presence-checking only; never parse the page into a schema.
- [ ] **Step 4: Run tests to verify pass.**
- [ ] **Step 5: Add the Playwright shell** — `--issuer <id>` iterates that issuer's active cards, renders each `source.url` (Playwright sync API, 15s timeout, `page.inner_text("body")`), runs the core, writes `docs/drift/<issuer>-<date>.md` with one row per card per field; logs redirects to a different host as drift. Network failures = SKIPPED rows, never crashes.
- [ ] **Step 6: Live smoke** — run `--issuer hsbc` (smallest catalogue), read the report, sanity-check statuses by hand against one page.
- [ ] **Step 7: Commit** — tool + tests + README + first drift report.

---

### Task 16: Board close-out

- [ ] **Step 1:** Re-run `scripts/audit_uncapped.py`, `scripts/audit_stamps.py`, `validate.py` (expect zero warnings post-Task-14), and the full site + engine suites. Paste the outputs into `docs/ENGINE_DIVE_LOG.md`-style lines in a new `docs/REMEDIATION_LOG.md` section.
- [ ] **Step 2:** Update `docs/TODO.md` Current State block (card count, warning count) and flip every completed row. Commit `docs: close 2026-07 data remediation board`.

## Self-Review Notes

- Every open TODO item is covered: D1(T6) D2(T6) D3(T8) D4(T7) D5(T12) D6(T14) D7(T10) D8(T9) D9(→ UI plan) D10(deferred — see below) D11(T12) D12(T13) D14(T5) D15(T11) D16(T4) D20(T1–3) D25(→ UI plan) D26(folded into T2/T3 research protocol — competitor cross-checks happen naturally while reading T&Cs; log finds) D29(T15) D30(T6) D31(T14).
- D10 (network-variant file splits) is intentionally NOT a task: it depends on D-20-rule judgment per card and zero users are blocked; leave on the board at P3 unless a materially-different variant surfaces during T2/T3 research.
- Research tasks can't contain literal result values by definition; they contain exact decision rules, file paths, protocols, and gates instead — the no-fabrication constraint is the spec.
