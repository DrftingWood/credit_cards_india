# Equitas PowerMiles issuer review addendum (2026-11-01)

## Current issuer material reviewed

- [MITC v1.2](https://equitas.bank.in/strapi-dev/uploads/MITC_V1_2_Track_change_8ed95eca57.pdf), opened as full PDF text on 1-Nov-2026.
- [Credit Card Product & Pricing MID (Jan 2026)](https://equitas.bank.in/strapi-dev/uploads/Elite_Artha_Credit_Card_2_f1e79a9024.pdf).
- [Cardmember Agreement](https://equitas.bank.in/strapi-dev/uploads/Card_Member_Agreement_21b39ee7dc.pdf), version 1.0, 28-Nov-2025.
- [PowerMiles insurance summary](https://www.equitasbank.com/strapi-dev/uploads/Insurance_Power_Miles_Website_07d777292f.pdf), and the insurer-policy follow-up at `powermiles-insurance-conditions-2026-11-01.md`.
- [PowerMiles product page](https://equitas.bank.in/personal-banking/pay/credit-cards/powermiles-credit-card/) was retried and returned HTTP 503. The accessible issuer documents do not replace the product page for benefits and eligibility that they do not state.

## Verified terms and record corrections

- Pricing MID identifies standard joining and annual membership fees of INR 5,000, a joining-fee waiver at INR 120,000 eligible spend in the first 90 days, and a renewal waiver at INR 480,000 in an anniversary year. The form also displays separate first-year-free options; those are not treated as the standard paid-fee card. MITC v1.2 confirms 3.75% monthly finance charges, 2% PowerMiles foreign-currency markup, and a 2.5% cash-advance fee with INR 250 minimum.
- MITC v1.2 states fuel-surcharge relief of 1% on eligible transactions, capped at INR 450 monthly and INR 5,400 annually; GST on the surcharge is not reversed. It does not state transaction-size thresholds.
- Cardmember Agreement section 34 confirms 3X accelerated rewards on international POS transactions only, on a best-effort basis and subject to MCC. The accessible issuer terms do not state the base points-per-spend rate, so the absolute rate is unverified and the YAML base rate and accelerator effective rate are null. The international feature is not extended to online transactions in the reviewed text.
- MITC states points accrue only on transaction amounts in INR 100 multiples; PowerMiles points remain valid for three years; no points accrue on rent, wallet loads, EMI, fuel, cash advances or government transactions on consumer retail cards; grocery and utility are capped at 2,000 points per month each and insurance at 2,000 points per day; minimum redemption is 500 points and the redemption fee is INR 99. Insurance is capped, not excluded, so the unsupported insurance-premium exclusion was removed.
- The issuer agreement confirms that luxury memberships are third-party fulfilled and subject to fee payment or spend milestones: INR 120,000 in the first three months for year one and INR 480,000 annually from year two, effective 24-Nov-2025. Accessible current terms do not name the specific membership brands or their values; the record now models the generic issuer-confirmed feature only.
- The agreement says lounge fulfilment is third-party but provides no quota or network/program detail. Because the product page is unavailable, the previously listed 2 domestic and 1 international visits per quarter were removed from structured benefits pending issuer evidence.
- The issuer insurance summary lists air-accident, credit-shield and lost-card cover, but the current per-card certificate/schedule and exact applicable limits/deductibles remain unavailable. Insurer-policy conditions are summarized separately; benefit amounts are not guarantees of claim payment.
- The unreferenced 2025-01-01 launch date and unsupported resident-Indian eligibility value were cleared. The issuer materials reviewed do not establish exact launch date, applicant residency, age/income/score thresholds, reward-point value, transfer partners, or current application availability.

## Remaining evidence gaps

The issuer product page still returns HTTP 503. Current page-specific evidence is required to restore any absolute base earn rate, lounge count/program, named membership brands, applicant criteria, or open-market application status. The individual insurance schedule/certificate is not public in the reviewed material. These unknowns remain null or are explicitly qualified in `data/cards/equitas/powermiles.yaml`.
