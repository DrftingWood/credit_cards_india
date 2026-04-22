"use client";

import { useMemo } from "react";
import type { EnrichedCard, IssuerRecord } from "@/lib/types";
import type { FilterState } from "@/lib/filters";
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

export function FilterBar({ state, onChange, cards, issuers }: Props) {
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
    <aside className="space-y-5 text-sm">
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
                  <IssuerLogo issuer={iss} variant="with-name" height={16} />
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
            label={<NetworkLogo network={n} height={18} />}
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

      <Group title="Features">
        <Check
          checked={state.lifetimeFree}
          onChange={() => onChange({ ...state, lifetimeFree: !state.lifetimeFree })}
          label="Lifetime free"
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
