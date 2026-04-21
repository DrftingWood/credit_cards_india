# Brand asset sourcing

The site displays logos for **networks** (Visa / Mastercard / RuPay / Amex / Diners) and **issuers** (HDFC, ICICI, …) wherever a card is mentioned. This document is the checklist for dropping those assets into the repo.

## Where files live

```
site/public/logos/networks/<network-id>.svg        # e.g. visa.svg
site/public/logos/issuers/<issuer-id>.svg          # e.g. hdfc.svg
site/public/cards/<issuer-id>/<slug>.webp          # optional real card-face art
```

After adding a file, wire it up by setting the matching field in the YAML record:

- Network: add `logo_path: "/logos/networks/visa.svg"` to `data/networks/visa.yaml`.
- Issuer: add `logo_path: "/logos/issuers/hdfc.svg"` and `brand_color: "#004C8F"` to `data/issuers/hdfc.yaml`.
- Card art (optional): add `image_path: "/cards/hdfc/infinia.webp"` to the card YAML.

Until a `logo_path` is set, the site falls back to a text chip. Commits that add only assets without the path field are fine — they just won't surface until the path lands.

## Format guidance

- **Prefer SVG** for logos. Vector, tiny, crisp at any size. Trim viewBox to the logo bounds.
- If only a raster is available, use **webp at 2× the display height** (so ~40 px high for the 20 px logo slot). PNG with transparency is an acceptable fallback.
- Card face art: **webp**, ~800 × 504 (ISO credit-card ratio 1.586:1). Keep under 60 kB.
- Use a consistent **neutral / on-light** colour treatment. A separate `_dark.svg` variant can be added later for dark mode.

## Licensing note

Network and issuer logos used in a comparison / editorial context are generally covered by nominative fair use and brand-usage guidelines. Card face designs are riskier — only commit `image_path` for a card after licensing/explicit permission, or when reproduced from the issuer's own public marketing pages under documented fair-use grounds.

## Sourcing checklist

### Networks (5)

| Network | Source | File |
| --- | --- | --- |
| Visa | https://www.visa.com/brand | `visa.svg` |
| Mastercard | https://brand.mastercard.com | `mastercard.svg` |
| RuPay | https://www.npci.org.in (brand assets) | `rupay.svg` |
| American Express | https://www.americanexpress.com/en-us/partner-with-us/ | `amex.svg` |
| Diners Club | https://www.dinersclubus.com/company/media | `diners.svg` |

### Issuers (24)

Source each from the issuer's press / media / about page. Save as SVG if available, else PNG → webp.

- [ ] `hdfc.svg` — HDFC Bank
- [ ] `icici.svg` — ICICI Bank
- [ ] `sbi.svg` — SBI Card
- [ ] `axis.svg` — Axis Bank
- [ ] `amex.svg` — American Express (reuse network logo if appropriate)
- [ ] `idfc-first.svg` — IDFC FIRST Bank
- [ ] `au.svg` — AU Small Finance Bank
- [ ] `rbl.svg` — RBL Bank
- [ ] `kotak.svg` — Kotak Mahindra Bank
- [ ] `indusind.svg` — IndusInd Bank
- [ ] `yes.svg` — YES Bank
- [ ] `standard-chartered.svg` — Standard Chartered
- [ ] `hsbc.svg` — HSBC India
- [ ] `bob.svg` — BoB Financial / Bank of Baroda
- [ ] `federal.svg` — Federal Bank
- [ ] `onecard.svg` — OneCard
- [ ] `canara.svg` — Canara Bank
- [ ] `pnb.svg` — Punjab National Bank
- [ ] `union.svg` — Union Bank of India
- [ ] `boi.svg` — Bank of India
- [ ] `idbi.svg` — IDBI Bank
- [ ] `kvb.svg` — Karur Vysya Bank
- [ ] `south-indian.svg` — South Indian Bank
- [ ] `slice.svg` — slice

### Brand colours

For each issuer, also populate `brand_color` (hex) in the YAML. Suggested sources:

1. Issuer's official brand-guidelines PDF if published.
2. Extract from their logo (dominant non-white colour).
3. Reasonable defaults below (verify against brand guide where possible):

```
hdfc   #004C8F     (HDFC Blue)
icici  #B02A30     (ICICI Red)
sbi    #2C5FA8     (SBI Blue)
axis   #9E1C2F     (Axis Maroon)
amex   #016FD0     (Amex Blue)
kotak  #EF3E42     (Kotak Red)
rbl    #D02D2D     (RBL Red)
...
```

### Card face art (optional, per-card)

Only populate `image_path` when a licensed asset is in hand. The fallback is a stylised placeholder that uses the issuer's `brand_color` + logo, which is the default for every card.
