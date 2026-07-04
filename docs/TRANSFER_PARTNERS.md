# Transfer-Partner Conversion Matrix (India)

**Verified:** 2026-07-05 · **Confidence:** High on ratios (cross-checked 3+ 2026 sources per
ecosystem); Medium on some partner rupee values (award pricing is increasingly dynamic).

This document maps every major **transferable-points** credit-card currency in India to its
airline/hotel partners, with the current transfer ratio and the resulting **₹ value per card
point**. It is the human-readable companion to the `redemption[].transfer_partners[]` data
encoded on the individual card YAMLs.

## How to read this

**Full visibility, no blending.** This document never collapses a card's worth into a single
"best" or "average" number. Every partner is shown with its own ratio and ₹/point so the reader
decides based on where *they* actually fly or stay. The two scalars on each card
(`unit_value_inr_realized`, `unit_value_inr`) are deliberately just the two transparent endpoints:

- `unit_value_inr_realized` = the **guaranteed non-transfer floor** (portal / SmartBuy / catalogue /
  cash) — what you get with zero effort and no airline preference.
- `unit_value_inr` (face) = the **single best documented transfer** (the ceiling).
- Everything between those endpoints is the per-partner grid below. Neither number is an average.

Reading the numbers:

- **Ratio direction is `card point : partner unit`.** `1:2` = 1 card point → 2 partner units
  (favourable). `2:1` = 2 card points → 1 partner unit (you lose half). `100:33` = 3 card points
  → ~1 partner unit.
- **₹/card point = (partner units per card point) × (₹ per partner unit).** Partner values are
  the *realized economy* number an ordinary Indian traveller actually achieves — not cherry-picked
  business-class sweet spots (those are noted separately and run 1.5–3× higher).
- 🔴 marks conversions that fall **below the card's own floor** — transferring there destroys value
  versus just using the floor. It is a per-cell honesty flag, not a summary.

## Realized value per partner unit (₹, economy)

| Partner | ₹/unit | Note |
|---|---|---|
| Singapore KrisFlyer | 1.10 | biz ~2.0–2.5 |
| Turkish Miles&Smiles | 1.10 | biz ~2.0–2.5 |
| Finnair Avios | 1.05 | same Avios pool as BA/Qatar |
| Air Canada Aeroplan | 1.00 | no fuel surcharges |
| British Airways / Qatar Avios | 1.00 | short-haul sweet spots |
| Virgin Atlantic | 1.00 | ANA/Delta partner awards |
| Club ITC | 1.00 | fixed ₹1 |
| JAL Mileage Bank | 0.95 | biz huge but hard to reach from India |
| Cathay Asia Miles | 0.95 | Asia routes |
| Accor ALL | 0.95 | nominal ~₹1.8, realistic ~₹0.9 |
| Flying Blue (AF/KLM) | 0.90 | 25% Promo Rewards ex-India |
| United / Etihad / Emirates / EVA | 0.90 | |
| Qantas / Vietnam LotusMiles | 0.80 | |
| Air India Maharaja | 0.55 | post-Apr-2026 revaluation |
| Marriott Bonvoy | 0.55 | aspirational ~₹1.0 |
| IHG / Wyndham / Shangri-La / Hainan | 0.50 | |
| Hilton Honors | 0.35 | |
| SpiceJet SpiceClub | 0.30 | LCC, near-cash |
| AirAsia rewards | 0.22 | fixed-value LCC |
| Radisson Rewards | 0.16 | weak post-devaluation |

## Value range per card (floor → ceiling)

The endpoints only. **The point of the card is the full per-partner grid below** — this table just
bounds it. "Ceiling partner" is named for reference, not as a recommendation; use the grid to find
the partner that fits *your* travel.

