# Local data and PDF review - 2026-07-04

## Scope

This review covers the local repository state after the audit-branch merge and
cleanup. It checks the card YAML dataset, generated site artifacts, tracked
source manifests, and the local-only PDF archive under `docs/sources/**/*.pdf`.

PDFs were not deleted or moved. They remain local-only and gitignored.

## Executive summary

- The local dataset is structurally healthy: 317 card YAML files generate
  successfully into the site bundle, and the site builds all 317 card pages.
- The local PDF archive is intact and readable: 261 PDFs, 2,888 pages, 0 parse
  failures, and 0 encrypted PDFs.
- The strongest evidence coverage is for HDFC, Axis, ICICI, SBI, BoB, RBL,
  IDFC FIRST, and Standard Chartered. Other issuers are mostly live-web-backed,
  and seven small-bank cards remain explicitly low-confidence estimates.
- I found and corrected one concrete data mismatch: `sbi-cashback` had a
  Rs. 5,000 cashback cap, while the archived SBI PDF caps aggregate online plus
  offline cashback at Rs. 4,000 per statement cycle.
- The current schema is suitable for rendering and calculator behavior, but it
  is not yet strong enough for source auditability. The next schema improvement
  should add machine-readable evidence references to local PDFs/manifests.

## Validation performed

Commands run locally:

| Check | Result |
| --- | --- |
| `npm.cmd --prefix site run prebuild` | Pass. 351 YAML files valid; 317 cards, 24 issuers, 5 networks, 5 loyalty programs generated. |
| `npm.cmd --prefix site test -- --run` | Pass. 67 tests across 7 test files. |
| `npm.cmd --prefix site run typecheck` | Pass. |
| `npm.cmd --prefix site run build` | Pass after the data correction. 327 static pages generated. |
| Python PDF parse with `pypdf` | 261 PDFs parsed; 2,888 total pages; 0 failures; 0 encrypted PDFs. |

Note: `scripts/validate.py` did not run in the bundled Python runtime because
`PyYAML` is not installed there. The repo lists `PyYAML` in
`scripts/requirements.txt`, but the local default review environment does not
have those Python dependencies installed. The Node schema path is healthy; the
Python cross-file lint path is not locally reproducible without installing the
requirements.

## Dataset inventory

| Metric | Count |
| --- | ---: |
| Cards | 317 |
| Issuers | 24 |
| Networks | 5 |
| Active cards | 287 |
| Invite-only cards | 17 |
| On-hold cards | 5 |
| Discontinued cards | 8 |
| PDF files | 261 |
| PDF pages | 2,888 |

Cards by issuer:

| Issuer | Cards |
| --- | ---: |
| SBI | 49 |
| Axis | 40 |
| YES | 28 |
| HDFC | 27 |
| BoB | 23 |
| ICICI | 23 |
| IndusInd | 23 |
| AU | 21 |
| Kotak | 19 |
| IDFC FIRST | 18 |
| Standard Chartered | 10 |
| RBL | 9 |
| HSBC | 7 |
| Amex | 6 |
| Federal | 5 |
| BOI, Canara, IDBI, KVB, OneCard, PNB, slice, South Indian, Union | 1 each |

## PDF archive findings

The PDF archive itself is in good shape. The issue is not file corruption; it is
uneven source mapping.

Per-card PDF maps:

| Issuer | Manifest style | Manifest cards/entries | PDF refs | Actual PDFs | Issue |
| --- | --- | ---: | ---: | ---: | --- |
| Axis | per-card PDF map | 39 | 79 | 79 | Clean, except Axis Olympus is sourced from a different Axis URL not represented in the manifest. |
| HDFC | per-card PDF map | 27 | 120 | 120 | Clean. Several YAML source URLs still point to older `hdfcbank.com` pages while archived PDFs came from `hdfc.bank.in`. |
| ICICI | per-card PDF map | 22 | 36 | 36 | Clean. Manchester United Signature is not mapped in the ICICI per-card PDF manifest. |
| SBI | per-card/page-slug PDF map | 67 | 20 | 19 | One missing reference: `FAILED 404 Landmark-SBI-Card-Booklet.pdf`. SBI manifest keys use official page slugs, not always dataset card slugs. |

