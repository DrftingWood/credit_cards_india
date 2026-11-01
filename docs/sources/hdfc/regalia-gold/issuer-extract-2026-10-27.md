# HDFC Bank Regalia Gold — issuer field review (27 Oct 2026)

## Sources compared

- Current HDFC product page: https://www.hdfc.bank.in/credit-cards/regalia-gold-credit-card
- Current HDFC eligibility page: https://www.hdfc.bank.in/credit-cards/regalia-gold-credit-card/eligibility
- Regalia Gold-specific reward terms: https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/regalia-gold-credit-card/pdfs/regalia-gold-credit-card-reward-points-t-and-cs.pdf (archived here)
- Regalia Gold-specific milestone/network terms: https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/regalia-gold-credit-card/terms-and-conditions.pdf (retrieved 27-Oct-2026 and archived here)
- Current travel/lounges feature terms: https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/regalia-gold-credit-card/pdfs/regalia-gold-travel-edge-tnc.pdf and https://www.hdfc.bank.in/content/dam/hdfcbankpws/in/en/personal-banking/discover-products/cards/credit-cards/regalia-gold-credit-card/pdfs/lounge-t-and-cs-and-list-Regalia-Gold.pdf
- HDFC Regalia Gold feature-change notice effective 15-May-2026 (archived here)
- HDFC personal MITC v4.15 retrieved 27-Oct-2026 and co-branded MITC v3.9 updated 08-May-2026 (shared archives)
- Current Regalia Gold launch release dated 23-Mar-2023 (archived here)
- Current HDFC ERGO policy summary effective 23-Jul-2026 to 22-Jul-2027 (previously archived in HDFC Regalia sources)

## Material field decisions

- Network/tier: cleared from Visa Signature to null. Regalia Gold-specific milestone terms explicitly recognize Mastercard-to-Visa franchise conversion. Current official sources do not establish the network and tier assigned for new approvals. A single-network record cannot represent the card's network variants accurately.
- Launch date: retained 23-Mar-2023 from HDFC's dated release. The prior 2022-06-01 date was incorrect.
- Eligibility: retained salaried age 21–60, self-employed age 21–65, net monthly income >INR 100,000 government and >INR 150,000 private, and ITR >INR 1.8 million self-employed. Annualized salaried field remains INR 1.2 million as the schema cannot express the occupation split. The current product page specifies Indian nationality but not residence; residency is null. The detailed eligibility text says gross while headline/FAQ say net, so that conflict remains explicit.
- Fees: confirmed INR 2,500 joining/annual fee, INR 400,000 annual renewal waiver, 2% forex and current MITC 3.75% monthly finance / 2.5% or INR 500 minimum cash advance fee. The May-2026 notice sets DCC to 1.75% and reissue to INR 199; HDFC FAQ still says INR 100 for reissue. These have no dedicated schema fields and remain in notes.
- Rewards: current base is 5 points per INR 200 effective 15-May-2026. Five-times earning at Myntra, Nykaa, Reliance Digital and Marks & Spencer remains capped at 5,000 points/month, with base points beyond the accelerator cap. Current card reward terms require minimum INR 200; the linked milestone terms still say INR 150. Grocery, insurance, utilities and telecom monthly caps are 2,000 each where applicable; statement-cycle maximum is 50,000 points. Current rewards T&C specifies 0.15 INR for statement cashback; product page summary and co-branded MITC v3.9 say up to 0.20, so 0.15 is modeled from the detailed current card page/personal MITC v4.15. Other listed redemption values and limits were rechecked; airline miles partner roster remains portal-dependent and unverified.
- Lounges and travel: from 1-Jul-2026, three domestic lounge accesses/quarter require INR 60,000 settled retail spend in the preceding calendar quarter; no lounge vouchers are issued, and guests are not allowed free access. Priority Pass grants up to six international visits/year; application requires four retail transactions and primary/add-on members can apply. Boarding Edge gives the primary cardholder any two travel benefits per calendar quarter after uploading a valid boarding pass. The older product page and current lounge terms conflict on old lounge access wording; current dated terms are modeled.
- Other benefits: current HDFC page advertises up to 10% savings via Swiggy Dineout, added as a benefit; page does not give current cap or expiry. Current card terms retain other current welcome, quarterly and annual milestone terms. Product page advertises INR 5,000 flight vouchers at INR 500,000 and INR 750,000 annual spend, while current milestone T&Cs specify one INR 5,000 ticket at INR 750,000; only the specific T&C threshold remains modeled. No current fuel waiver was found, despite old shared MITC schedule discrepancy. Current insurance amounts/eligibility are summarized in structured notes; detailed exclusions/triggers remain subject to policy wording.

## Limits

Issuer web pages contain stale/contradictory material (redemption value, milestone levels, reissue fee, salary net/gross, and outdated lounge/fuel descriptions). The structured record follows current card-specific terms where available and records unresolved conflicts. This review validates modeled product fields against accessible primary issuer sources; account-specific approvals/offers can vary.
