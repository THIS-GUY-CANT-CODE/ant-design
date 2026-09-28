'use client';
import { MeadeMark } from '@/brands/marks';
import { Counter, HoverLetters, Marquee, Reveal, Spotlight, Stagger, Tilt } from '@sc/ui';
import Link from 'next/link';
import { useState } from 'react';
import { BASE, PAGES } from './site';

export function Mark({ className, color }: { className?: string; color?: string }) {
  return <MeadeMark className={className} color={color} />;
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
          <Spotlight key={i} className="border-line p-6 odd:border-r md:border-r md:p-8 md:last:border-r-0">
            <dd className="font-display text-[clamp(3rem,6vw,5.6rem)] leading-none font-bold tracking-[-0.05em]">{n}</dd>
            <dt className="mt-3 text-[14px] text-muted">{l}</dt>
          </Spotlight>
        ))}
      </dl>
    </section>
  );
}

const HELP = [
  ['Sell', 'An honest valuation, strong marketing on every major portal, and negotiators who know your area.', '/sell'],
  ['Let', 'Tenant-find or full management from a UKALA-accredited lettings team.', '/let'],
  ['Buy', "Register with us and hear about new homes as soon as they're listed.", '/buy'],
  ['Rent', 'Flats and houses across East and North London, with a local team you can talk to.', '/offices'],
] as const;

export function Help() {
  return (
    <section id="help" className="mx-auto max-w-[1600px] px-5 py-32 md:px-8">
      <Reveal as="h2" className="mb-14 max-w-[16ch] font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.9] font-bold tracking-[-0.05em]">
        Selling, letting, buying or renting. One local team.
      </Reveal>
      <Stagger className="grid gap-3 md:grid-cols-4">
        {HELP.map(([t, d, h], i) => (
          <Tilt key={t} max={6} className="group relative flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-[1.75rem] bg-card p-7 transition-colors duration-500 hover:bg-accent hover:text-accent-ink">
            <span className="font-mono text-[12px] opacity-50">0{i + 1}</span>
            <div>
              <h3 className="font-display text-[56px] leading-none font-bold tracking-[-0.05em]">{t}</h3>
              <p className="mt-4 text-[15px] leading-snug opacity-70">{d}</p>
              <Link href={`${BASE}${h}`} aria-label={`${t}: find out more`} className="mt-6 inline-flex size-11 items-center justify-center rounded-full border border-current/20 text-[15px] font-semibold transition-[translate,rotate,background-color] duration-500 group-hover:translate-x-2 group-hover:-rotate-45 group-hover:bg-accent-ink group-hover:text-accent after:absolute after:inset-0">→</Link>
            </div>
          </Tilt>
        ))}
      </Stagger>
    </section>
  );
}

