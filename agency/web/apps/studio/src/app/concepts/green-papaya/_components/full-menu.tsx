'use client';
import { CopyButton, ShareButton, toast, useSearch, useStored } from '@sc/ui';
import { useMemo, useState } from 'react';
import { DISHES, PHONE, slug, type City, type Dish } from './site';

const CITY = { hanoi: ['Hà Nội', 'var(--hanoi)', '#1A120D'], xian: ['西安 Xi’an', 'var(--xian)', '#FFF4EA'] } as const;
const KEYS = ['name', 'desc', 'tags'];
const EMPTY: Record<string, number> = {};

/** Plain-language tip for how much to order, family style. */
export function tableTip(dishes: number, people: number) {
  if (!dishes) return `Most tables order about one dish each, plus one to share. For ${people}, that’s around ${people + 1}.`;
  const target = people + 1;
  if (dishes < people) return `${dishes} dish${dishes > 1 ? 'es' : ''} for ${people}. Add ${target - dishes} more to share properly.`;
  if (dishes <= target) return `${dishes} dishes for ${people}. That’s about right.`;
  return `${dishes} dishes for ${people}. That’s a feast. Leftovers are allowed.`;
}

export function orderText(table: Record<string, number>, people: number) {
  const lines = Object.entries(table)
    .filter(([, q]) => q > 0)
    .map(([n, q]) => `${q > 1 ? `${q} × ` : ''}${n}`);
  return `Green Papaya, table for ${people}:\n${lines.map((l) => `• ${l}`).join('\n')}`;
}

