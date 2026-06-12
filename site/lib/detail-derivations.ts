/**
 * Pure derivation helpers for the card detail page.
 *
 * Keeps presentation logic out of components — each function returns a
 * string / string[] built from the EnrichedCard so components can stay
 * narrowly focused on layout.
 */

import type { AcceleratedReward, EnrichedCard, RewardRecord } from "./types";
import { formatInr, formatPct } from "./utils";
import { pointsToPct } from "./rate-math.mjs";

/**
 * Comparable value percentage for an accelerator. Normalises
 * `effective_rate` (reward units per effective_per_inr/base.per_inr rupees —
 * the receipt-visible total, NOT a percent) and `multiplier` (× base) onto
 * one scale so pickTopAccelerated doesn't compare "45 pts/₹200" against
 * "10×" naively and pick the wrong headline.
 */
function effectivePctOf(a: AcceleratedReward, rewards: RewardRecord | null): number {
  if (!rewards?.base) return 0;
  const unitValue =
    rewards.base.unit_value_inr_realized ??
    rewards.base.unit_value_inr ??
    (rewards.currency === "cashback" ? 1 : null);
  if (a.effective_rate != null) {
    if (unitValue == null) return 0;
    const perInr = a.effective_per_inr ?? rewards.base.per_inr;
    return pointsToPct(a.effective_rate, perInr, unitValue);
  }
  if (a.multiplier != null) {
    return pointsToPct(rewards.base.rate, rewards.base.per_inr, unitValue ?? 1) * a.multiplier;
  }
  return 0;
}

/**
 * Receipt-visible rate string for an accelerator: "5%" for cashback,
 * "45 pts per ₹200" for points/miles, "10×" when only a multiplier is set.
 */
export function formatAcceleratedRate(a: AcceleratedReward, rewards: RewardRecord | null): string {
  if (a.effective_rate == null) return `${a.multiplier}×`;
  const perInr = a.effective_per_inr ?? rewards?.base.per_inr ?? 100;
  if (!rewards || rewards.currency === "cashback") {
    const pct = (a.effective_rate / perInr) * 100;
    return `${Number(pct.toFixed(2))}%`;
  }
  const unit = rewards.currency === "miles" ? "miles" : "pts";
  return `${a.effective_rate} ${unit} per ₹${perInr}`;
}

/** Map co-brand category to a human "Best suited for" label. */
export function bestSuitedFor(card: EnrichedCard): string {
  const cat = card.co_brand?.category;
  if (cat) {
    switch (cat) {
      case "airline":
      case "hotel":
      case "travel-agency":
        return "Travel";
      case "ecommerce":
      case "retail":
        return "Online shopping";
      case "fuel":
        return "Fuel";
      case "lifestyle":
      case "railway":
        return "Lifestyle & travel";
      case "telecom":
        return "Bill payments";
      default:
        return "Co-brand rewards";
    }
  }
  const tags = card.metadata.tags ?? [];
  if (tags.includes("travel")) return "Travel";
  if (tags.includes("dining")) return "Dining";
  if (tags.includes("cashback") || tags.includes("flat-cashback")) return "Cashback";
  if (tags.includes("premium") || tags.includes("super-premium")) return "Lifestyle & travel";
  if (tags.includes("online-spend")) return "Online shopping";
  return "Everyday spends";
}

/** Short human-readable reward currency label. */
export function rewardTypeLabel(card: EnrichedCard): string {
  const cur = card.current_rewards?.currency;
  const name = card.current_rewards?.currency_name;
  if (!cur) return "—";
  if (cur === "cashback") return "Cashback";
  if (cur === "miles") return name ? `${name} (miles)` : "Air miles";
  if (cur === "points") return name ? `${name} (points)` : "Reward points";
  return cur;
}

