# Visual references (2026-10)

Five reference sites for the visual redesign pass. The goal from
`docs/PROGRADE_DESIGN_WORKFLOW.md` is a finance-grade decision tool that feels
calm, dense and trustworthy, not an affiliate blog or a generic SaaS page.

> **Provenance:** these notes come from the author's own knowledge of the sites.
> They were **not web-checked** in this pass, and the sites may have changed
> since. Re-verify before citing any specific pattern. No screenshots of these
> sites are committed (copyright; see the 2026-07 benchmark constraints).

| # | Site | Why it is relevant | Borrow | Avoid |
| --- | --- | --- | --- | --- |
| 1 | **Stripe Docs** (docs.stripe.com) | Dense technical reference that still reads calmly; strong light and dark themes | Neutral greys with one saturated accent; hairline borders instead of heavy shadows; monospace for figures and code; a quiet left rail with a clear active state; callouts tinted by meaning (info, warning, danger) instead of loud fills | Too much marketing gradient on the top-level pages. Our pages are tools, not launches |
| 2 | **Linear** (linear.app) | Best-in-class dark mode and tight type hierarchy | Dark surfaces stepped by lightness, not pure black (canvas, then surface, then raised); restrained elevation (a 1px light edge plus a soft shadow); small uppercase section labels; a consistent 4px spacing rhythm | Low-contrast grey-on-grey secondary text. We hold every text token to ≥4.5:1 |
| 3 | **Wise** (wise.com) | Money product that leads with the number and shows the fee | Fee transparency as the hero element ("you pay X, they get Y"); big tabular figures with small units; plain, factual copy; one strong primary action per screen | Its bright brand green is too playful for our tone. Keep a blue accent |
| 4 | **NerdWallet** (nerdwallet.com) | The closest analogue: a credit-card comparison site with editorial trust cues | Card tile anatomy (art, name, two key numbers, then chips); visible "how we rate" and methodology links next to rankings; pros/cons blocks; comparison tables with a sticky header and row labels | Star ratings and "Apply now" pressure. These are lead-gen patterns that conflict with our no-affiliate promise |
| 5 | **Zerodha Varsity** (zerodha.com/varsity) | Indian finance education. Trusted, unflashy, readable for beginners | Generous reading measure and line height for explainer prose (about pages, methodology); ₹ and lakh/crore formatting conventions; a warm neutral background with simple illustration; chapter-style progress | Long-form layout for tool pages. Keep it to the about and methodology pages |

## What this pass adopted

- **Palette:** neutral slate-blue greys and one blue accent (Stripe, Linear).
  Status colours are used only as tinted callouts (Stripe), and the "how we
  rank" band uses the warn tint.
- **Depth:** the canvas, surface, subtle and muted steps, plus a four-step
  elevation scale. Dark mode raises surfaces by lightness instead of shadow
  (Linear).
- **Numbers first:** tabular figures, ₹ formatting and large metric type are
  already in place (Wise, Varsity). The type scale keeps them.
- **Trust cues:** the inverse "why you can trust the numbers" band and the
  methodology link stay prominent (NerdWallet's useful half).

## Still to borrow (later passes)

- A sticky first column and header on the compare table (NerdWallet, Stripe API
  tables).
- Reading-measure caps (about 70ch) on the about and methodology prose
  (Varsity).
- An explicit 1px top highlight on raised dark surfaces (Linear), if
  elevation alone reads too flat.
