"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import type { EnrichedCard, IssuerRecord } from "@/lib/types";
import { EMPTY_FILTERS, filterCards, paramsToState, stateToParams } from "@/lib/filters";
import { PAGE_SIZE, browseHref, paginate, parsePage, type BrowseView } from "@/lib/paginate";
import { cn } from "@/lib/utils";
import { CardGrid } from "@/components/card-grid";
import { CardTable } from "@/components/card-table";
import { Pager } from "@/components/pager";
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

  const view: BrowseView = params.get("view") === "table" ? "table" : "cards";
  const rawPage = parsePage(params.get("page") ?? undefined);

  // Keep URL in sync (replace, not push, so back-button isn't flooded). Only a real filter change
  // writes: it keeps `view`, and drops `page` so a new result set starts at page 1. Pager and view
  // links own the other params, and a mount that matches the URL must not strip them.
  useEffect(() => {
    const next = stateToParams(state);
    const cur = new URLSearchParams(params.toString());
    cur.delete("page");
    cur.delete("view");
    if (next.toString() === cur.toString()) return;
    router.replace(browseHref(next, 1, view) as never, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Sync the other direction too: when the URL changes after mount (back/forward,
  // or arriving at /browse?tag=… while this client is already mounted), adopt it.
  // Guard against the state→URL effect above by comparing serialised forms — an
  // equal round-trip returns the current state, so the two effects don't loop (C3).
  const paramString = params.toString();
  useEffect(() => {
    const fromUrl = paramsToState(new URLSearchParams(paramString));
    setState((cur) =>
      stateToParams(cur).toString() === stateToParams(fromUrl).toString() ? cur : fromUrl,
    );
  }, [paramString]);

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

  const paged = paginate(filtered, rawPage);
  const filterParams = stateToParams(state);
  const first = (paged.page - 1) * PAGE_SIZE + 1;
  const hrefFor = (p: number) => browseHref(filterParams, p, view);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
      {/* On mobile the filter list is long; show results first and let filters
          follow, so users aren't scrolling past every filter to reach cards.
          On md+ the sidebar returns to the left column (C3). */}
      <div className="order-2 md:order-none">
        <FilterBar state={state} onChange={setState} cards={cards} issuers={issuers} />
      </div>

      <div className="order-1 md:order-none">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div aria-live="polite" className="text-sm text-fg-muted num">
            {paged.total === 0 ? (
              "No cards"
            ) : (
              <>
                Showing{" "}
                <strong>
                  {first}–{first + paged.items.length - 1}
                </strong>{" "}
                of {paged.total} cards
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {hasAny(state) ? (
              <button
                type="button"
                onClick={() => setState(EMPTY_FILTERS)}
                className="hit-dense text-sm text-accent-fg hover:text-accent-strong"
              >
                Reset filters
              </button>
            ) : null}
            <ViewToggle view={view} hrefFor={(v) => browseHref(filterParams, paged.page, v)} />
          </div>
        </div>
        {view === "table" && paged.items.length > 0 ? (
          <CardTable cards={paged.items} />
        ) : (
          <CardGrid cards={paged.items} />
        )}
        <Pager page={paged.page} pageCount={paged.pageCount} hrefFor={hrefFor} />
      </div>
    </div>
  );
}

function ViewToggle({ view, hrefFor }: { view: BrowseView; hrefFor: (v: BrowseView) => string }) {
  const router = useRouter();
  const options: { id: BrowseView; label: string }[] = [
    { id: "cards", label: "Cards" },
    { id: "table", label: "Table" },
  ];
  return (
    <div role="group" aria-label="Layout" className="inline-flex rounded-md border border-line p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={view === o.id}
          onClick={() => router.replace(hrefFor(o.id) as never, { scroll: false })}
          className={cn(
            "hit-dense rounded px-3 text-sm",
            view === o.id ? "bg-accent text-on-accent font-semibold" : "text-fg-secondary hover:bg-surface-muted",
          )}
        >
          {o.label}
        </button>
      ))}
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
    s.coBrandCategories.length > 0 ||
    s.tags.length > 0 ||
    s.forexBand !== null ||
    s.lifetimeFree ||
    s.feeWaiver ||
    s.domesticLounge ||
    s.intlLounge ||
    s.hasMilestones ||
    s.hasWelcomeBonus ||
    s.inviteOnly !== null ||
    s.coBrandOnly
  );
}
