"use client";

import { useMemo, useState } from "react";
import {
  ROUTES,
  DEFAULT_PT,
  rankChannels,
  isTie,
  type RouteKey,
  type PointValues,
  type ChannelResult,
} from "@/lib/booking";
import { formatInr } from "@/lib/utils";

const ROUTE_KEYS: RouteKey[] = ["dom-flight", "intl-flight", "dom-hotel", "intl-hotel"];

/** Clamp a rupee input to a finite, sane range. */
function clampPrice(raw: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(1_00_00_000, n);
}

export function BookingClient() {
  const [routeKey, setRouteKey] = useState<RouteKey>("dom-flight");
  const route = ROUTES[routeKey];
  const [price, setPrice] = useState<number>(route.P);
  const [pt, setPt] = useState<PointValues>(DEFAULT_PT);
  const [showPts, setShowPts] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [editing, setEditing] = useState<string | null>(null);

  // When the route changes, reset the price to that route's typical baseline and clear overrides.
  const onRoute = (k: RouteKey) => {
    setRouteKey(k);
    setPrice(ROUTES[k].P);
    setOverrides({});
  };

  const rows = useMemo(
    () => rankChannels(route, price > 0 ? price : route.P, pt, overrides),
    [route, price, pt, overrides],
  );
  const best = rows[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
      {/* ---- input rail ---- */}
      <form className="space-y-4 lg:sticky lg:top-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">What are you booking?</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ROUTE_KEYS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onRoute(k)}
                aria-pressed={k === routeKey}
                className={
                  k === routeKey
                    ? "rounded-full border border-brand-500 bg-brand-50 text-brand-800 px-3 py-1 text-xs font-medium"
                    : "rounded-full border border-slate-300 bg-white text-slate-600 px-3 py-1 text-xs"
                }
              >
                {ROUTES[k].label}
              </button>
            ))}
            <span className="rounded-full border border-dashed border-slate-300 bg-white text-slate-400 px-3 py-1 text-xs">
              Electronics · soon
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-700 mb-1">Cheapest price you can find</label>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">₹</span>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(clampPrice(e.target.value))}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            The cheapest sticker price (e.g. on ixigo / EaseMyTrip). We treat this as the baseline and add each
            channel&apos;s typical markup on top.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-3">
          <button
            type="button"
            onClick={() => setShowPts((s) => !s)}
            className="text-xs font-medium text-slate-700 hover:text-slate-900"
          >
            {showPts ? "▾" : "▸"} What are your points worth elsewhere?
          </button>
          {showPts ? (
            <div className="mt-2 space-y-2 text-xs">
              <PtField label="Reward Points (SmartBuy)" value={pt.rp} onChange={(v) => setPt({ ...pt, rp: v })} />
              <PtField label="EDGE Miles — floor" value={pt.atlasFloor} onChange={(v) => setPt({ ...pt, atlasFloor: v })} />
              <PtField label="EDGE Miles — transfer" value={pt.atlasXfer} onChange={(v) => setPt({ ...pt, atlasXfer: v })} />
              <p className="text-slate-500">
                Used for the &quot;pay with points&quot; row — burning a point worth ₹2 elsewhere to cover a ₹1
                portal rate is a leak.
              </p>
            </div>
          ) : null}
        </div>
      </form>

      {/* ---- results ---- */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Ranked by what you actually pay</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Net cost = price + channel markup − discount − reward value. Markups are estimates shown as ranges;
          when two ranges overlap it&apos;s a near-tie.
        </p>

        <ol className="mt-4 space-y-3">
          {rows.map((r, i) => (
            <ChannelRow
              key={r.channel.name}
              row={r}
              rank={i + 1}
              best={best}
              editing={editing === r.channel.name}
              onEdit={() => setEditing(editing === r.channel.name ? null : r.channel.name)}
              onOverride={(markup) => {
                setOverrides((o) => ({ ...o, [r.channel.name]: markup }));
                setEditing(null);
              }}
              onReset={() => {
                setOverrides((o) => {
                  const n = { ...o };
                  delete n[r.channel.name];
                  return n;
                });
                setEditing(null);
              }}
              basePrice={price > 0 ? price : route.P}
              hasOverride={overrides[r.channel.name] != null}
            />
          ))}
        </ol>

        {best ? (
          <p className="mt-4 rounded-md bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-900">
            <strong>Winner: {best.channel.name}</strong> — about {formatInr(Math.round(best.netMid))} out of
            pocket. The highest-reward channel isn&apos;t always this one; the markup and any blocked coupon are
            netted in.
          </p>
        ) : null}
        <p className="mt-3 text-xs text-slate-400">
          Estimates. Markups vary with dynamic pricing; rewards assume you book on the stated channel and redeem
          as noted. Bank instant discounts are mostly sale-only — confirm the actual price before you pay.
        </p>
      </div>
    </div>
  );
}

function PtField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex items-center justify-between gap-2">
      <span className="text-slate-600">{label}</span>
      <span className="flex items-center gap-1">
        <span className="text-slate-400">₹</span>
        <input
          type="number"
          step={0.1}
          min={0}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-16 rounded border border-slate-300 px-1.5 py-0.5 text-right tabular-nums focus:border-brand-500 focus:outline-none"
        />
      </span>
    </label>
  );
}

