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

## Axis batch (agent sweep 2026-06-12) — ENCODED

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

## SBI batch (agent sweep 2026-06-12) — ENCODED (deferred: irctc-premier annual milestone (med), aurum Club Marriott, miles-elite per-₹1L lounge accrual, air-india decomposition + Maharaja Club programme rename)

- **GLOBAL (all 11 SBI cards)**: finance charge 3.5 → 3.75 eff 2024-11-01
  (cardinsider, high); Dec-2024 wave eff 2024-12-01: digital-gaming spends
  earn nothing, government spends excluded on most cards, utility payments
  >₹50k/cycle attract 1% fee; rent ₹199 processing fee + third-party
  education 1% fee (2024). business-standard. high
- **prime**: OK apart from global items. paisabazaar. high
- **elite**: milestones are points (10k/10k/15k/15k pts at 3L/4L/5L/8L =
  ₹2,500/2,500/3,750/3,750); movies 2 tickets/mo ₹250 each; CV Silver +
  Trident Red discontinued post-merger, no replacement (med). high
- **simplyclick**: 10X list = Apollo 24x7, BookMyShow, Cleartrip, Dominos,
  IGP, Myntra, Netmeds, Yatra (Amazon 10X discontinued; lenskart/ola gone);
  Swiggy cut 10X→5X eff 2025-04-01. businesstoday. high
- **simplysave**: OK apart from global. med
- **pulse**: milestone is ₹4L annual → ₹1,500 e-voucher (YAML had ₹2L);
  welcome watch model is ColorFit Pulse 4 Pro (med). high
- **bpcl-octane**: milestone ₹3L annual → ₹2,000 e-voucher (YAML ₹2L). high
- **aurum**: waiver = fee reversed on ₹12L (YAML null); domestic lounge
  4/quarter not unlimited; welcome 40,000 pts (med); milestones Tata CLiQ
  ₹5,000 @5L + Taj ₹10,000 @10L + Club Marriott (med); applications via
  aurumcreditcard.com income ≥₹40L (med). high/med
- **miles-elite**: waiver ₹15L (YAML 10L); welcome 5,000 TC on ₹1L/60d;
  milestone ₹12L → 20,000 TC (+1 dom lounge per ₹1L cumulative); transfer
  1:1 some partners, 2:1 Emirates/Qatar/Turkish/Accor/ITC (med); ₹1Cr
  air-accident cover discontinued eff 2025-07-15 (sbicard notice). high
- **air-india-platinum**: discontinued for new issuance eff 2024-10-10;
  AI-ticket accelerator was 15/₹100 (YAML 10) cut to 5/₹100 eff 2025-03-31;
  insurance withdrawn 2025-07-26; programme rebranded Maharaja Club (med).
  cardinsider + sbicard notices. high
- **reliance-prime**: milestones = Reliance vouchers ₹1,500 @75k, ₹2,250
  @1.5L, ₹5,000 @3L annual (YAML ₹7,000 @5L); 1 free BMS ticket/mo ₹250
  missing; welcome also includes ₹11,999 Reliance discount vouchers (med). high
- **irctc-premier**: lounge is 8 RAILWAY station visits/yr (2/quarter), no
  airport lounge; welcome 1,500 RP on first annual fee; milestone up to
  5,000 RP (med). paisabazaar. high

## ICICI batch (agent sweep 2026-06-12) — encoding in progress

- **BANK-WIDE**: domestic-lounge spend gate ₹35k → ₹75k/quarter (~Jul-2025,
  high); currency_name "PAYBACK Points" → "ICICI Bank Reward Points" (high);
  Jan/Feb-2026 devaluation eff **2026-01-15**: base 6 RP/₹200 on Coral/
  Rubyx/Sapphiro, transport-MCC reward caps (₹10k spends/mo Coral, ₹20k
  Rubyx/Sapphiro), government-services/tax exclusions (med-high across 4
  sources); BOGO movies gated on ₹25k prior-quarter spend eff **2026-04-01**
  (high). cardinsider/cardmaven/technofino/paisabazaar.
- **coral**: base was 2/₹100 → 6/₹200 (Jan-2026); milestones 2,000 RP @₹2L
  + 1,000/addl ₹1L max 10,000/yr (med). high/med
- **rubyx**: base 4/₹100 → 6/₹200; welcome = travel/shopping vouchers
  ₹5,000 (med); golf is spend-linked (1 per ₹50k prior-month, max 2/mo,
  high); milestones 3,000 RP @₹3L + 1,500/addl ₹1L (med).
- **sapphiro**: base 4/₹100 wrong (2/₹100 pre-2026, 6/₹200 after); intl
  accel 4/₹100 not 6 (med); lounge 4/quarter @₹75k gate; intl 2/yr + PP for
  post-15-Nov-2024 applicants (med); welcome ~₹13k (med); milestones 4,000
  RP @₹4L + 2,000/addl ₹1L cap 20k/yr (med).
- **emeralde**: movies gate 2026-04-01; govt/tax exclusions; still OPEN for
  applications (med). Otherwise OK.
- **emeralde-private-metal**: milestones add EaseMyTrip ₹3,000 @₹4L and
  @₹8L (high); Q4-2025 retention restructure to ₹23k iShop credit (low —
  NOT encoded). Otherwise verified OK.
- **hpcl-super-saver**: fuel is 4% capped ₹200/mo (+1% surcharge waiver);
  grocery/utility 5% as RP capped 400 RP/mo, dining NOT included; PAYBACK
  rename; ₹75k lounge gate. all high.
