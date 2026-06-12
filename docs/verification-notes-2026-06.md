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

(Encoded so far: Magnus fees + 2-Apr-2026 partner removal, Reserve, IDFC
18-Jan-2026 wave, DCB Metal, Infinia retention, Regalia, Diners Rewardz,
Diners Privilege, tata-neu-plus (3 dated records; RuPay-only UPI change
noted, not modelled), marriott-bonvoy, freedom, moneyback-plus, indianoil,
pixel-play, swiggy-hdfc exclusions + successor note.)

- **axis/reserve & axis/atlas & axis/magnus** — Reserve ₹25L grandfathered
  waiver tier unverified (low); Oberoi offer discontinued 1-Oct-2025 +
  EDGE forfeiture rules (med, from first sweep).
- **amex** — renewal-fee waiver withdrawal encoded on mrcc/smartearn with
  approximate 2025-07-01 effective date; pin the exact date on next sweep.
- **idfc-first mayura/ashva** — Jan-2026 intl cut left unencoded: agent
  phrasing ("10X→5X") doesn't reconcile with Ashva's 9/₹100 accelerator;
  needs the issuer T&C before encoding.

## Axis batch (agent sweep 2026-06-12) — encoding in progress

- **ace**: finance charge 3.75 (Dec-2024); lounge 4/yr gated ₹50k/3mo
  (1-May-2024); 5%+4% share a ₹500/mo combined hard cap (per-category
  "unlimited" was wrong); category-based (not MCC) cashback eligibility +
  jewellery/education/government exclusions from 20-Jun-2025. cardinsight.in,
  technofino. high
- **flipkart**: Myntra is 7.5% (own bucket), Flipkart 5%, Cleartrip 5%,
  each capped ₹4,000/quarter; welcome ₹250 Flipkart (+₹100 Swiggy) not
  ₹500; lounge REMOVED Jun-2025; exclusions += utilities/telecom/jewellery/
  education/government (med). 1finance.co.in. high
- **select**: waiver ₹8L not ₹6L; forex 3.5 not 1.5; earn = 20/₹200 on
  first ₹20k/mo then 10/₹200 (since 20-Apr-2024), no dining-intl accel;
  lounge 2/quarter gated ₹50k/3mo; welcome 10,000 EDGE pts; District BOGO
  ₹250 ×2/mo replaced BMS (20-Jun-2025). cardinsider. high
- **privilege**: waiver ₹5L (med); welcome 12,500 EDGE pts; milestone
  10,000 pts @ ₹2.5L/yr (missing); lounge 2/quarter gated ₹50k, NO intl/PP;
  District BOGO ₹250 ×1/mo (20-Jun-2025); still open for applications.
  cardinsider. high
- **my-zone**: NO spend-based waiver (med); lounge 1/quarter gated ₹50k/3mo
  (1-May-2024); District BOGO cap ₹200/mo; SonyLIV ₹1,499 value, renewal
  benefit replaced by 1,000 EDGE pts on ₹1.5L (Apr-2025 vs Apr-2026
  conflicting — med). cardinsider. high/med
- **neo**: now lifetime-free (limited-period, current); NO 2% bill-payments
  accelerator — discount-based benefits instead (Zomato 40% ×2/mo, Blinkit
  10%, Myntra ₹150, BMS 10%); welcome = 100% cashback up to ₹300 on first
  utility bill in 30 days. cardinsider. high
- **aura**: discontinued for new applications (date unconfirmed) — on-hold.
  paisabazaar. med
- **horizon**: NO fee waiver; forex 3.5 (med); welcome 5,000 miles on
  ₹1,000/30d + 1,500 renewal; lounge 32 dom/yr (Visa; 8/quarter) + 8
  intl/yr, no spend criterion; transfers 1:1 standard / 2:1 premium (BA,
  Finnair, Lotusmiles), 5L miles/yr cap; launched mid-2025 (Citi
  PremierMiles successor, med). cardinsider. high
- **olympus**: invite-only (Citi Prestige migrants); NO fee waiver; forex
  1.8 not 0.99; base 1 mile/₹100 dom + 2/₹100 intl (NOT 10/₹100), 7.5L
  miles/yr cap; 30/₹100 portal rate unverified-likely-wrong; welcome 2,500
  miles + ₹10,000 Taj/ITC vouchers (also renewal); transfers 1 mile = 4
  partner points; 10 guest visits/yr; golf 8 + 1 per ₹50k. cardinsider. high