/** 2–3 sentence prose summary derived from card attributes. */
export function summaryProse(card: EnrichedCard): string[] {
  const sentences: string[] = [];
  const fee = card.current_fees?.annual_fee_inr ?? null;
  const partner = card.co_brand?.partner;
  const topAccel = pickTopAccelerated(card);
  const issuer = card.issuer_detail.name;
  const tierLabel = card.tier.replace("-", " ");

  // Sentence 1: positioning
  if (partner) {
    sentences.push(
      `The ${card.name} is a ${tierLabel} co-branded credit card from ${issuer} and ${partner}` +
        (fee !== null ? `, with a joining fee of ${formatInr(fee)} + GST.` : "."),
    );
  } else {
    sentences.push(
      `The ${card.name} is a ${tierLabel} credit card from ${issuer}` +
        (fee !== null ? `, with a joining fee of ${formatInr(fee)} + GST.` : "."),
    );
  }

  // Sentence 2: headline reward
  if (topAccel) {
    const rewards = card.current_rewards ?? null;
    const rate = formatAcceleratedRate(topAccel, rewards);
    const valuePct = effectivePctOf(topAccel, rewards);
    const value =
      rewards && rewards.currency !== "cashback" && valuePct > 0
        ? ` (≈${formatPct(valuePct, 1)} value)`
        : "";
    const where = partner ? partner : topAccel.category.replace(/-/g, " ");
    sentences.push(
      `It earns up to ${rate}${value} on ${where} spends` +
        (card.current_rewards?.currency
          ? ` in the form of ${rewardTypeLabel(card).toLowerCase()}.`
          : "."),
    );
  }

  // Sentence 3: lounge / welcome
  const lounge = card.current_benefits?.lounge_access;
  const welcome = card.current_benefits?.welcome?.[0];
  if (lounge?.domestic || lounge?.international) {
    const parts: string[] = [];
    if (lounge.domestic) {
      const v = lounge.domestic.visits_per_cycle;
      parts.push(`${v} ${lounge.domestic.cycle ?? "yr"} domestic`);
    }
    if (lounge.international) {
      const v = lounge.international.visits_per_cycle;
      parts.push(`${v} ${lounge.international.cycle ?? "yr"} international`);
    }
    sentences.push(`Cardholders get ${parts.join(" + ")} airport lounge access${welcome ? `, plus ${welcome.benefit.toLowerCase()} as a welcome benefit.` : "."}`);
  } else if (welcome) {
    sentences.push(`Welcome benefit: ${welcome.benefit}.`);
  }

  // Discontinued footnote
  if (card.status === "discontinued") {
    sentences.push(
      `This card was discontinued${
        card.discontinued_on ? ` on ${card.discontinued_on}` : ""
      } and is no longer accepting new applications.`,
    );
  }
  return sentences;
}

/** 3–6 key bullets for the Product Details section. */
export function productDetails(card: EnrichedCard): string[] {
  const bullets: string[] = [];
  const fee = card.current_fees?.annual_fee_inr ?? null;
  const waiver = card.computed.fee_waiver_spend_inr;
  const partner = card.co_brand?.partner;
  const networkName = card.network_detail?.name ?? card.network;

  if (partner) {
    bullets.push(
      `Co-branded ${card.tier.replace("-", " ")} card by ${card.issuer_detail.name} and ${partner}.`,
    );
  } else {
    bullets.push(`${card.tier.replace("-", " ")} card issued by ${card.issuer_detail.name}.`);
  }
  if (fee === 0) {
    bullets.push(`Lifetime free — no joining or annual fee.`);
  } else if (fee !== null) {
    bullets.push(
      `Joining / annual fee of ${formatInr(fee)} + GST${
        waiver ? `, waived on annual spends of ${formatInr(waiver)}` : ""
      }.`,
    );
  }
  bullets.push(`Available on the ${networkName} network.`);
  const lounge = card.current_benefits?.lounge_access;
  if (lounge?.domestic || lounge?.international) {
    const parts: string[] = [];
    if (lounge.domestic) parts.push(`domestic (${lounge.domestic.visits_per_cycle}/${lounge.domestic.cycle ?? "yr"})`);
    if (lounge.international) parts.push(`international (${lounge.international.visits_per_cycle}/${lounge.international.cycle ?? "yr"})`);
    bullets.push(`Complimentary airport lounge access: ${parts.join(" + ")}.`);
  }
  const ins = card.current_benefits?.insurance ?? [];
  if (ins.length > 0) {
    bullets.push(`Insurance cover bundled: ${ins.map((i) => i.type.replace(/-/g, " ")).join(", ")}.`);
  }
  return bullets;
}

