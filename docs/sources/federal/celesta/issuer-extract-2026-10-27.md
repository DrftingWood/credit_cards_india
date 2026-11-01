# Federal Bank Celesta issuer comparison (27 Oct 2026)

## Primary issuer sources reviewed

- [Celesta Visa product page](https://www.federal.bank.in/visa-celesta-credit-card): rewards, current INR 10,000 / INR 600 welcome offer, limited-period no-fee offer, 2% forex markup, fuel waiver, INOX offer and lounge highlights.
- [Celesta Mastercard product page](https://www.federal.bank.in/celesta-credit-card): confirms Mastercard variant; product/network options shown online are illustrative.
- [Current Federal Bank MITC](https://www.federal.bank.in/-/credit-card-tc-1): fee schedule, AMB-linked APR tiers, add-on fee, reward rules and redemption. The [10 Jan 2026 APR revision schedule](https://www.federal.bank.in/revised-credit-card-charges) publishes the dynamic rates omitted in the MITC rendering.
- [Federal Bank credit-card FAQ](https://www.federal.bank.in/credit-card-faq): general age/residency eligibility and redemption fee caveat.
- [Federal Bank lounge program](https://www.federal.bank.in/federal-bank-debit-cards-credit-cards-airport-lounge-program): thresholds, qualifying cycles, primary/add-on access distinction, validation and reimbursement mechanics.
- [Amazon voucher terms](https://www.federal.bank.in/amazon-gift-card-tc): Celesta INR 600 voucher on INR 10,000 eligible spend in the 30-day issuance period, delivery and validity.
- [Visa Celesta offer page](https://www.federal.bank.in/federal-bank-visa-credit-card): identifies the Visa Signature Celesta variant; the cited campaign ended 31 Oct 2026.

## Corrections and unresolved items

- Corrected APR band limits: INR 0-INR 49,999 at 3.75% monthly; INR 50,000-INR 300,000 at 2.69%; INR 300,001-INR 1,000,000 at 1.99%; and above INR 1,000,000 at 0.69%, from the issuer schedule effective 10 Jan 2026. The FAQ example assigns 0.69% at exactly INR 1,000,000, conflicting with the schedule boundary. Record follows the schedule and documents the boundary conflict.
- Confirmed 2% forex, 2.5% cash-advance fee (minimum INR 500), INR 100 + GST add-on fee (maximum four) and current no-fee offer. Zero joining/annual fees describe current onboarding; MITC preserves INR 3,000 for cohorts before 3 Apr 2023.
- Confirmed 1 point per INR 100 base, 2x dining, 3x travel/international, INR 0.25 catalog face value and INR 0.10 statement-credit rate. Cash, fuel, wallet, government, financial institution/quasi-cash, rent and listed MCC exclusions do not earn. Insurance MCCs 6300/5960 cap at 250 points per card/calendar month. Redemption fee conflicts: MITC says INR 99/request; FAQ says minimum INR 99, with actual fee dependent on redemption type. Calculator does not deduct this fee.
- Confirmed two domestic lounge visits per quarter after INR 60,000 eligible spend in the immediately preceding cycle; cycles run 21st-20th, add-on spend counts, but add-on cardholders cannot access the benefit. International access is two visits/year without a spend gate, with charges reimbursed within 30 days. INR 2 domestic validation is non-refundable.
- Current welcome offer is INR 600 Amazon voucher after INR 10,000 spend in the first 30 days. Removed stale targeted Aug-Oct 2026 10,000-point promotion from baseline notes. Added EMI and add-on features; exact EMI minimum/tenure is not published on the card page.
- General Federal Bank eligibility FAQ gives minimum age 21 unsecured / 18 secured and accepts residents or NRIs. Celesta-specific income and bureau thresholds are not published. Record leaves age null and uses residency `either`; Celesta-specific age, income and bureau limits remain unconfirmed.
- `network: visa` / `network_tier: signature` refer to the Visa variant. A temporary issuer Visa offer explicitly named VISA Signature Celesta; Federal Bank also offers Mastercard Celesta. The one-network schema cannot represent both variants; separate variant modeling would be needed to encode both.
- No exact Celesta launch date identified; remains null.


## Follow-up verification (27 Oct 2026)

Federal Bank's [10 January 2026 APR revision schedule](https://www.federal.bank.in/revised-credit-card-charges) provides the APR values omitted from the MITC page rendering: 3.75%, 2.69%, 1.99% and 0.69% monthly across the four AMB bands. Record now uses these rates. A single FAQ example at exactly INR 1,000,000 gives 0.69% even though the rate table places INR 1,000,000 within the 1.99% band; the table is recorded and the edge inconsistency noted.
