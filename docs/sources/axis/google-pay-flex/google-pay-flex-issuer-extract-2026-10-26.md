# Google Pay Flex Axis Bank Credit Card — issuer evidence extract

Reviewed 2026-10-26. This is a field summary of the current Axis product page and linked terms, not an independent claim that every transaction will qualify.

## Sources archived

- Current [Axis product page](https://www.axis.bank.in/cards/credit-card/google-pay-flex-axis-bank-credit-card), checked 2026-10-26.
- Current [Google Pay Flex card terms](https://www.axis.bank.in/docs/default-source/default-document-library/credit-card/terms-and-conditions-for-google-pay-flex-axis-bank-credit-card.pdf), downloaded as `terms-and-conditions-google-pay-flex-retrieved-2026-10-26.pdf`.
- [Reward structure terms](https://www.axis.bank.in/docs/default-source/default-document-library/upgraded-reward-structure-for-google-pay-flex.pdf) effective 2026-10-16 through 2027-10-15, archived as `google-pay-flex-upgraded-reward-structure-effective-2026-10-16.pdf`.
- [Axis Bankwide terms update](https://campaign.axis.bank.in/generic/terms-and-conditions-generic-all.pdf) effective 2026-08-28, archived as `axis-credit-card-terms-update-effective-2026-08-28.pdf`.
- Current Axis MITC, downloaded from the product page's linked issuer MITC as `../_shared/mitc-credit-cards-retrieved-2026-10-26.pdf`.
- Historical card-specific terms previously archived as `terms-and-conditions-for-google-pay-flex-axis-bank-credit-card.pdf`; retained for comparison.

## Evidence mapped to database fields

- **Identity:** Axis launch release dated 2025-12-17 establishes RuPay. It does not establish a RuPay tier, so `network_tier` is null. Product is active and applied for inside Google Pay.
- **Fees:** Product page says joining and annual fees are waived, finance charge 3.75% monthly, foreign currency fee 3.50%, DCC markup 3.5%, rent fee 1% per transaction, and payment-reversal fee 2% (minimum INR 500). Current MITC gives cash withdrawal at 2.5% (minimum INR 500). The page gives late-fee slabs: nil through INR 500, INR 500 for INR 501–5,000, INR 750 for INR 5,001–10,000, INR 1,200 for INR 10,001–50,000, and INR 1,300 at INR 50,000 and above. The bankwide 28-Aug-2026 notice describes the top slab as INR 50,000 and above in prose but greater than INR 50,000 in its table; the product-page slab also overlaps at exactly INR 50,000. The database records INR 1,200 through INR 50,000 and INR 1,300 above it following the notice table and flags the boundary ambiguity.
- **Base rewards:** Current card terms: 1 Star per cumulative INR 500 of eligible spend, with each Star worth INR 1. Stars are credited on an ongoing basis during the cycle. Reward cycle is the 16th through 15th. Refunds, reversals and EMI conversions can reverse or alter Stars as set out in the terms.
- **Accelerator:** The first reward cycle earns 2 Stars per cumulative INR 500. Later cycles earn 2 per INR 500 if prior-cycle net eligible spend is at least INR 100; otherwise the rate is 1 per INR 500. The total maximum is 1,500 Stars per reward cycle, of which at most 750 are awarded by Axis. Stars expire after one year.
- **Exclusions:** Current card terms exclude rent, cash withdrawals, financial-institution payments, insurance premiums, education, government payments/fees, card fees/charges, wallet spends, clock/jewellery/watch/silverware stores, gift cards, bridge fees, road fees and tolls. The product page explicitly says fuel is eligible. The previous YAML MCC 6513 exclusion and fuel exclusion were unsupported and removed.
- **Redemption:** Google Pay controls redemption modes. Current issuer page says Stars can be redeemed while making a UPI payment using this card on Google Pay; the database does not treat them as unrestricted bank cashback.
- **Promotions:** The 16-Oct-2026 to 15-Oct-2027 reward structure gives 3.2% in Stars to qualifying Google One members and 1.6% to non-members on eligible-cycle spend after crossing INR 15,000, with all eligible spend in the cycle counted. Google Pay also awards up to INR 450 Stars for INR 3,000 bills/OTT/recharges and up to INR 250 Stars for INR 5,000 UPI spend at eligible food/grocery apps, once per reward cycle. Promo terms, prior-cycle activity and the aggregate cap apply. These temporary Google Pay rewards are captured under benefits, separate from Axis base earn.
- **Welcome:** Current product page lists INR 1,750 in Stars plus an INR 250 Google Pay gift card, subject to Google Pay offers, with first-cycle spend terms. This supersedes the previous July page snapshot of INR 250 Stars plus INR 250 gift card; the value is not stored as guaranteed because availability is offer-dependent.
- **Eligibility:** Product page states age 18–70 and resident in India, with indicative criteria and issuer approval discretion. It publishes no numeric income or credit-score cutoff.

## Open interpretation notes

- The product page’s late-payment table and the bankwide Aug-2026 notice disagree at exactly INR 50,000. The encoded boundary follows the notice table; retain the conflict until Axis clarifies it.
- The newer page's welcome headline is offer-dependent; availability and qualifying audience may vary in Google Pay.
- Marketing page headline, campaign schedule and detailed terms may be updated independently. Recheck before relying on campaign rates beyond their published end date.
