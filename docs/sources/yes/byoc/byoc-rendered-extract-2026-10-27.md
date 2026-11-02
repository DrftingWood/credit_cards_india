# YES BANK BYOC — issuer evidence comparison (2026-10-27)

## Sources reviewed

- Current product listing: <https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards> — JavaScript-rendered issuer page; current search extraction lists BYOC monthly starting fees and customization options.
- BYOC product page: <https://www.yes.bank.in/personal-banking/yes-individual/cards/credit-cards/byoc-credit-card> — current route returns a JavaScript-only shell to text retrieval.
- Consolidated YES BANK MITC, version V18 dated 05-Oct-2026: <https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONTAA57595B2EF245259C4C623B1F7D33B3/native/ybl_mitc_pdf.pdf?download=false>.
- YES BANK domestic lounge schedule: <https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONT23CDBE6F27E4444AA0A336DDB2885343/native/ybl_yes_bank_domestic_lounge_access.pdf?download=false>.
- BYOC-specific MITC indexed at <https://www.yes.bank.in/content/published/api/v1.1/assets/CONTE8D52EF526B44370B731A2D4237736CE/native/yesbank_byoc_mitc.pdf?channelToken=21f7ccfa2fc3401091938f541a6f8f2a&download=false> (the direct route now returns a 404/JS shell).
- BYOC rewards/cashback value chart: <https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONT89CEDEF284214A4FA42DCEB307974C7F/native/value_chart_byoc_pdf.pdf?channelToken=21f7ccfa2fc3401091938f541a6f8f2a&download=false>.

The current MITC was read through the issuer-document browser extraction. Direct terminal downloads of YES BANK PDFs timed out; no local PDF copy is claimed. The current BYOC product route is likewise available as extracted issuer text/search output but not a locally archived HTML page.

## Field-by-field findings

| Field | Prior record | Current evidence | Disposition |
|---|---|---|---|
| Network / tier | Mastercard / Platinum | Current BYOC listing describes choice of reward mode, image, material and subscription plan but does not explicitly identify selected network or a network tier. Older BYOC value chart refers to Mastercard golf but does not prove all issued BYOC cards use Mastercard. | Clear network and tier as unverified |
| Launch date | 2022-01-01 | No current issuer launch-date source found | Clear date |
| Fee model | INR249 joining + annual, plus module fee in notes | Current listing labels INR49 as a monthly starting price. MITC v18: regular card one-time fee nil; eco-friendly INR249; metal INR3,499. Monthly module fee: Cashback INR99; Rewards INR49. Optional merchant subscription: Silver INR99, Gold INR149, Platinum INR249/month, all plus GST. | Set standard plastic joining/annual fields to zero; explain monthly fees because schema has no recurring-fee field |
| Interest / cash advance / forex | 3.99% monthly, 2.5% min INR500, 3.5% forex | MITC v18: 3.99% monthly for regular cards; cash advance effective 15-Jun-2026 is 2.5% or INR650 minimum; BYOC forex markup 3.5% | Update cash minimum; retain APR/forex |
| Cashback module base | 1%/INR100; value 1.0 | BYOC-specific issuer terms and value chart describe 1% cashback on retail spend, excluding fuel, utility, wallet and rent. Current common MITC v18 caps BYOC Cashback at INR1,000 per statement cycle and confirms no cashback on utility/wallet. | Keep 1% cashback and ₹1,000 cycle cap; record module selection and exclusions |
| Optional selected merchants | 10% selected merchants; old INR1,000 cycle cap | MITC v18: optional Silver/Gold/Platinum subscriptions select 2/3/5 from Swiggy, Uber, PharmEasy, Bigbasket and BookMyShow. 10% of net transaction value, up to INR100/customer/merchant/statement cycle, up to INR500 total per statement cycle and up to twice the selected subscription fee. | Correct plan count, per-merchant and total caps |
| Alternative Rewards module | Not represented | MITC v18 fee table: INR49 monthly module fee; issuer terms/value chart: 8 Reward Points per INR200 except fuel; utility reward points capped at 600 per statement cycle. | Document alternative but do not mix point earn with cashback in a single-currency record |
| Redemption | INR1 per unit | Cashback is credited to card account. Alternative Reward Points have minimum redemption/request fee per general MITC and value chart says up to INR0.25 per point; the current record models cashback mode only. | Keep 1:1 cash value for cashback; document rewards-mode distinction |
| Lounge | Four visits per year, Mastercard/DreamFolks, no spend gate | Current YES lounge list: one domestic visit per quarter for BYOC primary cardholder. MITC v18 imposes INR50,000 eligible spend in previous quarter for subsequent-quarter complimentary access; excludes fees, reversals/cancellations, rent and wallet. | Update to 1/quarter with spend gate; remove unverified access mechanism |
| Fuel surcharge | 1%, INR400–5,000, uncapped | MITC v18 effective 15-Jun-2026: eligible transaction INR500–3,000, up to INR125 per statement cycle for BYOC | Correct range and cap |
| Mastercard golf / ET Prime | Golf not represented; ET Prime membership listed | Golf appears on older issuer value chart only; ET Prime has no current BYOC-specific confirmation | Do not add unconfirmed golf; remove unsupported ET Prime |
| Eligibility | Age/income/score/residency all unknown, resident-indian set | BYOC-specific numeric cutoffs were not published in current sources. General YES BANK eligibility text is generic and not treated as a BYOC cutoff or residency rule. | Leave age, income, credit-score and residency unknown |

## Schema and source limitations

- BYOC is customizable. One YAML record cannot represent distinct Rewards versus Cashback modules, optional merchant subscriptions, card-material fees, and corresponding reward currencies simultaneously. This entry models the Cashback module and describes the Rewards module as an alternative in notes.
- Schema has no monthly membership-fee field. Monthly module/subscription charges are explicit in fee notes; annual fee fields represent no yearly fee, not an absence of monthly fees.
- The current card page is JavaScript-rendered and the BYOC product-specific document URL is no longer directly retrievable. Current common MITC v18 and issuer search/document extraction support the modeled rates, caps, lounges and charges; this comparison preserves the retrieval limitation.
- The current issuer page does not establish network or network tier; both structured fields are null.

Updated record: `data/cards/yes/byoc.yaml`.