/** Derive a handful of automatic pros from card attributes. */
export function derivePros(card: EnrichedCard): string[] {
  const pros: string[] = [];
  if (card.computed.is_lifetime_free) pros.push("Lifetime-free — no joining or annual fee.");
  if (card.computed.has_fee_waiver) {
    pros.push(`Annual fee waivable on ${formatInr(card.computed.fee_waiver_spend_inr)} spend.`);
  }
  const base = card.computed.headline_rate_pct;
  if (base !== null && base >= 1.5) pros.push(`Strong base reward rate of ${formatPct(base, 2)}.`);
  // 2.5% is the practical cutoff — standard forex markup is 3.5% on most
  // cards, so anything below 3 reads as "preferential" even without the
  // sub-1% outliers (OneCard, Scapia).
  const forex = card.current_fees?.forex_markup_pct;
  if (forex !== null && forex !== undefined && forex < 3) {
    pros.push(`Low forex markup of ${formatPct(forex, 2)} — suited to international spends.`);
  }
  if (card.current_benefits?.lounge_access?.international) {
    pros.push("Complimentary international airport lounge access.");
  } else if (card.current_benefits?.lounge_access?.domestic) {
    const d = card.current_benefits.lounge_access.domestic;
    pros.push(
      `Complimentary domestic airport lounge access (${d.visits_per_cycle}/${d.cycle ?? "year"}).`,
    );
  }
  if (card.current_benefits?.concierge) pros.push("24/7 concierge service.");
  if (card.current_benefits?.milestones?.length) {
    pros.push("Milestone-based bonus rewards on annual / quarterly spend thresholds.");
  }
  const topAccel = pickTopAccelerated(card);
  if (topAccel) {
    const pct = effectivePctOf(topAccel, card.current_rewards ?? null);
    if (pct >= 3) {
      pros.push(
        `Accelerated earn worth ≈${formatPct(pct, 1)} on ${topAccel.category.replace(/-/g, " ")}.`,
      );
    }
  }
  return pros;
}

export function deriveCons(card: EnrichedCard): string[] {
  const cons: string[] = [];
  const fee = card.current_fees?.annual_fee_inr ?? 0;
  if (fee >= 5000) cons.push(`High annual fee of ${formatInr(fee)}.`);
  if (!card.computed.has_fee_waiver && fee > 0) cons.push("No annual-fee waiver option.");
  const forex = card.current_fees?.forex_markup_pct;
  if (forex !== null && forex !== undefined && forex >= 3.5) {
    cons.push(`Standard forex markup of ${formatPct(forex, 2)} — suboptimal for international spend.`);
  }
  if (card.current_rewards?.exclusions?.includes("fuel")) {
    cons.push("No rewards on fuel spends.");
  }
  if (!card.current_benefits?.lounge_access?.domestic && !card.current_benefits?.lounge_access?.international) {
    cons.push("No complimentary airport lounge access.");
  }
  if (card.computed.is_invite_only) cons.push("Invite-only — limited availability.");
  const redemption = card.current_rewards?.redemption?.[0];
  if (redemption && (redemption.type === "voucher" || redemption.type === "cashback-bank")) {
    if (redemption.constraints && /only|exclusive|limited to/i.test(redemption.constraints)) {
      cons.push(`Rewards redeemable only with ${redemption.program ?? "a specific partner"}.`);
    }
  }
  if (card.status === "discontinued") cons.push("No longer accepting new applications.");
  return cons;
}

/** Returns the highest-value accelerated reward entry, normalising effective_rate (units per ₹N) and multiplier (×) to a comparable value-% scale. */
export function pickTopAccelerated(card: EnrichedCard) {
  const acc = card.current_rewards?.accelerated ?? [];
  if (!acc.length) return null;
  const rewards = card.current_rewards;
  return [...acc].sort((a, b) => effectivePctOf(b, rewards) - effectivePctOf(a, rewards))[0];
}

/** Format an accelerated reward as a one-line summary. */
export function formatAccelerated(a: AcceleratedReward, rewards: RewardRecord | null): string {
  const rate = formatAcceleratedRate(a, rewards);
  const where = a.category.replace(/-/g, " ");
  const cap =
    a.cap_per_cycle === "unlimited" || a.cap_per_cycle == null
      ? null
      : `cap ${a.cap_per_cycle}${a.cap_unit ? ` ${a.cap_unit.replace("-", " ")}` : ""} / ${a.cycle ?? "cycle"}`;
  return cap ? `${rate} on ${where} (${cap})` : `${rate} on ${where}`;
}