function ChannelRow({
  row,
  rank,
  best,
  editing,
  onEdit,
  onOverride,
  onReset,
  basePrice,
  hasOverride,
}: {
  row: ChannelResult;
  rank: number;
  best: ChannelResult;
  editing: boolean;
  onEdit: () => void;
  onOverride: (markup: number) => void;
  onReset: () => void;
  basePrice: number;
  hasOverride: boolean;
}) {
  const { channel: ch } = row;
  const isBest = rank === 1;
  const tie = !isBest && isTie(row, best);
  const delta = row.netMid - best.netMid;
  const marked = ch.markupLevel !== "none";
  const isPoints = ch.mode === "points";
  const rangeSpread = Math.round(row.netHi - row.netLo);

  const [quote, setQuote] = useState("");

  return (
    <li className={isBest ? "rounded-xl border-2 border-brand-500 bg-brand-50 p-4" : "rounded-xl border border-slate-200 bg-white p-4"}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {isBest ? <span className="text-[10px] font-bold uppercase tracking-wide text-brand-700">★ cheapest</span> : null}
            <span className="font-semibold text-slate-900">{ch.name}</span>
            <span className="text-[10px] rounded-full bg-slate-100 text-slate-500 px-1.5 py-0.5">{ch.mode}</span>
            {marked ? (
              hasOverride ? (
                <span className="text-[10px] rounded-full bg-emerald-50 text-emerald-700 px-1.5 py-0.5">your quote</span>
              ) : (
                <span className="text-[10px] rounded-full bg-slate-100 text-slate-500 px-1.5 py-0.5" title="Markup is a research-based estimate — paste a real quote to firm it up">estimate ⓘ</span>
              )
            ) : (
              <span className="text-[10px] rounded-full bg-slate-50 text-slate-400 px-1.5 py-0.5">firm</span>
            )}
          </div>
          {/* waterfall line */}
          <div className="mt-1 text-xs text-slate-600 tabular-nums">
            {isPoints ? (
              <>burns ~{Math.round(row.pointsBurned).toLocaleString("en-IN")} pts worth {formatInr(Math.round(row.pointsBurned * (ch.pointAlt ?? 1)))} elsewhere</>
            ) : (
              <>
                {marked ? "~" : ""}
                {formatInr(Math.round(row.priceMid + row.discount))} price
                {row.discount > 0 ? <> · −{formatInr(Math.round(row.discount))} offer</> : null}
                {row.reward > 0 ? <> · <span className="text-emerald-700">−{formatInr(Math.round(row.reward))} reward</span></> : null}
              </>
            )}
          </div>
          {ch.note ? <div className="mt-0.5 text-[11px] text-slate-500">{ch.note}</div> : null}
          {ch.closedLoopNote ? <div className="mt-0.5 text-[11px] text-amber-700">🔒 {ch.closedLoopNote}</div> : null}
          {isPoints && marked ? (
            <div className="mt-0.5 text-[11px] text-rose-600">Redeeming on a marked-up portal wastes value — pay cash and keep the points.</div>
          ) : null}
          {marked ? (
            <button type="button" onClick={onEdit} className="mt-1 text-[11px] text-brand-700 hover:underline">
              {editing ? "cancel" : hasOverride ? "edit / reset quote" : "I have a real price"}
            </button>
          ) : null}
          {editing ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500">Real price for this channel:</span>
              <span className="flex items-center gap-1">
                <span className="text-slate-400">₹</span>
                <input type="number" value={quote} onChange={(e) => setQuote(e.target.value)} className="w-24 rounded border border-slate-300 px-1.5 py-0.5 tabular-nums focus:border-brand-500 focus:outline-none" />
              </span>
              <button
                type="button"
                onClick={() => {
                  const q = Number(quote);
                  if (Number.isFinite(q) && q > 0 && basePrice > 0) onOverride(q / basePrice - 1);
                }}
                className="rounded bg-brand-600 text-white px-2 py-0.5 hover:bg-brand-700"
              >
                Use my price
              </button>
              {hasOverride ? (
                <button type="button" onClick={onReset} className="text-slate-500 hover:underline">reset to estimate</button>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-semibold tabular-nums text-emerald-700">
            {marked && !hasOverride ? "~" : ""}
            {formatInr(Math.round(row.netMid))}
          </div>
          {marked && !hasOverride && rangeSpread > 50 ? (
            <div className="text-[10px] text-slate-400 tabular-nums">
              {formatInr(Math.round(row.netLo))}–{formatInr(Math.round(row.netHi))}
            </div>
          ) : null}
          {!isBest ? (
            tie ? (
              <div className="text-[11px] text-amber-600">≈ tie</div>
            ) : (
              <div className="text-[11px] text-slate-500 tabular-nums">+{formatInr(Math.round(delta))}</div>
            )
          ) : null}
        </div>
      </div>
    </li>
  );
}
