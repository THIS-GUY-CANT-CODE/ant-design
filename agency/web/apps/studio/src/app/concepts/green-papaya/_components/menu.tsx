'use client';
import { Reveal } from '@sc/ui';
import { useRef, useState } from 'react';

type City = 'hanoi' | 'xian';
const DISHES: { name: string; city: City; desc: string; fav?: boolean }[] = [
  { name: 'Banana leaf tilapia', city: 'hanoi', desc: 'Whole tilapia, marinated and grilled in banana leaf.', fav: true },
  { name: 'Concubine noodles', city: 'xian', desc: 'Dry-fried flat noodles with chicken, potato and house chilli sauce.', fav: true },
  { name: 'Bún thịt nem nướng', city: 'hanoi', desc: 'Rice vermicelli, grilled pork, spring rolls, herbs and nước chấm.' },
  { name: 'Zha jiang noodles', city: 'xian', desc: 'Noodles in a rich fermented bean and pork sauce.' },
  { name: 'Rou jia mo', city: 'xian', desc: 'The Xi\'an "burger": slow-braised pork in a crisp flatbread bun.' },
  { name: 'Green papaya salad', city: 'hanoi', desc: 'Shredded green papaya, herbs, peanuts, lime and chilli.' },
  { name: 'Summer rolls', city: 'hanoi', desc: 'Rice paper rolls with fresh herbs and a dipping sauce.' },
  { name: 'Sweet potato & prawn', city: 'hanoi', desc: 'Crisp sweet potato and prawn fritters, wrapped in lettuce and herbs.' },
  { name: 'Crispy squid', city: 'xian', desc: 'Salt and pepper squid with chilli and spring onion.' },
];
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
          <Reveal as="h2" by="words" className="max-w-[10ch] font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.85] font-extrabold tracking-[-0.045em]">
            The ones people come back for.
          </Reveal>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-full bg-bg/10 p-1" role="group" aria-label="Filter the menu">
              {FILTERS.map(([l, v]) => (
                <button key={v} aria-pressed={filter === v} onClick={() => setFilter(v)} className={`rounded-full px-4 py-2 text-[14px] transition-colors ${filter === v ? 'bg-bg text-fg' : 'opacity-70 hover:opacity-100'}`}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={roll} className="rounded-full bg-accent px-5 py-3 text-[14px] font-semibold text-accent-ink transition-transform hover:-translate-y-0.5">
              {rolling ? 'Choosing…' : 'Pick for me'}
            </button>
          </div>
        </div>
        <ul className="border-t border-bg/15" aria-live="polite">
          {list.map((d) => {
            const on = pick === d.i;
            return (
              <li key={d.name} className={`group relative grid gap-2 border-b border-bg/15 py-6 transition-colors duration-300 md:grid-cols-12 md:items-center md:py-7 ${on ? 'bg-accent text-accent-ink' : ''}`}>
                <span className="px-2 font-display text-[clamp(1.9rem,4vw,3.6rem)] leading-none font-bold tracking-[-0.04em] md:col-span-6" style={{ fontStretch: '85%' }}>
                  {d.name}
                  {d.fav && <sup className="ml-2 align-super text-[13px] font-semibold tracking-normal">★ Favourite</sup>}
                </span>
                <span className={`px-2 text-[15px] md:col-span-4 ${on ? '' : 'opacity-65'}`}>{d.desc}</span>
                <span className="px-2 md:col-span-2 md:text-right">
                  <span className="inline-block rounded-full px-3 py-1 text-[12px] font-semibold" style={{ background: d.city === 'hanoi' ? 'var(--hanoi)' : 'var(--xian)', color: d.city === 'hanoi' ? '#1A120D' : '#FFF4EA' }}>
                    {d.city === 'hanoi' ? 'Hà Nội' : '西安'}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-[13px] opacity-60">Concept preview: prices and the full menu still to add. Please tell staff about any allergies.</p>
      </div>
    </section>
  );
}
