# BOI RuPay Select credit card source review — 2026-10-26

## Official sources checked

- Current BOI RuPay Select page: <https://bankofindia.bank.in/credit-card/rupay-select>. Search-indexed page text was available on 2026-10-26; direct retrieval through the web and shell clients returned HTTP 403. The source is primary but could not be archived as HTML in this session.
- BOI Star Rewards page: <https://bankofindia.bank.in/star-rewards>. Search-indexed text was available on 2026-10-26; direct retrieval returned HTTP 403.
- BOI credit-card MITC / schedule, indexed by the official bank site: <https://bankofindia.bank.in/documents/20121/23409404/BOI_CREDITCARD_MITC.pdf>. Direct retrieval returned HTTP 403. Its indexed schedule identifies RuPay Select fees; the copy locally archived from the prior review is the card brochure `Rupay_Select.pdf`, not this MITC.
- Local BOI RuPay Select brochure: `Rupay_Select.pdf`. Its fee/benefit text is captured below where it agrees with the current page. It is not treated as current evidence where the current issuer page differs.
- BOI general credit-card page and FAQ: <https://bankofindia.bank.in/credit-card> (official, indexed text).
- RuPay Select Credit Card lounge program T&C: <https://www.rupay.co.in/PDF/rupay/Lounge_tnc.pdf>.

## Current issuer statements and applied corrections

- BOI product page names the product RuPay Select, confirming network and tier. No precise launch date is published in reviewed materials; removed the seeded 2023-01-01 date.
- Current page lists issuance fee Nil; principal AMC INR800; add-on AMC INR600; replacement fee INR500. The principal joining/annual fields use Nil/INR800.
- Indexed official MITC schedule says cash advance fee is BOI ATM 2% (minimum INR50), other Indian ATM 2.5% (minimum INR75), and overseas ATM 2.5% (minimum INR125), plus currency conversion charges. The structured scalar stores the common other-Indian-ATM fee and notes the channel-specific variants.
- Finance charge sources conflict by scenario: official MITC indexed text says unsecured revolving credit 2.00% monthly, default service charge 3% monthly; BOI general card FAQ says revolving-credit opt-in 1.70% monthly on the outstanding 90%, and a 2.5% monthly charge if the entire amount is overdue. Since the current card page does not define the applicable RuPay Select rate, the card's scalar monthly finance field is left null and the conflict recorded.
- Current card page does not publish a RuPay Select foreign-currency markup. Removed seeded 3.5% and left forex markup null.
- Current Star Rewards page states standard-category accrual of 2 points per INR100 and preferred-category accrual of 3 per INR100, on transactions INR100 or above. It separately lists a 3-points-per-INR100 “Card-wise Bonus” for RuPay Select and Visa Platinum. The page does not list the preferred merchant categories or explain how the card-wise bonus combines with category points; only the standard 2/INR100 rate is encoded, to avoid overstatement.
- BOI product page advertises 2X loyalty points on POS/e-commerce, using the same 2-points-per-INR100 standard rate as the rewards page. The product page says “excluding restricted categories,” while Star Rewards says that from 2025-09-01 all POS/e-commerce exclusions were removed. No reward MCC exclusions or category exclusions are encoded. The Star Rewards page separately says UPI credit transactions of INR2,000 or less do not accrue points from 2025-09-01, and caps total accrual at 10,000 points per month per customer ID/CIF.
- BOI has not published a fixed current INR value for a Star Rewardz point in the reviewed materials. Removed seeded INR0.25 face value and INR0.18 realized value; catalog redemption remains with value null. Current redemption page describes merchandise, tickets, gift vouchers, mobile and DTH recharge through the BOI Star Rewardz catalog.
- Current card page states domestic lounge access twice per quarter and international twice per calendar year, subject to RuPay changes; RuPay Select Credit Card terms match those quotas. No BOI credit-card spend threshold is listed. A separate BOI RuPay Select **debit** card page has a spend gate; it has not been copied into this credit-card record.
- Current product page confirms INR200 monthly BigBasket voucher, INR250 off minimum two BookMyShow tickets per month, annual Amazon Prime, three-month Swiggy One membership per annum, once-per-year health check-up, up to INR10 lakh RuPay personal-accident/permanent-disability insurance, and 24x7 concierge.
- Current BOI page eligibility says age 21 minimum; valid active BOI savings account; regular income proof; salaried or self-employed; good credit history; resident Indians or NRIs. Numeric income/score cutoffs and maximum age are not published. Archived brochure says minimum age 18; the current web product page says 21 and is followed for the record.
- No current issuer source found for the seeded fuel surcharge waiver amounts; removed that benefit. Removed the unsupported MCC 6513 exclusion.

## Current-record limitations

The bank's 2024 MITC is still indexed on BOI's official site, but direct retrieval was blocked during this review. Current BOI product and Star Rewards page text was available through the web search index and is linked above. Reward category mapping/bonus stacking, point redemption value, card-specific foreign markup, card-specific finance charge scenario, and fuel-surcharge waiver are left unresolved or unknown rather than inferred. The formal data-quality basis is documented in `docs/DATABASE_ACCURACY_OVERVIEW_2026-10-26.md`; evidence coverage is not a factual-accuracy percentage.
