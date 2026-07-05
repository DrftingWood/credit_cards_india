"use client";

import { useMemo, useState } from "react";
import type { EnrichedCard, IssuerRecord } from "@/lib/types";
import type { FilterState, ForexBand } from "@/lib/filters";
import { IssuerLogo } from "./logos/issuer-logo";
import { NetworkLogo } from "./logos/network-logo";

interface Props {
  state: FilterState;
  onChange: (next: FilterState) => void;
  cards: EnrichedCard[];
  issuers: IssuerRecord[];
}

const NETWORKS = ["visa", "mastercard", "rupay", "amex", "diners"] as const;
const TIERS = ["entry", "mid", "premium", "super-premium", "invite-only"] as const;
const CURRENCIES = ["points", "cashback", "miles"] as const;
const CO_BRAND_CATEGORIES = [
  "airline",
  "hotel",
  "ecommerce",
  "fuel",
  "retail",
  "travel-agency",
  "telecom",
  "lifestyle",
  "railway",
  "other",
] as const;
const FOREX_BANDS: Array<{ value: ForexBand; label: string }> = [
  { value: "low", label: "< 2%" },
  { value: "mid", label: "2 – 3%" },
  { value: "high", label: "≥ 3%" },
];

// Number of independently-active filter dimensions, used for the mobile
// toggle label ("Filters (N active)"). Mirrors browse-client's hasAny check
// but counts rather than just detecting presence.
function activeFilterCount(s: FilterState): number {
  let n = 0;
  if (s.q) n += 1;
  if (s.issuers.length > 0) n += 1;
  if (s.networks.length > 0) n += 1;
  if (s.tiers.length > 0) n += 1;
  if (s.currencies.length > 0) n += 1;
  if (s.coBrandCategories.length > 0) n += 1;
  if (s.tags.length > 0) n += 1;
  if (s.forexBand !== null) n += 1;
  if (s.lifetimeFree) n += 1;
  if (s.feeWaiver) n += 1;
  if (s.domesticLounge) n += 1;
  if (s.intlLounge) n += 1;
  if (s.hasMilestones) n += 1;
  if (s.hasWelcomeBonus) n += 1;
  if (s.inviteOnly !== null) n += 1;
  if (s.coBrandOnly) n += 1;
  return n;
}

