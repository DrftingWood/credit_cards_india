# Bandhan Bank Lumina issuer review (2026-10-25)

This archive formalizes the issuer checks and field mappings already recorded in `data/cards/bandhan/lumina.yaml`. The product/fee pages, 19-Aug-2026 MITC and Delights portal were recorded as checked on 2026-10-25. They were not reopened under the one-month freshness rule.

## Recorded issuer evidence

- **Fees:** INR 9,999 joining/annual fee; renewal waiver at INR 1,200,000 eligible spend; 1% forex; no cash-withdrawal fee. Finance rates vary by customer relationship: 1.5% monthly for existing-to-bank customers with CASA and 3.5% for new-to-bank customers. The YAML stores the new-to-bank rate and notes the difference.
- **Rewards:** 16 points per INR 200 base; 24 points per INR 200 internationally (1.5X) with 5,000 bonus-point monthly cap. The Delights portal showed INR 100 Flipkart SuperCoins for 400 points, but the card page's value chart implies differing values; INR 0.25 remains provisional, not a guaranteed universal rate.
- **Benefits:** INR 10,000 Oberoi voucher after paying the joining fee and spending INR 20,000 within 30 days; 10,000 points on INR 100,000 monthly spend; eight domestic lounge visits per quarter and unlimited international visits at select airports; golf, dining, movie and meet-and-greet benefits. Only primary cardholders receive complimentary lounge access per the MITC. The product-page value chart states a INR 1,000 fuel-waiver cap, while the August MITC states INR 500 per statement cycle; the YAML conservatively retains INR 500 pending clarification.
- **Eligibility:** resident in India, age 21-65 and indicative income above INR 18 lakh. Income period/basis and credit-score cutoff are unpublished.

## Scope and open points

This is a record of the recent issuer review, not a new verification pass. The YAML source mappings identify the reviewed fields. The fuel-cap conflict, point-value inconsistency, guest access, network-dependent treatment and eligibility basis remain limitations. See `data/cards/bandhan/lumina.yaml` for the complete record.
