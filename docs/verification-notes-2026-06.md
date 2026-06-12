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

## ICICI batch (agent sweep 2026-06-12) — ENCODED (deferred: EPM Q4-2025 retention restructure (low), Times Black full milestone ladder, MMT dual-network modelling, ManU exact fee date, PAYBACK rename in historical records)

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

## Kotak/AU batch (agent sweep 2026-06-12) — ENCODED (deferred: PVR INOX Kotak successor card file, kotak/indigo first-year-free LTO, White Pass top tiers, AU vetta/ixigo milestones (med), solitaire realized value sourcing)

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

## BoB/PSU/misc batch (agent sweep 2026-06-12) — ENCODED (deferred: idbi network re-verification, pnb intl lounge count, eterna LTF offer modelling, league LTF variant)

- **bob/easy**: NOT lifetime-free — ₹500 JF/AF (JF waived on ₹6k/60d, AF on
  ₹35k/yr); base 1 RP/₹100 (was 5); 5X only on departmental stores + movies
  capped 1,000 RP/mo; redemption ₹0.20/pt; bobfinancial.com URLs dead →
  bobcard.co.in. high
- **bob/eterna**: network is Mastercard World (med); waiver ₹2.5L (was 4L);
  base 3 RP/₹100 (was 5); 15X capped 5,000 RP/mo (2025 devaluation); lounge
  unlimited dom gated ₹40k/prior-quarter eff 2025-01-01; NO intl PP (med);
  milestone 20,000 RP @₹5L (med); LTF acquisition offer to mid-2026 (med). high
- **bob/premier**: waiver ₹1.2L (was 2L); base 2 RP/₹100 (was 5, med); 5X
  incl international; lounge 1/quarter gated ₹20k eff 2025-01-01. high
- **boi/boi-select**: AF ₹800 (med); waiver ₹2L (med); intl lounge 2/yr
  missing; welcome Amazon Prime + health checkup (med).
- **canara/rupay-select**: actually LTF (YAML had ₹1,000 AF) + ₹300
  inactivity fee if spends <₹10k; lounge gated ₹10k prior-quarter (RuPay
  programme change); concierge true (med). high
- **idbi/winnings**: AF ₹899 (med); waiver ₹90k (med); marketed as RuPay
  Select (YAML visa platinum, med); intl lounge (low); welcome 10% cashback
  ≥₹500 txns in 90d (med).
- **kvb/honour**: AF ₹999; waiver ₹3L (was 2L); lounge 4 dom/yr (was 8);
  2X accel on restaurants/medical/books/insurance/rail/movies/car-rentals;
  welcome 700 RP. all high (official page).
- **pnb/rupay-select**: JF ₹500 (med); AF ₹500 (med); waiver is usage-based
  (quarterly card use), not spend threshold (med); intl lounge 4/yr (low —
  conflicting); welcome 300 RP (med).
- **union/rupay-select**: base 4 RP/₹100 @ ₹0.25 (was 2/₹150); AF ₹499 nil
  joining (med); intl lounge 2/yr missing; fuel waiver cap ₹100/cycle. high
- **south-indian/sib-platinum**: no longer listed/open — SIB lineup is only
  co-brands (One Card, SIB-SBI); old URL dead (med) — on-hold.
- **kotak/league-platinum**: tiered earn — 8X/₹150 special categories, 4X
  other spends up to ₹2L p.a., beyond ₹2L only special earns (high);
  Myntra-migration context (2025-07-10); possible first-year-free/LTF
  variant (med).
- **icici/platinum-chip**: PAYBACK → ICICI Reward Points (PAYBACK → Zillion
  → ICICI Rewards); utilities/insurance earn 1 RP/₹100 tier (YAML excluded
  insurance entirely); Jan-2026 exclusions (govt, tax, property mgmt, rent,
  wallets) eff 2026-01-15; BMS movie benefit gone/gated (med-high). high

## Amex/Yes/StanC/HSBC/Federal batch (agent sweep 2026-06-12) — ENCODED (deferred: centurion fee verification, reserve Rs10L waiver, premia/reserv med-conf earn tiers re-check, EMT points migration, scapia RuPay variant)

- **amex/centurion**: joining fee unverifiable (invite-only; YAML notes
  self-contradict 2L vs 1.5L) — low, flag only.
- **amex/platinum-charge**: fee ₹66,000 (was ₹60k, ~2023 refresh); welcome
  ₹45k vouchers on ₹50k/2mo (no 50k MR bonus); renewal ₹35k vouchers @₹20L
  (med). livefromalounge. high/med
