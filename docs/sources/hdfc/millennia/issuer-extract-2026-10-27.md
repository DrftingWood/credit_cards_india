# HDFC Bank Millennia Credit Card ? issuer comparison (27 Oct 2026)

## Sources checked and archived

- Current HDFC [product page](https://www.hdfc.bank.in/credit-cards/millennia-credit-card), [fees page](https://www.hdfc.bank.in/credit-cards/millennia-credit-card/fees-and-charges), and [eligibility page](https://www.hdfc.bank.in/credit-cards/millennia-credit-card/eligibility), retrieved 27-Oct-2026.
- HDFC card-specific terms linked from the product page at `millennia-tnc-20th-jul26.pdf`. Its cover says published 20-Jul-2026, but its detailed terms pages retain 25-Apr-2025 footers. The new summary terms were read together with the detailed sections; conflicts are not silently resolved.
- Current linked FAQ, lounge milestone terms, quarterly-spend milestone program, and HDFC personal MITC archive. HDFC launch release dated 22-Aug-2019 and the HDFC FD-lien pricing MID listing the Millennia Visa variant are archived. The launch release is archived as `hdfc-millennia-launch-2019-08-22.pdf`.
- General data-quality approach follows the [UK Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-data-quality-framework): accuracy is distinct from validity, completeness, consistency, and timeliness. These are review-method sources, not evidence for card terms.

## Corrections and confirmed terms

- Corrected the launch date to 22-Aug-2019, supported by HDFC's release announcing the Millennia range launch. The old 1-Feb-2020 date had no cited support. Removed `network_tier: platinum`: the issuer sources checked do not specify that tier. Retained Visa as a supported issuance variant based on the archived HDFC pricing MID. The launch release names Mastercard; issuer material therefore indicates network variants over time, and the record does not claim Visa is the only possible network.
- Current fee page confirms INR 1,000 joining/renewal and renewal waiver at INR 1 lakh annual spend. Current Millennia page quotes 3.6% monthly finance; shared HDFC MITC says 3.75%, so the card-page figure remains in the record with the difference documented. Forex 3.5% and cash-advance 2.5%/INR 500 minimum are from HDFC's current shared terms.
- Confirmed 1% cashback (CashPoints) on other eligible spend and 5% on Amazon, BookMyShow, Cult.fit, Flipkart, Myntra, Sony LIV, Swiggy, Tata CLiQ, Uber and Zomato. Base and accelerated categories have separate INR 1,000 calendar-month caps; Uber 5% requires travel/commute MCC 4121. Merchant settlement/TID/MID determine eligibility. Product terms exclude fuel, rent, government spend, cash advances, fees and EMI from reward posting; wallet loads and EMI have been excluded since 1-Sep-2024. Direct school/college site/POS education earns; third-party education-app payments do not.
- Removed the unsupported `over_cap_earns_base: true` assertion: issuer terms say spend beyond the 5% cap is not considered for CashPoints, but do not establish fallback to base earning.
- Confirmed statement redemption at INR 1 per point, 500-point minimum, INR 50 fee, 3,000-point monthly cap; SmartBuy flight/hotel/catalogue value INR 0.30, flight/hotel 50% booking cap and 50,000 points/month; up to 70% of selected catalogue/voucher value; two-year expiry; INR 99 plus tax catalogue redemption fee.
- Quarterly milestone is INR 1 lakh net spend (spends less reversals); EMI principal counts, SmartEMI/Dial-an-EMI does not. Current offer is choice of INR 1,000 brand voucher or HOI lounge voucher. Complimentary direct lounge swipes ended 1-Dec-2023. Welcome 1,000 CashPoints require paid joining membership fee; no points are given for renewal fee. Fuel waiver is 1% on INR 400?5,000 transactions, capped at INR 250 per statement cycle.
- Eligibility: current product page and eligibility FAQ agree on Indian national, age 21?40, salaried net monthly income above INR 35,000, and self-employed ITR above INR 6 lakh/year. The eligibility page's headline conflicts (salaried age to 60 and gross monthly income > INR 25,000; self-employed age to 65 and INR 26 lakh/year). The structured record follows the current card page and the same page's New-card FAQ; disagreement remains visible in notes.

## Unresolved issuer conflicts and modeling limits

- Gift/prepaid/voucher treatment is internally inconsistent. The Jul-2026 summary table classifies such purchases under 1% other spend, while detailed sections and prior FAQ language differ on eligibility; MCC 6540 is variously excluded from 5%, eligible under 1%, or named as wallet-load MCC. The record does not apply MCC 6540 as a blanket exclusion. Wallet loads are excluded per the current summary; gift/voucher rewards remain unresolved.
- Terms do not say whether spending above the accelerated cap earns 1% base cashback. The record no longer asserts that it does.
- Exact effective dates for current fee, reward, and benefit values are not published in the checked sources. The required schema `effective_from` uses the supported product launch date as a row anchor and must not be read as proof that these current terms were active since launch.
- The annualized salaried field (INR 420,000) represents a monthly net threshold above INR 35,000; it is a schema approximation, not the actual monthly underwriting rule.

## Accuracy boundary

This is one record-level comparison, not a database-wide factual accuracy score. Schema validation, source dates, and numeric evidence-path coverage do not prove every value elsewhere in the database.
