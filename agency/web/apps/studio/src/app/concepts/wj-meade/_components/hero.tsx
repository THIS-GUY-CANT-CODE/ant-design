'use client';
import { gsap, Magnetic, Reveal, useGSAP } from '@sc/ui';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useRef, useState } from 'react';
import { skyline } from './skyline';

gsap.registerPlugin(DrawSVGPlugin);
const SKY = skyline();

function Valuation() {
  const [mode, setMode] = useState<'Sell' | 'Let'>('Sell');
  const [beds, setBeds] = useState(2);
  const [sent, setSent] = useState(false);
  const field = 'w-full rounded-xl border border-line bg-bg px-4 py-3.5 text-[16px] outline-none focus:border-accent';
  return (
    <div className="rounded-[1.75rem] bg-card p-6 shadow-[0_30px_80px_-40px_rgba(14,14,16,.35)] md:p-8">
      {sent ? (
        <p className="py-16 text-center text-[22px] font-semibold">Thanks. <span className="font-normal text-muted">Concept demo, so nothing was sent.</span></p>
      ) : (
        <form onSubmit={(e) => (e.preventDefault(), setSent(true))} className="space-y-4">
          <p className="text-[24px] leading-tight font-semibold tracking-[-0.02em]">What&apos;s your home worth?</p>
          <div className="grid grid-cols-2 rounded-xl bg-bg p-1" role="group" aria-label="Sell or let">
            {(['Sell', 'Let'] as const).map((m) => (
              <button type="button" key={m} aria-pressed={mode === m} onClick={() => setMode(m)} className={`rounded-lg py-2.5 text-[15px] font-medium transition-colors ${mode === m ? 'bg-fg text-bg' : 'text-muted'}`}>
                {m}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
            <span className="text-[15px]">Bedrooms</span>
            <div className="flex items-center gap-3">
              <button type="button" aria-label="Fewer bedrooms" onClick={() => setBeds((b) => Math.max(0, b - 1))} className="size-9 rounded-full border border-line text-[18px] hover:border-fg">−</button>
              <output className="w-16 text-center text-[20px] font-semibold tabular-nums">{beds === 0 ? 'Studio' : beds > 5 ? '6+' : beds}</output>
              <button type="button" aria-label="More bedrooms" onClick={() => setBeds((b) => Math.min(6, b + 1))} className="size-9 rounded-full border border-line text-[18px] hover:border-fg">+</button>
            </div>
          </div>
          <input className={field} placeholder="Your postcode" aria-label="Your postcode" required autoComplete="postal-code" />
          <input className={field} placeholder="Email or phone" aria-label="Email or phone" required />
          <button type="submit" className="w-full rounded-xl bg-accent py-4 text-[16px] font-semibold text-accent-ink transition-transform hover:-translate-y-0.5">
            Book my free valuation
          </button>
          <p className="text-center text-[14px] text-muted">
            Or call Bow on <a href="tel:+442089813331" className="text-fg underline">020 8981 3331</a>
          </p>
        </form>
      )}
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from('[data-sky]', { drawSVG: '0%', duration: 3.2, ease: 'power2.inOut', delay: 0.3 });
      gsap.from('[data-win]', { opacity: 0, duration: 0.3, stagger: { each: 0.018, from: 'random' }, delay: 1.6 });
    },
    { scope: ref },
  );
  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-28">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-7">
          <p className="mb-8 text-[14px] text-muted">Independent estate &amp; letting agents · East London</p>
          <Reveal as="h1" immediate className="font-display text-[clamp(3.4rem,8.2vw,8.6rem)] leading-[0.88] font-bold tracking-[-0.05em]">
            East London&apos;s estate agent. <span className="text-accent">Since 1953.</span>
          </Reveal>
          <p className="mt-8 max-w-lg text-[19px] leading-snug text-muted">For more than seventy years we&apos;ve helped East London buy, sell, let and rent. Still independent, and we still know the streets.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <a href="#homes" className="block rounded-full bg-fg px-7 py-4 text-[16px] font-medium text-bg">See homes</a>
            </Magnetic>
            <Magnetic>
              <a href="#offices" className="block rounded-full border border-fg/20 px-7 py-4 text-[16px] font-medium">Five local offices</a>
            </Magnetic>
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <Valuation />
        </div>
      </div>
      <svg viewBox="0 0 1600 224" className="mt-16 block w-full" aria-hidden preserveAspectRatio="xMidYMax slice">
        {SKY.wins.map(([x, y], i) => (
          <rect key={i} data-win x={x} y={y} width="14" height="18" rx="1.5" fill={i % 4 === 0 ? 'var(--accent)' : 'var(--mist)'} />
        ))}
        <path data-sky d={SKY.d} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </section>
  );
}