| Card | Floor (realized) | Floor source | Ceiling (face) | Ceiling partner | # partners beating floor |
|---|---|---|---|---|---|
| Axis Atlas (EDGE Mile) | ₹1.00 | Travel EDGE portal | ₹2.20 | KrisFlyer / Turkish (1:2) | 8 of 11 |
| Axis Horizon (EDGE Mile) | ₹1.00 | Travel EDGE portal | ₹1.10 | KrisFlyer (1:1) | 3 of 11 |
| Axis Magnus / Select (EDGE Rwd Pt) | ₹0.20 | EDGE catalogue | ₹0.44 | KrisFlyer (5:2) | 9 of 10 |
| Axis Reserve (EDGE Rwd Pt) | ₹0.40 | EDGE catalogue | ₹0.44 | KrisFlyer (5:2) | 5 of 10 |
| HDFC Infinia / Diners Black | ₹1.00 | SmartBuy | ₹1.10 | KrisFlyer (1:1) | 3 of 22 |
| HDFC Regalia Gold | ₹0.50 | SmartBuy | ₹0.55 | KrisFlyer (100:50) | 7 of 22 |
| HSBC TravelOne / Premier | ₹0.25 | HSBC catalogue | ₹1.10 | KrisFlyer (1:1) | 19 of 20 |
| IndusInd Pinnacle | ₹0.75 | cash credit | ₹0.75 | *(no transfer beats cash)* | 0 of 2 |
| IndusInd Legend | ₹0.75 | pay-with-points | ₹0.75 | *(no transfer beats cash)* | 0 of 2 |
| Amex Membership Rewards | ₹0.25–0.50 | Gold Collection / Taj | ₹0.55 | Marriott (1:1) | 7–8 of 8 |
| HSBC Platinum (Visa/RuPay) | ₹0.25 | HSBC catalogue | ₹0.55 | KrisFlyer (2:1) | 17 of 19 |
| ICICI Emeralde Private Metal | ₹1.00 | iShop travel | ₹1.00 | Air India (1:1) — below floor | 0 of 1 |
| Kotak Solitaire | ₹1.00 | Kotak Unbox | ₹1.00 | Air India (1:1) — below floor | 0 of 9 |
| YES Marquee | ₹0.25 | portal | ₹0.25 | none usable | 0 of 2 |

Note the shape each card makes: Atlas is a *wide* range (₹1.00→₹2.20, transfers add a lot); HDFC
Infinia is *narrow* (₹1.00→₹1.10, only 3 partners beat SmartBuy); HSBC is *floor-poor, transfer-rich*
(₹0.25→₹1.10 — the card is pointless unless you transfer); IndusInd Pinnacle/Legend are *inverted*
(the cash floor beats every transfer — never transfer).

## Full matrix — ₹ per card point by partner (realized economy)

🔴 = below the card's own non-transfer floor (value-destroying). `–` = not a partner of that card.

