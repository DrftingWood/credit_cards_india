# Central Bank of India RuPay Platinum Credit Card — issuer evidence extract (27 Oct 2026)

Compared Central Bank of India's current [Credit Cards page](https://centralbank.bank.in/en/credit-cards), its official [FY2019–20 annual report](https://centralbank.bank.in/pdf/Annual_Report_2019_20_%28English%29.pdf), and the current issuer [card application-form directory](https://centralbank.bank.in/en/node/929) with its linked [Central Platinum Card form](https://centralbank.bank.in/pdf/central_platinum_card.pdf).

## Product availability and scope

The FY2019–20 annual report states that CBI standalone credit-card issuance was discontinued as co-branded issuance began in October 2019. CBI's current Credit Cards page contains no standalone card terms or application route. Its current downloadable “Central Platinum Card” form is visibly for a **Visa Platinum** card, not the RuPay Platinum product, so its fees, eligibility and terms were not transferred. The issuer's current page supports treating this legacy standalone RuPay product as on hold for new issuance, but no product-specific discontinuation date or terms for existing holders are published. `status` is therefore `on-hold` and `discontinued_on` remains null.

## Fields cleared as unsupported

The current issuer page gives no RuPay Platinum credit-card-specific fees, APR, cash-advance charge, reward earn/redemption, lounge access, fuel waiver, concierge, insurance or eligibility schedule. The values previously stored for those fields cited only the general credit-card page, which no longer contains those terms. Those claims were cleared to unknown rather than inferred from third-party descriptions or the issuer's RuPay Platinum **debit** card. `launched_on` is also null because no source reviewed establishes a launch date for this credit variant.

The schema requires date-bounded fee, reward and benefit records, so `effective_from: 2026-10-27` is the review observation date only; it is not an issuer-stated effective date. Current application URL is null because no current standalone application route is published for this card.
