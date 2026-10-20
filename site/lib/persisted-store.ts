import { useSyncExternalStore } from "react";

/**
 * A tiny shared, localStorage-persisted store — the pattern every calculator input
 * uses (spend profile, value prefs, …) so all views read and write one source.
 *
 * `sanitize` runs on every write AND on whatever localStorage hands back, so a
 * hostile or stale stored value can never reach the engines. On the server (and on
 * first paint) the store reports `defaults`; the browser hydrates from storage at
 * module init.
 */
export interface PersistedStore<T> {
  read: () => T;
  write: (updater: (s: T) => T) => void;
  subscribe: (cb: () => void) => () => void;
  /** React hook over the store. */
  use: () => [T, (updater: (s: T) => T) => void];
}

export function createPersistedStore<T>(key: string, defaults: T, sanitize: (raw: unknown) => T): PersistedStore<T> {
  const listeners = new Set<() => void>();
  const load = (): T => {
    if (typeof window === "undefined") return sanitize(defaults);
    try {
      const raw = window.localStorage.getItem(key);
      return sanitize(raw ? JSON.parse(raw) : defaults);
    } catch {
      return sanitize(defaults);
    }
  };
  let current = load();
  const read = () => current;
  const write = (updater: (s: T) => T) => {
    current = sanitize(updater(current));
    if (typeof window !== "undefined") {
      try { window.localStorage.setItem(key, JSON.stringify(current)); } catch { /* storage full/blocked — keep in-memory */ }
    }
    listeners.forEach((l) => l());
  };
  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  };
  const use = (): [T, (updater: (s: T) => T) => void] => [useSyncExternalStore(subscribe, read, () => defaults), write];
  return { read, write, subscribe, use };
}