Partial/shared PDF evidence:

| Issuer | Actual PDFs | Observation |
| --- | ---: | --- |
| BoB | 2 | Manifest is an audit note, not a per-card PDF map. The PDFs are useful but not machine-linked to cards. |
| IDFC FIRST | 2 | Manifest is an audit note; Ashva and Mayura PDFs are present but not listed as per-card refs. |
| RBL | 2 | Manifest is an audit note; shared charges and World Safari T&C PDFs are present but not listed as per-card refs. |
| Standard Chartered | 1 | Ultimate T&C PDF is present but not listed as a per-card ref. |

Low-text PDFs:

- `docs/sources/axis/flipkart/flipkart-axis-bank-credit-card-preferred-merchants.pdf`
  produced only 5 sampled text characters.
- `docs/sources/icici/_shared/voucher-redemption-manual-2.pdf` produced only 7
  sampled text characters from the first 8 pages.

These are likely image-heavy or extraction-hostile PDFs. They should not be
deleted; they should be marked as requiring OCR or manual review.

## Accuracy spot checks

I used broad automated checks plus targeted full-text reads on high-impact
cards. These spot checks do not prove every field in every one of the 317 cards,
but they do show whether the local evidence model is trustworthy.

| Card | Local PDF evidence | Result |
| --- | --- | --- |
| HDFC Infinia | HDFC shared MITC and Infinia PDFs | Fees, annual waiver spend, forex, and finance charge are supported by the shared MITC. The local packet mentions SmartBuy terms, but the exact base earn and SmartBuy cap were not cleanly located in extracted text. Treat rewards as source-backed but worth a targeted recheck against the live card page or SmartBuy T&C. |
| Axis Atlas | Atlas feature PDFs | Reward earn rates are supported: 2 EDGE Miles/INR 100 base, 5 EDGE Miles/INR 100 travel, and INR 2,00,000 monthly travel cap. Fee/forex values were not found in the two local Atlas PDFs I searched, so those appear to depend on page text or another shared charges source. |
| SBI Cashback | `cashback-tnc-ekit.pdf` | Mismatch found and fixed. PDF states aggregate online plus offline cashback is capped at Rs. 4,000 per statement cycle; YAML previously had Rs. 5,000/month. |
| Amazon Pay ICICI | Amazon Pay T&C plus ICICI shared MITC | Reward bands are supported: 5%, 3%, 2%, and 1%. ICICI shared MITC supports 1.99% forex for Amazon Pay ICICI. The local PDF did not cleanly expose explicit zero joining/annual fee text, so that remains page-backed. |
| Swiggy HDFC | Swiggy HDFC T&C PDF | Supported: 10% Swiggy cashback capped at Rs. 1,500, 5% online cashback capped at Rs. 1,500, and 1% other-category cashback capped at Rs. 500 per billing cycle. |

## Data issues and risks

### Fixed in this review

- `data/cards/sbi/cashback.yaml`: changed accelerated cashback cap from 5,000
  monthly to 4,000 per statement cycle, matching the archived SBI PDF.

### Remaining issues

1. The source schema does not identify exact local evidence files.
   Each fee/reward/benefit record has `source.url` and `retrieved_on`, but not
   `source.type`, `confidence`, `local_pdf_refs`, `source_excerpt`, or
   `field_confidence`. That makes it hard to automatically prove which PDF
   supports which field.

2. Manifests use multiple shapes.
   Axis/HDFC/ICICI/SBI are per-card maps. Several other issuers use compact
   audit-note manifests. This is readable by humans but weak for automation.