| Partner (₹/unit) | Axis Atlas | Axis Horizon | Axis Magnus | HDFC Infinia/DCB | HDFC Regalia Gold | HSBC TravelOne | IndusInd Pinnacle | IndusInd Legend | Amex MR |
|---|---|---|---|---|---|---|---|---|---|
| Singapore KrisFlyer (1.10) | **2.20** | 1.10 | 0.44 | 1.10 | 0.55 | 1.10 | 🔴0.55 | 🔴0.28 | 0.55 |
| Turkish Miles&Smiles (1.10) | 2.20 | 1.10 | 0.44 | 🔴0.55 | 0.55 | 0.55 | – | – | – |
| Finnair Avios (1.05) | 🔴0.53 | 🔴0.53 | 0.21 | 1.05 | 0.53 | – | – | – | – |
| Air Canada Aeroplan (1.00) | 2.00 | 1.00 | – | 🔴0.50 | 🔴0.33 | – | – | – | – |
| British Airways Avios (1.00) | 🔴0.50 | 🔴0.50 | 0.20 | 🔴0.50 | 🔴0.33 | 1.00 | – | – | 0.50 |
| Qatar Avios (1.00) | – | – | – | 🔴0.50 | 🔴0.33 | 1.00 | – | – | 0.50 |
| Virgin Atlantic (1.00) | – | – | – | – | – | – | – | – | 0.50 |
| Club ITC (1.00) | 2.00 | 1.00 | 0.40 | 🔴0.50 | 0.50 | – | – | – | – |
| JAL Mileage Bank (0.95) | 1.90 | 0.95 | – | – | – | 0.95 | – | – | – |
| Cathay Asia Miles (0.95) | – | – | – | 🔴0.47 | 🔴0.31 | – | – | – | 0.47 |
| Accor ALL (0.95) | – | – | – | 🔴0.47 | 0.47 | 0.95 | – | – | – |
| Flying Blue (AF/KLM) (0.90) | 1.80 | 0.90 | 0.36 | 0.90 | 0.45 | 0.90 | – | – | – |
| United MileagePlus (0.90) | – | – | – | 🔴0.45 | 🔴0.30 | 0.45 | – | – | – |
| Etihad Guest (0.90) | – | – | – | 🔴0.45 | 🔴0.30 | 0.90 | – | – | – |
| Emirates Skywards (0.90) | – | – | – | – | – | – | – | – | 0.45 |
| EVA Air Infinity (0.90) | – | – | – | – | – | 0.90 | – | – | – |
| Qantas FF (0.80) | – | – | – | – | – | 0.80 | – | – | – |
| Vietnam LotusMiles (0.80) | 🔴0.40 | 🔴0.40 | 🔴0.16 | 🔴0.80 | 🔴0.40 | 0.80 | – | – | – |
| Air India Maharaja (0.55) | 1.10 | 🔴0.55 | 0.22 | 🔴0.28 | 🔴0.18 | 0.55 | 🔴0.28 | 🔴0.14 | – |
| Marriott Bonvoy (0.55) | – | – | – | 🔴0.28 | 🔴0.18 | 0.55 | – | – | 0.55 |
| Hainan Fortune Wings (0.50) | – | – | – | – | – | 0.25 | – | – | – |
| IHG One Rewards (0.50) | 1.00 | 🔴0.50 | – | 🔴0.50 | 🔴0.25 | 0.50 | – | – | – |
| Wyndham Rewards (0.50) | – | – | – | 🔴0.50 | 🔴0.25 | 0.50 | – | – | – |
| Shangri-La Circle (0.50) | – | – | – | – | – | 🔴0.10 | – | – | – |
| Hilton Honors (0.35) | – | – | – | – | – | – | – | – | 🔴0.32 |
| SpiceJet SpiceClub (0.30) | – | – | – | 🔴0.30 | 🔴0.15 | – | – | – | – |
| AirAsia rewards (0.22) | – | – | – | 🔴0.22 | 🔴0.11 | 0.66 | – | – | – |
| Radisson Rewards (0.16) | – | – | – | 🔴0.16 | 🔴0.08 | – | – | – | – |

## Per-ecosystem notes

- **Axis EDGE Miles** — Atlas is 1:2 (best transferable currency in India, ₹2.2/pt to KrisFlyer);
  Horizon is 1:1 (half). BA/Finnair/Vietnam LotusMiles are 2:1 **penalty** partners added
  2026-04-02, all below the ₹1 portal floor — never transfer there. Marriott, Accor and Qatar were
  **removed** 2026-04-02 (Accor was the old ~₹1.8/mile hotel benchmark).
- **Axis EDGE Reward Points** (Magnus/Reserve) — a *different, weaker* currency (~₹0.2 base) that
  transfers at 5:2 (standard) / 5:1 (penalty). Do not conflate with EDGE Miles.
- **HDFC** — Infinia = Diners Club Black for transfers. Tiered: KrisFlyer/Flying Blue/Finnair/IHG
  are 1:1 (worth transferring); most legacy majors (Air India, BA, Etihad, United, Marriott, ITC)
  are 2:1 and land **at or below** the ₹1 SmartBuy floor — use SmartBuy instead. Regalia Gold is a
  full tier worse (100:50 / 100:33). Diners Club Privilege transfers are discontinued on new cards.
  Transfer cap 1.5 lakh RP/month.