- **amex/platinum-reserve**: fee ₹10,000 (was ₹5k); 100% renewal waiver
  @₹10L (med); welcome 11,000 MR on ₹30k/90d; lounge 12 dom (3/qtr) + 2
  intl PP (med); golf gated ₹50k/mo (med); monthly ₹1,000 voucher @₹50k +
  Accor ALL+ (med). high/med
- **yes/marquee**: earn 36/₹200 online (cap 1,00,000 pts/cycle) + 18/₹200
  offline, no intl accel (was 12/24); waiver ₹10L (med); lounge gated ₹1L
  prior-quarter eff 2025-04-01; welcome 40,000 pts; redemption capped 70%
  cart / 3L pts/mo eff 2024-12-01 (med). high
- **yes/premia**: renamed YES ELITE+ (~2023-24); AF ₹999 (med); earn
  12/₹200 online, 6 offline, 4 utilities/govt/edu/insurance, cap 12,000/
  cycle (med); lounge gated ₹50k/qtr eff 2025-04-01; rent 1% + utility>₹15k
  1% fees (med). high(rename, lounge)
- **yes/reserv**: AF ₹1,999 waiver ₹3L (med); forex 1.75 (med); earn
  24/₹200 online, 12 offline, 6 select, cap 75,000/cycle (med); lounge 3
  dom/qtr gated ₹1L + 6 intl/yr eff 2025-04-01 (med).
- **standard-chartered/easemytrip**: per-txn caps (dom flights ₹1k, intl
  ₹5k, dom hotels ₹5k, intl ₹10k); base is 2 RP/₹100 @ ₹0.50 (points, not
  cashback — med); waiver ₹50k (was 1.2L); lounge 2/yr, PP withdrawn eff
  2024-10-15. high
- **standard-chartered/rewards**: base 4 RP/₹150 retail + 1/₹150 govt/
  insurance (was 1/₹150); 4x bonus only after ₹20k/mo, cap 2,000 bonus
  RP/mo; waiver ₹3L (was 1.2L). high
- **standard-chartered/ultimate**: utilities/supermarkets/insurance/etc
  earn REDUCED 3 RP/₹150 (not zero) since 2023-04-02; renewal 6,000 RP
  (med). high
- **hsbc/live-plus**: 10% categories are dining/food-delivery/GROCERIES
  (not entertainment); forex 3.5 (was 1.99); welcome ₹1,000 cashback on
  ₹20k/30d (med). high
- **hsbc/premier**: JF ₹12,000 / renewal ₹20,000 waived for Premier (med);
  transfers 1:1 (was 2:1, med); eligibility is Premier relationship (TRB
  ₹50L / ₹3L salary / ₹1.15Cr mortgage, med); 8 intl guest visits (med);
  Taj Epicure + ₹12k welcome (med).
- **hsbc/visa-platinum**: verified OK.
- **federal/celesta**: LTF limited-period offer (med); forex 2.0 (was
  1.5); earn 3x travel-intl / 2x dining / 1x other (med); lounge 2 intl/yr
  + dom tiered spend-gated (₹20k→1, ₹40k→2 per quarter from 2025-10-01);
  welcome ₹600 Amazon Pay (high). high
- **federal/scapia**: 20% Scapia coins on app travel = 4% value, coins are
  ₹0.20 each (unit value was wrongly ₹1); base 10% coins = 2% value;
  lounge unlimited dom on ₹20k preceding-month spend (raised from ₹10k;
  min-spend rule eff 2026-02-27); RuPay UPI variant (Jun-2025) not
  modelled. high
- **federal/signet**: currently LTF (med); earn 3x electronics/apparel +
  2x entertainment (no intl accel, med); lounge 1/quarter gated ₹20k
  (2025, high); welcome ₹200 voucher (med).
- **Amex waiver date**: discretionary renewal waivers ended ~12-Jun-2025
  (forum-reported) — refines the approximate 2025-07-01 already encoded.

## RBL/IndusInd/IDFC/fintech batch (agent sweep 2026-06-12) — ENCODED (deferred: ashva lounge re-model, first-private earn tiers, idfc-indigo 0.5x exclusion re-model, play points model, pinnacle AF (low), power/power+ full HPCL structures — partially noted in file comments)

