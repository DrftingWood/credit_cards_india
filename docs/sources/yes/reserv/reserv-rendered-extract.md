# YES Bank RESERV: issuer evidence extract

Reviewed: 2026-10-26  
Current issuer listing: <https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards>  
Current indexed Reserv product/terms page (NRI route contains common product details): <https://pri1.yes.bank.in/personal-banking/nri/credit-cards/reserv-credit-card>  
Current consolidated MITC v18: <https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false>  
Official Reserv value chart (Nov-2023; legacy evidence): <https://www.yes.bank.in/content/published/api/v1.1/assets/CONT4EAD59EF49CE4B8EADB3234B1D9AF541/native/yesbank_credit_card_reserv_value_chart_nov23.pdf?channelToken=21f7ccfa2fc3401091938f541a6f8f2a&download=false>

## Status, fees and charges

- Current YES Bank card listing identifies Reserv and shows joining/renewal fees ?2,499, first-month ?40,000 waiver, online earning 24 points/?200, three domestic lounge visits quarterly, six international visits yearly and 25% BookMyShow discount. This listing remains available, so record status stays `active`.
- Current MITC v18 identifies Reserv as formerly YES First Exclusive. The existing network `Mastercard`, tier `World`, and exact launch date could not be established from current reviewed evidence; removed those assertions. Issuer listing confirms network variants collectively but not a single scalar network.
- Current issuer-indexed Reserv page confirms ?2,499 + tax joining/renewal fee; ?40,000 eligible retail spend within 30 days waives joining fee; ?300,000 retail spend in the 12 months before renewal waives annual fee.
- Current MITC v18 sets standard Reserv revolving APR at 2.99% monthly / 35.88% annual, cash advance at 2.5% or ?650 minimum (effective 15-Jun-2026), forex markup at 2.00% from 15-Jun-2026, and DCC at 1%. Older card-specific indexed MITC text stated a ?500 cash-advance minimum; v18 is followed.

## Rewards and redemptions

- Issuer product text: 24 YES Rewardz/?200 online shopping except Select categories; 12/?200 offline shopping except Select categories; 6/?200 on Select categories; overall maximum 36,000 points per statement cycle.
- Current issuer terms specify a 750-point per-statement cap for utility MCC 4900. Remaining Select MCC mappings were not reliably extractable from current page view and are not fabricated into the YAML.
- Effective 15-Jun-2026 exclusions: rent, wallet, fuel, UPI, government, marketing/advertising, cash withdrawals, post-purchase / on-call / instant EMI, insurance, education, railways, toll, ferry and jewellery.
- Official value chart says value is ?up to? ?0.25 per point. This is only illustrative; realized value depends on redemption channel and remains null.
- Current MITC v18 waives the normal ?100 + GST reward redemption fee for Reserv. It sets the standard point expiry at three years; no product-specific override was found. Flight redemption convenience fee in the generic MITC is ?99 + GST. Current terms supersede older generic-MITC text that did not include the Reserv fee exception.

## Benefits

- Domestic airport lounge quota: three visits per quarter, subject to ?100,000 eligible spend in the previous quarter per current MITC v18. Excludes fee payments, reversals/cancellations, rent and wallet for the spend gate.
- International airport lounge access: six visits per year per current card listing and legacy issuer value chart; MITC states no spend threshold applies to international access. Public page does not make guest-sharing conditions clear, so those are left unknown.
- Fuel surcharge waiver: 1% for transactions from ?500 to ?4,000, up to ?500 per statement cycle. GST on surcharge is not reversed; current MITC says UPI fuel transactions are not eligible.
- Current listing advertises 25% BookMyShow movie discount. Official Nov-2023 value chart gives older detailed condition of ?1,000 monthly spend and ?250 monthly maximum; current full booking terms were not independently visible, so limits are provisional in YAML notes.
- Old official chart mentions purchase protection on online-purchased mobile/electronic devices for six months and golf green-fee waiver. Current eligibility/limits were not established in reviewed current material; these remain unasserted.

## Capture limits and evidence quality

- Current card listing and MITC PDF were inspected via web search/open. The card detail page is JavaScript-rendered; accessible indexed issuer text was used for common product details.
- Current generic MITC v18 was copied from the verified YES archive and passed a `%PDF-` signature check. It is the authoritative current common-terms source.
- Official Reserv value-chart direct download returned the YES Bank session JavaScript shell; indexed PDF contents were available from issuer search result/open, but the failed shell was not archived as a PDF. It is dated Nov-2023 and used only for legacy product details that the current listing does not spell out.
- No independent card-level fact accuracy score is claimed; unpublished terms remain unknown.
