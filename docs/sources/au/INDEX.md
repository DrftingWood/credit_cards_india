# AU Small Finance Bank â€” source verification (2026-07-04)

AU serves fees/rewards as JS-rendered HTML on au.bank.in (no per-card PDFs found). Values are textContent-readable.

## Verified
- **Xcite (2026-11-01, insurance scope):** the card-specific page lists card-liability cover, while the shared footer's INR 50 lakh accident-cover claim is not enough to establish Xcite eligibility under the current member agreement (accident cover is limited to selected variants). Left air-accident cover unmodeled. Linked Xcite terms are dated 2021. See [xcite/insurance-scope-clarification-2026-11-01.md](xcite/insurance-scope-clarification-2026-11-01.md).
- **Xcite Ultra (2026-11-01, insurance clarification):** the card-specific benefit section says INR 20 lakh air-accident cover, while the shared footer says INR 50 lakh. Retained the card-specific amount and left in-force policy wording open because the linked terms are dated 2021. See [xcite-ultra/insurance-clarification-2026-11-01.md](xcite-ultra/insurance-clarification-2026-11-01.md).
- **Xcite Ace (2026-11-01, insurance scope):** checked the current card page, its linked policy (dated 16-Apr-2021), and the gated device-plan link. Confirmed current-page benefit claims but documented that detailed conditions and current limits remain unverified. See [xcite-ace/issuer-extract-2026-11-01.md](xcite-ace/issuer-extract-2026-11-01.md).
- **Altura** (2026-10-27): current product page, KFS v1.9 and issuer FAQs checked; cleared unsupported network/tier/launch date, replaced unpublished cashback cap claim, confirmed current benefits/fees/eligibility, and documented feature coverage unknowns. See [`altura/issuer-extract-2026-10-27.md`](altura/issuer-extract-2026-10-27.md).

- **Altura Plus** (2026-10-27): current product page, KFS v1.9 and MITC v2.22 (30 Sep 2026), 16 May 2026 member agreement, and rewards FAQ compared field by field. See [`altura-plus/issuer-extract-2026-10-27.md`](altura-plus/issuer-extract-2026-10-27.md). Removed unsubstantiated launch date/network/tier; corrected reward base scope and point expiry; documented 1 Oct fuel cap update and remaining unpublished offline cap/coverage details.

- **LIT** (2026-10-27): current product/features pages, card terms, Schedule of Charges/KFS, AU Rewardz FAQ and product guide compared. Cleared unsupported network/tier/launch date and wallet-load exclusion; reconciled current feature-based rewards, cashback, lounge/fuel options, fees and eligibility. See [`lit/issuer-extract-2026-10-27.md`](lit/issuer-extract-2026-10-27.md).

- **Zenith+** (2026-10-27): compared current product page, KFS v1.9, 24 Mar 2026 cardmember agreement, current reward FAQ and lounge terms. Corrected zero cash-advance fee and removal of unsupported network/tier/launch-date and reward-exclusion claims; documented conflicted category caps and missing reward/milestone details. See [`zenith-plus/issuer-extract-2026-10-27.md`](zenith-plus/issuer-extract-2026-10-27.md).

