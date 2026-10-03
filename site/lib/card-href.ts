/**
 * Card URL helpers. Kept free of data imports so client components can use
 * them without pulling lib/data.ts (which statically imports every
 * dist/*.json) into the browser bundle.
 */

/** Slug portion of a card's URL — the part after /card/<issuer>/. Strips the redundant "{issuer}-" prefix from the id when present so /card/hdfc/infinia matches what generateStaticParams produces. */
export function cardSlug(card: { id: string; issuer: string }): string {
  return card.id.startsWith(`${card.issuer}-`) ? card.id.slice(card.issuer.length + 1) : card.id;
}

/** Canonical detail-page href for a card. Single source of truth — use everywhere instead of inlining the slug math, which is duplicated easily and breaks when the slug convention shifts. */
export function cardHref(card: { id: string; issuer: string }): string {
  return `/card/${card.issuer}/${cardSlug(card)}`;
}
