# South Indian Bank SBI Platinum issuer evidence (reviewed 2026-10-27)

## Sources

- [Current card page](https://www.sbicard.com/en/personal/credit-cards/south-india-bank-sbi-platinum-card.html), retrieved 2026-10-27. The live page currently renders the SBI Card shell but no card-specific benefit text. An HTML copy is stored beside this memo.
- [Current SBI Card Most Important Terms and Conditions](https://www.sbicard.com/en/most-important-terms-and-conditions.page), retrieved 2026-10-27. An HTML copy is stored beside this memo.
- Archived undated South Indian Bank SBI Platinum brochure at `sib-platinum-brochure.pdf`. Preserved as historical card-specific evidence; it does not establish that all marketing benefits remain current.

## Field comparison

| Field | Previous YAML | Evidence and disposition |
|---|---|---|
| Name / partner | South Indian Bank SBI Platinum, SBI Card co-brand | Current SBI Card MITC lists ?South Indian Bank SBI Platinum Credit Card?; retained. |
| Network / tier | Visa / Platinum | Historical brochure presents Visa Platinum privileges. Current card-specific issuance/network confirmation was not exposed on the live page; retain as historical/medium-confidence evidence and recheck when a current product schedule becomes available. |
| Launch date | 2020-01-01 | No issuer launch date found; cleared. |
| Joining/renewal fees | INR2,999 each | Current SBI Card MITC table explicitly lists INR2,999 joining and renewal fees, no waiver. Retained. |
| Fee waiver | none | Current MITC does not show a spend waiver for this row; retained null. INR2L in the archived brochure is an Anniversary Gift trigger, not fee waiver. |
| APR | 3.5% monthly | Current card-specific APR was not exposed; cleared rather than carry forward an unverified rate. |
| Base points | 2 points/INR100 | Archived brochure states this rate for all other categories; current page exposes no current reward schedule. Retained as dated/historical evidence, not independently confirmed current. |
| Accelerated points | 5X dining, departmental stores and international; 40,000-point annual cap | Archived brochure supports 5X and cap. ?Departmental stores? is not a canonical category in schema, so represented as `other` with description. Current applicability is unverified. |
| Point INR value | INR0.25 | No current issuer conversion ratio located; removed fixed unit and redemption values. Brochure says points may pay card outstanding but gives no ratio. |
| Priority Pass | ?Unlimited? international access | Archived brochure says standard membership is complimentary and each lounge use can cost up to USD27; it does not state a free visit quota. Corrected structured free quota to zero and noted chargeable access, pending current confirmation. |
| Domestic lounge | 2 quarterly visits | Not supported by the archived brochure or current product-page content; removed from structured data. |
| Golf | unlimited rounds/year | Archived brochure describes access to 300+ courses, without complimentary round quota. Corrected free-round quota to zero. Current offer not confirmed. |
| Welcome / milestones | INR3,000 welcome; INR3,000 at INR4L and INR5L | Archived brochure supports the welcome voucher after annual fee payment and bonus vouchers at INR4L/INR5L. Current conditions/applicability not exposed; marked historical in source notes. |
| Anniversary gift | absent | Archived brochure states INR3,000 anniversary gift on INR2L prior-year spend, after annual fee payment. Not added as current because current issuer details are unavailable. |
| Fuel waiver | 1%, INR500-4,000, cap INR250/month | Archived brochure supports these terms; current applicability not verified. Preserved with historical-source caveat. |
| Eligibility | age/income/score unknown | No card-specific current numerical requirements located. |

## Open items

SBI Card's live page and current MITC allow fee verification, but the live page lacks accessible card-specific product content. The undated brochure cannot prove current reward, lounge, golf, welcome, milestone, fuel or network terms. These fields remain historical snapshots and require a current product terms PDF or issuer clarification before they can be described as current.