3. Seven issuers are explicitly low-confidence.
   BOI, Canara, IDBI, KVB, PNB, South Indian, and Union are documented in
   `docs/PROVENANCE.md` as page-redirect/no-source cards. Their values should
   be treated as estimates until fresh issuer evidence is captured.

4. Some dates disagree inside the same card.
   I found 31 section-level cases where `metadata.last_verified_on` differs
   from the nested `source.retrieved_on`. Affected cards include
   `axis-magnus`, `axis-olympus`, `hdfc-6e-rewards`, `hdfc-indianoil`,
   `hdfc-marriott-bonvoy`, `hdfc-pixel-play`, `hdfc-tata-neu-infinity`,
   `icici-manchester-united-signature`, `kotak-myntra-kaching`,
   `kotak-pvr-gold`, `rbl-zomato-edition`, `sbi-aurum`, and `yes-premia`.
   Some of this is legitimate when a card was re-reviewed against older
   evidence, but it should be explained by `last_swept_on` or notes.

5. Some official URLs are stale or split across migrations.
   HDFC is the clearest example: archived PDFs came from `hdfc.bank.in`, while
   several YAML source URLs still point to `hdfcbank.com`. This does not make
   the values wrong, but it weakens traceability.

6. Eligibility, income, credit score, and launch dates are not uniformly
   source-verified.
   `docs/PROVENANCE.md` already says these are often tier-standard defaults.
   They should not be presented as issuer-confirmed facts unless a source says
   so.

7. The local Python lint path is not reproducible out of the box.
   Node schema validation passes, but `scripts/validate.py` requires Python
   dependencies that are not present in the bundled runtime.

## Schema suitability review

The current hybrid schema is the right base for the product. It handles:

- dated fee/reward/benefit records,
- card-wide and accelerator-specific reward caps,
- MCC exclusions,
- alternate accelerator semantics such as `effective_rate` and
  `earn_components`,
- `last_verified_on` versus `last_swept_on`.

For user-facing card comparison and the calculator, this schema is more
suitable than a simpler flat schema. For auditability, it needs one more layer:

Recommended `Source` upgrade:

```json
{
  "url": "https://issuer.example/card",
  "retrieved_on": "2026-07-03",
  "type": "issuer-pdf",
  "confidence": "high",
  "local_refs": [
    "docs/sources/sbi/cashback/cashback-tnc-ekit.pdf"
  ],
  "fields_verified": [
    "rewards.accelerated.cap_per_cycle",
    "rewards.accelerated.cycle"
  ],
  "notes": "PDF says aggregate online plus offline cashback is capped at Rs. 4,000 per statement cycle."
}
```

This would let the repo verify source coverage mechanically without relying on
YAML header comments or separate prose documents.

## Recommended cleanup backlog

1. Normalize all `_manifest.json` files to one schema with issuer-level metadata
   plus optional per-card `pdfs`, `shared`, `source_type`, and `notes`.
2. Add `local_refs` or `evidence_refs` to `schema/card.schema.json` and migrate
   high-confidence cards first.
3. Add an OCR/manual-review marker for low-text PDFs instead of treating them as
   ordinary text-extractable evidence.
4. Reconcile the 31 `metadata.last_verified_on` versus `source.retrieved_on`
   mismatches.
5. Capture better evidence for the seven low-confidence small-bank cards.
6. Make Python validation reproducible locally, either by documenting the exact
   install command or porting the remaining cross-file lints into the Node
   validation path.
7. Re-run a targeted rewards check for HDFC Infinia and fee/forex checks for
   Axis Atlas, because the local PDFs support many but not all of those fields
   through clean extractable text.

## Bottom line

The local project is in good overall shape after the merge: it has the expected
300+ card catalog, passes the site validation/build pipeline, and preserves a
substantial local PDF evidence archive. The dataset is useful and mostly
well-sourced, but it is not yet a fully machine-auditable source-of-truth. The
next quality step is not more freeform review; it is stricter evidence mapping
inside the schema and manifests.
