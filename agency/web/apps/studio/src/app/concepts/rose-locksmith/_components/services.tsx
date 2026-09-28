'use client';
import { Reveal, RollText, Stagger, Tilt } from '@sc/ui';
import { useState } from 'react';
import Link from 'next/link';
import { BASE, bitting, bladePath, PHONE } from './data';

export function KeyCutter() {
  const [name, setName] = useState('Bethnal');
  const cuts = bitting(name);
  return (
    <div className="mt-auto">
      <label htmlFor="kc" className="font-mono text-[12px] opacity-60">TYPE A NAME · WE&apos;LL CUT IT</label>
      <input id="kc" value={name} maxLength={12} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border-b border-bg/25 bg-transparent py-3 font-display text-[40px] font-bold tracking-[-0.04em] uppercase outline-none focus:border-accent" spellCheck={false} autoComplete="off" />
      <svg viewBox="110 40 800 110" className="mt-6 w-full" aria-hidden>
        <path d={bladePath(cuts)} fill="none" stroke="var(--steel)" strokeWidth="2" strokeLinejoin="round" style={{ transition: 'd .5s cubic-bezier(.16,1,.3,1)' }} />
      </svg>
      <p className="mt-3 flex justify-between font-mono text-[12px] opacity-60">
        <span>CUT {cuts.join('-')}</span>
        <span>Just for fun. Bring the real one in.</span>
      </p>
    </div>
  );
}

const tile = 'rounded-[1.75rem] p-7 md:p-8 flex flex-col gap-4 min-h-64';

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-[1600px] px-5 py-32 md:px-8">
      <Reveal as="h2" className="mb-12 max-w-[16ch] font-display text-[clamp(2.8rem,6.5vw,6.4rem)] leading-[0.88] font-bold tracking-[-0.05em]">
        If it opens, locks or needs fixing, start here.
      </Reveal>
      <Stagger className="grid gap-3 md:grid-cols-4 md:grid-rows-2">
        <Tilt max={3} className={`${tile} bg-alt text-bg md:col-span-2 md:row-span-2`}>
          <span className="font-mono text-[12px] opacity-60">01</span>
          <h3 className="font-display text-[clamp(2rem,3.4vw,3.2rem)] leading-[0.95] font-bold tracking-[-0.045em]">Key cutting, including the awkward ones.</h3>
          <p className="max-w-md opacity-70">Difficult, worn and unusual keys that other shops turn away are what we&apos;re known for.</p>
          <Link href={`${BASE}/keys`} className="u-draw self-start text-[15px] font-medium">All about keys →</Link>
          <KeyCutter />
        </Tilt>
        <Tilt max={7} className={`${tile} bg-card`}>
          <span className="flex items-end gap-1" aria-hidden>
            {[10, 18, 26, 18, 10].map((h, i) => (
              <span key={i} className="w-1.5 animate-pulse rounded-full bg-accent" style={{ height: h, animationDelay: `${i * 0.15}s` }} />
            ))}
          </span>
          <h3 className="mt-auto text-[24px] font-bold tracking-[-0.03em] transition-transform duration-500 ease-expo group-hover/tilt:translate-x-1">Remote copying</h3>
          <p className="text-[15px] text-muted">Garage and gate remotes, including 433MHz fobs, copied while you wait.</p>
          <Link href={`${BASE}/keys#remotes`} className="u-draw self-start text-[15px] font-medium">Check your remote →</Link>
        </Tilt>
        <Tilt max={7} className={`${tile} bg-accent text-accent-ink`}>
          <span className="font-mono text-[12px]">EMERGENCY</span>
          <h3 className="mt-auto text-[24px] font-bold tracking-[-0.03em] transition-transform duration-500 ease-expo group-hover/tilt:translate-x-1">Emergency locksmith</h3>
          <p className="text-[15px]">Lockouts and break-ins across Bethnal Green, Tower Hamlets and Hackney.</p>
          <Link href={`${BASE}/emergency#coverage`} className="u-draw self-start text-[15px] font-medium">Do we cover you? →</Link>
          <a href={`tel:${PHONE.emergency[1]}`} className="u-draw self-start font-mono text-[15px]">{PHONE.emergency[0]}</a>
        </Tilt>
        <Tilt max={7} className={`${tile} bg-card`}>
          <h3 className="mt-auto text-[24px] font-bold tracking-[-0.03em] transition-transform duration-500 ease-expo group-hover/tilt:translate-x-1">uPVC door repair</h3>
          <p className="text-[15px] text-muted">Sticking, dropped or jammed uPVC doors, mechanisms and multi-point locks.</p>
          <Link href={`${BASE}/emergency#upvc`} className="u-draw self-start text-[15px] font-medium">Door troubles →</Link>
        </Tilt>
        <Tilt max={7} className={`${tile} bg-card`}>
          <h3 className="mt-auto text-[24px] font-bold tracking-[-0.03em] transition-transform duration-500 ease-expo group-hover/tilt:translate-x-1">Paint &amp; hardware</h3>
          <p className="text-[15px] text-muted">Any Dulux colour mixed while you wait, plus tools, fixings and timber.</p>
          <Link href={`${BASE}/paint`} className="u-draw self-start text-[15px] font-medium text-fg"><RollText>Try a colour →</RollText></Link>
        </Tilt>
      </Stagger>
    </section>
  );
}
