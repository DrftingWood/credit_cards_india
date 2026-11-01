# DCB PayLess Select issuer-source review (27 Oct 2026)

Target: `data/cards/dcb/payless-select.yaml`.

## Issuer sources checked

- DCB [September 2025 PayLess MITC](https://www.dcbbank.com/api/dcb/assets/2025-09/DCB-PayLess-Credit-Card-MITC-Multilingual.pdf); archived under `docs/sources/dcb/payless-platinum/` because the single MITC covers Platinum and Select variants. Its Select-specific cashback and lounge rows were checked directly.
- DCB [PayLess FAQ](https://www.dcbbank.com/api/dcb/assets/2024-12/DCB-Bank-Payless-Credit-Credit-Card-FAQs_0.pdf); archived with the shared PayLess issuer documents. FAQ is general across PayLess variants and does not state separate FD minimum by variant.
- Current DCB PayLess product page: <https://www.dcb.bank.in/personal/cards/secured-card/dcb-payless-platinum-card> (the page lists both PayLess variants under secured cards but publishes no detailed Select terms). Current page capture is archived under the shared PayLess source directory.

## Verified corrections

- Fees: nil joining, INR1,000 annual fee from month 13, annual waiver at INR200,000 spend, 3% monthly finance, ATM fee 2.5% or INR250 minimum, 3.5% foreign currency markup, GST, and late fees (nil up to INR100; INR100 above INR100 to INR1,000; INR500 above INR1,000). Card closure fee INR250 when closed within one year is included in source notes because the schema has no closure-charge field.
- Rewards are a cashback milestone rather than Reward Points: INR1,000 after INR100,000 qualifying spend per quarter; credited in the first month of the following quarter. Rent, wallet loads, online gaming, gambling, fuel and cash withdrawals are excluded. No per-transaction base earn or Reward Point value is published.
- Select lounge quota: two participating domestic airport lounge visits per quarter plus one international visit per year (nine total/year). No spend threshold is stated. Platinum's quota is different and has not been copied.
- Fuel surcharge waiver: 1% up to INR100 per statement cycle on eligible fuel transaction amounts up to INR5,000. Current MITC does not specify a minimum transaction value.
- Shared insurance wording confirms complimentary cover for Select and Platinum variants and zero lost-card purchase liability, with fraudulent-purchase protection subject to FIR and policy terms. Coverage type/amount is not stated in the reviewed MITC; the previous INR10 lakh personal-accident claim was removed. Primary cardholder, active status and nomination conditions apply.
- FAQ eligibility: Indian resident, age 18-75, minimum DCB FD INR15,000, no income proof; internal bank assessment applies. FAQ gives general PayLess eligibility and does not state a different FD minimum for Select. Eligible FD must be singly held and excludes listed account/entity types.

## Cleared unsupported claims

Removed 2 Reward Points/INR100, INR0.25 catalog value, INR0.20 cashback redemption value, old MCC reward exclusions, unsupported personal-accident limit and concierge. Corrected finance rate from 2.5% to 3%, ATM minimum INR300 to INR250, and fuel waiver cycle/transaction floor. Removed unsupported 2022-01-01 launch date. Exact minimum fuel amount, card-specific application route, and insurance limits remain unknown.

The September 2025 MITC version date is used as an evidence snapshot; the exact date each term began is not published. Structural validation and evidence coverage are not factual-accuracy scores.
