# IndusInd Bank — audit + verification (2026-07-03)

Review of the IndusInd Bank credit-card catalogue against the live
**indusind.bank.in** site (Playwright + DOM extraction; the site is tab-based via
`?tabName=` and heavily JS-rendered), 2026-07-03.

## Systematic findings

1. **Domain migration.** `indusind.com` → **`indusind.bank.in`** (the 6th `.bank.in`
   migration this audit run). IndusInd had **no** entry in the validator's
   `ISSUER_ALLOWED_DOMAINS` — added it.
2. **Fabricated reward tiers.** Iconia carried invented "weekend-dining 3X" +
   "international 3X" accelerators; the real structure is 0.75 RP/₹100 weekday, 1
   RP/₹100 weekend. Removed (mirrors the fabricated 6X found on IDFC).
3. **2024-25 benefit reductions the dataset missed:**
   - Legend: **lounge access discontinued 7-Mar-2025** (was 4/yr) — removed.
   - Pinnacle: golf cut to **1 game + 1 lesson/month** (eff 13-Mar-2025).
   - Platinum: base fixed 1 RP/₹100 → **1.5 RP/₹150**.
4. **Redemption-value resets (eff Mar-2024 / cash caps Sep-2024)** captured on
   Platinum (₹0.60/₹0.40), Iconia (₹0.75/₹0.50), Crest (cash cap 10k/mo). Inflated
   ₹0.35 face values corrected to ₹0.25/₹0.20 on the points cards.

## Catalogue reconciliation

**5 existing — all handled:** legend, pinnacle, platinum, iconia (all corrected),
eazydiner-platinum (verified active/LTF).

**19 new cards added:** tiger, avios (Avios metal), nexxt (interactive modes),
celesta, samman (govt RuPay), jio-bp-mobility (Smiles), crest, cred, indulge
(invite), poonawalla-platinum-rupay, intermiles-odyssey-amex/visa +
intermiles-voyage-amex/visa, pioneer-private/heritage/legacy (invite), duo.

## MCC pass
Universal rent (MCC 6513) exclusion on all IndusInd cards. See
[`indusind-mcc-map.md`](indusind-mcc-map.md).

## Follow-ups
IndusInd's tab-based site resists deep extraction, so many new/co-brand/invite cards
carry `# TODO verify` on exact fees, reward rates/caps, lounge counts, and network —
close from each card's MITC / rate-card PDF in the final TODO-cleanup wave.
