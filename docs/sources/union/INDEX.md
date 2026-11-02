# union — source verification (2026-07-04)

Single card (rupay-select), a RuPay/Visa program card (RuPay Select / Winnings / Honour). Post-`.bank.in` migration the card pages redirect to the bank homepage and expose no machine-readable fee/reward table or PDF, so the seeded values (annual Rs.750, forex 3.5%, 1-2 RP/Rs100 per the RuPay-Select program) are RETAINED as plausible-unconfirmed. Domain + rent-MCC were verified during the audit.

# DIVAA ICON card review — 2026-10-26

Reviewed the current [Union Bank DIVAA ICON page](https://www.unionbankofindia.bank.in/en/details/divaa-icon-credit-card), current [MITC v1.4](https://www.unionbankofindia.bank.in/pdf/mitc-credit-cards.pdf), current portal eligibility and card offer pages. Archived the 24-page MITC in `divaa-icon/mitc-credit-cards.pdf` with extracted text.

- Confirmed NIL joining fee, INR1,499 annual fee, INR100,000 annual usage waiver, 3% forex, 3% monthly finance and 3%/INR500 cash advance. Card page and MITC agree on the INR1 lakh waiver threshold.
- Current page lists 2 Reward Points/INR100 and INR0.25/RP; remove unsupported realized value. Full MCC exclusions are not listed.
- Updated offers (Lakme, BookMyShow, MakeMyTrip, Healthians, Cult.fit, Swiggy One, BigBasket, Flipkart, Nykaa, Myntra, Jockey); updated NPCI INR200,000 and cardholder-premium INR1,000,000 accident cover; added INR200,000 cyber cover. Cancer coverage is advertised without a sum insured/terms.
- Card-specific eligibility states women-only, age 21-65 and INR250,000 minimum annual income; term-deposit lien route is available. No credit score threshold published. Removed unsupported exact launch date.
# NEXTERIA card review — 2026-10-26

Reviewed Union Bank's current [NEXTERIA product page](https://www.unionbankofindia.bank.in/en/details/nexteria-credit-card), [NEXTERIA eligibility page](https://unioncards.unionbankofindia.bank.in/HTML/ADB_NEXTERIA_ELIGIBILITY.html), current [MITC v1.4](https://www.unionbankofindia.bank.in/pdf/mitc-credit-cards.pdf), and current [credit-card policy listing](https://www.unionbankofindia.bank.in/en/common/policies-and-disclosures). Archived MITC v1.4 and text under `nexteria/`.

- Current MITC confirms joining/annual fee INR12,499 for primary and add-on, joining waived at INR300,000 spend within 90 days, annual waived at INR800,000 over last 12 months, 3% forex, 3% monthly finance and 3%/INR500 cash advance.
- Reward structure: 5 points/INR125, 10,000 points/month excluding milestone points; exclusions include jewellery, fuel, cash withdrawal, bitcoin, wallet loads, alcohol/wine shops and insurance. Birthday 10X max 10,000; monthly 5X at INR200,000 spend max 10,000; annual milestones at INR1m (+10,000) and INR1.2m+ (+15,000; milestone total cap 15,000).
- Product page confirms family lounge visit allocation, ITC night/dining/spa, Hotel Luxe, golf, concierge, emergency cash, card insurance and Visa service offers. Proposed RuPay exclusive benefits are marked as changeable/proposed.
- Eligibility page lists gross income INR2.5m or deposit INR1m; base credit limit INR200,000. Age governed by extant policy/SOP, but card-specific numeric ages are not published there. Removed unsupported launch date; retain no credit-score cutoff absent product-specific evidence.
# Union Unicorn RuPay Credit Card review — 2026-10-26

Reviewed the current [Union Unicorn product page](https://www.unionbankofindia.bank.in/en/details/union-unicorn-credit-card), current [MITC v1.4](https://www.unionbankofindia.bank.in/pdf/mitc-credit-cards.pdf), and card-specific [eligibility page](https://unioncards.unionbankofindia.bank.in/HTML/ADB_UNICORN_ELIGIBILITY.html). MITC v1.4 and extracted text are archived in `unicorn/`.

- Fees: INR2,400 joining and annual fees (primary/add-on); joining fee waived at INR100,000 within 90 days; annual waived at INR300,000 usage in preceding 12 months; 3% forex, 3% monthly finance and 3%/INR500 cash advance.
- Rewards: 4 points/INR100 valued at INR0.25, 10,000 monthly base-point cap, exclusions and 5X birthday/monthly offers; INR4,000 activation offer within 30 days and 2,000-point milestone at each INR100,000 through INR500,000 (total milestone cap 10,000). Public product page calls rewards structure proposed; current MITC lists offers, so that wording conflict is documented.
- Updated current MMT, Aromas Spa, Myntra, BigBasket, Nykaa, BookMyShow, Swiggy One and OTT offers. Current page/MITC confirm 8 domestic plus 2 international lounge visits, RuPay domestic lounge access, and INR1m accident/disability cover.
- Eligibility page states minimum gross annual income INR5 lakh; age/score not numerically stated on card-specific page. Removed unsupported launch date.
# Union Bank RuPay Select review — 2026-10-26

Reviewed the current [RuPay Select card page](https://www.unionbankofindia.bank.in/en/details/rupay-select-credit-card), current [MITC v1.4](https://www.unionbankofindia.bank.in/pdf/mitc-credit-cards.pdf), and card-specific [legacy eligibility page](https://unioncards.unionbankofindia.bank.in/HTML/ADB_RUPAY_SEL_CCR_ELIGIBILITY.html). Archived MITC v1.4 under `rupay-select/`.

- Current card page confirms 4 points/INR100 at INR0.25 each, no points for cash withdrawals, 2 domestic visits/quarter, 2 international/year, 1% fuel waiver up to INR100/month, and accident cover INR1m NPCI-funded plus additional INR3m cardholder-funded.
- Current MITC confirms NIL joining fee, INR550 primary annual / INR450 add-on, annual fee waived at INR50,000 previous 12-month usage, 3% forex, 3% monthly finance, and 3%/INR500 cash advance.
- Removed unsupported launch date, realized INR0.18 value, rent MCC 6513 and unverified fuel transaction thresholds. Full reward MCC exclusions remain unpublished in current card-specific page.
- Eligibility conflict: legacy card-specific portal says INR7.5 lakh annual income with different age bands; general FY2024-25 policy states INR2.5 lakh net income and age 18-65 salaried /18-70 others. The current FY2025-26 policy appears in the issuer policy list but was not retrievable, so numeric eligibility remains unresolved.

# Union UNI-CARBON review - 2026-10-26

Reviewed the current [Union Bank UNI-CARBON page](https://www.unionbankofindia.bank.in/en/details/union-uni-carbon-credit-card) and current [MITC v1.4](https://unioncards.unionbankofindia.bank.in/abcc/English-MITC.pdf); MITC PDF and extracted text are archived under `uni-carbon/`. The bank's current card page confirms the 2021 launch date; its official historical [launch announcement](https://www.unionbankofindia.bank.in/pdf/ubi-launches.pdf) is also indexed online, but direct retrieval returned 404 during this review.

- Confirmed primary joining INR499, annual INR550, INR100,000 annual waiver, 3% forex, 3% monthly finance and 3%/INR500 cash advance.
- Updated rewards to 2 points/INR100 non-fuel (INR0.25/point) and 16 points/INR100 at HPCL on transactions INR500+, capped at 600 points/INR150 per billing cycle. Current page also lists 1.5% HP Pay points and annual spend milestones.
- Confirmed welcome bill credit, 1% HPCL fuel surcharge waiver (INR200+ txn, INR100 monthly cap), UPI linkage, and two INR1m accident covers with different premium payers.
- Full MCC exclusions and current card-specific age/income/score criteria are not published on the reviewed card page.
