import { createPersistedStore } from "./persisted-store";
import { DEFAULT_USAGE, sanitizeUsage, type UsageProfile } from "./usage";

const store = createPersistedStore<UsageProfile>("cc-usage-profile-v1", DEFAULT_USAGE, sanitizeUsage);

export const readUsage = store.read;
export const writeUsage = store.write;
export const subscribeUsage = store.subscribe;
/** React hook: shared, persisted usage profile (merchant shares, ecosystems) across all calculators. */
export const useUsageProfile = store.use;
