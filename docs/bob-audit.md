# Bank of Baroda (BOBCARD) — audit + verification (2026-07-03)

Full review of the BoB credit-card catalogue against the live **`bobcard.co.in`**
site (Playwright crawl of all `/credit-card-types/<slug>` product pages), 2026-07-03.

## Issuer rebrand (systematic)

**`bobfinancial.com` is dead** — the issuer rebranded from *BOB Financial Solutions
Limited* to **BOBCARD Limited** and moved all content to `www.bobcard.co.in`. Every
pre-existing source URL in the dataset (all pointed at `bobfinancial.com/*.jsp`) was
stale and has been re-sourced. `data/issuers/bob.yaml` updated: `legal_name`,
`website`, and notes.

## Catalogue reconciliation

The live listing (`/credit-card-types/`) exposes **28 card slugs**. Resolved to
**23 in-scope consumer cards** + 5 excluded.

- **Corrected (3 pre-existing):** easy, eterna, premier — heavy drift fixed (see
  below).
- **Added (20):** tiara, prime, select, cashback, etihad-guest-premium,
  etihad-guest, irctc, hpcl-energie, uni-goldx, one, snapdeal, scapia,
  indian-army-yoddha, indian-navy-varunah, indian-coast-guard-rakshamah,
  assam-rifles-the-sentinel, vikram, icai-exclusive, icsi-diamond, cma-one.
- **Excluded — business (out of scope, per HDFC precedent):** empower (proprietor/
  self-employed business card), corporate, bobcard-micro-enterprise.
- **Excluded — partner-bank / RRB clones (per SBI precedent):**
  nainital-bank-renaissance, bupb-bggb-brkgb-pragati (same BoB products issued via
  partner/regional-rural banks).

## Systematic findings (corrections to the 3 pre-existing cards)

1. **Base reward rate was wrong on every card.** The dataset had `base.rate: 5`
   across easy/eterna/premier; the live pages show tiered bases — **eterna 3**,
   **premier 2**, **easy 1** RP per ₹100. The "5X" headline is the *accelerated*
   rate (15/10/5 respectively), which had been mis-decomposed as the base.
2. **Accelerator caps were modelled as "unlimited" but are capped.** eterna 5X →
   **5,000 RP/stmt**, premier 5X → **2,000 RP/stmt**, easy 5X → **1,000 RP/stmt**.
   Presenting them uncapped materially overstates earn.
3. **Easy is not lifetime-free.** Standard fee is **₹500** (a limited-period LTF
   *offer* runs, but the MITC fee is ₹500); its Reward Points are worth **₹0.20**,
   not ₹0.25.
4. **Fee-waiver thresholds stale** (eterna ₹4L→₹2.5L, premier ₹2L→₹1.2L).
5. **Eligibility bands wrong** (age 21–65 → **25–55**; incomes refreshed) and an
   **unverified international lounge** on eterna was dropped (page shows unlimited
   *domestic* only).

## Per-card highlights (new cards)

- **tiara** — women's premium (Eterna-class); + women's health package, quarterly
  brand vouchers, OTT memberships; CC-UPI RP capped ₹500/stmt.
- **prime** — secured/FD-backed (≥₹30k FD, guaranteed issuance, zero fee).
- **cashback** — Mastercard; 5% online (≤₹1,500/mo) + 1% unlimited; ₹499/yr or ₹49/mo.
- **etihad-guest-premium / etihad-guest** — miles co-brands (6/2 & 3/1 mi per ₹100),
  0%/1% forex, tiered lounges + Silver status; Etihad Guest miles valuation is a
  flagged estimate (no Etihad loyalty programme modelled yet).
- **irctc** — RuPay, up to 40 RP/₹100 on IRCTC bookings; railway lounges.
- **hpcl-energie** — fuel co-brand, per-₹150 basis, ~5% on HPCL fuel.
- **uni-goldx / one / scapia** — fintech co-brands (Uni Coins / OneCard RP / Scapia
  Coins), all LTF with 0–1% forex; one & scapia rates partly flagged TODO.
- **snapdeal** — 20/10/4 RP tiers; activation vouchers.
- **defense (yoddha/varunah/rakshamah/sentinel/vikram)** — RuPay; verified each
  individually since templates differ (varunah = premium ₹2,499; vikram = entry LTF;
  the other three = mid LTF).
- **professional (icai/icsi/cma)** — LTF, 1 RP base + 5X dining/online/utility, 12
  lounges, 2% forex, professional-indemnity + accident cover.

## MCC pass

Universal **rent (MCC 6513)** exclusion applied to all 23 cards' `mcc_exclusions`.
See [`bob-mcc-map.md`](bob-mcc-map.md).

## Remaining follow-ups (inline `# TODO verify`)

New cards carry `# TODO verify` markers where the product page didn't publish a
value — chiefly: **network** (Visa/RuPay unstated on most co-brand pages),
**income eligibility** and **launch dates** (frequently truncated/absent), and a
few **reward specifics** (OneCard RP rate/value, Scapia base earn, Etihad miles
valuation, Varunah 5X cap). To close these, pull each card's **MITC / Key Fact
Statement PDF** from the MITC section on `bobcard.co.in` and confirm.

## Source / PDF coverage

BoB keeps reward detail on the web pages (like SBI), so backing is page-sourced
plus the shared MITC (fees / finance 3.49%/mo / forex / cash-advance). Card MITC
PDFs can be archived under `docs/sources/bob/` (gitignored) during the TODO-closure
pass; not required for this landing.
