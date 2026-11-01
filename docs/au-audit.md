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
- **Ixigo** ? current fee schedule lists ?999 annual fee with spend-based waivers, while the product-specific page advertises limited-period lifetime-free (conflict documented); 0% forex; quarterly milestone and spend-gated lounge terms rechecked.
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


## Current follow-up (2026-10-25)
AU ixigo, Prathama, Kosmo and Paytm were rechecked against live AU product pages and the current card-member agreement. See `CARD_CONFIDENCE_AUDIT_2026-10-25.md` for corrected values and unresolved schema/source conflicts. Kosmo?s unpublished earn rate and redemption value are intentionally null; Paytm?s ordinary earn rate, cap and detailed app eligibility remain unresolved.


Tejas was rechecked 2026-10-25: fee waiver moved to INR 150,000 annual spend, Rewardz earn scoped to AU portal, current 5-transaction bonus and capped partner cashback offers added. AU Rewardz points are paise fractions (INR 0.0025 catalog; INR 0.002 e-voucher), not INR 0.25. See the issuer page and confidence audit.


Laksya was rechecked 2026-10-26: current fees/waiver, grocery and contactless reward caps, lounge spend gate, welcome, monthly partner offer limits, fuel cap and AU Rewardz paise valuation confirmed. Corrected fuel-waiver cycle to statement and replaced unsupported 2024 launch placeholder with AU's 6-May-2026 portfolio launch date. Added explicit unit-value provenance and issuer-advertised insurance, card liability, credit shield, device protection and Xpress EMI benefits; policy details remain unpublished. Exact issued network/tier is not established; Visa tier is now unknown.


SPONT was rechecked 2026-10-25: corrected current-quarter airport gate, railway lounge count, finance/cash-advance charges and verified 1% cashback; separated AU0101-only coins as unvalued and flagged unpublished coin rules and cashback exclusions.


Ananta was rechecked 2026-10-26 against the current card page, KFS, agreement, milestone and lounge terms. Replaced the unsupported 2024 launch placeholder with AU's 6-May-2026 launch date; set network and tier to unknown because the issuer describes a selected network variant without identifying it; removed the wrong Altura+ Visa image reference; corrected the fuel-waiver cycle and anniversary milestone repeatability; and added the currently advertised Xpress EMI, contactless, add-on-card and protection benefits. Specific insurance limits, conditions and reward-point unit value remain unknown due to unpublished terms and a 100x conflict between AU's general Rewardz FAQ and the Ananta milestone table. The duplicate Altura+ image reference was also removed from Altura, Laksya, NOMO, SPONT, Vetta, Xcite and Zenith+; see `CARD_CONFIDENCE_AUDIT_2026-10-25.md` for sources and full field notes.

Tejas was rechecked 2026-10-26 against the current product page, 30 Sep 2026 KFS, current card-member agreement and dedicated welcome/cashback terms. Corrected fuel waiver cycle; structured overall reward cap, utility/telecom earning and separate catalog/e-voucher redemption; corrected welcome-option values/conditions; separated the partner offers by merchant and statement/month cadence; added liability/credit-shield/device-protection, EMI, contactless and add-on benefits; and left launch date/network/tier unknown where current first-party evidence does not establish them. The product FAQ says BBPS is excluded without defining channel scope, while the agreement specifically excludes AU 0101 BBPS transactions; that remains an explicit unresolved scope note.

Zenith rewards were rechecked 2026-10-26 against the current card-member agreement, Rewardz FAQ and Zenith-specific 2024 revision. Fixed the duplicate accelerated key, added cited utility/telecom and insurance MCC earn, the dining and overall caps, catalog/voucher redemption values and fees, and the birthday award of 2,500 points (specific eligibility remains unpublished). Base and dining/grocery reward rates remain unknown because AU does not state them on the product page.
