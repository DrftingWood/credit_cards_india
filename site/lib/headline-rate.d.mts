import type { RewardRecord, LoyaltyProgram } from "./types";

export declare function computeHeadlineRatePct(
  rewards: RewardRecord | null | undefined,
  programsById?: Record<string, LoyaltyProgram> | null,
): number | null;
