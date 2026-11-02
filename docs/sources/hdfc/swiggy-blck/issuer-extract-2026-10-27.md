# Swiggy BLCK HDFC Bank Credit Card: issuer field review (2026-10-27)

Reviewed HDFC's current [BLCK product page](https://www.hdfc.bank.in/credit-cards/swiggy-blck-hdfc-bank-credit-card), its linked 15-Oct-2026 product-specific [terms](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/swiggy-blck-hdfc-bank-credit-card/pdf/tncs-swiggy-blck-hdfc-bank-credit-card-15102026.pdf) and [combined Ornge/BLCK terms](https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/swiggy-blck-hdfc-bank-credit-card/pdf/combined-tncs-ornge-and-blck-15102026.pdf), personal MITC v4.15, co-branded MITC v3.9, the live eligibility panel, current Mastercard World golf program, and Swiggy/HDFC's 12-Mar-2026 launch announcement.

## Confirmed and corrected

- Set launch date to 12-Mar-2026, the launch announcement date for the BLCK and Ornge variants.
- Confirmed Mastercard World issuance: BLCK-specific terms say the Swiggy BLCK HDFC card is offered only on Mastercard World.
- Kept INR 1,000 joining/renewal fees, INR 75,000 joining-fee waiver in the first 90 days (first year only), and INR 200,000 annual renewal waiver. HDFC's page and BLCK terms agree.
- Kept 1% cashback/INR 100 minimum/INR 1,000 cycle cap on other eligible spend, 10% on eligible Swiggy app MIDs/TIDs with INR 249 minimum/INR 1,500 cap, and 5% selected online merchants/categories with INR 100 minimum/INR 1,500 cap. Current total ceiling is INR 4,000 per statement cycle in Personal MITC v4.15; the category caps sum to this maximum.
- Confirmed cashback is automatically credited to the statement balance, excluding finance charges; posting date determines the cycle; EMI conversion reverses cashback. Existing APR/fees/cash advance remain supported by current Personal MITC. The 3.5% forex rate is retained with medium confidence because it is the common schedule rate, not repeated on the BLCK-specific row.
- Confirmed the three-month Swiggy BLCK membership welcome benefit. It requires activation within 37 days and a claim in Swiggy; converted-card special cases are in the product terms. Monetary value is not published.
- Current Mastercard World program lists four complimentary green-fee rounds and 12 golf lessons per year (one of each maximum per month); further green-fee bookings are discounted up to 50% and INR 1,800. The listed terms are valid through 31-Dec-2026. HDFC links the Mastercard program from the card page. Mastercard's CDN denied direct PDF download during this review; the current online [program page](https://specials.priceless.com/en-in/offers/Mastercard_World_Card_India_Golf_Program?Oid=201902180041&issuerId=201812040019&productId=202205130002) was reviewed.
- Cleared `resident-indian`: HDFC's live eligibility panel says nationality is Indian, while its current page does not specify a residence requirement. Kept the salaried age 21-60/net monthly income above INR 100,000 and self-employed age 21-65/annual ITR above INR 1,200,000; the schema stores the overall 21-65 age range. No bureau score floor is published. The issuer says approval also depends on credit profile and location.
- Retained `active`; HDFC presents the product and launch announcement says applications are being rolled out through Swiggy/HDFC channels.

## Conflicts and modeling limits

- Gaming exclusion differs by source: the 15-Oct-2026 card-specific terms list MCC 5816; the live issuer 1% cashback-details PDF lists MCC 7995. The dataset excludes both conservatively and records the conflict.
- The 5% terms include online/MCC and merchant-ID constraints, including a broad all-online row except standard excluded MCCs. A fully enumerated merchant-ID set is not published and cannot be represented as a complete whitelist in the current schema.
- Cleartrip and Nykaa discount add-ons are described as limited-time offers without end dates. The record preserves them as current offers while explicitly noting the unknown end dates.
- Mastercard's direct PDF endpoint blocked local retrieval; the PDF is not listed in the archive manifest. The linked Mastercard page and HDFC's own link provide the current benefit reference.

## Archived evidence

- `swiggy-hdfc-launch-2026-03-12.html` — Swiggy/HDFC launch announcement.
- `tncs-swiggy-blck-hdfc-bank-credit-card-15102026.pdf` and `combined-tncs-ornge-and-blck-15102026.pdf` — current HDFC product-specific terms.
- Existing issuer files `1-percent-cashback-details-swiggy-blck-hdfc-bank-credit-card.pdf`, `5-percent-cashback-details-swiggy-black-credit-card.pdf`, and related card terms.
- Shared `_shared/mitc-v4.15-retrieved-2026-10-27.pdf` and `_shared/co-branded-mitc-v3.9-retrieved-2026-10-26.pdf`.

