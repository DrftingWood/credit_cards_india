# PSU / regional-bank credit-card portfolios (survey 2026-07-04)

Full-catalogue survey of the seven low-confidence small-bank issuers, done during
the B5 verification pass. For each issuer the dataset previously held **one**
card; this documents the issuer's *entire* current catalogue (from the live
issuer site / issuer PDFs) so the missing products are known candidates.

Per the no-unsourced-data rule, missing cards below are **candidates only** — none
should be added as YAML until its fee/reward/benefit terms are sourced from
issuer evidence. Held cards were re-verified against issuer PDFs where available
(see each card's `source.local_refs`).

## Held cards — verification outcome (all corrected 2026-07-04)

| Card | Verified against | Key corrections |
|---|---|---|
| `idbi-winnings` | IDBI KFS + MITC + Usage Guide (PDF) | Visa/Platinum → **RuPay/Select**; fee ₹999→**₹899**, waiver ₹1.2L→**₹90k**; finance charge 3.49→3.40% |
| `pnb-rupay-select` | PNB MITC (PDF) | joining ₹0→**₹500**; waiver spend-based→**usage-based** (1 txn/quarter) |
| `union-rupay-select` | Union issuer card page | base 2/₹150 → **4/₹100**; +international lounge 2/yr; fuel cap ₹250→**₹100** |
| `boi-boi-select` | BOI RuPay Select brochure (PDF) | base 1→**2/₹100**; +intl lounge + BigBasket/BookMyShow/Prime/Swiggy perks; fee ₹500→₹800 |
| `canara-rupay-select` | Canara Variants & Features (PDF) | annual ₹1,000→**NIL** (₹250 one-time enrolment); forex 3.5→**3%** |
| `kvb-honour` | BankBazaar + Card Insider (aggregator) | base 2/₹100 → **3/₹150 + 4x travel**; fee ₹1,000→**₹1,299** (medium — no issuer page) |
| `south-indian-sib-platinum` | SIB SBI Platinum brochure (PDF) | **re-modelled as the SBI co-brand**: ₹2,999, 5X dining/dept/intl, Priority Pass, golf, milestone vouchers |

## Full catalogues (held card in **bold**)

### IDBI Bank — 7 cards (idbi.bank.in/credit-card.aspx)
Royale Signature (Visa) · Euphoria World (Mastercard) · Aspire Platinum (Visa) ·
Imperium Platinum (Visa) · **Winnings Select (RuPay)** · Lumine (RuPay) · Eclat (RuPay)

### PNB — 18 cards (pnbcard.in / creditcard.pnb.bank.in)
Visa Classic · Visa Gold · Visa Platinum · Visa Signature · Wave & Pay ·
RuPay Platinum · **RuPay Select** · RuPay Millennial · Rakshak RuPay Platinum ·
Rakshak RuPay Select · RuPay Metal "LUXURA" · Visa Metal "LUXURA" ·
Patanjali RuPay Select · Patanjali RuPay Platinum · EMT RuPay · BLISS ·
Salary RuPay Platinum · Salary RuPay Select

### Union Bank — 13 cards (unionbankofindia.bank.in/en/listing/credit-cards)
NEXTERIA · Unicorn · DIVAA ICON · PM Svanidhi · JCB Wellness ·
**RuPay Select** · JCB Health · UNI-CARBON (RuPay/HPCL) · RuPay Platinum ·
Visa Signature · Visa Platinum · Visa Gold · Sparsh

### Canara Bank — variant grid (canarabank.bank.in/credit-cards)
RuPay Classic · Mastercard Standard · Mastercard Platinum · Visa Platinum ·
**RuPay Select** · RuPay Select Secured · Mastercard World · Visa Signature ·
Corporate

### Bank of India (bankofindia.bank.in/credit-cards)
**RuPay Select** held. Other BOI variants (RuPay Platinum, Visa) not yet
catalogue-captured — a follow-up crawl of the BOI cards hub is needed.

### KVB — catalogue reshaped (kvb.bank.in/personal/cards/kvb-credit-cards/)
The KVB site now lists a generic **"KVB Credit Card"** plus **KVB-SBI co-brands**
(Gold / Platinum / Signature). The standalone "Honour" product page is no longer
exposed — `kvb-honour` is retained at medium confidence pending issuer
re-confirmation (possible rename/withdrawal).

### South Indian Bank (via SBI Card banking partnership)
**SBI Platinum** held (re-modelled). SIB also offers **SBI Card Prime** and other
SBI co-brands via the sbicard.com banking-partnership catalogue — candidates.

## Recommended next action

The seven held cards are now issuer-verified (5 via PDF, 1 aggregator, 1 SBI
brochure). The catalogues above are large; a sourced-expansion sweep (issuer
PDFs → YAML) would materially grow PSU coverage but must follow the same
evidence rule. Priorities: PNB's RuPay Platinum / Rakshak / LUXURA lines and
Union's RuPay premium tier (NEXTERIA / Unicorn / DIVAA) are the most mainstream
missing products.
