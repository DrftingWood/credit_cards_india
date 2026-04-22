"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import type { EnrichedCard } from "@/lib/types";
import { CompareTable } from "@/components/compare-table";
import { IssuerLogo } from "@/components/logos/issuer-logo";
import { NetworkLogo } from "@/components/logos/network-logo";

const MAX_CARDS = 4;

export function CompareClient({ cards }: { cards: EnrichedCard[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const [selectedIds, setSelectedIds] = useState<string[]>(() => parseIds(params.get("cards")));
  const [query, setQuery] = useState("");

  // URL <-> state sync (replace, not push)
  useEffect(() => {
    const q = selectedIds.length ? `?cards=${selectedIds.join(",")}` : "";
    router.replace(`/compare${q}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds]);

  const fuse = useMemo(
    () =>
      new Fuse(cards, {
        keys: ["name", "issuer_detail.name", "issuer_detail.short_name", "metadata.tags"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [cards],
  );

  const selected = useMemo(
    () =>
      selectedIds
        .map((id) => cards.find((c) => c.id === id))
        .filter((c): c is EnrichedCard => !!c),
    [selectedIds, cards],
  );

  const suggestions = useMemo(() => {
    if (!query.trim()) return [] as EnrichedCard[];
    return fuse
      .search(query)
      .map((r) => r.item)
      .filter((c) => !selectedIds.includes(c.id))
      .slice(0, 8);
  }, [fuse, query, selectedIds]);

  const addCard = useCallback(
    (id: string) => {
      setSelectedIds((ids) => {
        if (ids.includes(id)) return ids;
        if (ids.length >= MAX_CARDS) return ids;
        return [...ids, id];
      });
      setQuery("");
    },
    [],
  );

  const removeCard = useCallback((id: string) => {
    setSelectedIds((ids) => ids.filter((x) => x !== id));
  }, []);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-sm text-slate-600">
            {selected.length === 0 ? (
              <>Pick up to {MAX_CARDS} cards to compare side by side.</>
            ) : (
              <>
                <strong>{selected.length}</strong> of {MAX_CARDS} selected.{" "}
                {selectedIds.length > 0 ? (
                  <button
                    type="button"
                    className="text-brand-600 hover:text-brand-700 ml-1"
                    onClick={() => setSelectedIds([])}
                  >
                    Clear all
                  </button>
                ) : null}
              </>
            )}
          </div>
        </div>

        <div className="mt-3 relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              selectedIds.length >= MAX_CARDS
                ? `Maximum ${MAX_CARDS} cards selected`
                : "Search by card or issuer name…"
            }
            disabled={selectedIds.length >= MAX_CARDS}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          {suggestions.length > 0 ? (
            <div className="absolute left-0 right-0 mt-1 z-10 rounded-md border border-slate-200 bg-white shadow-sm max-h-72 overflow-auto">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => addCard(s.id)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-0"
                >
                  <div className="font-medium text-slate-900">{s.name}</div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <IssuerLogo issuer={s.issuer_detail} height={16} />
                    <span>· {s.tier.replace("-", " ")} ·</span>
                    <NetworkLogo network={s.network_detail} height={16} />
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {selected.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {selected.map((s) => (
              <span
                key={s.id}
                className="chip chip-brand inline-flex items-center gap-2 py-1"
              >
                {s.name}
                <button
                  type="button"
                  onClick={() => removeCard(s.id)}
                  aria-label={`Remove ${s.name}`}
                  className="-mr-1 text-brand-700/70 hover:text-brand-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {selected.length >= 2 ? (
        <CompareTable cards={selected} />
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          {selected.length === 0 ? (
            <>Add at least 2 cards above to see the comparison.</>
          ) : (
            <>
              Add one more card to compare with{" "}
              <Link
                href={`/card/${selected[0].issuer}/${selected[0].id.slice(selected[0].issuer.length + 1)}`}
                className="underline"
              >
                {selected[0].name}
              </Link>
              .
            </>
          )}
        </div>
      )}
    </div>
  );
}

function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean).slice(0, MAX_CARDS);
}
