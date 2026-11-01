# Apollo SBI Card: issuer comparison (27 Oct 2026)

## Primary issuer sources

- [Current Apollo SBI Card product page](https://www.sbicard.com/en/personal/credit-cards/apollo-sbi-card.html): current card availability, page metadata, product-page description and the card's promoted benefits.
- [Current SBI Card digital membership kit index](https://www.sbicard.com/en/personal/digitized-membership-kits.page): links the base Apollo card to its terms booklet and brochure.
- [Apollo SBI Card terms booklet](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/apollotnc-ekit.pdf): product-specific earn rates, point value and redemption, MID dependency, eligible-spend exclusions and point expiry.
- [Current SBI MITC](https://www.sbicard.com/en/most-important-terms-and-conditions.page): INR499 joining/annual charges, INR1 lakh renewal-waiver threshold and current standard APR/forex/cash-advance schedule.
- [SBI media archive](https://www.sbicard.com/en/who-we-are/media.page) and [27-Sep-2018 launch coverage hosted by SBI](https://www.sbicard.com/sbi-card-en/assets/docs/pdf/who-we-are/news/2018/hindustan-times-apollo-sbi-card-launched.pdf): establishes the 27-Sep-2018 launch date.

Local copies of the booklet and launch coverage are archived in this directory. The product-page capture is `product-page-current.html`; a page-description metadata snippet calls the membership Silver, while SBI's product finder/brochure calls it Gold.

## Corrections

- Corrected network from Visa Platinum to null with `multi-network` tag: the current SBI digital kit describes Mastercard/RuPay issuance. The card schema cannot record both options in the one network slot.
- Corrected launch date from 1-Sep-2018 to 27-Sep-2018 based on SBI's media archive date and contemporary launch item.
- Confirmed INR499 joining and annual fee; renewal fee reverses when prior-year annual spend reaches INR1 lakh. Kept general current finance charge 3.75% monthly, forex 3.5%, cash advance 2.5%/minimum INR500 and nil add-on charge.
- Confirmed earn rates: 3 Reward Points/INR100 on One Apollo services; 2/INR100 on dining, movies and entertainment; 1/INR100 on Beauty & Wellness; 1/INR200 on other eligible purchases. Apollo partner rewards depend on Apollo merchant identifiers and SBI identifies eligibility on a best-effort basis.
- Removed unsupported 0.25 INR statement-credit and SBI rewards catalogue rates. The e-kit states 1 RP = INR1 and permits OneApollo e-Gift Vouchers, Apollo services and OneApollo Health Credits. Redemption is closed-loop to Apollo.
- Added issuer exclusions: fuel MCCs 5172, 5541, 5983 and 5542; wallet-load MCCs 6540/6541; rent MCC 6513; government MCCs 9399/9311; cash advances, fees, disputed transactions, balance transfers, Flexipay and Merchant EMI. Removed unsupported insurance-premium exclusion.
- Retained 500 Reward Point welcome benefit after joining-fee payment and up-to-10% instant discounts at select Apollo services. Preserved generic OneApollo membership without choosing a tier because issuer references conflict (Silver vs Gold).
- Cleared the unsupported 1% monthly fuel-surcharge-waiver claim: neither the current product page nor the base-card booklet located in SBI's current digital kit establishes it for this card.
- Left lounge access unknown; no current base-card issuer source establishes a quota.
- Kept issuer age-policy ranges; a card-specific income floor and credit-score cutoff are not published.

## Caveats

The product-specific booklet contains several dated change notices through July 2024 but does not display a current revision date. SBI continues to link it as the card's digital membership-kit terms. The current product page retains active apply links. Membership tier wording varies between SBI page metadata and its own product-finder content, so the database records the membership but not a tier.