- **mmt-signature**: product restructured ~Oct-2024 (old Signature closed):
  fees ₹999/₹999 waiver ₹3L; dual-network MC+RuPay; 6% myCash MMT hotels /
  3% MMT flights-holidays-cabs-bus / 1% other; lounge 8 dom/yr (2/qtr) + 1
  intl/yr, exempt from spend gates (med); welcome MMTBLACK Gold. high.
- **manchester-united-signature**: still OPEN (discontinuation not
  corroborated, med); fees ₹2,499/₹2,499 waiver ₹2.5L (med); welcome is MU
  holdall + football (med); ₹75k lounge gate; PAYBACK rename.
- **adani-one-signature**: fees ₹5,000/₹5,000 waiver ₹6L (high — YAML had
  ₹999/₹3L); welcome ~₹9,000 vouchers (med); base 1.5% dom / 2% intl (med);
  lounge 4 dom + 2 intl + Adani perks (med).
- **times-black**: earn 2% dom / 2.5% intl Times Points (utilities/
  insurance/education/govt EARN — YAML wrongly excludes, med); realized
  ₹0.40 cashback / ₹1 voucher (high; YAML 0.5); welcome ₹12k Lohono or ₹10k
  EMT + extras (med); milestones up to ₹70k/yr tiered (med); OPEN
  application via timesblack.com (med — YAML invite-only).

## Kotak/AU batch (agent sweep 2026-06-12) — encoding in progress

- **kotak/myntra-kaching**: DISCONTINUED 2025-07-10, holders migrated to
  Kotak League Platinum; 7.5% Myntra discount withdrawn. cardinsider +
  business-standard. high
- **kotak/pvr-gold**: discontinued (Kotak lists "(Discontinued)"; date
  unknown); replacement product is PVR INOX Kotak (₹499, 2023) — new card
  file needed; 1 free ticket ≤₹300 per ₹10k monthly spend + 5% tickets /
  20% F&B; milestone exclusions eff 2025-06-01. high
- **kotak/white-reserve**: fees ₹12,500 (YAML ₹3,000), waiver ₹10L; NO
  per-transaction earn — milestone-only White Pass (₹5k @₹3L scaling to
  ₹2.5L value @₹1Cr); lounge unlimited dom+intl; welcome Club Marriott
  (med); fuel waiver ₹400–7,500 cap ₹4,500/yr (med). high
- **kotak/solitaire**: launched 2024 (YAML 2021); forex 0% (YAML 2%);
  rewards are Air Miles 3/₹100 base + 10/₹100 travel via Kotak Unbox (YAML
  Whites-Pass cashback 4/₹150); fee ₹0 in programme / ₹25,000 if
  downgraded; lounge guests 2+2/yr (med). high
- **kotak/indianoil-kotak**: fee ₹449 waiver ₹50k (YAML ₹500/₹75k); base
  3 RP/₹150 (YAML 1); fuel cap 1,200 pts/mo (YAML 300); grocery/dining
  12 RP/₹150 (med); fsw ₹100–5,000 cap ₹100/cycle; welcome 1,000 RP (med). high
- **kotak/indigo**: milestones are 2,500 BluChips @₹1.25L/₹2.5L/₹6L max
  7,500/yr (YAML wrongly had XL's 4×4,000); first-year-free LTO (med). high
- **kotak/indigo-xl**: welcome 4,000 BluChips + 6E Eats voucher (YAML
  2,500); rest verified OK. high
- **kotak/811-dreamdifferent**: base 1 RP/₹100 offline (YAML 2); online 4
  OK; uv ₹0.20 (med); milestone ₹1,000 Amazon @₹72k/yr (med). high
- **au/altura**: base 1% cap ₹50/mo (YAML 1.5% unlimited); accel 2%
  grocery/dept/utility cap ₹50/mo; NO airport lounge — 2 railway/quarter;
  edu/govt/BBPS earn nothing eff 2024-04-01; milestone ₹50 @₹10k/cycle
  (med). high
- **au/altura-plus**: currency is Reward Points ₹0.25 (YAML cashback);
  1/₹100 offline, 2/₹100 online uncapped; milestone 500 RP @₹20k/mo; NO
  airport lounge — 2 railway/quarter; waiver ₹80k (med). high
- **au/ixigo**: lifetime-free (YAML ₹999) (med); forex 0% but intl earns
  nothing; eff 2026-04-13 flat 5 RP/₹200 all spends + 5,000 RP @₹75k/qtr
  milestone (med) + lounge 2/qtr gated ₹50k prior-quarter (was ₹20k from
  2025-04-01; train accel removed 2025-04-01; edu/govt/rent/BBPS excluded
  2024-12-22). high
- **au/vetta**: waiver ₹1.5L (YAML ₹3L); forex 2.99 (med); earn 4/₹100
  grocery/dept, 2/₹100 retail, 1/₹100 utility/telecom, no intl accel
  (med); lounge 1 dom + 1 intl per quarter, dom gated ₹50k/qtr eff
  2026-04-10; milestones 500 RP @₹50k/qtr +1,000 @₹1L/qtr +1,000 birthday
  (med). high
- **au/zenith-plus**: fee ₹4,999 waiver ₹8L (YAML ₹7,999/₹18L); earn
  1 RP/₹100 base, 2/₹100 travel-dining-intl, 1 RP ≈ ₹1 (YAML 10/20 @
  ₹0.25); lounge 16+16/yr (YAML unlimited); welcome ₹5,000 (YAML ₹20k);
  golf 2/quarter; milestones 1,000 RP @₹75k/mo + Taj Epicure @₹12L (med). high
