'use client';
import { CopyButton, Num, ShareButton, toast, useStored } from '@sc/ui';
import { useEffect, useMemo, useState } from 'react';
import { APPROX } from './data';

/* ---------- Colour room with a saved palette ---------- */
const COLOURS = [
  ['Chalk', '#ECE7DD'], ['Rose', '#E0607E'], ['Olive', '#7C8363'], ['Ink', '#1F2330'], ['Clay', '#C0714F'], ['Sky', '#A9C3D6'], ['Butter', '#F1D98A'], ['Graphite', '#3C3D40'],
  ['Moss', '#5E6B4E'], ['Terracotta', '#B5563A'], ['Lilac', '#B9A7C9'], ['Sea', '#2F6F73'],
] as const;
const lum = (hex: string) => {
  const v = parseInt(hex.slice(1), 16);
  return ((v >> 16) & 255) * 0.299 + ((v >> 8) & 255) * 0.587 + (v & 255) * 0.114;
};
const EMPTY: string[] = [];

export function ColourRoom() {
  const [hex, setHex] = useState('#E0607E');
  const [saved, setSaved] = useStored<string[]>('rose-palette', EMPTY);
  // a shared palette arrives as ?p=hex,hex
  useEffect(() => {
    const p = new URLSearchParams(location.search).get('p');
    if (!p) return;
    const list = p.split(',').filter((h) => /^[0-9a-f]{6}$/i.test(h)).map((h) => `#${h.toUpperCase()}`);
    if (list.length) {
      setSaved((prev) => [...new Set([...prev, ...list])].slice(0, 12));
      toast.success(`${list.length} shared colour${list.length > 1 ? 's' : ''} added to your palette`);
    }
  }, [setSaved]);
  const ink = lum(hex) > 150 ? '#0F0F0F' : '#F2F1EC';
  const name = COLOURS.find(([, h]) => h.toLowerCase() === hex.toLowerCase())?.[0] ?? hex.toUpperCase();
  const shareUrl = useMemo(() => `${typeof location === 'undefined' ? '' : location.pathname}?p=${saved.map((h) => h.slice(1)).join(',')}`, [saved]);
  return (
    <div className="overflow-hidden rounded-[2rem]">
      <div className="grid min-h-[70vh] content-between gap-10 p-7 transition-colors duration-700 ease-expo md:p-12" style={{ background: hex, color: ink }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <p className="font-mono text-[12px] opacity-70">TRY IT ON THE WALL</p>
          <p className="max-w-xs text-right text-[14px] opacity-80">Inspiration only. Bring this code, a chip or a photo and we mix the exact Dulux shade in store.</p>
        </div>
        <div>
          <p className="overflow-hidden font-display text-[clamp(4rem,14vw,14rem)] leading-[0.8] font-bold tracking-[-0.06em]" aria-live="polite">
            <span key={name} className="block animate-[rise_.7s_cubic-bezier(.16,1,.3,1)]">{name}</span>
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3" role="group" aria-label="Pick a colour">
            {COLOURS.map(([n, h]) => (
              <button key={n} onClick={() => setHex(h)} aria-pressed={hex === h} aria-label={n} data-cursor="Mix" className="size-12 rounded-full transition-transform duration-500 ease-expo hover:-translate-y-1.5 hover:scale-110 active:scale-90" style={{ background: h, boxShadow: hex === h ? `0 0 0 3px ${hex}, 0 0 0 5px ${ink}` : `inset 0 0 0 1px ${ink}33` }} />
            ))}
            <label className="relative grid size-12 cursor-pointer place-items-center rounded-full border-2 border-dashed text-[20px]" style={{ borderColor: ink }} title="Any colour">
              +
              <input type="color" value={hex} onChange={(e) => setHex(e.target.value.toUpperCase())} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Pick any colour" />
            </label>
            <button
              onClick={() => {
                if (saved.includes(hex)) return toast('Already in your palette');
                setSaved((p) => [...p, hex].slice(-12));
                toast.success(`${name} saved to your palette`);
              }}
              className="ml-auto rounded-full px-5 py-3 text-[15px] font-medium"
              style={{ background: ink, color: hex }}
            >
              Save to palette
            </button>
          </div>
        </div>
      </div>
      <div className="bg-card p-7 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-[22px] font-bold tracking-[-0.03em]">Your palette {saved.length > 0 && <span className="text-muted">({saved.length})</span>}</h3>
          {saved.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <CopyButton value={`My colours for Rose Locksmith & DIY: ${saved.join(', ')}`} label="Colour list copied" className="rounded-full border border-line px-4 py-2 text-[14px] hover:border-fg">Copy list</CopyButton>
              <ShareButton title="My paint palette" text="Colours to mix at Rose Locksmith & DIY" url={shareUrl} className="rounded-full border border-line px-4 py-2 text-[14px] hover:border-fg">Share palette</ShareButton>
              <button onClick={() => setSaved([])} className="rounded-full px-4 py-2 text-[14px] text-muted hover:text-fg">Clear</button>
            </div>
          )}
        </div>
        {saved.length === 0 ? (
          <p className="mt-3 text-[15px] text-muted">Save colours you like. They stay on this device, and you can share them or show them at the counter.</p>
        ) : (
          <ul className="mt-5 flex flex-wrap gap-3">
            {saved.map((h) => (
              <li key={h} className="group relative">
                <button onClick={() => setHex(h)} className="block size-20 rounded-2xl ring-1 ring-line transition-transform hover:-translate-y-1" style={{ background: h }} aria-label={`Show ${h}`} />
                <span className="mt-1 block text-center font-mono text-[11px] text-muted">{h}</span>
                <button onClick={() => setSaved((p) => p.filter((x) => x !== h))} aria-label={`Remove ${h}`} className="absolute -top-2 -right-2 grid size-6 place-items-center rounded-full bg-fg text-[12px] text-bg opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- Paint calculator ---------- */
const DOOR = 1.6; // m², a standard internal door
const WINDOW = 1.5; // m², a typical sash
const num = (v: string) => Math.max(0, parseFloat(v) || 0);

/** Walls (and optionally the ceiling) in m², minus doors and windows, times coats, over coverage. */
export function paintNeeded({ length, width, height, doors, windows, coats, coverage, ceiling }: { length: number; width: number; height: number; doors: number; windows: number; coats: number; coverage: number; ceiling: boolean }) {
  const walls = Math.max(0, 2 * (length + width) * height - doors * DOOR - windows * WINDOW);
  const area = walls + (ceiling ? length * width : 0);
  const litres = coverage > 0 ? (area * coats) / coverage : 0;
  return { walls, area, litres };
}

/** Cheapest-waste mix of 5L, 2.5L and 1L tins that covers `litres`. */
export function tinsFor(litres: number) {
  const need = Math.ceil(litres * 10) / 10;
  let best: { five: number; twoHalf: number; one: number; total: number } | null = null;
  for (let five = 0; five <= Math.ceil(need / 5); five++)
    for (let twoHalf = 0; twoHalf <= 3; twoHalf++)
      for (let one = 0; one <= 2; one++) {
        const total = five * 5 + twoHalf * 2.5 + one;
        if (total + 1e-9 < need) continue;
        const tins = five + twoHalf + one;
        if (!best || total < best.total - 1e-9 || (Math.abs(total - best.total) < 1e-9 && tins < best.five + best.twoHalf + best.one)) best = { five, twoHalf, one, total };
      }
  return best ?? { five: 0, twoHalf: 0, one: 0, total: 0 };
}

export function PaintCalculator() {
  const [f, setF] = useState({ length: '4', width: '3.5', height: '2.4', doors: '1', windows: '1', coats: '2', coverage: '12' });
  const [ceiling, setCeiling] = useState(false);
  const r = paintNeeded({ length: num(f.length), width: num(f.width), height: num(f.height), doors: num(f.doors), windows: num(f.windows), coats: Math.max(1, num(f.coats)), coverage: num(f.coverage), ceiling });
  const tins = tinsFor(r.litres);
  const field = (k: keyof typeof f, label: string, unit: string, step = '0.1') => (
    <label className="block">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="mt-1 flex items-center rounded-2xl border border-line bg-bg focus-within:border-accent">
        <input type="number" min="0" step={step} inputMode="decimal" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="w-full min-w-0 bg-transparent px-4 py-3 text-[18px] tabular-nums outline-none" />
        <span className="pr-4 text-[13px] text-muted">{unit}</span>
      </span>
    </label>
  );
  const tinText = [tins.five && `${tins.five} × 5L`, tins.twoHalf && `${tins.twoHalf} × 2.5L`, tins.one && `${tins.one} × 1L`].filter(Boolean).join(' + ') || 'None';
  return (
    <div id="calculator" className="grid scroll-mt-32 gap-8 rounded-[2rem] bg-card p-7 md:grid-cols-2 md:p-10">
      <div>
        <p className="font-mono text-[12px] text-muted">PAINT CALCULATOR</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] font-bold tracking-[-0.045em]">How much paint do I need?</h2>
        <div className="mt-8 grid grid-cols-3 gap-3">
          {field('length', 'Room length', 'm')}
          {field('width', 'Room width', 'm')}
          {field('height', 'Wall height', 'm')}
          {field('doors', 'Doors', '', '1')}
          {field('windows', 'Windows', '', '1')}
          {field('coats', 'Coats', '', '1')}
        </div>
        <div className="mt-3 grid grid-cols-2 items-end gap-3">
          {field('coverage', 'Coverage per litre', 'm²')}
          <label className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3.5 text-[15px]">
            <input type="checkbox" checked={ceiling} onChange={(e) => setCeiling(e.target.checked)} className="size-5 accent-[var(--accent)]" /> Include ceiling
          </label>
        </div>
        <p className="mt-4 text-[13px] text-muted">Coverage varies by paint and surface, so check the tin. Doors count as {DOOR}m² and windows as {WINDOW}m².</p>
      </div>
      <div className="flex flex-col justify-between rounded-[1.5rem] bg-alt p-7 text-bg" aria-live="polite">
        <div>
          <p className="text-[14px] opacity-60">You&apos;ll need about</p>
          <p className="mt-2 font-display text-[clamp(4rem,9vw,7rem)] leading-none font-bold tracking-[-0.06em]">
            <Num value={Math.round(r.litres * 10) / 10} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} /><span className="text-[0.4em]">L</span>
          </p>
          <p className="mt-3 text-[15px] opacity-70">
            {r.area.toFixed(1)}m² to paint{ceiling ? ' including the ceiling' : ''}, {num(f.coats) || 1} coat{num(f.coats) === 1 ? '' : 's'}.
          </p>
        </div>
        <div className="mt-8 border-t border-bg/15 pt-6">
          <p className="text-[14px] opacity-60">Least waste</p>
          <p className="mt-1 text-[26px] font-bold tracking-[-0.03em]">{tinText}</p>
          <p className="mt-1 text-[14px] opacity-60">{tins.total ? `${tins.total}L in total` : ''}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Painting forecast (Open-Meteo) ---------- */
type Forecast = { daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; precipitation_probability_max: number[]; precipitation_sum: number[]; wind_speed_10m_max: number[] }; hourly: { time: string[]; relative_humidity_2m: number[] } };

/** Rules of thumb for exterior painting: dry, mild, not too humid or windy. */
export function paintingVerdict(d: { tmax: number; tmin: number; rainChance: number; rain: number; wind: number; humidity: number }) {
  const why: string[] = [];
  if (d.rainChance >= 50 || d.rain >= 1) why.push('rain likely');
  else if (d.rainChance >= 30) why.push('chance of showers');
  if (d.tmax < 10) why.push('too cold');
  if (d.tmax > 30) why.push('too hot');
  if (d.humidity >= 85) why.push('very humid');
  if (d.wind >= 35) why.push('windy');
  const bad = d.rainChance >= 50 || d.rain >= 1 || d.tmax < 8;
  return { level: bad ? 'Skip' : why.length ? 'Okay' : 'Good', why: why.length ? why : ['dry, mild and calm'] } as const;
}

export function PaintForecast() {
  const [data, setData] = useState<Forecast | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    const ctrl = new AbortController();
    const q = new URLSearchParams({
      latitude: String(APPROX.lat),
      longitude: String(APPROX.lng),
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max',
      hourly: 'relative_humidity_2m',
      timezone: 'Europe/London',
      forecast_days: '7',
    });
    fetch(`https://api.open-meteo.com/v1/forecast?${q}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: Forecast) => setData(j))
      .catch((e) => (e as Error).name !== 'AbortError' && setError(true));
    return () => ctrl.abort();
  }, []);
  const days = useMemo(() => {
    if (!data) return [];
    return data.daily.time.map((t, i) => {
      // mean humidity across the daytime hours (9am to 5pm)
      const hrs = data.hourly.time.map((h, k) => [h, data.hourly.relative_humidity_2m[k]!] as const).filter(([h]) => h.startsWith(t) && +h.slice(11, 13) >= 9 && +h.slice(11, 13) <= 17);
      const humidity = hrs.length ? hrs.reduce((a, [, v]) => a + v, 0) / hrs.length : 70;
      const d = { tmax: data.daily.temperature_2m_max[i]!, tmin: data.daily.temperature_2m_min[i]!, rainChance: data.daily.precipitation_probability_max[i] ?? 0, rain: data.daily.precipitation_sum[i] ?? 0, wind: data.daily.wind_speed_10m_max[i] ?? 0, humidity };
      return { date: t, ...d, ...paintingVerdict(d) };
    });
  }, [data]);
  return (
    <div id="forecast" className="scroll-mt-32 rounded-[2rem] bg-card p-7 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[12px] text-muted">PAINTING OUTSIDE THIS WEEK?</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] font-bold tracking-[-0.045em]">The E2 painting forecast.</h2>
        </div>
        <p className="max-w-xs text-[13px] text-muted">Rules of thumb: dry, above 10°C, not too humid or windy. Always follow the tin.</p>
      </div>
      {error && <p className="mt-8 text-[15px] text-muted">The forecast isn&apos;t available right now.</p>}
      {!data && !error && <div className="mt-8 h-44 animate-pulse rounded-2xl bg-fg/5" aria-busy="true" />}
      {days.length > 0 && (
        <ol className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {days.map((d) => (
            <li key={d.date} className={`rounded-2xl p-4 ${d.level === 'Good' ? 'bg-[#16A34A]/12' : d.level === 'Okay' ? 'bg-[#EAB308]/15' : 'bg-fg/5'}`}>
              <p className="text-[13px] text-muted">{new Date(d.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}</p>
              <p className="mt-2 text-[22px] font-bold tracking-[-0.03em]">{d.level}</p>
              <p className="mt-1 font-mono text-[12px] tabular-nums">
                {Math.round(d.tmax)}° · {d.rainChance}% rain
              </p>
              <p className="mt-2 text-[12px] leading-snug text-muted">{d.why.join(', ')}</p>
            </li>
          ))}
        </ol>
      )}
      <p className="mt-4 text-[12px] text-muted">Weather from Open-Meteo.</p>
    </div>
  );
}
