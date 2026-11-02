# Snapdeal BOBCARD issuer comparison (27 Oct 2026)

## Primary sources reviewed

- [BOBCARD Snapdeal product page](https://www.bobcard.co.in/credit-card-types/snapdeal-bobcard): ₹249 joining and annual fees; reward rates and caps; welcome voucher; bonus points; fuel waiver; Smart EMI; add-on cards; eligibility.
- [BOBCARD FAQs](https://www.bobcard.co.in/faqs): 24-month point expiry and redemption details.
- [BOBCARD Features and Rewards terms, effective 1 Apr 2026](../_shared/features-and-rewards-important-terms-conditions-01042026.pdf): core rate, excluded transactions and MCCs; minimum transaction; UPI treatment.
- [BOBCARD MITC, Jan 2026](https://media.bobcard.co.in/media/gaudahay/bob_mitc_a4-booklet_ver-19jan26_15jan2026.pdf): finance, forex and cash-advance charges.
- [BOBCARD feature and charge revision, 1 Apr 2026](https://media.bobcard.co.in/media/nfkmkemd/revision-in-product-features-charges-wef-1st-april-26.pdf): additional transaction-specific charges.
- [NPCI launch announcement, 2 Sep 2022](https://www.npci.org.in/PDF/npci/press-releases/2022/NPCI-Press-Release-BoB-Financial-and-Snapdeal-Launch-Co-Branded-JCB-RuPay-Contactless-Credit-Card.pdf): launch date and RuPay/JCB co-branding.
- [BOBCARD reward/feature revision, Jul 2025](https://media.bobcard.co.in/media/lmod15z0/revision-in-product-features-charges_010725-final.pdf): ended auto-redemption; manual statement-credit minimum.

## Field decisions and caveats

- Confirmed ₹249 joining/annual fee, 20 points/₹100 on Snapdeal, 10 points/₹100 eligible online/departmental spend capped at 2,000 points per statement, and 4 points/₹100 core earn. Point value is ₹0.25. Snapdeal-specific earn is treated as the applicable merchant rate because the issuer page does not explain overlap with the general online bucket.
- Removed the unsupported EMI reward exclusion. UPI earns core points only and does not qualify for accelerated rewards, bonus points or voucher activation. Fuel earns no points.
- RuPay is supported by the issuer application form and NPCI release. No source established a product-specific RuPay tier, so `network_tier` is null and tagged unverified.
- The April 2026 fee revision includes transaction-specific education, toll/bus and railway charges not represented in the current card fee schema; values are recorded in the fee source note.
- Issuer page publishes distinct salaried and self-employed age ranges. The schema's 21–65 range spans both; it is not a single applicant-category range.
- Rewards, benefit limits and exact start dates may depend on issuer operational terms; no factual-accuracy percentage is inferred from structural validation or source-path coverage.
