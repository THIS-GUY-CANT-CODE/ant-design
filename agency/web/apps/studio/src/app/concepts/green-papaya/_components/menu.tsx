'use client';
import { Magnetic, Reveal, RollText } from '@sc/ui';
import { useRef, useState } from 'react';

import Link from 'next/link';
import { Bowl } from './bowl';
import { BASE, DISHES, type City } from './site';

const FILTERS: [string, 'all' | City][] = [['Everything', 'all'], ['Hà Nội', 'hanoi'], ['西安', 'xian']];

export function Menu() {
  const [filter, setFilter] = useState<'all' | City>('all');
  const [pick, setPick] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const list = DISHES.map((d, i) => ({ ...d, i })).filter((d) => filter === 'all' || d.city === filter);

  // "Pick for me": the highlight races down the list, slows, and lands on one dish
  const roll = () => {
    if (rolling) return;
    setFilter('all');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = Math.floor(Math.random() * DISHES.length);
    if (reduce) return setPick(target);
    setRolling(true);
    let step = 0;
    const total = DISHES.length * 2 + target;
    const tick = () => {
      setPick(step % DISHES.length);
      if (step++ < total) timer.current = window.setTimeout(tick, 40 + step * step * 0.35);
      else setRolling(false);
    };
    tick();
  };

  return (
    <section id="menu" className="bg-alt text-bg">
      <div className="mx-auto max-w-[1600px] px-4 py-32 md:px-8 md:py-44">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
          <div className="flex items-end gap-4 md:gap-8">
            <Reveal as="h2" by="words" className="max-w-[10ch] font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.85] font-extrabold tracking-[-0.045em]">
              The ones people come back for.
            </Reveal>
            <Bowl busy={rolling} className="w-28 shrink-0 md:w-52" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-full bg-bg/10 p-1" role="group" aria-label="Filter the menu">
              {FILTERS.map(([l, v]) => (
                <button key={v} aria-pressed={filter === v} onClick={() => setFilter(v)} className={`rounded-full px-4 py-2 text-[14px] transition-colors ${filter === v ? 'bg-bg text-fg' : 'opacity-70 hover:opacity-100'}`}>
                  <RollText>{l}</RollText>
                </button>
              ))}
            </div>
            <Magnetic>
              <button onClick={roll} data-cursor="Roll" className="flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-[14px] font-semibold text-accent-ink">
                <span aria-hidden className={`inline-block ${rolling ? 'animate-spin' : ''}`}>✺</span>
                <RollText>{rolling ? 'Choosing…' : 'Pick for me'}</RollText>
              </button>
            </Magnetic>
          </div>
        </div>
        <ul className="border-t border-bg/15" aria-live="polite">
          {list.map((d) => {
            const on = pick === d.i;
            return (
              <li key={d.name} className={`group relative grid animate-[pop_.5s_cubic-bezier(.16,1,.3,1)] gap-2 border-b border-bg/15 py-6 transition-colors duration-300 hover:bg-bg/5 md:grid-cols-12 md:items-center md:py-7 ${on ? 'bg-accent text-accent-ink' : ''}`}>
                <span className="px-2 font-display text-[clamp(1.9rem,4vw,3.6rem)] leading-none font-bold tracking-[-0.04em] transition-transform duration-500 ease-expo group-hover:translate-x-3 md:col-span-6" style={{ fontStretch: '85%' }}>
                  {d.name}
                  {d.fav && <sup className="ml-2 align-super text-[13px] font-semibold tracking-normal">★ Favourite</sup>}
                </span>
                <span className={`px-2 text-[15px] md:col-span-4 ${on ? '' : 'opacity-65'}`}>{d.desc}</span>
                <span className="px-2 md:col-span-2 md:text-right">
                  <span className="inline-block rounded-full px-3 py-1 text-[12px] font-semibold transition-transform duration-500 ease-expo group-hover:-rotate-6 group-hover:scale-110" style={{ background: d.city === 'hanoi' ? 'var(--hanoi)' : 'var(--xian)', color: d.city === 'hanoi' ? '#1A120D' : '#FFF4EA' }}>
                    {d.city === 'hanoi' ? 'Hà Nội' : '西安'}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13px] opacity-60">Concept preview: prices and the full menu still to add. Please tell staff about any allergies.</p>
          <Link href={`${BASE}/menu`} className="rounded-full bg-bg px-6 py-3.5 text-[15px] font-medium text-fg">Search the menu &amp; plan your table →</Link>
        </div>
      </div>
    </section>
  );
}
