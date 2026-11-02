# Axis Bank Burgundy Private – The One Card issuer evidence (reviewed 2026-10-27)

Primary Axis sources checked:

- [Current The One Card page](https://www.axis.bank.in/burgundy-private/the-one-card)
- [Current Burgundy Private eligibility page](https://www.axis.bank.in/burgundy-private/eligibility-criteria)
- [Current Axis MITC](https://www.axis.bank.in/docs/default-source/default-document-library/mitc-credit-cards.pdf?sfvrsn=3e341456_66)
- [Current KFS](https://www.axis.bank.in/docs/default-source/credit-cards/terms-and-conditions/sosc-credit-cards.pdf)
- [Burgundy Private fee, lounge and membership update](https://campaign.axis.bank.in/generic/terms-and-conditions-burgundy.pdf)
- [Card rewards T&Cs](https://www.axis.bank.in/docs/default-source/default-document-library/bp-rewards-program-tnc.pdf?sfvrsn=91031dc4_1)
- [Current Travel EDGE transfer terms](https://traveledge.axis.bank.in/travel/common/termsandcondition)
- Card-specific lounge, BookMyShow and golf terms; current FY2026-27 credit-card insurance schedule; Club Marriott, ALL Accor+ Explorer and Taj Epicure membership terms.

The issuer PDFs and captures are archived in this directory. The current Travel EDGE HTML includes a dynamic card column.

| Field | Current evidence and record treatment |
|---|---|
| Network/tier/launch | Visa is confirmed in Axis domestic lounge-program terms. Current sources do not establish a Visa Infinite network tier or exact launch date; tier and launch date cleared. |
| Fees | Until 31-Aug-2026, INR50,000 joining/annual, complimentary to qualifying Burgundy Private clients. From 01-Sep-2026, page says INR100,000 annual fee if TRV below INR5 crore. Current MITC lists INR100,000 joining and annual; the 2026 fee notice says only the annual fee changed, and KFS remains INR50,000. The YAML uses MITC values and documents the conflict. Qualifying TRV clients receive complimentary card. |
| Other charges | Zero forex markup; cash withdrawal fee waived; 1.5% monthly interest (19.56% p.a.); no cash-withdrawal interest until payment due date; late payment fee waived. |
| Rewards | 15 EDGE Reward Points/INR200. Government, jewellery/gold, fuel, utilities, telecom and EMIs do not earn; rent earns only up to INR100,000/month; insurance earn capped at 6,000 points/month. EMI conversion debits points without restoration after EMI cancellation. Excluded categories have been identified by spend category since 20-Jun-2025. |
| Transfer | Travel EDGE currently lists 5:4 EDGE Reward Point-to-partner reward ratios for 27 airline/hotel programs. Annual limit is 1,500,000 points/customer ID: Group A 300,000; Group B 1,200,000. Its table calls the card “Burgundy Pvt The One Metal”; product page says “Burgundy Private – The One Card,” so the label difference is noted. No fixed cash/catalog value is encoded. |
| Lounges | Unlimited domestic access on the card itself and unlimited international access through Priority Pass for primary/add-on holders. Priority Pass cannot be used for domestic lounges in India from 28-Aug-2026. Up to 12 complimentary guest visits per card anniversary year; lounge T&Cs allow quarterly program limits to be set by Axis. |
| Golf | 50 domestic rounds/lessons combined per financial year; 4 international rounds per financial year; primary cardholder only. Schema cannot represent the combined domestic allowance without double-counting; exact terms are in `other` benefit text. |
| BookMyShow | Buy one ticket, receive up to INR500 off second movie ticket up to 5 times/month; non-movie event version up to INR1,000, also 5 times/month. Primary and add-on cards qualify. |
| Fuel | 1% fuel surcharge reversal for INR400–4,000 transactions; cap INR400. Card page says monthly cap; MITC says statement-cycle cap. YAML follows MITC and records the wording conflict. |
| Memberships/dining | Current page advertises Club Marriott, ALL Accor+ Explorer, Taj Epicure and EazyDiner Prime. EazyDiner page says INR1,000 off eligible dining plus birthday-month benefit. From 15-Nov-2026 linked complimentary memberships renew only with explicit consent (future-dated relative to review). |
| Other benefits | Up to 8 complimentary airport meet-and-assist services/year; The Postcard Hotel privileges; up to 30% airport transfer discount; travel and health services subject to partner terms. |
| Insurance | Axis FY2026-27 schedule lists USD500 baggage loss/delay, INR500,000 Credit Shield and INR200,000 purchase protection. Conditions apply, including same-card ticket purchase/international travel for baggage cover and eligible purchase/domicile/activity conditions for other covers. |
| Eligibility | Burgundy Private relationship required. The card page requires INR5 crore TRV excluding demat; the general program page also describes account eligibility through INR5 crore TRV or INR10 lakh net monthly salary credit, but says The One Card itself requires the INR5 crore TRV. NRI card variant is supported. Card-specific age and bureau criteria are not published. |

## Open representation and source issues

- The current MITC/KFS and fee-revision notice disagree on whether the joining fee changed to INR100,000; the joining-fee field follows the current MITC.
- The card page's monthly fuel-cap wording differs from MITC statement-cycle wording; the structured record follows MITC.
- The lounge page says unlimited, while program terms reserve power to set quarterly quotas and subject access to lounge capacity.
- The Travel EDGE partner table's “The One Metal” label differs from the current product page's “The One Card.” Ratios are recorded from the current published column; confirm equivalence if the card variants are distinguished internally.
- The current membership-consent change is effective 15-Nov-2026, after this review date.
- The schema cannot express relationship-based fee waiver/eligibility criteria, nor the combined domestic golf rounds/lessons quota.