- **rbl/zomato-edition**: FABRICATED/conflated — the Zomato-RBL Edition
  co-brand (launched 2020) was terminated 15-May-2023, holders migrated to
  ShopRite; no 2023 "Zomato Edition" exists. Mark discontinued 2023-05-15.
  paisabazaar. high
- **rbl/insignia**: fee ₹7,000 (LTF for Insignia Preferred clients; YAML
  ₹10k, med-high); welcome 28,000 RP (med); lounge 2/quarter + PP 6 intl/yr
  (med-high, was unlimited); milestone ₹8,000 vouchers @₹8L (med).
- **rbl/play**: BMS-centric now — 2 free BMS tickets per ₹5,000 spend +
  ₹100/mo F&B; Super Star benefit devalued Dec-2024 (med); waiver ₹1.5L
  (high); welcome ₹500 BMS (med).
- **rbl/shoprite**: waiver ₹1.5L (high); welcome 2,000 RP (med); movies 10%
  BMS ≤₹100 15×/yr (med).
- **rbl/world-safari**: intl accel 5/₹100 not 10 (med); milestones 10,000
  @2.5L / 15,000 @5L / ₹10k voucher @7.5L (high); lounge spend-gated eff
  1-Jul-2025 + PP extra visit per ₹50k/qtr (med).
- **indusind/eazydiner-platinum**: LTF (₹1,500 fee wrong, high); 15-Jul-2025
  devaluation — 2X EazyPoints all spends + 20% PayEazy discount ≤₹500
  capped ₹2,000/mo (₹5,000 on ₹30k non-dining), dining points wiped,
  lounge removed (med); welcome 3-mo Prime + 500 pts (med).
- **indusind/iconia**: discontinued for new sourcing (Amex variant) — high.
- **indusind/legend**: lounge discontinued eff 7-Mar-2025 (high).
- **indusind/pinnacle**: intl lounge 1/quarter PP + golf halved (1+1/mo)
  eff 13-Mar-2025 (high); AF possibly ₹14,999 (low-med, not applied).
- **idfc/ashva**: forex 1% (was 1.5); earn 5X ≤₹20k/mo, 10X above; intl
  cut to 5X eff 18-Jan-2026 (high); lounge 16 dom (incl spa) + 8 intl/yr
  spend-gated (med); welcome ₹2,000 cashback + 2,500 RP (med); waiver
  unverified (low).
- **idfc/mayura**: forex 0% (was 0.99); NO waiver (₹5,999 fee); earn 5X
  ≤₹20k, 10X above + birthday, 3X rent/wallet/edu/govt; intl 10X→5X eff
  18-Jan-2026 (high); lounge 16+16/yr gated ₹20k prev-month (high);
  welcome unverified (low).
- **idfc/swyp**: NO per-transaction earn — monthly milestones 200 RP @₹5k,
  500 @₹10k, 1,000 @₹15k (₹0.25/RP); FASTag/railway excluded from
  milestones eff Mar-2026 (high); EMI is user-initiated >₹3,000 flat-fee
  (med).
- **idfc/first-private**: fee ₹50,000 (LTF only as ~₹1Cr-TRV invite; YAML
  said ₹0, high); forex 0%; up to 10 RP/₹100 with 1 RP = ₹1 on Travel &
  Shop portal eff Jun-2025 (med); welcome 1,00,000 RP + ITC Culinaire +
  Accor Plus (med).
- **idfc/indigo**: NO lounge access at all (high, was 4/q + 4/yr);
  milestones 5,000 BluChips @ 2L/5L/8L/10L/12L (high, issuer PDF);
  fuel/rent/insurance earn 0.5/₹100 not zero (med).
- **onecard/metal**: 1 RP = ₹0.10 (was ₹1, high); NO complimentary lounge
  (high, was 4/q on ₹50k).
- **slice/slice-rupay**: launched Jun/Jul-2025 post-NESFB merger (med);
  ~2% cashback, up to 3% conditional on slice balance (med; YAML caps
  uncorroborated).

## Sweep completion note (2026-06-12)

All 127 cards now carry either last_verified_on: 2026-06-12 (fact-checked
this sweep) or last_swept_on: 2026-06-12 (IndiGo/IRCTC co-brands verified
in the recent programme-modelling waves; amex/centurion unverifiable
invite-only; hdfc/6e-rewards-xl discontinued). idfc power/power+ detailed
HPCL structures from the final agent report (21X/30X fuel etc.) were NOT
encoded — flagged for the next data PR alongside the other deferred items.
