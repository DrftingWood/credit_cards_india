import type { EnrichedCard } from "@/lib/types";
import { formatInr, formatPct } from "@/lib/utils";
import { InfoGrid, type InfoCell } from "./info-grid";

export function FeesChargesGrid({ card }: { card: EnrichedCard }) {
  const fees = card.current_fees;
  const fuel = card.current_benefits?.fuel_surcharge_waiver;
  const redemption = card.current_rewards?.redemption?.[0];

  const spendWaiver = fees?.fee_waiver
    ? `${formatInr(fees.fee_waiver.spend_inr)} in the preceding year`
    : "Not waivable";

  const redemptionFee =
    redemption?.fee_inr != null
      ? `${formatInr(redemption.fee_inr)} + GST per redemption`
      : "N/A";

  const forex = formatPct(fees?.forex_markup_pct, 2);

  const interest = fees?.finance_charge_monthly_pct != null
    ? `${formatPct(fees.finance_charge_monthly_pct, 2)} per month (${formatPct(fees.finance_charge_monthly_pct * 12, 1)} annualised)`
    : "N/A";

  const fuelWaiver = fuel
    ? `${formatPct(fuel.pct, 1)} waiver on transactions ${
        fuel.min_txn_inr ? `between ${formatInr(fuel.min_txn_inr)}` : ""
      }${fuel.max_txn_inr ? ` and ${formatInr(fuel.max_txn_inr)}` : ""}${
        fuel.cap_per_cycle_inr
          ? `, capped at ${formatInr(fuel.cap_per_cycle_inr)} per ${fuel.cycle ?? "cycle"}`
          : ""
      }.`
    : "N/A";

  const cashAdvance = fees?.cash_advance_fee
    ? `${formatPct(fees.cash_advance_fee.pct ?? null, 1)} or ${formatInr(fees.cash_advance_fee.min_inr ?? null)} (whichever is higher)`
    : "N/A";

  const cells: InfoCell[] = [
    { label: "Spend-Based Waiver", value: spendWaiver },
    { label: "Rewards Redemption Fee", value: redemptionFee },
    { label: "Foreign Currency Markup", value: forex },
    { label: "Interest Rates", value: interest },
    { label: "Fuel Surcharge Waiver", value: fuelWaiver },
    { label: "Cash Advance Charges", value: cashAdvance },
  ];

  return <InfoGrid title="Fees & Charges" cells={cells} />;
}