export function FullMenu() {
  const [q, setQ] = useState('');
  const [city, setCity] = useState<'all' | City>('all');
  const [favs, setFavs] = useState(false);
  const [table, setTable] = useStored<Record<string, number>>('gp-table', EMPTY);
  const [people, setPeople] = useStored<number>('gp-people', 2);
  const found = useSearch<Dish>(DISHES, KEYS, q);
  const list = found.filter((d) => (city === 'all' || d.city === city) && (!favs || d.fav));
  const count = Object.values(table).reduce((a, b) => a + b, 0);
  const add = (n: string, delta: number) =>
    setTable((t) => {
      const next = { ...t, [n]: Math.max(0, (t[n] ?? 0) + delta) };
      if (!next[n]) delete next[n];
      return next;
    });
  const pick = () => {
    const pool = list.length ? list : DISHES;
    const d = pool[Math.floor(Math.random() * pool.length)]!;
    document.getElementById(slug(d.name))?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast(`Tonight: ${d.name}`, { action: { label: 'Add to table', onClick: () => add(d.name, 1) } });
  };
  const text = useMemo(() => orderText(table, people), [table, people]);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="sticky top-24 z-10 -mx-2 rounded-3xl bg-bg/90 p-2 backdrop-blur-md">
          <label htmlFor="menu-q" className="sr-only">Search the menu</label>
          <input id="menu-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: noodles, pork, squid, spicy…" className="w-full rounded-2xl border border-line bg-card px-5 py-4 text-[18px] outline-none focus:border-accent" />
          <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Filter the menu">
            {(
              [
                ['all', 'Both kitchens'],
                ['hanoi', 'Hà Nội'],
                ['xian', '西安 Xi’an'],
              ] as const
            ).map(([v, l]) => (
              <button key={v} aria-pressed={city === v} onClick={() => setCity(v)} className={`rounded-full px-4 py-2 text-[14px] transition-colors ${city === v ? 'bg-fg text-bg' : 'bg-card hover:bg-fg/10'}`}>
                {l}
              </button>
            ))}
            <button aria-pressed={favs} onClick={() => setFavs(!favs)} className={`rounded-full px-4 py-2 text-[14px] transition-colors ${favs ? 'bg-accent text-accent-ink' : 'bg-card hover:bg-fg/10'}`}>
              ★ Favourites
            </button>
            <button onClick={pick} className="ml-auto rounded-full bg-accent px-4 py-2 text-[14px] font-semibold text-accent-ink">Pick for me</button>
          </div>
        </div>
        <p className="mt-4 text-[14px] text-muted" aria-live="polite">
          {list.length} dish{list.length === 1 ? '' : 'es'}
          {q && ` matching “${q}”`}
        </p>
        <ul className="mt-2 border-t border-line">
          {list.map((d) => {
            const qty = table[d.name] ?? 0;
            const [label, bg, ink] = CITY[d.city];
            return (
              <li key={d.name} id={slug(d.name)} className="group grid scroll-mt-48 gap-3 border-b border-line py-6 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-none font-bold tracking-[-0.04em]" style={{ fontStretch: '85%' }}>
                    {d.name}
                    {d.fav && <sup className="ml-2 align-super text-[12px] font-semibold tracking-normal text-accent">★ Favourite</sup>}
                  </p>
                  <p className="mt-2 max-w-lg text-[15px] text-muted">{d.desc}</p>
                  <span className="mt-3 inline-block rounded-full px-3 py-1 text-[12px] font-semibold" style={{ background: bg, color: ink }}>{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {qty > 0 && (
                    <>
                      <button onClick={() => add(d.name, -1)} aria-label={`One less ${d.name}`} className="grid size-11 place-items-center rounded-full border border-line text-[20px] hover:border-fg">−</button>
                      <span className="w-6 text-center text-[18px] font-bold tabular-nums" aria-label={`${qty} on your table`}>{qty}</span>
                    </>
                  )}
                  <button onClick={() => add(d.name, 1)} className={`rounded-full px-5 py-3 text-[14px] font-semibold transition-colors ${qty ? 'size-11 px-0' : ''} bg-fg text-bg hover:bg-accent hover:text-accent-ink`} aria-label={qty ? `One more ${d.name}` : `Add ${d.name} to your table`}>
                    {qty ? '+' : 'Add to table'}
                  </button>
                </div>
              </li>
            );
          })}
          {list.length === 0 && <li className="py-10 text-[17px] text-muted">Nothing matches. Try another word, or clear the filters.</li>}
        </ul>
        <p className="mt-6 text-[13px] text-muted">These are the dishes regulars name most. Prices and the full menu are still to come. Please tell staff about any allergies.</p>
      </div>

      <aside id="planner" className="scroll-mt-28 lg:col-span-4">
        <div className="sticky top-24 rounded-[2rem] bg-alt p-7 text-bg">
          <p className="text-[13px] opacity-60">Your table</p>
          <div className="mt-3 flex items-center justify-between">
            <p className="font-display text-[34px] leading-none font-bold tracking-[-0.04em]">Table for {people}</p>
            <div className="flex gap-1">
              <button onClick={() => setPeople(Math.max(1, people - 1))} aria-label="Fewer people" className="grid size-10 place-items-center rounded-full border border-bg/25">−</button>
              <button onClick={() => setPeople(Math.min(20, people + 1))} aria-label="More people" className="grid size-10 place-items-center rounded-full border border-bg/25">+</button>
            </div>
          </div>
          {count === 0 ? (
            <p className="mt-6 text-[15px] opacity-70">Add dishes from the menu to plan what to order, then send the list to whoever you&apos;re eating with.</p>
          ) : (
            <ul className="mt-6 divide-y divide-bg/10">
              {Object.entries(table).map(([n, qty]) => (
                <li key={n} className="flex items-center justify-between gap-3 py-2.5 text-[15px]">
                  <span>{qty > 1 ? `${qty} × ` : ''}{n}</span>
                  <button onClick={() => add(n, -qty)} className="text-[13px] opacity-60 hover:opacity-100" aria-label={`Remove ${n}`}>Remove</button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-5 rounded-2xl bg-bg/10 p-4 text-[14px]" aria-live="polite">{tableTip(count, people)}</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <a href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener" aria-disabled={!count} className={`rounded-full bg-accent py-3 text-center text-[14px] font-semibold text-accent-ink ${count ? '' : 'pointer-events-none opacity-40'}`}>
              Send on WhatsApp
            </a>
            <CopyButton value={text} label="Order copied" className="rounded-full border border-bg/25 py-3 text-[14px] disabled:opacity-40">
              Copy list
            </CopyButton>
            <ShareButton title="Our Green Papaya order" text={text} className="rounded-full border border-bg/25 py-3 text-[14px]">Share</ShareButton>
            <button onClick={() => setTable({})} className="rounded-full py-3 text-[14px] opacity-60 hover:opacity-100">Clear</button>
          </div>
          <a href={`tel:${PHONE[1]}`} className="mt-5 block rounded-full bg-bg py-3.5 text-center text-[15px] font-semibold text-fg">Call to book, {PHONE[0]}</a>
        </div>
      </aside>
    </div>
  );
}