A prior AU-wide audit (PR #50) covered 21 cards. Current record-specific extracts supersede that snapshot; the Zenith+ review above documents unresolved base-rate and special-category-cap wording in current sources.

- **InstaPay** (2026-10-27): product page/FAQ and KFS v1.9 checked; removed unsupported launch date, network tier and residency claim; documented cash-advance/MCC unknowns. See [instapay/issuer-extract-2026-10-27.md](instapay/issuer-extract-2026-10-27.md).

- **ixigo AU** (2026-10-27): compared current product page/FAQ, KFS v1.9, MITC v2.22, current lounge terms, Priority Pass rules and member agreement. Applied current limited-period LTF offer, corrected train-reward date and statement cap, corrected quarterly milestone trigger, cleared unsupported network/tier/launch date; records remaining fee/base-rate conflicts. See [ixigo/issuer-extract-2026-10-27.md](ixigo/issuer-extract-2026-10-27.md).

- **AU KOSMO (Kiwi)** (2026-10-27): compared current AU product page/FAQ and KFS v1.9 with current Kiwi Rewards Policy and AU/ Kiwi launch notice; added source-backed online and Scan & Pay reward rates/exclusions, corrected launch date/network tier, and documented dynamic cap and channel-model limits. See [kosmo/issuer-extract-2026-10-27.md](kosmo/issuer-extract-2026-10-27.md).

- **Ananta** (2026-11-01): compared the current product/FAQ page with KFS v1.9, Card Member Agreement and current lounge terms; confirmed fees, caps, exclusion groups, milestones and lounge gate, and recorded the 100x issuer point-value conflict. See [ananta/issuer-extract-2026-11-01.md](ananta/issuer-extract-2026-11-01.md).

- **CheQ AU (Visa and RuPay)** (2026-11-01): compared current product page, CheQ rewards terms and AU Member Agreement; corrected redemption-fee applicability and documented variant-specific earning channels and open MID/policy limitations. See [cheq/issuer-extract-2026-11-01.md](cheq/issuer-extract-2026-11-01.md).
- **CheQ AU insurance scope** (2026-11-01): checked the card page's generic insurance summary against the current Member Agreement and linked insurance terms. They do not establish CheQ-specific coverage or limits; no insurance amounts are modeled. See [cheq/insurance-scope-clarification-2026-11-01.md](cheq/insurance-scope-clarification-2026-11-01.md).

- **Laksya** (2026-11-01): rechecked the current product page against lounge terms, current Member Agreement, KFS and Rewardz FAQ; recorded the current-page/older-PDF lounge eligibility timing conflict and non-modeled reward channels. See [laksya/issuer-extract-2026-11-01.md](laksya/issuer-extract-2026-11-01.md).

- **NOMO** (2026-11-01): compared current product page and FAQs with Member Agreement, 10-Apr-2026 lounge policy, current KFS and Rewardz FAQ; retained unresolved reward-value, stale lounge-threshold and fuel-cap conflicts. See [nomo/issuer-extract-2026-11-01.md](nomo/issuer-extract-2026-11-01.md).

- **Paytm AU** (2026-11-01): compared current AU card page/KFS with the 21-Oct-2026 AU/Paytm family-lounge card announcement; narrowed the 5% category to Paytm Travel/Gold and added the newly announced 12 annual family lounge visits, while recording undisclosed caps and booking rules. See [paytm/issuer-extract-2026-11-01.md](paytm/issuer-extract-2026-11-01.md).

- **Prathama** (2026-11-01): compared current card FAQ/page with Member Agreement, KFS and Rewardz FAQ; confirmed statement threshold and cap, SI bonus and exclusions, preserving unresolved contactless stacking and reward-value proxy limits. See [prathama/issuer-extract-2026-11-01.md](prathama/issuer-extract-2026-11-01.md).

- **SPONT** (2026-11-01): compared current product page and KFS with SPONT lounge terms effective 10-Apr-2026; corrected lounge qualification from same-quarter spend to preceding-quarter spend for next-quarter access, and recorded cardholder/guest rules. See [spont/issuer-extract-2026-11-01.md](spont/issuer-extract-2026-11-01.md).

- **Tejas** (2026-11-01): compared current product page/FAQ, welcome and merchant offer PDFs, Card Member Agreement, Rewardz FAQ and KFS; confirmed point structure, SI-free reward analog (Tejas transaction milestone), offer-specific caps/channels and open BBPS scope. See [tejas/issuer-extract-2026-11-01.md](tejas/issuer-extract-2026-11-01.md).

- **Vetta** (2026-11-01): compared current product page, revised lounge terms, Priority Pass terms, KFS and Card Member Agreement; corrected next-quarter domestic lounge eligibility and confirmed visit counts, fee waivers, and remaining unpublished reward/milestone detail. See [vetta/issuer-extract-2026-11-01.md](vetta/issuer-extract-2026-11-01.md).

- **CA Metal** (2026-11-01): opened the current card page to confirm the 1-Oct lounge spend gate, rewards and caps, welcome, fuel range, eligibility and advertised protection cover against the fresh 27-Oct record. The October KFS and card-specific reward terms remain the source for detailed charges/MCC rules; unresolved MCC 9311 and insurance wording are recorded. See [ca/issuer-extract-2026-11-01.md](ca/issuer-extract-2026-11-01.md).