export function FilterBar({ state, onChange, cards, issuers }: Props) {
  // Collapsed by default on mobile (<md); md+ always shows the sidebar via
  // the md:block override below, regardless of this state.
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCount = useMemo(() => activeFilterCount(state), [state]);

  // Show issuer counts so users see which options are populated.
  const counts = useMemo(() => {
    const byIssuer = new Map<string, number>();
    for (const c of cards) byIssuer.set(c.issuer, (byIssuer.get(c.issuer) ?? 0) + 1);
    return byIssuer;
  }, [cards]);

  const issuersSorted = useMemo(
    () =>
      [...issuers].sort(
        (a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0) || a.name.localeCompare(b.name),
      ),
    [issuers, counts],
  );

  function toggle<K extends keyof FilterState>(key: K, value: string) {
    const arr = state[key] as unknown as string[];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    onChange({ ...state, [key]: next } as FilterState);
  }

  return (
    <aside className="text-sm">
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        aria-expanded={mobileOpen}
        className="md:hidden sticky top-0 z-10 mb-3 flex w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
      >
        <span>Filters{activeCount > 0 ? ` (${activeCount} active)` : ""}</span>
        <span aria-hidden="true">{mobileOpen ? "▲" : "▼"}</span>
      </button>
      <div className={`space-y-5 ${mobileOpen ? "block" : "hidden"} md:block`}>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">
          Search
        </label>
        <input
          type="search"
          placeholder="Card or issuer name"
          value={state.q}
          onChange={(e) => onChange({ ...state, q: e.target.value })}
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <Group title="Issuer">
        <div className="max-h-64 overflow-auto space-y-1 pr-1">
          {issuersSorted.map((iss) => (
            <Check
              key={iss.id}
              checked={state.issuers.includes(iss.id)}
              onChange={() => toggle("issuers", iss.id)}
              label={
                <span className="inline-flex items-center gap-1.5">
                  <IssuerLogo issuer={iss} variant="with-name" height={14} />
                  <span className="text-xs text-slate-500">({counts.get(iss.id) ?? 0})</span>
                </span>
              }
            />
          ))}
        </div>
      </Group>

      <Group title="Network">
        {NETWORKS.map((n) => (
          <Check
            key={n}
            checked={state.networks.includes(n)}
            onChange={() => toggle("networks", n)}
            label={<NetworkLogo network={n} height={14} />}
          />
        ))}
      </Group>

      <Group title="Tier">
        {TIERS.map((t) => (
          <Check
            key={t}
            checked={state.tiers.includes(t)}
            onChange={() => toggle("tiers", t)}
            label={<span className="capitalize">{t.replace("-", " ")}</span>}
          />
        ))}
      </Group>

      <Group title="Reward currency">
        {CURRENCIES.map((c) => (
          <Check
            key={c}
            checked={state.currencies.includes(c)}
            onChange={() => toggle("currencies", c)}
            label={<span className="capitalize">{c}</span>}
          />
        ))}
      </Group>

      <Group title="Co-brand category">
        {CO_BRAND_CATEGORIES.map((cat) => (
          <Check
            key={cat}
            checked={state.coBrandCategories.includes(cat)}
            onChange={() => toggle("coBrandCategories", cat)}
            label={<span className="capitalize">{cat.replace("-", " ")}</span>}
          />
        ))}
      </Group>

      <Group title="Forex markup">
        <label className="flex items-center gap-2 cursor-pointer select-none hover:text-slate-900">
          <input
            type="radio"
            name="forex-band"
            className="border-slate-400 text-brand-600 focus:ring-brand-500"
            checked={state.forexBand === null}
            onChange={() => onChange({ ...state, forexBand: null })}
          />
          <span className="text-sm text-slate-700">Any</span>
        </label>
        {FOREX_BANDS.map((b) => (
          <label
            key={b.value}
            className="flex items-center gap-2 cursor-pointer select-none hover:text-slate-900"
          >
            <input
              type="radio"
              name="forex-band"
              className="border-slate-400 text-brand-600 focus:ring-brand-500"
              checked={state.forexBand === b.value}
              onChange={() => onChange({ ...state, forexBand: b.value })}
            />
            <span className="text-sm text-slate-700">{b.label}</span>
          </label>
        ))}
      </Group>

      <Group title="Features">
        <Check
          checked={state.lifetimeFree}
          onChange={() => onChange({ ...state, lifetimeFree: !state.lifetimeFree })}
          label="Lifetime free"
        />
        <Check
          checked={state.feeWaiver}
          onChange={() => onChange({ ...state, feeWaiver: !state.feeWaiver })}
          label="Annual-fee waivable"
        />
        <Check
          checked={state.domesticLounge}
          onChange={() => onChange({ ...state, domesticLounge: !state.domesticLounge })}
          label="Domestic lounge"
        />
        <Check
          checked={state.intlLounge}
          onChange={() => onChange({ ...state, intlLounge: !state.intlLounge })}
          label="International lounge"
        />
        <Check
          checked={state.hasMilestones}
          onChange={() => onChange({ ...state, hasMilestones: !state.hasMilestones })}
          label="Milestone rewards"
        />
        <Check
          checked={state.hasWelcomeBonus}
          onChange={() => onChange({ ...state, hasWelcomeBonus: !state.hasWelcomeBonus })}
          label="Welcome bonus"
        />
        <Check
          checked={state.coBrandOnly}
          onChange={() => onChange({ ...state, coBrandOnly: !state.coBrandOnly })}
          label="Co-branded"
        />
        <Check
          checked={state.inviteOnly === false}
          onChange={() =>
            onChange({ ...state, inviteOnly: state.inviteOnly === false ? null : false })
          }
          label="Exclude invite-only"
        />
      </Group>

      {state.tags.length > 0 ? (
        <Group title="Active tags">
          <div className="flex flex-wrap gap-1">
            {state.tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggle("tags", t)}
                className="chip hover:bg-slate-100"
              >
                {t.replace(/-/g, " ")} ✕
              </button>
            ))}
          </div>
        </Group>
      ) : null}
      </div>
    </aside>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none hover:text-slate-900">
      <input
        type="checkbox"
        className="rounded border-slate-400 text-brand-600 focus:ring-brand-500"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}
