# Flipkart SBI Card — issuer evidence and field review (27 Oct 2026)

## Primary evidence archived

- `product-page-capture-2026-10-27.html` — current SBI Card product page response captured 27 Oct 2026. The saved HTML is a client-rendered shell; current advertised content was also checked from SBI Card's indexed page.
- `flipkart-launch-press-release.pdf` — SBI Card's [26 Aug 2025 issuer filing and product release](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/who-we-are/notices/SEFilingPressReleaseAugust2025.pdf), which gives the launch date, available networks, welcome vouchers and current cashback rates/caps.
- `flipkart-card-terms.pdf` / `.txt` — current card-specific [Flipkart SBI Card terms booklet](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/ekit-tncs/Flipkart-SBI-CreditCard-TandC-Booklet.pdf). Relevant sections: card cashback table and statement-credit (PDF pp. 34–36), exclusion MCCs and MID conditions (pp. 35–36), transaction threshold/rounding (p. 37), welcome voucher (p. 34), fuel surcharge waiver (p. 34).
- `kfs-current.pdf` — current linked [SBI Card KFS](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/kfs/key-fact-statement.pdf) for current card fees, reversal threshold and common fee/finance charges. The [current MITC](https://www.sbicard.com/en/most-important-terms-and-conditions.page) independently lists the Flipkart fee and Rs.3.5-lakh renewal reversal threshold.
- `cleartrip-offer-terms.pdf` — SBI Card's [Flipkart SBI Credit Card Cleartrip offer T&Cs](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/personal/cards/Cleartrip-SBIC-TnCs.pdf), explicitly valid only through 30 Jun 2026.
- `issuance-policy-current.pdf` — current [SBI Card issuance and conduct policy](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/who-we-are/notices/policy-for-the-Issuance-and-conduct-of-credit-cards.pdf), supporting occupation-specific age ranges and underwriting policy.

## Corrections made

- Cleared the single-network Visa and Platinum-tier assertions. SBI Card says the product is issued on Visa and Mastercard; the current issuer sources do not assign a card-specific network tier.
- Verified the 26 Aug 2025 launch date, Rs.500 joining/renewal fee, Rs.3.5-lakh annual renewal-fee reversal threshold, 3.5% foreign currency markup and standard SBI Card finance/cash-advance charges.
- Corrected the cashback structure: 7.5% Myntra, 5% Flipkart (including Shopsy), 5% Cleartrip, 4% at Zomato/Uber/Netmeds/PVR, each with an independent Rs.4,000 calendar-quarter cap; 1% unlimited base cashback.
- Added Shopsy and the named four preferred merchants, capped the rules, recorded the issuer MID dependency, and restored the complete card-booklet cashback exclusions/MCC list.
- Added the Rs.100 minimum transaction, per-transaction round-down and cashback credit two days after statement generation. The card booklet's table also says up to 15 days after statement-cycle end; the detailed clause and issuer launch release specify statement generation plus two days, so that more specific timing is retained and the booklet wording conflict is noted.
- Replaced the unsubstantiated Rs.1,000 first-transaction welcome benefit with the documented Rs.500 Flipkart voucher plus Rs.500 Cleartrip voucher, each conditional on a first Flipkart transaction within 30 days of approval for Flipkart-app applications. Retained the Rs.250 voucher on fee realization and recorded its 60-day delivery/one-year expiry terms.
- Retained the 1% fuel-surcharge waiver capped at Rs.400 per statement cycle and removed the unverified Rs.500 minimum transaction; the current card booklet specifies eligible fuel transactions up to Rs.4,000 but no minimum.
- The SBI product page advertises 12% on Cleartrip, but the detailed Cleartrip booklet located during review expired 30 Jun 2026. Kept the page claim with a clear expiry/source limitation and did not assert that a 12% offer is currently active.
- Refreshed age ranges from SBI's current issuance policy; left card-specific income minimum and fixed credit-score cutoff unknown.

## Review limits

Partner cashback eligibility depends on approved merchant identifiers and network coding. The Cleartrip promotional discount needs current terms to establish its code, booking types, caps and duration; it is recorded as unverified. The T&C booklet contains differing credit-timing wording, documented above. Values with these limits are explicitly marked in `data/cards/sbi/flipkart.yaml`.
