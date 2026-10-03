import type { ClientCard } from "./types";

/** GST on card fees in India. Fee figures in the dataset are pre-GST list prices. */
export const GST_PCT = 18;

/** Annual fee as actually billed: list fee + GST unless the record says GST doesn't apply. */
export function annualFeeWithGst(fees: ClientCard["current_fees"]): number {
  const fee = fees?.annual_fee_inr ?? 0;
  if (fees?.gst_applicable === false) return fee;
  // Integer arithmetic keeps paise exact (499 → 588.82, not 588.8199999999999).
  return (fee * (100 + GST_PCT)) / 100;
}
