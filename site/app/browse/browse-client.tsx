"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import type { EnrichedCard, IssuerRecord } from "@/lib/types";
import { EMPTY_FILTERS, filterCards, paramsToState, stateToParams } from "@/lib/filters";
import { CardGrid } from "@/components/card-grid";
import { FilterBar } from "@/components/filter-bar";

export function BrowseClient({
  cards,
  issuers,
}: {
  cards: EnrichedCard[];
  issuers: IssuerRecord[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [state, setState] = useState(() => paramsToState(new URLSearchParams(params.toString())));

  // Keep URL in sync (replace, not push, so back-button isn't flooded)
  useEffect(() => {
    const q = stateToParams(state).toString();
    router.replace((q ? `/browse?${q}` : "/browse") as never, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const fuse = useMemo(
    () =>
      new Fuse(cards, {
        keys: ["name", "issuer_detail.name", "issuer_detail.short_name", "metadata.tags"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [cards],
  );

  const searched = useMemo(() => {
    if (!state.q.trim()) return cards;
    return fuse.search(state.q).map((r) => r.item);
  }, [cards, fuse, state.q]);

  const filtered = useMemo(() => filterCards(searched, state), [searched, state]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
      <FilterBar state={state} onChange={setState} cards={cards} issuers={issuers} />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-slate-600">
            Showing <strong>{filtered.length}</strong> of {cards.length}
          </div>
          {hasAny(state) ? (
            <button
              type="button"
              onClick={() => setState(EMPTY_FILTERS)}
              className="text-sm text-brand-600 hover:text-brand-700"
            >
              Reset filters
            </button>
          ) : null}
        </div>
        <CardGrid cards={filtered} />
      </div>
    </div>
  );
}

function hasAny(s: ReturnType<typeof paramsToState>): boolean {
  return (
    !!s.q ||
    s.issuers.length > 0 ||
    s.networks.length > 0 ||
    s.tiers.length > 0 ||
    s.currencies.length > 0 ||
    s.lifetimeFree ||
    s.domesticLounge ||
    s.intlLounge ||
    s.inviteOnly !== null ||
    s.coBrandOnly
  );
}
