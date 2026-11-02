# YES Bank — audit + verification (2026-07-03)

Review of the YES Bank credit-card catalogue against the live **yes.bank.in** site
(Playwright + DOM extraction), 2026-07-03.

## Systematic findings

1. **Domain migration.** `yesbank.in` → **`yes.bank.in`** — the 7th `.bank.in`
   migration found this audit run (after hdfc/axis/icici/idfcfirst/kotak/rbl/indusind).
   YES Bank had **no** entry in the validator's `ISSUER_ALLOWED_DOMAINS` — added
   `yes` (yesbank.in + yes.bank.in, www variants).
2. **Reserv URL-path + rename.** Reserv is **active** but lives at
   `/personal-banking/cards/credit-card/reserv-credit-card` (the standard
   `yes-individual/.../credit-cards/` path 404s). Reward model rewritten to the live
   **24/12/6 YES Rewardz per ₹200** (online/offline/select), fee ₹1,499→₹2,499,
   forex 2.75%→2.00%, finance 3.5%→2.99%, max age 65→60. Formerly **YES FIRST
   EXCLUSIVE**.
3. **Card renames confirmed:** SELECT = formerly *YES PROSPERITY EDGE*; ACE =
   formerly *YES PROSPERITY REWARDS PLUS*.
4. **YES Rewardz reward model.** Most YES cards use an online/offline/Select-category
   tiered structure (e.g. Reserv 24/12/6, Elite+ 12/6/4, Select 8/4/2, ACE 8/4/2 per
   ₹200). Point face value ≈ ₹0.25 (realized ~₹0.18).
5. **15-Jun-2026 T&C refresh.** New reward-exclusion list across cards (Rent, Wallet,
   Fuel, UPI, Government, Marketing, cash, EMI, Insurance, Education, Railways, Toll,
   Ferry, Jewellery) — captured per card.
6. **Premia discontinued** (404, off live grid). Marquee verified active.

## Catalogue reconciliation

**3 existing — all handled:** marquee (verified), reserv (corrected + re-pathed),
premia (discontinued).

**25 new cards added:**
- Core: ace, select, elite-plus, essence, prosperity-rewards, prosperity-cashback,
  prosperity-cashback-plus.
- Cashback/health/UPI: ai-inside, ai-inside-rupay, wellness, wellness-plus, emi.
- Co-brand / fintech BYOC: pop-club (POP), paisabazaar + paisabazaar-rupay (PaisaSave),
  byoc (Build Your Own Card), freo, uni, uni-rupay, anq-phi, klick, finbooster, zagg.
- Premium / flagship: first-preferred (YES FIRST Preferred), private (YES Private —
  super-premium invite-only, ₹50k fee, 40/20 RP intl/domestic, 0.5% forex).

**Excluded (out of scope):**
- `yes-rupay-credit-card` (Virtual RuPay) — companion/add-on issued only to existing
  YES Mastercard/Visa holders, mirrors the primary card on UPI; non-standalone
  (SBI/IDFC companion-card precedent). Note: PaisaSave-RuPay, AI-Inside-RuPay and
  Uni-RuPay **are** standalone products with their own reward programmes → kept.
- Business/corporate (yes-first-business, yes-prosperity-business/purchase/corporate,
  Zaggle corporate).

## MCC pass
Universal rent (MCC 6513) exclusion on all YES cards. See
[`yes-mcc-map.md`](yes-mcc-map.md).

## Schema/tooling notes (gotchas hit this audit)
- `issuer: yes` parses as YAML boolean `True` → **must** be quoted `issuer: "yes"`.
- `movies` / `dining` benefits are **objects**, not lists.
- `insurance` benefit is an **array** of `{type, sum_insured_inr}` (both required);
  omit rather than set null.
- `reward_cap` = `{max_units, cap_unit, cycle}` (not `amount_inr`).
- `co_brand.partner_website` must be a URI string or omitted (never null).
- `lounge_access.*.visits_per_cycle` / `golf.rounds_per_cycle` accept an integer or
  the string `"unlimited"` (not null).
- Card filename must equal `id` minus the issuer prefix (e.g. id `yes-private` →
  `private.yaml`).

## Follow-ups
Many fintech co-brand and tab-gated pages resist deep extraction, so several new
cards carry `# TODO verify` on exact fees, reward caps, network, and income
thresholds — close from each card's MITC / rate-card PDF in the final TODO-cleanup
wave.

## YES Premia / ELITE+ alias and current-term validation (2026-10-26)

YES BANK's current [credit-card MITC](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false) explicitly says ELITE+ was formerly YES Premia; the rebranding FAQ says existing Premia cardholders may continue using the card and receive a replacement on upgrade/expiry. Marked the legacy Premia record `on-hold`, removed the unsupported launch/end dates and legacy single-network/tier assignment, and cleared its application URL. It now carries the current ELITE+ terms for legacy account holders; new issuance is represented by the separate active ELITE+ record.

Refreshed both records from the current MITC, official [ELITE+ value chart](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONT8410175D038545F1BC2EEC7B35DFA756/native/yesbank_credit_card_elite_plus_value_chart.pdf?download=false), official [credit-card listing](https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards), and indexed rebranding FAQ. Current MITC gives INR 999 joining/annual fees, INR 20,000 joining-fee waiver within 30 days, INR 2 lakh renewal waiver, 2.75% forex, 3.99% finance, 2.5%/INR 650 cash advance, INR 50,000 previous-quarter domestic lounge gate, fuel waiver at 1% on INR 500-4,000 transactions capped INR 125/statement, INR 100 + GST reward redemption fee, and three-year reward expiry. ELITE+ earns 12 points/INR 200 online up to 12,000/statement, 6 offline and 4 on select categories; points are worth up to INR 0.25. Current benefits include 2 domestic lounge visits/quarter, 3 international/year, 25% BookMyShow discount (value chart: minimum INR 1,000 monthly spend, max INR 250/month), purchase protection and golf green-fee privileges. Removed unsupported fixed point valuation, 2019 launch date, and stale Premia-only fees/rates/visit counts/welcome voucher. Several pages give different old Premia fee/reward variants; current alias terms are followed and legacy claims are not retained as active offers.

PDF archiving was attempted; YES Bank served its session HTML shell to direct file downloads, so the source files were not retained locally. Their official source URLs are listed in YAML and this log. Validator result recorded after both cards were refreshed.
