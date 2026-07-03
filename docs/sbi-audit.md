# SBI Card — audit + PDF verification (2026-07-03)

Full review of the SBI Card catalogue against the live `sbicard.com` sitemap and
card pages (Playwright crawl of all 67 personal-card sitemap URLs) and the archived
native PDFs (local-only, gitignored, under `docs/sources/sbi/`).

## Reconciliation

SBI's sitemap lists 67 personal-card URLs, but **~18 are dead or duplicate**, so the
real unique consumer catalogue is **~49 cards**.

- **Matched (13):** air-india-platinum, bpcl-octane, cashback, elite, indigo,
  indigo-elite, irctc-premier, miles-elite, prime, pulse, reliance-prime,
  simplyclick, simplysave. (+ aurum, which lives on aurumcreditcard.com.)
- **Added (35):** miles, miles-prime, unnati, elite-advantage, prime-advantage,
  elite-business, prime-business, pulse-sprint, simplyclick-advantage,
  simplysave-advantage, shaurya, shaurya-select, air-india-signature, bpcl,
  club-vistara, club-vistara-prime, krisflyer, krisflyer-apex, irctc-platinum,
  tata-neu-infinity, tata-neu-plus, flipkart, reliance, titan, paytm, paytm-select,
  phonepe-purple, phonepe-select-black, apollo, apollo-select, doctors, doctors-ima,
  landmark, landmark-prime, landmark-select.
- **Skipped — dead/duplicate sitemap URLs (~18):**
  - **max, spar, lifestyle-hc, home-centre** (+ their prime/select variants) — all
    redirect to the single **Landmark Rewards SBI Card** content (Landmark Group
    brands under one card). Modelled as landmark / landmark-prime / landmark-select.
  - **yatra, aditya-birla, fab-india, fbb-styleup** — return the generic listing
    page = discontinued/no product page.
  - **irctc-rupay** — redirects to irctc-platinum (duplicate).
  - Partner-bank clones (Central Bank, City Union, Karnataka, Karur Vysya, PSB,
    South Indian, UCO, BOM) — same SBI products issued via partner banks; excluded.

## Systematic findings

- **Finance charge: up to 3.75%/month (45% p.a.)** — MITC-confirmed universal SBI
  rate; the dataset's `3.5` was stale. Applied to all 49 cards.
- **Cash advance: 2.5% or ₹500** (whichever higher), domestic & international (MITC).
- **Currency migrations:** air-india-platinum earned "Flying Returns Miles" → now
  earns SBI **Reward Points** convertible via **Air India Maharaja Club** (post
  Air-India/Vistara merger). Club Vistara "CV Points" similarly transitioning.
- **PAYBACK is gone** — SBI uses "Reward Points" (1 RP ≈ ₹0.25).

## Per-card verification highlights

- **elite / prime:** milestone bonus-RP structure corrected; welcome brand list
  refreshed; **Club Vistara → Club ITC** tier; movies cap corrected.
- **miles-elite:** fee-waiver ₹10L→₹15L; travel-only 6 TC/₹200; +₹12L→20k TC
  milestone; full travel-insurance suite added.
- **cashback / pulse:** exclusions (+Railways), welcome (Noise Pulse 4 Pro ₹7,999),
  lounge 8→4, insurance realigned.
- **air-india-platinum:** post-merger rewrite (miles→RP, Maharaja Club, 5 RP/₹100).
- **bpcl-octane:** dining/etc. accel cap → 7,500 pts/mo; lounge 8→4; milestone ₹3L.
- **irctc-premier / indigo(+elite) / reliance-prime:** milestones, lounge, and
  reward-tier splits corrected from the live pages.

## PDF coverage

19 PDFs archived (local-only). SBI keeps most reward detail on the web page rather
than in PDFs, so the machine-readable backing is the **shared MITC** (fees / finance
3.75% / forex / cash-advance) plus ~10 card-specific T&C booklets (Air India, BPCL
Octane, Club Vistara, Apollo Select, Doctor's, SimplyClick, SimplySAVE, Landmark
Prime/Select). Those card-specific values were verified; the rest are page-sourced.

## Network + remaining follow-ups

- **Network** was unstated in SBI PDFs for the new co-brand cards → resolved by the
  default rule (PhonePe/UPI → RuPay, else Visa) with a `# TODO verify` note (31 cards).
- Reward caps, some eligibility incomes, and Advantage/Business/Sprint variant
  specifics (their pages often show the parent card) remain `# TODO verify`.
