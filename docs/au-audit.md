# AU Small Finance Bank — audit + verification (2026-07-03)

Review of the AU Small Finance Bank credit-card catalogue against the live
**au.bank.in** site (Playwright + DOM extraction), 2026-07-03.

## Systematic findings

1. **Domain migration.** `aubank.in` **redirects to `au.bank.in`** — the 10th `.bank.in`
   migration found this audit run (only HSBC did not migrate). Added `au.bank.in` to the
   validator's `ISSUER_ALLOWED_DOMAINS` (AU already had `aubank.in`).
2. **Card path.** The bare `/credit-cards` path 404s on the new domain; the live catalogue
   lives under `/personal-banking/credit-cards/<slug>-credit-card` (premium cards under
   `/premium-banking/credit-cards/`).
3. **Large catalogue.** AU has grown to ~24 consumer cards (up from the 6 seeded).

## Catalogue reconciliation

**6 existing — all verified/corrected:**
- **Altura** — base cashback 1.5%→1% + 2% grocery/departmental/utility; ₹50/cycle
  milestone; lounge corrected to 8 **Railway** Lounge/yr; renewal waiver 50k→40k.
- **Altura Plus** — reward model → 1.5% offline cashback + RP on online; 500-RP moved from
  welcome to monthly milestone; lounge 2/qtr→8/yr.
- **Vetta** — renewal waiver 300k→150k; concierge enabled; +1,000-RP birthday milestone;
  +₹50L air-accident cover.
- **Zenith+** — path/slug fix; fee ₹7,999→₹4,999; waiver ₹18L→₹8L; **base 10→1 RP/₹100**
  + 2x dining/travel/intl; welcome → Taj Epicure + ₹5,000.
- **LIT** — reward-booster up to 10X (from 5X) + à-la-carte cashback category features.
- **Ixigo** — now **lifetime-free** (was ₹999); **0% forex**; base → 2.5% rewards; lounge
  → 1 intl/yr; +₹75k milestone + ₹1.5L credit shield.

**15 new cards added:** zenith, ananta, xcite, xcite-ace, xcite-ultra (SwipeUp program),
instapay (RuPay UPI), kosmo (Kiwi co-brand), nomo (secured/FD-backed), spont (RuPay UPI),
laksya, tejas, prathama, ca (CA Metal — Chartered Accountants), cheq (CheQ co-brand,
India's first LED card), paytm (Paytm co-brand).

**Excluded (out of scope):**
- **Traverse** — NRI-only card (requires an NRE account; non-resident eligibility).
- **Add-on / floater cards** — companion cards sharing a primary card's limit (non-standalone).
- Loan/EMI instruments — SMARTLoan, Xpress Loan, convert-to-emi.

## Notes on card types
- **NoMo** is a **secured credit card issued against a Fixed Deposit** (tagged
  `secured`/`fd-backed`), kept as a distinct consumer product.
- The **SwipeUp Xcite** trio (Xcite / Ace / Ultra) are regular upgrade-path cards — not
  FD-secured.

## MCC pass
Universal rent (MCC 6513) exclusion on all AU cards. See [`au-mcc-map.md`](au-mcc-map.md).

## Follow-ups
AU's PDPs are JS-heavy and several fee tables load dynamically, so many new-card fields
carry `# TODO verify` (exact fees, reward caps, network tier, income) — close from each
card's MITC / fees PDF in the final TODO-cleanup wave.
