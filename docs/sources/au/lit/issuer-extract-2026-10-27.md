# AU LIT issuer comparison (27 Oct 2026)

## Sources reviewed

- [Current AU LIT product page](https://www.au.bank.in/personal-banking/credit-cards/lit-credit-card) and its linked feature details.
- [Current AU LIT features page](https://www.au.bank.in/personal-banking/credit-cards/lit-credit-card/features).
- [AU LIT card terms](https://www.au.bank.in/lit-terms-and-conditions), including Reward Points, feature conditions, fuel waiver, lounge and category definitions.
- [AU Schedule of Charges / KFS](https://www.au.bank.in/pdf/credit-card/Schedule-of-Charges-CC.pdf).
- [AU Rewardz FAQ](https://www.au.bank.in/personal-banking/credit-cards) for point value.
- [AU LIT Product Guide](https://www.au.bank.in/campaign/lit-product-guide.pdf), used as secondary confirmation; where it differs from current product page and LIT terms, current live terms control.

## Field comparison and changes

- **Network, tier and launch date:** removed the unsupported Visa, Signature and 1 Apr 2022 claims. Current issuer materials reviewed do not publish those facts. Unknowns remain null.
- **Fees:** current issuer page calls the base card lifetime free. Schedule of Charges confirms lifetime-free status, cash advance fee 2.5% or INR 500 minimum, general forex markup 3.49%, and monthly finance charge 3.75%. Feature fees are separately charged and may incur GST. LIT cash withdrawal limit is 20% of the credit limit in the KFS; no matching structured field exists in this card record.
- **Base rewards:** 1 Reward Point per INR 100 eligible retail spend. Utility and telecom earn base points, capped at 100 points per transaction. Issuer terms exclude fuel, rent, cash withdrawal, BBPS, EMI and education/government services. Wallet loads were removed from structured exclusions because current card-specific terms reviewed do not support that claim. No universal exact MCC list is encoded for these exclusions.
- **Paid reward boost:** 5X or 10X is an optional, paid feature selected separately for online and/or offline retail; the base point is included in the multiplier. Total earning is capped at 10,000 points per statement cycle. Features generally run 90 days and auto-renew unless disabled. The current product page says renewal can be disabled after seven days. Calculator inputs cannot represent selected channel, price, activation dates or renewal state.
- **Point value:** AU Rewardz FAQ gives 0.25 paise per point for catalogue and most categories, but 0.20 paise for e-vouchers. The YAML point value is catalogue value only; it must not be applied to e-vouchers.
- **Cashback:** current features page and card terms state optional 5% grocery and apparel cashback capped at INR 500 per category for each 30-day feature period. Milestone choices are 5% with INR 10,000 minimum eligible retail spend and INR 500 cap per 30 days, or 2% with INR 15,000 minimum and INR 1,000 cap per 30 days. These are paid feature benefits and not base-card cashback. The older product guide has conflicting category-cap text; current product page and card terms agree on INR 500, retained in YAML.
- **Fuel:** standard LIT has no fuel waiver in the Schedule of Charges. Opting into the paid feature gives 1% on transactions from INR 400 to INR 5,000, capped at INR 1,500 per 90-day feature period. Existing record models this only as an optional benefit.
- **Lounge:** up to two domestic visits per 90-day feature period are available through a paid feature, cardholder only. The base card does not automatically include this. Schema cycle values do not encode a 90-day period exactly; YAML retains the nearest quarterly cycle with the exact 90-day condition in notes.
- **Eligibility:** current product page says resident Indian; salaried age 21–60, self-employed 25–65, add-on cardholders over 18. Criteria are indicative and approval remains at the bank's discretion. Income and score thresholds are unpublished.
- **Other optional items:** current issuer page confirms ZEE5 and Amazon Prime three-month memberships, spend conditions/penalties, and the INR 200 Amazon Pay e-gift voucher after INR 10,000 spend in 30 days (feature fee INR 50). Cashback posts five days after the 30-day period. Card-liability marketing says zero liability after loss reporting up to INR 1.5 lakh or the card limit, whichever is lower, and mentions counterfeit/skimming and online fraud protection; detailed coverage conditions remain outside the structured record.

## Remaining limitations

The issuer's feature pricing can be surfaced in-app and can change; the calculator cannot model selected feature prices or auto-renewal. The schema cannot exactly express 90-day lounge/cashback periods or all MCC exclusions. Network, tier, launch date, cash-advance limit and detailed insurance coverage are not fully represented as verified structured facts. This review does not establish factual accuracy for other cards in the library.
