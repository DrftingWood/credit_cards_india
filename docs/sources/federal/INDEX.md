# Current Scapia Federal card verification ? 2026-10-26

Reviewed Federal Bank's [Scapia product page](https://www.federal.bank.in/scapia), current [Cardholder Agreement v11](https://www.federal.bank.in/documents/d/guest/cardholder_agreement-v11-30_04_26) (last updated 2026-06-01), [MITC v11](https://www.federal.bank.in/documents/d/guest/mitc_v11-30_04_26), [Schedule of Charges effective 2026-04-01](https://www.federal.bank.in/documents/d/guest/credit-card-charges-w-e-f-from-01-04-2026), [Scapia benefits terms](https://www.federal.bank.in/documents/d/guest/scapia-federal-credit-card-tnc-v4-21_04_25), and Scapia's [15-Jun-2023 launch release](https://www.scapia.cards/newsroom/scapia-launches-revolutionary-new-credit-card-for-travel-lovers-in-association-with-federal-bank). Archived the valid June-2026 cardholder agreement under `scapia/`. Direct downloads of the MITC, schedule and benefits T&C returned a Radware CAPTCHA page; those HTML responses were removed and not treated as PDFs.

## Corrections

- Set launch date to 2023-06-15 from Scapia's official co-brand launch announcement. Cleared Visa/Signature scalar because Federal now offers both Visa and RuPay variants and does not publish one common tier.
- Fees: joining/annual/add-on fees nil; zero forex; finance 3.75% monthly; cash advance 2.5% or INR500 minimum. Restored current 1% fuel surcharge waiver up to INR5,000 per transaction, INR500/month cap. Fuel, utility, telecom and cable spends over INR50,000/month may attract separate 1% convenience fees plus GST.
- Rewards: 1 Reward converts to 1 Scapia Coin; 5 coins = INR1, coins valid 36 months, redemption fee nil. Visa earns 10 Rewards/INR100 on eligible spends INR20+; RuPay earns 5/INR100 on eligible spends INR500+; Scapia-app travel earns 20/INR100. Record uses RuPay's lower base rate because the schema has one network/rate, and documents Visa's higher rate plus differing minimums in notes. No published overall earn cap found.
- Updated published exclusions/MCCs and retained that rates are reward-unit counts, not cash back percentages.
- Lounge is unlimited domestic access after INR20,000 eligible spend per billing cycle and monthly activity, with entry through Scapia app QR and cardholder only. Agreement text conflicts on whether spend on Visa and RuPay variants can be combined; this is noted in YAML.
- Eligibility: resident Indian; primary age 21-65 salaried and 25-65 self-employed. Income and credit-score cutoffs remain unpublished.

## Modeling limits

One record cannot fully model Visa vs RuPay earn rates/minimum transactions or card network selection; structured reward baseline is conservative. Lounge variant-spend aggregation is ambiguous in current agreement. Exact MCC range 9099-9999 and detailed app offers remain in notes.

---

# Federal Bank — source verification (2026-07-03)

Federal Bank publishes its **Credit Cards MITC as an inline HTML page**
(`/credit-cards-mitc`), **not** as downloadable per-card PDFs. Verification was
therefore done against the central MITC fee/charges table (columns:
**Signet / Imperio / Celesta / Wave**).

## Corrections applied from the MITC table
| Card | Field | Was | MITC (corrected) |
| --- | --- | --- | --- |
| Signet | annual/joining fee | ₹999 | **₹750** |
| Signet | forex markup | 1.5% | **3.5%** |
| Imperio | annual/joining fee | ₹1,000 | **₹1,500** |
| Imperio | forex markup | 1.5% | **3.5%** |
| Celesta | forex markup | 1.5% | **2.0%** |

Celesta annual fee ₹3,000 confirmed. Cash-advance limits per MITC: Signet 10% /
Imperio 20% / Celesta 25% of credit limit.

## Note
The MITC lists a **"Wave"** column (RuPay Wave, ₹199) — excluded from the card set
during the audit as a floater/companion (shares the primary card's limit), but it
does carry its own ₹199 fee per MITC. Scapia is co-issued via the Scapia app
(scapia.cards), not on Federal's site.