export function Homes() {
  const tools = [
    ['Stamp duty', 'What you’ll pay, with first-time buyer relief.', `${BASE}/buy#stamp-duty`],
    ['Mortgage', 'Monthly payments for any price, deposit and rate.', `${BASE}/buy#mortgage`],
    ['Rental yield', 'Gross and net returns for landlords.', `${BASE}/let#yield`],
    ['Nearest office', 'Put in your postcode, find your branch.', `${BASE}/offices`],
  ] as const;
  return (
    <section id="homes" className="mx-auto max-w-[1600px] px-5 pb-32 md:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <Reveal as="h2" className="max-w-[14ch] font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.9] font-bold tracking-[-0.05em]">Tools, not guesswork.</Reveal>
        <div className="flex flex-wrap gap-2 text-[14px]">
          <a href="https://www.wjmeade.co.uk/" rel="noopener" className="rounded-full bg-fg px-5 py-3 font-semibold text-bg">See every home on wjmeade.co.uk ↗</a>
          {[['Rightmove', 'https://www.rightmove.co.uk/'], ['OnTheMarket', 'https://www.onthemarket.com/'], ['PrimeLocation', 'https://www.primelocation.com/']].map(([l, h]) => (
            <a key={l} href={h} rel="noopener" className="rounded-full border border-line px-5 py-3">{l} ↗</a>
          ))}
        </div>
      </div>
      <Stagger className="grid gap-3 md:grid-cols-4">
        {tools.map(([t, d, h]) => (
          <Link key={t} href={h} className="group flex min-h-64 flex-col justify-between rounded-[1.75rem] bg-[var(--mist)] p-7 transition-colors duration-500 hover:bg-accent hover:text-accent-ink">
            <span className="grid size-12 place-items-center rounded-full bg-card text-[18px] text-fg transition-transform duration-500 group-hover:-rotate-45">→</span>
            <div>
              <h3 className="font-display text-[36px] leading-none font-bold tracking-[-0.045em]">{t}</h3>
              <p className="mt-3 text-[15px] opacity-75">{d}</p>
            </div>
          </Link>
        ))}
      </Stagger>
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
        <Stagger as="ol" className="mt-20 grid border-t border-bg/15 md:grid-cols-4">
          {years.map(([y, t, d]) => (
            <li key={y} className="group border-bg/15 py-8 md:border-r md:pr-8 md:last:border-r-0 [&:not(:first-child)]:md:pl-8">
              <p className="font-display text-[56px] leading-none font-bold tracking-[-0.05em] transition-[color,translate] duration-500 group-hover:-translate-y-1 group-hover:text-accent">{y}</p>
              <h3 className="mt-8 text-[18px] font-semibold">{t}</h3>
              <p className="mt-2 text-[15px] opacity-60">{d}</p>
            </li>
          ))}
        </Stagger>
        <Reveal as="blockquote" className="mt-24 max-w-[24ch] font-display text-[clamp(2rem,4vw,3.6rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
          &ldquo;The most trusted and straightforward estate agent I&apos;ve worked with.&rdquo;
          <footer className="mt-5 text-[14px] font-normal tracking-normal opacity-50">Client review · UKALA accredited</footer>
        </Reveal>
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
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <Reveal as="h2" className="font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.9] font-bold tracking-[-0.05em]">Five offices, all local.</Reveal>
        <Link href={`${BASE}/offices`} className="rounded-full bg-fg px-6 py-3.5 text-[15px] font-semibold text-bg">Live map &amp; nearest office →</Link>
      </div>
      <div className="grid gap-8 md:grid-cols-12">
        <Stagger as="ul" className="grid content-start gap-2 md:col-span-5">
          {OFFICES.map((o, i) => (
            <li key={o.name}>
              <button onPointerEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => setSel(i)} className={`flex w-full items-baseline justify-between gap-4 rounded-2xl px-5 py-4 text-left transition-[background-color,color,padding] duration-500 ease-expo ${sel === i ? 'bg-accent pl-7 text-accent-ink' : 'bg-card'}`}>
                <span className="text-[22px] font-bold tracking-[-0.03em]">{o.name}</span>
                <span className={`text-right text-[13px] ${sel === i ? 'opacity-80' : 'text-muted'}`}>{o.addr}</span>
              </button>
            </li>
          ))}
        </Stagger>
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
                  {on && (
                    <circle cx={x} cy={y} r="22" fill="var(--accent)" opacity=".15">
                      <animate attributeName="r" values="12;30;12" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values=".3;0;.3" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                  )}
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
            <Mark className="size-8" color="#FFFFFF" />
          </span>
        ))}
      </Marquee>
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        <div className="grid gap-10 border-b border-white/20 py-14 md:grid-cols-12">
          <p className="max-w-xs text-[15px] opacity-80 md:col-span-4">Independent estate and letting agents across East and North London since 1953.</p>
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="text-[13px] opacity-60">Pages</p>
            <ul className="mt-3 space-y-2 text-[17px]">
              <li><Link href={BASE} className="u-draw">Home</Link></li>
              {PAGES.map((p) => (
                <li key={p.href}><Link href={p.href} className="u-draw">{p.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-2">
            <p className="text-[13px] opacity-60">Offices</p>
            <ul className="mt-3 space-y-1.5 text-[15px]">
              {['Bow', 'Stratford', 'Wood Green', 'Highams Park', 'Enfield'].map((o) => <li key={o}>{o}</li>)}
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="text-[13px] opacity-60">Bow office</p>
            <a href="tel:+442089813331" className="u-draw mt-3 inline-block text-[22px] font-bold">020 8981 3331</a>
            <p className="mt-2 text-[14px] opacity-80">391 Mile End Road, Bow, London E3 4QS</p>
            <p className="mt-3 text-[13px] opacity-60">UKALA member</p>
          </div>
        </div>
        <p className="pt-10 font-display text-[18.5vw] leading-[0.8] font-bold tracking-[-0.07em] whitespace-nowrap">
          <HoverLetters className="[--accent:var(--fg)]">W J Meade</HoverLetters>
        </p>
        <div className="flex flex-wrap justify-between gap-4 py-8 pb-24 text-[13px] opacity-70 md:pb-8">
          <span>© {new Date().getFullYear()} W J Meade Estate Agents · Established 1953</span>
          <span>Concept by Second Coat</span>
        </div>
      </div>
    </footer>
  );
}
