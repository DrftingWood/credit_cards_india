# Verification notes — 2026-06-12 sweep

Raw verified findings from the web fact-check agents (audit Phase 2/3).
Items move from here into dated records as they are encoded; anything left
is verified-but-unencoded and is the worklist for the next data PR.
Confidence tags: high/med/low per the source quality.

## Encoded in this branch (kept for traceability)

- Magnus fees: launch ₹10,000 (Aug-2019); ₹12,500 effective **1-Sep-2023**
  (new customers; existing grandfathered initially); waiver ₹15L → ₹25L on
  **20-Apr-2024** (insurance/gold/fuel/utilities/govt excluded from waiver
  calc). Sources: livefromalounge.com/axis-bank-magnus-credit-card-september-1-2023-onwards/,
  businesstoday.in (Mar-2024). high
- EDGE transfer partners: Marriott/Accor/Qatar removed effective
  **2-Apr-2026** (immediate, no notice); BA/Vietnam Airlines/Finnair added
  at weaker ratios. Applies to EDGE Miles/Reward programme (Magnus, Reserve,
  Atlas...). Source: cardexpert.in/axis-bank-drops-accor-marriott-qatar-partners/. high
- Axis Reserve: waiver ₹35L (current published; ₹25L grandfathering
  unverified-low); **20-Jun-2025** revision: accelerated = 2X international
  only (30/₹200, capped at credit limit per calendar month, 15/₹200 beyond);
  old 3X dining+intl (45/₹200) gone. 20-Apr-2024: 50k-point renewal benefit
  + airport transfers removed. Sources: paisabazaar.com/credit-card/axis-reserve-devaluation/,
  cardinsider.com/axis-bank/axis-bank-reserve-credit-card/. high
- IDFC FIRST devaluation effective **18-Jan-2026** (Classic, Select, Wealth,
  Millennia): basis ₹150 → ₹200/point; 3X below ₹20k/month, 10X above
  (10X requires ₹20k+ monthly spend; no points if minimum due missed);
  FASTag/railway 1X. Further change **18-Jun-2026**: 24-month point expiry
  (Wealth/Millennia) + credit-limit earning cap. Sources:
  cardmaven.in/forum/threads/w-e-f-18th-january-2026-...-devaluation.23528/,
  upstox.com/news/.../idfc-first-bank-revises-credit-card-benefits. high
  (Mayura/Ashva intl 10X→5X: med — NOT yet encoded.)
- HDFC DCB Metal: milestone = 10,000 pts on ₹4L/calendar quarter; welcome =
  Club Marriott + Swiggy One (3mo) + Amazon Prime on ₹1.5L in 90 days; fee
  ₹10,000, waiver ₹8L. Source: hdfc.bank.in DCB Metal page + cardinsider. high
- HDFC Infinia retention (announced ~26-Feb-2026): ₹18L retail card spend
  FY Apr-2026..Mar-2027 OR ₹50L relationship value, else downgrade/removal
  in 2027. Source: businesstoday.in 2026-02-26, cardexpert.in. high
- HDFC Regalia (original): withdrawn for new applications (Regalia Gold is
  successor); lounge = 2 vouchers/quarter gated ₹1L prior-quarter spend
  (~Dec-2023), intl PP 6/yr after 4 card uses. paisabazaar/cardinsider/
  mymoneymantra. high(status, dom lounge)/med(intl detail)
- HDFC Diners Rewardz: discontinued for new applications; base 3 RP/₹150
  (not 4); no lounge; waiver ₹1L (not ₹2L); 2X weekend dining discontinued,
  10X partner brands capped 2,000/mo (med); forex 3% (med). cardinsider. high
- HDFC Diners Privilege: base 4 RP/**₹200** from **2026-05-15** (was ₹150);
  SmartBuy cut to 5X Aug-2025 (DCP cap was 2,500/mo, not 7,500 — med);
  from **2026-07-01** lounge = 3 vouchers/quarter (2 dom + 1 intl) on ₹60k
  prior-quarter spend; 2026-05-15 fee additions: reissuance ₹199, DCC 1.75%;
  quarterly ₹1,500 voucher milestone on ₹1.5L (high); welcome = Swiggy One +
  Times Prime on ₹1.5L/90d (med). cardinsider.com/blog/hdfc-diners-club-privilege-update/. high

## Verified, NOT yet encoded (next data PR)

(Encoded since first commit of this file: Magnus fees + 2-Apr-2026 partner
removal, Reserve waiver/2025 revision, IDFC 18-Jan-2026 wave (classic/
select/wealth/millennia), DCB Metal milestones/welcome, Infinia retention
note, Regalia on-hold + lounge, Diners Rewardz corrections, Diners
Privilege 2025-2026 records.)

- **hdfc/tata-neu-plus** — four missing dated changes (all high, hdfc.bank.in):
  UPI earn 0.25% (+0.75% with Tata Neu UPI id) cap 500 NC/mo eff 2024-08-01;
  grocery cap 1,000 NC/mo + utility cap 2,000 NC/mo eff 2024-09-01;
  gaming (MCC 5816) zero + insurance cap 2,000/mo eff 2025-07-01;
  NeuCoin validity 12 months eff 2025-08-01.
- **hdfc/marriott-bonvoy** — lounge is 12 dom + 12 intl/yr (YAML says 8 dom);
  welcome = 1 FNA ≤15,000 pts + Silver Elite + 10 ENCs (no more "categories");
  NO spend-based fee waiver (renewal grants FNA); milestones are 15,000-pt
  FNAs at 6L/9L/15L; FNA top-up +25k pts allowed 2025-26. cardmaven. high/med
- **hdfc/swiggy-hdfc** — split into Swiggy BLCK (10%) and ORNGE (5%)
  announced 2026-03-12, phased rollout; original superseded for new
  applications (med). Add exclusions: government, jewellery (med).
- **hdfc/freedom** — accelerated is 10X on BigBasket/BookMyShow/OYO/Swiggy/
  Uber cap 2,500 CP/mo + 5X EMI (high); CashPoint value ₹0.15 not ₹0.25
  (med); education-payments exclusion eff 2024-09-01 (med).
- **hdfc/moneyback-plus** — EMI accelerator is 5X not 10X (shared 2,500
  CP/mo cap); merchants include BigBasket; grocery cap 1,000 CP/mo (med).
- **hdfc/indianoil** — fuel cap 250 FP/mo only first 6 months then 150
  (high); other accelerators capped 100 FP/mo each (high); redemption
  ₹0.96/FP on fuel (med).
- **hdfc/pixel-play** — renewal waiver ₹1L (not ₹2.5L) + joining waived on
  ₹20k/90d (high); packs cap 500 CP/mo not ₹750 (high); "online-other 3%"
  is actually ONE chosen e-commerce merchant cap 500/mo (high); missing 1%
  UPI cashback cap 500/mo (med).
- **axis/reserve & axis/atlas & axis/magnus** — Reserve ₹25L grandfathered
  waiver tier unverified (low); Oberoi offer discontinued 1-Oct-2025 +
  EDGE forfeiture rules (med, from first sweep).
- **idfc-first mayura/ashva** — intl 10X→5X, 10X gated ₹20k/mo (med).
- **amex** — renewal-fee spend waivers ended mid-2025 programme-wide (med);
  per-card YAML notes not yet added beyond platinum-travel.
