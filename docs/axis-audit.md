# Axis Bank — audit + PDF verification (2026-07-03)

Full review of the Axis catalogue against the live `axis.bank.in` site (Playwright
crawl of all 39 retail cards) and the archived native PDFs (kept local-only under
`docs/sources/axis/`, gitignored).

## Reconciliation

- **Matched (15):** ace, airtel, atlas, aura, flipkart, horizon, indianoil-premium,
  indigo, indigo-premium, magnus, my-zone, neo, privilege, reserve, select.
- **Added (24):** vistara ×3, miles-more, spicejet-voyage(+black), samsung ×2,
  flipkart-super-elite, shoppers-stop, freecharge(+plus), fibe, kwik,
  google-pay-flex, cashback, rupay, indianoil, lic-platinum(+signature),
  pride-platinum(+signature), my-zone-easy, privilege-easy.
- **Discontinued (1):** olympus — 404 on live site.
- **On-hold:** aura, samsung-infinite, csk-style (not accepting applications).

## Systematic findings (from the MITC per-card table, eff 20-Dec-2024)

- **Finance charge is per-card tiered**, not a single value. The dataset's flat
  `3.6`/`3.75` was wrong for many cards:
  - **3.0%/mo** (42.58% p.a.): ace, airtel, flipkart, horizon, magnus, reserve,
    cashback, samsung ×2, freecharge ×2, fibe, google-pay-flex, spicejet ×2.
  - **3.75%/mo** (52.86–55.55% p.a.): atlas, select, privilege, aura, my-zone, neo,
    indigo(+premium), indianoil(+premium), shoppers-stop, flipkart-super-elite,
    vistara ×3, miles-more, lic ×2, pride ×2, kwik.
  - **3.4%/mo** (49.36% p.a.): the secured "Easy" cards (my-zone-easy, privilege-easy).
- **Forex is card-specific:** Magnus **2.0%**, Reserve **1.5%**, Indigo Premium
  **2.5%**, Olympus 0.99% (discontinued); **everyone else 3.5%**. Several cards had
  wrongly-reduced forex (horizon, select, kwik) — corrected to 3.5%.
- **Currency migrations:** Vistara "CV Points" → **"Maharaja Points"** (post
  Air-India merger; welcome tickets/milestones **discontinued**). indianoil-premium
  points → **EDGE Miles** (1/₹150). SpiceJet earns **SpiceClub points** (not miles).
- **Fuel-surcharge caps** are per-card in the MITC (₹250/₹400/₹500 per statement);
  several cards had wrong caps/cycles — fixed. Fuel refund is **not applicable** on
  neo, cashback, freecharge ×2, google-pay-flex.

## Per-card verification highlights

- **magnus:** finance 3.6→3.0, base 1/100→**12/200**, unlimited lounge (₹50k/qtr
  gate), concierge **discontinued**, Travel-EDGE cap → ₹2L spend/mo, +jewellery excl.
- **reserve:** finance 3.0; the fabricated dining-3× tier **removed** (only intl 2×).
- **atlas:** finance 3.75; welcome 5000→**2500 miles/37 days**; milestone table +
  lounge tiers corrected; travel cap ₹2L spend/mo; income 12L/15L.
- **select / privilege:** forex 1.5→3.5 (select); lounge & movie caps; exclusions
  (+utilities/jewellery/education); privilege lounge 8/yr→2/qtr.
- **neo:** fees 0→**250**, finance 3.75, fuel waiver removed (LTF corrected).
- **Vistara ×3:** Maharaja Points; welcome/milestones discontinued; renewal fee ₹0;
  exclusions + ₹50k/qtr lounge gate.
- **samsung ×2:** fees (infinite 1500→**5000**), cashback caps (₹5k/mo, ₹20k/yr),
  lounge/priority-pass; finance 3.0.
- **spicejet ×2:** currency miles→**points**; earn tables confirmed; ₹1L/mo cap;
  finance 3.0.
- **indianoil-premium:** fee 500→**1000**; fuel 6X cap 600/mo, grocery 2X cap 66/mo.
- **cashback / flipkart:** 7% online & Flipkart/Cleartrip caps (₹4,000/period)
  confirmed; welcome revised to ₹250 (post 20-Jun-2025).
- **google-pay-flex:** base 2/₹500 → **1 Star/₹500**; reward_cap 1,500 Stars/cycle.
- **fibe:** reward_cap ₹1,500/statement; lounge 4/yr→1/qtr.

## PDF coverage

79 PDFs archived (local-only, gitignored). Axis publishes rich per-card feature
T&C plus a shared MITC (`mitc-credit-cards.txt` — the authoritative per-card fee /
finance / forex / fuel table) and program docs (lounge, dining, EazyDiner, Swiggy
One, IOCL, Miles&More MMI-World). Every live Axis card is backed by ≥1 PDF except
kwik and (base) lic-platinum, which are covered by the shared MITC.

## Remaining follow-ups

- **Card network** unresolved (not in any Axis PDF) for several new cards: freecharge
  ×2, kwik, rupay, google-pay-flex (likely RuPay/UPI), samsung ×2, flipkart-super-elite,
  shoppers-stop, pride ×2, lic ×2 — left `# TODO verify network`.
- **base earn rate** for a few thin pages (freecharge, rupay, kwik) — page/PDF silent.
- **indianoil (base)** fee-waiver was misattributed from the Flipkart row → set null,
  TODO re-check.
