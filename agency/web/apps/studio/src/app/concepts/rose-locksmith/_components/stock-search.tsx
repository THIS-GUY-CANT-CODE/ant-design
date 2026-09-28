'use client';
import { useMemo, useState } from 'react';
import { PHONE, STOCK } from './data';

/** Matches what someone types against the shop's own list of what it sells. */
export function matchStock(q: string) {
  const words = q.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1);
  if (!words.length) return [];
  return STOCK.filter((s) => words.some((w) => s.words.some((k) => k.startsWith(w) || w.startsWith(k)) || s.name.toLowerCase().includes(w)));
}

export function StockSearch() {
  const [q, setQ] = useState('');
  const hits = useMemo(() => matchStock(q), [q]);
  return (
    <div id="stock" className="scroll-mt-32 rounded-[2rem] bg-card p-7 md:p-10">
      <p className="font-mono text-[12px] text-muted">BEFORE YOU COME IN</p>
      <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] font-bold tracking-[-0.045em]">Do you stock…?</h2>
      <label htmlFor="stock-q" className="sr-only">What are you looking for?</label>
      <input id="stock-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try “hinges”, “garage remote” or “sage green paint”" className="mt-8 w-full rounded-2xl border border-line bg-bg px-5 py-4 text-[18px] outline-none focus:border-accent" />
      <div aria-live="polite" className="mt-5 min-h-20">
        {q.trim().length > 1 && hits.length > 0 && (
          <div>
            <p className="text-[18px] font-bold">Yes, that&apos;s the kind of thing we sell.</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {hits.map((h) => (
                <li key={h.name} className="rounded-full bg-accent px-4 py-2 text-[14px] font-medium text-accent-ink">{h.name}</li>
              ))}
            </ul>
            <p className="mt-3 text-[14px] text-muted">Stock changes, so for something specific, <a className="underline" href={`tel:${PHONE.shop[1]}`}>call {PHONE.shop[0]}</a> and we&apos;ll check the shelf.</p>
          </div>
        )}
        {q.trim().length > 1 && hits.length === 0 && (
          <p className="text-[16px]">
            Not on our list, but we might have it. <a className="font-medium underline" href={`tel:${PHONE.shop[1]}`}>Call {PHONE.shop[0]}</a> and ask.
          </p>
        )}
      </div>
      <p className="mt-2 text-[13px] text-muted">We sell: {STOCK.map((s) => s.name.split(' (')[0]).join(', ')}.</p>
    </div>
  );
}
