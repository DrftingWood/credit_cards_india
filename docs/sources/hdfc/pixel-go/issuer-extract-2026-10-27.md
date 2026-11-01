# HDFC Bank PIXEL Go — issuer field review (27 Oct 2026)

## Sources compared

- Current HDFC PIXEL Go page: https://www.hdfc.bank.in/credit-cards/pixel-go-credit-card
- Current HDFC fees page: https://www.hdfc.bank.in/credit-cards/pixel-go-credit-card/fees-and-charges
- Current PIXEL MITC, updated 15-Oct-2026: https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/personal-mitc/MITC-PIXEL-Credit-Card-12Aug-26-1.pdf (archived in this folder)
- PIXEL Go specific terms: https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/pixel-go-credit-card/pdfs/terms-n-conditions-pixel-go-credit-card.pdf
- HDFC PIXEL FAQ: https://v.hdfc.bank.in/pixel-credit-card/index.html (archived FAQ copies retained in this folder; live URL was not accessible to automated fetch)
- HDFC launch release dated 14-May-2024: https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/pdf/press-release/2024/q2-apr-jun/may/hdfc-bank-introduces-pixel-a-new-generation-of-digital-credit-cards.pdf (archived in this folder)

## Material field decisions

- `launched_on`: corrected to 2024-05-14, the dated HDFC announcement of the PIXEL range launch.
- `network`, `network_tier`: cleared to null. The current PIXEL Go page says standard issuance after the selection window is both RuPay (digital) and Visa (physical); approved applicants can choose Visa, RuPay or both. The single-network schema cannot accurately describe this product. `rupay` and `platinum` were too specific.
- Fee terms: current MITC confirms INR 250 joining/annual fee; INR 10,000 eligible spend in first 90 days for joining waiver; INR 50,000 annual spend for renewal waiver; 3.5% forex; 3.75% monthly finance; 2.5%/INR 500 minimum cash advance fee; 1.75% DCC from 20-May-2026. Current MITC lists SmartEMI processing fee INR 249 effective 1-Oct-2026. DCC and SmartEMI details remain in notes because schema fields are unavailable.
- Rewards: current MITC updated 15-Oct-2026 says all-other-spend cashback (branded “1% unlimited”) is capped at INR 15,000 per calendar month, despite current product page FAQ and older specific terms calling it unlimited. The 5% SmartBuy cashback cap is 500 CashPoints/month; RuPay UPI cashback is 1%, capped at 500/month. Whether UPI cashback stacks with the 1% category is not stated. Current MITC insurance cap is modeled as 2,000 CashPoints/month, while older specific terms say 2,000/day; conflict is retained in notes. Fuel, wallet, rent, government, EMI, cash advances, fees/charges and listed MCCs are excluded. Points expire after two years; the current MITC also states 365-day inactivity nullification and other forfeiture cases.
- Benefits: fuel waiver is 1% for transactions INR 400–5,000, capped INR 250 per statement cycle. Current PIXEL Go page says 10% Dineout savings; the linked FAQ says up to 20% and valid through 31-Dec-2026. Those statements may describe different campaigns; current combined terms/cap are not established.
- Eligibility: current page gives salaried age 21–60 and monthly income INR 12,000 with no comparator; self-employed age 21–65 and ITR > INR 6 lakh. A separate PIXEL FAQ says self-employed maximum age 60. Record retains the page's age/income values and documents conflict. Page specifies Indian applicants but not a separate residency test, so residency is null. No minimum bureau score was found.

## Limits

This is a field comparison to accessible primary HDFC sources, not proof that unpublished underwriting or account-specific offer terms are known. The website currently says 1% unlimited while its newer MITC supplies a monthly cap; structured rewards follow the newer MITC and the conflict is explicit. Dineout offer terms are also inconsistent across HDFC pages. The Cardmember Agreement was not exhaustively reviewed clause-by-clause for generic legal terms unrelated to modeled product fields.
