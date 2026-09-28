'use client';
import { Counter, FadeIn, Marquee, Reveal } from '@sc/ui';
import { useState } from 'react';

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 46 34" className={className} aria-hidden>
      <path d="M3 32V14L13 4l10 10L33 4l10 10v18" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:px-8" aria-label="Main">
        <a href="#top" className="flex items-center gap-2.5 text-[19px] font-bold tracking-[-0.03em]">
          <Mark className="h-5 w-7 text-accent" /> W J Meade
        </a>
        <div className="hidden gap-8 text-[14px] md:flex">
          {[['#help', 'Services'], ['#homes', 'Homes'], ['#story', 'Since 1953'], ['#offices', 'Offices']].map(([h, l]) => (
            <a key={h} href={h} className="text-muted hover:text-fg">{l}</a>
          ))}
        </div>
        <a href="#top" className="rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-ink">Free valuation</a>
      </nav>
    </header>
  );
}

export function Stats() {
  return (
    <section className="border-y border-line">
      <dl className="mx-auto grid max-w-[1600px] grid-cols-2 md:grid-cols-4">
        {[
          [<Counter key="a" from={1900} to={1953} />, 'Founded in Walthamstow'],
          [<><Counter to={70} />+</>, 'Years in East London'],
          [<Counter key="c" to={5} />, 'Local offices'],
          [<Counter key="d" to={3} />, 'Owners in our whole history'],
        ].map(([n, l], i) => (
          <div key={i} className="border-line p-6 odd:border-r md:border-r md:p-8 md:last:border-r-0">
            <dd className="font-display text-[clamp(3rem,6vw,5.6rem)] leading-none font-bold tracking-[-0.05em]">{n}</dd>
            <dt className="mt-3 text-[14px] text-muted">{l}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

const HELP = [
  ['Sell', 'An honest valuation, strong marketing on every major portal, and negotiators who know your area.'],
  ['Let', 'Tenant-find or full management from a UKALA-accredited lettings team.'],
  ['Buy', "Register with us and hear about new homes as soon as they're listed."],
  ['Rent', 'Flats and houses across East and North London, with a local team you can talk to.'],
];

export function Help() {
  return (
    <section id="help" className="mx-auto max-w-[1600px] px-5 py-32 md:px-8">
      <Reveal as="h2" className="mb-14 max-w-[16ch] font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.9] font-bold tracking-[-0.05em]">
        Selling, letting, buying or renting. One local team.
      </Reveal>
      <div className="grid gap-3 md:grid-cols-4">
        {HELP.map(([t, d], i) => (
          <FadeIn key={t} delay={i * 0.08} className="group relative flex min-h-80 flex-col justify-between overflow-hidden rounded-[1.75rem] bg-card p-7 transition-colors duration-500 hover:bg-accent hover:text-accent-ink">
            <span className="font-mono text-[12px] opacity-50">0{i + 1}</span>
            <div>
              <h3 className="font-display text-[56px] leading-none font-bold tracking-[-0.05em]">{t}</h3>
              <p className="mt-4 text-[15px] leading-snug opacity-70">{d}</p>
              <span className="mt-6 inline-block text-[15px] font-semibold transition-transform duration-500 group-hover:translate-x-1">→</span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

export function Homes() {
  const homes = [['For sale', 'Bow E3'], ['To let', 'Stratford E15'], ['For sale', 'Mile End E3']];
  return (
    <section id="homes" className="mx-auto max-w-[1600px] px-5 pb-32 md:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <Reveal as="h2" className="font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.9] font-bold tracking-[-0.05em]">Just listed.</Reveal>
        <p className="text-[14px] text-muted">Live from the property feed on the real site.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {homes.map(([tag, area], i) => (
          <FadeIn key={i} delay={i * 0.08} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[var(--mist)]">
              <svg viewBox="0 0 200 150" className="absolute inset-x-0 bottom-0 w-full text-accent/25 transition-transform duration-700 ease-expo group-hover:scale-105" aria-hidden>
                <path d="M20 150V70l45-35 45 35v80M110 150V80l35-28 35 28v70" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-[12px] font-semibold ${tag === 'To let' ? 'bg-fg text-bg' : 'bg-accent text-accent-ink'}`}>{tag}</span>
              <span className="absolute top-4 right-4 rounded-full bg-card/80 px-3 py-1 text-[12px] text-muted">Property photo</span>
            </div>
            <p className="mt-4 text-[26px] font-bold tracking-[-0.03em]">£—{tag === 'To let' ? ' pcm' : ''}</p>
            <p className="text-[15px] text-muted">[Bedrooms] · [Street], {area}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

export function Story() {
  const years = [
    ['1953', 'Hoe Street, Walthamstow', 'Walter Joseph Meade opens the first office.'],
    ['1990', 'Bow opens', 'On 3 January, in a small business centre on Coborn Road.'],
    ['1992', 'New owners', "The current owners take over. They're only the third in our history."],
    ['Today', 'Five offices', 'Bow, Stratford, Wood Green, Highams Park and Enfield.'],
  ];
  return (
    <section id="story" className="bg-alt text-bg">
      <div className="mx-auto max-w-[1600px] px-5 py-32 md:px-8">
        <Reveal as="h2" className="max-w-[16ch] font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.9] font-bold tracking-[-0.05em]">
          Seventy years. Three owners. <span className="text-accent">One name.</span>
        </Reveal>
        <p className="mt-8 max-w-xl text-[18px] leading-relaxed opacity-60">Most agents on the high street are chains. W J Meade has only changed hands twice since Walter Joseph Meade opened the doors.</p>
        <ol className="mt-20 grid border-t border-bg/15 md:grid-cols-4">
          {years.map(([y, t, d], i) => (
            <FadeIn key={y} delay={i * 0.1} className="border-bg/15 py-8 md:border-r md:pr-8 md:last:border-r-0 [&:not(:first-child)]:md:pl-8">
              <p className="font-display text-[56px] leading-none font-bold tracking-[-0.05em]">{y}</p>
              <h3 className="mt-8 text-[18px] font-semibold">{t}</h3>
              <p className="mt-2 text-[15px] opacity-60">{d}</p>
            </FadeIn>
          ))}
        </ol>
        <blockquote className="mt-24 max-w-[24ch] font-display text-[clamp(2rem,4vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
          &ldquo;The most trusted and straightforward estate agent I&apos;ve worked with.&rdquo;
          <footer className="mt-5 text-[14px] font-normal tracking-normal opacity-50">Client review · UKALA accredited</footer>
        </blockquote>
      </div>
    </section>
  );
}

// Positions from real coordinates: x = (lon + .13) * 2400, y = (51.67 - lat) * 3840
const OFFICES = [
  { name: 'Enfield', lat: 51.652, lon: -0.081, addr: '[Address] · [Phone]' },
  { name: 'Wood Green', lat: 51.597, lon: -0.109, addr: '[Address] · [Phone]' },
  { name: 'Highams Park', lat: 51.608, lon: 0.0, addr: '[Address] · [Phone]' },
  { name: 'Stratford', lat: 51.541, lon: -0.003, addr: '[Address] · [Phone]' },
  { name: 'Bow', lat: 51.524, lon: -0.03, addr: '391 Mile End Road, E3 4QS · 020 8981 3331' },
  { name: 'Hoe Street, 1953', lat: 51.584, lon: -0.02, addr: 'Where it started', past: true },
];
const P = (o: (typeof OFFICES)[number]) => [30 + (o.lon + 0.13) * 2400, 30 + (51.67 - o.lat) * 3840] as const;

export function Offices() {
  const [sel, setSel] = useState(4);
  return (
    <section id="offices" className="mx-auto max-w-[1600px] px-5 py-32 md:px-8">
      <Reveal as="h2" className="mb-14 font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.9] font-bold tracking-[-0.05em]">Five offices, all local.</Reveal>
      <div className="grid gap-8 md:grid-cols-12">
        <ul className="grid content-start gap-2 md:col-span-5">
          {OFFICES.map((o, i) => (
            <li key={o.name}>
              <button onPointerEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)} className={`flex w-full items-baseline justify-between gap-4 rounded-2xl px-5 py-4 text-left transition-colors ${sel === i ? 'bg-accent text-accent-ink' : 'bg-card'}`}>
                <span className="text-[22px] font-bold tracking-[-0.03em]">{o.name}</span>
                <span className={`text-right text-[13px] ${sel === i ? 'opacity-80' : 'text-muted'}`}>{o.addr}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="overflow-hidden rounded-[1.75rem] bg-[var(--mist)] md:col-span-7">
          <svg viewBox="0 0 420 620" className="h-full max-h-[640px] w-full" role="img" aria-label="Map of W J Meade offices across East and North London">
            <path d="M350 0 C 330 120, 360 200, 330 300 S 340 480, 320 560 L 330 620" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
            <path d="M0 600 C 120 575, 260 610, 420 590 L420 620 L0 620Z" fill="#fff" />
            <text x="30" y="612" className="fill-muted font-mono text-[10px]">THAMES</text>
            {OFFICES.map((o, i) => {
              const [x, y] = P(o);
              const on = sel === i;
              return (
                <g key={o.name} onPointerEnter={() => setSel(i)} className="cursor-pointer">
                  {on && <circle cx={x} cy={y} r="22" fill="var(--accent)" opacity=".15" />}
                  <circle cx={x} cy={y} r={on ? 9 : 6} fill={o.past ? 'var(--fg)' : 'var(--accent)'} stroke="#fff" strokeWidth="2.5" style={{ transition: 'r .3s' }} />
                  <text x={x + (x > 300 ? -16 : 16)} y={y + 5} textAnchor={x > 300 ? 'end' : 'start'} className={`text-[14px] ${on ? 'font-bold' : ''}`} fill="var(--fg)">
                    {o.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden bg-accent text-accent-ink">
      <Marquee className="border-b border-white/20 py-5" speed={26}>
        {['Bow', 'Stratford', 'Wood Green', 'Highams Park', 'Enfield', 'Since 1953'].map((w) => (
          <span key={w} className="flex items-center gap-8 pr-8 font-display text-[clamp(1.6rem,3vw,2.6rem)] font-bold tracking-[-0.04em]">
            {w}
            <Mark className="h-5 w-7" />
          </span>
        ))}
      </Marquee>
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        <p aria-hidden className="pt-10 font-display text-[18.5vw] leading-[0.8] font-bold tracking-[-0.07em] whitespace-nowrap">W J Meade</p>
        <div className="flex flex-wrap justify-between gap-4 py-8 pb-24 text-[13px] opacity-70 md:pb-8">
          <span>© {new Date().getFullYear()} W J Meade Estate Agents · Established 1953</span>
          <span>Concept by Second Coat</span>
        </div>
      </div>
    </footer>
  );
}
