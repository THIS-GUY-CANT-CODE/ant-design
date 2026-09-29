'use client';
import { useEffect, useState } from 'react';
import { distanceKm, walkMinutes } from './geo';

/* Live departures from TfL's Unified API (free, CORS enabled, no key needed at this volume). */

type Stop = { naptanId: string; commonName: string; distance: number; lat: number; lon: number; modes: string[]; lines: { id: string; name: string }[] };
type Arrival = { id: string; lineId: string; lineName: string; platformName?: string; destinationName?: string; towards?: string; expectedArrival: string; modeName: string };
type LineStatus = { id: string; name: string; lineStatuses: { statusSeverity: number; statusSeverityDescription: string; reason?: string }[] };

const MODES = ['tube', 'overground', 'elizabeth-line', 'dlr'];
const API = 'https://api.tfl.gov.uk';

const shortName = (n: string) => n.replace(/ (Underground|Rail|DLR) Station$/, '').replace(/ Station$/, '');
const cleanDest = (n?: string) => (n ?? '').replace(/ (Underground|Rail|DLR) Station$/, '').replace(/ Station$/, '');

async function json<T>(url: string, signal: AbortSignal): Promise<T> {
  const r = await fetch(url, { signal });
  if (!r.ok) throw new Error(String(r.status));
  return (await r.json()) as T;
}

/** Nearest stations to a point, with live next trains and line status, refreshed every 30 seconds. */
export function LiveDepartures({ lat, lng, radius = 1200, maxStops = 2, className }: { lat: number; lng: number; radius?: number; maxStops?: number; className?: string }) {
  const [stops, setStops] = useState<Stop[] | null>(null);
  const [arrivals, setArrivals] = useState<Record<string, Arrival[]>>({});
  const [status, setStatus] = useState<Record<string, LineStatus>>({});
  const [error, setError] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    let timer = 0;
    const load = async (found: Stop[]) => {
      try {
        const lineIds = [...new Set(found.flatMap((s) => s.lines.map((l) => l.id)))];
        const [arr, st] = await Promise.all([
          Promise.all(found.map((s) => json<Arrival[]>(`${API}/StopPoint/${s.naptanId}/Arrivals`, ctrl.signal))),
          lineIds.length ? json<LineStatus[]>(`${API}/Line/${lineIds.join(',')}/Status`, ctrl.signal) : Promise.resolve([]),
        ]);
        setArrivals(Object.fromEntries(found.map((s, i) => [s.naptanId, arr[i]!.sort((a, b) => +new Date(a.expectedArrival) - +new Date(b.expectedArrival))])));
        setStatus(Object.fromEntries(st.map((l) => [l.id, l])));
        setNow(Date.now());
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setError(true);
      }
    };
    (async () => {
      try {
        const res = await json<{ stopPoints: Stop[] }>(`${API}/StopPoint/?lat=${lat}&lon=${lng}&stopTypes=NaptanMetroStation,NaptanRailStation&radius=${radius}&modes=${MODES.join(',')}`, ctrl.signal);
        const seen = new Set<string>();
        const found = res.stopPoints
          .filter((s) => s.modes.some((m) => MODES.includes(m)))
          .sort((a, b) => a.distance - b.distance)
          .filter((s) => (seen.has(s.naptanId) ? false : (seen.add(s.naptanId), true)))
          .slice(0, maxStops);
        setStops(found);
        await load(found);
        timer = window.setInterval(() => document.visibilityState === 'visible' && load(found), 30_000);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setError(true);
      }
    })();
    const tick = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => {
      ctrl.abort();
      clearInterval(timer);
      clearInterval(tick);
    };
  }, [lat, lng, radius, maxStops]);

  if (error)
    return (
      <div className={className}>
        <p className="text-[15px] opacity-70">Live train times aren&apos;t available right now.</p>
        <a className="mt-2 inline-block text-[15px] font-medium underline underline-offset-4" href="https://tfl.gov.uk/plan-a-journey/" target="_blank" rel="noopener">
          Plan your journey on TfL ↗
        </a>
      </div>
    );
  if (!stops) return <div className={`h-40 animate-pulse rounded-2xl bg-current/5 ${className ?? ''}`} aria-busy="true" aria-label="Loading live train times" />;
  if (!stops.length) return <p className={`text-[15px] opacity-70 ${className ?? ''}`}>No stations within walking distance.</p>;

  return (
    <div className={`grid gap-3 ${className ?? ''}`} aria-live="polite">
      {stops.map((s) => {
        const walk = walkMinutes(distanceKm({ lat, lng }, { lat: s.lat, lng: s.lon }));
        const list = (arrivals[s.naptanId] ?? []).filter((a) => +new Date(a.expectedArrival) > (now || Date.now()) - 30_000).slice(0, 5);
        return (
          <div key={s.naptanId} className="rounded-2xl border border-current/15 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[18px] font-semibold tracking-[-0.02em]">{shortName(s.commonName)}</p>
              <p className="text-[13px] opacity-60">{walk} min walk</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {s.lines.map((l) => {
                const ls = status[l.id]?.lineStatuses[0];
                const good = !ls || ls.statusSeverity === 10;
                return (
                  <span key={l.id} title={ls?.reason} className="inline-flex items-center gap-1.5 rounded-full bg-current/[0.06] px-2.5 py-1 text-[12px]">
                    <span className={`size-1.5 rounded-full ${good ? 'bg-[#16A34A]' : 'bg-[#EA580C]'}`} />
                    {l.name}
                    {ls && !good && <span className="opacity-70">· {ls.statusSeverityDescription}</span>}
                  </span>
                );
              })}
            </div>
            <ul className="mt-3 divide-y divide-current/10 text-[14px]">
              {list.length === 0 && <li className="py-2 opacity-60">No live departures listed right now.</li>}
              {list.map((a) => {
                const mins = Math.round((+new Date(a.expectedArrival) - (now || Date.now())) / 60000);
                return (
                  <li key={a.id} className="flex items-baseline justify-between gap-3 py-2">
                    <span className="min-w-0 truncate">
                      <b className="font-semibold">{a.lineName}</b> <span className="opacity-70">to {cleanDest(a.destinationName) || a.towards || 'check front of train'}</span>
                    </span>
                    <span className="shrink-0 font-mono tabular-nums">{mins <= 0 ? 'Due' : `${mins} min`}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <p className="text-[12px] opacity-50">Live from TfL. Updates every 30 seconds.</p>
    </div>
  );
}