- **HSBC** TravelOne/Premier — mostly 1:1, but Turkish/United/Hainan are 2:1 and Shangri-La 5:1;
  AirAsia is a quirky 1:3. Air Canada was removed. Its ₹0.25 catalogue floor is low, so *transfers
  are the whole point* of the card.
- **IndusInd** — Avios card earns Avios **directly** (no bank-point layer; free 1:1 pooling across
  BA/Qatar/Iberia/Finnair/Aer Lingus). Pinnacle (2:1) and Legend (4:1) transfers to KrisFlyer/Air
  India are **worse than their own cash floor** — never transfer. **InterMiles conversion is dead**
  (withdrawn 2025-01-21).
- **Amex India** MR — 6 airlines, all **2:1**; only Marriott is 1:1 (the de-facto hub). Etihad was
  removed 2026-07-01. Airline transfers (~₹0.5/pt) barely beat the Gold Collection floor; MR is a
  weak transfer currency in India versus the US program.

## Additional ecosystems & non-transfer cards (verified 2026-07-05)

- **HSBC Platinum (Visa / RuPay)** — real transfer program, same 20 partners as TravelOne but the
  ratio is **halved: 2:1 general** (vs TravelOne 1:1), with exceptions AirAsia 1:2, United 3:1,
  Hainan/Turkish 4:1, Shangri-La 10:1. Floor is the ₹0.25 catalogue, so transfers still add value.
- **ICICI Emeralde Private Metal** — exactly **one** partner: Air India Maharaja **1:1**. At ~₹0.55
  it is *below* the ₹1.00 iShop floor — iShop redemption beats the transfer. No hotel/other airline
  partners. (Legacy non-metal Emeralde: Air India 6:1, low confidence.)
- **Kotak Solitaire** — "Air Miles" transfer to 9 partners (Air India 1:1; Etihad/Qatar/BA/United/
  Cathay/Flying Blue/Accor 2:1; Marriott 3:1), but **every one is below the ₹1.00 Kotak Unbox floor**
  — Unbox travel is the better redemption. 2,000-mile minimum; periodic 20% transfer-bonus promos.
- **YES Marquee** — InterMiles 10:1 and Air India 15:1, both effectively worthless (~₹0.02–0.04/pt)
  vs the ₹0.25 floor. Club Vistara removed (defunct since Nov 2024).
- **Catalogue-only, NO transfer partners** (false transfer claims removed from the data):
  IDFC First Mayura (₹0.50 travel / ₹0.25 other), RBL Insignia (₹0.25), RBL World Safari (₹0.25),
  AU Zenith+ (₹1.00). Their marketed hotel "partners" are elite-status perks, not point transfers.
- **Equitas PowerMiles** — a 1:1 transfer program to ~11 partners is **announced but NOT live**
  (expected ~Sep 2026). Recorded as inactive; current worth ₹0.50/pt via portal.
- **IndusInd InterMiles Voyage/Odyssey (×4)** — co-brand **discontinued**, migrated to Legend/Celesta
  (2025-01-21); no longer earn InterMiles. Marked `status: discontinued`. Residual InterMile ~₹0.17–0.25.

## Sources

Cross-verified July 2026 across: paisabazaar, cardmaven, magnify.club, rivo.pe, savesage.club,
cardinsider, Live From A Lounge, technofino, pointsmath, milesahead.club, thepointsguy,
nerdwallet, doubledip.in, frequentmiler, and issuer pages. Flagged-stale sources (pointsmath Axis
grid on Marriott; magnify HSBC on Air Canada/Turkish; cardtrail Amex on Etihad) were excluded on
the specific points where they conflicted with the weight of evidence. Full per-claim source lists
live in the research transcripts.
