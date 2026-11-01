# Axis Miles & More issuer evidence extract (2026-10-26)

This note captures current issuer web-page facts and reconciliation decisions. PDF copies of the cited issuer documents are archived in this directory; this markdown file is a manual web-content capture, not an issuer PDF.

## Primary sources reviewed

- Current product page: <https://www.axis.bank.in/cards/credit-card/miles-more-credit-card>
- World launch release (11-Jun-2013): <https://www.axis.bank.in/docs/default-source/default-document-library/press-release/2013/june/axis-bank-lufthansa-miles-more-launch-co-branded-credit-card.pdf?sfvrsn=12>
- World variant terms (revision effective 20-Apr-2024): <https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/terms-and-conditions-mmi-world-credit-card.pdf?sfvrsn=5637911b_2>
- Reward-category changes (effective 20-Jun-2025): <https://www.axis.bank.in/docs/default-source/default-document-library/credit-cards/terms-and-conditions-mmi-world-select-credit-card.pdf?sfvrsn=c6ec22fd_3>
- World award-mile / non-expiry terms: <https://www.axis.bank.in/docs/default-source/default-document-library/tnc-milesfaaa9ab9be576bf08df9ff00000b8c1c.pdf?sfvrsn=3750cfa5_2>
- Current MITC: <https://www.axis.bank.in/docs/default-source/default-document-library/mitc-credit-cards.pdf?sfvrsn=aba4dce4_32>
- 28-Aug-2026 World Select terms: <https://campaign.axis.bank.in/generic/terms-and-conditions-world-select.pdf>

## World variant facts encoded

- The original Axis/Miles & More launch announcement dates the card to 11-Jun-2013, identifies Mastercard, and says the two variants are World and World Select. This YAML models World (`network: mastercard`, `network_tier: world`).
- Current card comparison says World earns 4 Award Miles per INR200 of eligible spend, receives 5,000 welcome miles on first transaction and receives an annual renewal bonus of 3,000 miles. World Select values differ and are not applied to this record.
- The product page lists INR3,500 joining and annual fees for World, 3.5% foreign-currency fee, and 3.5% DCC plus taxes. It waives joining/annual fees for HON Circle and Senator status members. The page says 3.7% monthly finance charge; current MITC lists 3.75% monthly, so YAML follows 3.75% and preserves the conflict in fee notes.
- World domestic Mastercard lounge allowance is 4 visits per quarter. World terms require INR50,000 spend during the preceding three calendar months; the threshold is waived for the month of issuance and the following three calendar months. Priority Pass allowance is 2 visits per card membership year for the primary cardholder; guests are chargeable.
- World age criterion is 18-70 for primary applicants and 18+ for add-on applicants. Axis lists both resident Indian and NRI applicants, and publishes no card-specific income or bureau-score threshold in the current page.
- Eligible-spend exclusions include fuel, wallet, rent, utilities/telecom, government, insurance, gold/jewellery, gift cards, cash advances, tolls/road fees and repayments; also reversals, fraud, fee payments, cash withdrawals, interest and EMI. The 20-Jun-2025 terms replaced the MCC-based category identification with transaction-category identification. The old 2024 MCC table is retained only as historical support for the spend-threshold and lounge rules, not as the current reward exclusion mechanism.
- Miles & More redemption has no fixed Axis-published INR value. The previous guessed values of INR0.80 best-case and INR0.50 realized were cleared. Non-expiry requires at least three months as a cardholder and at least one eligible miles purchase each month; the page additionally requires first transaction within 30 days of issuance. Expiry can reactivate when terms fail, an account is cancelled or outstanding is unpaid.
- The current product page describes baggage-loss, air-accident, lost-card and credit-shield coverage but does not expose the monetary limits and full conditions reviewed here. No limits are inferred.
- The current product page lists additional transaction fees: rent 1% per transaction; wallet loads 1% at INR10,000 cumulative per statement; fuel 1% at INR50,000 cumulative per statement; third-party education 1% per payment; utilities 1% at INR25,000 cumulative per statement; and online skill gaming 1% at INR10,000 cumulative per statement.
- The 28-Aug-2026 PDF linked from the product page is titled for World Select. Its specific PP domestic-lounge authentication change is not assigned to World without a World-specific notice. The page's current World-specific lounge section is modeled directly.
