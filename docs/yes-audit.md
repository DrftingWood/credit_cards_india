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
