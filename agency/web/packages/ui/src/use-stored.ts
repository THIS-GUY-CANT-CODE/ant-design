'use client';
import { useCallback, useSyncExternalStore } from 'react';

/** A value kept in localStorage, safe to render on the server (returns `initial` there), synced across tabs. */
export function useStored<T>(key: string, initial: T) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const on = (e: Event) => (e instanceof StorageEvent ? e.key === key && cb() : (e as CustomEvent).detail === key && cb());
      window.addEventListener('storage', on);
      window.addEventListener('sc-store', on);
      return () => {
        window.removeEventListener('storage', on);
        window.removeEventListener('sc-store', on);
      };
    },
    [key],
  );
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    () => null,
  );
  const value: T = raw == null ? initial : safeParse(raw, initial);
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      let prev = initial;
      try {
        const r = localStorage.getItem(key);
        if (r != null) prev = safeParse(r, initial);
      } catch {}
      const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      try {
        localStorage.setItem(key, JSON.stringify(v));
      } catch {}
      window.dispatchEvent(new CustomEvent('sc-store', { detail: key }));
    },
    [key, initial],
  );
  return [value, set] as const;
}

const cache = new Map<string, unknown>();
function safeParse<T>(raw: string, fallback: T): T {
  // keep the same object for the same string so React sees a stable snapshot
  if (cache.has(raw)) return cache.get(raw) as T;
  try {
    const v = JSON.parse(raw) as T;
    cache.set(raw, v);
    return v;
  } catch {
    return fallback;
  }
}
