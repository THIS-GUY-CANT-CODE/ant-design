'use client';
import { useSyncExternalStore } from 'react';

const subscribe = (cb: () => void) => {
  const i = setInterval(cb, 15_000);
  return () => clearInterval(i);
};
// Encoded as one number so the snapshot is stable between renders: day * 10000 + minutes since midnight.
const snap = () => {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  return d.getDay() * 10000 + d.getHours() * 60 + d.getMinutes();
};

/** Current day (0 = Sunday) and minutes past midnight in London; null during server render. */
export function useLondonTime() {
  const v = useSyncExternalStore(subscribe, snap, () => null);
  if (v === null) return null;
  const day = Math.floor(v / 10000), mins = v % 10000;
  const label = `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
  return { day, mins, label };
}

/** True if `mins` on `day` falls inside any of that day's [open, close) ranges. */
export const isOpenAt = (hours: Record<number, [number, number][]>, day: number, mins: number) =>
  (hours[day] ?? []).some(([a, b]) => mins >= a && mins < b);
