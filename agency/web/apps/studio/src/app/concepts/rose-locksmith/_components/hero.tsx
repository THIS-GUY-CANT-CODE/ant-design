'use client';
import { Counter, gsap, Magnetic, Reveal, RollText, Scramble, useGSAP } from '@sc/ui';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useRef } from 'react';
import { bitting, bladePath, PHONE } from './data';

gsap.registerPlugin(DrawSVGPlugin);
const CUTS = bitting('ROSE1938');

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const tl = gsap.timeline({ delay: 0.3 });
      tl.from('[data-blade]', { drawSVG: '0%', duration: 2.4, ease: 'power2.inOut' })
        .from('[data-cut]', { opacity: 0, y: 10, stagger: 0.12, duration: 0.5, ease: 'power3.out' }, '-=1.6')
        .from('[data-stat]', { opacity: 0, y: 30, stagger: 0.1, duration: 1, ease: 'expo.out' }, 0.2);
    },
    { scope: ref },
  );
  const years = new Date().getFullYear() - 1938;
  const w = (860 - 40 - 150) / CUTS.length;
  return (
    <section id="top" ref={ref} className="mx-auto max-w-[1600px] px-5 pt-16 pb-24 md:px-8 md:pt-24">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="mb-8 font-mono text-[12px] text-muted"><Scramble>149 BETHNAL GREEN ROAD · LONDON E2</Scramble></p>
          <Reveal as="h1" immediate className="font-display text-[clamp(3.6rem,10vw,10.5rem)] leading-[0.84] font-bold tracking-[-0.055em]">
            Keys cut since <span className="text-accent">1938.</span>
          </Reveal>
          <p className="mt-8 max-w-lg text-[19px] leading-snug text-muted">
            Keys, remotes, locks, paint and hardware. The same family has run this shop since it opened, and we&apos;ll probably have the part you need.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <a href="#visit" className="block rounded-full bg-fg px-7 py-4 text-[16px] font-medium text-bg"><RollText>Visit the shop</RollText></a>
            </Magnetic>
            <Magnetic>
              <a href={`tel:${PHONE.emergency[1]}`} className="block rounded-full bg-accent px-7 py-4 text-[16px] font-medium text-accent-ink">Emergency: {PHONE.emergency[0]}</a>
            </Magnetic>
          </div>
        </div>
        <dl className="grid content-end gap-3 md:col-span-4">
          <div data-stat className="group rounded-3xl bg-card p-6 transition-colors duration-500 hover:bg-accent hover:text-accent-ink">
            <dt className="text-[14px] text-muted">Google rating</dt>
            <dd className="mt-1 flex items-baseline gap-3 font-display text-[64px] leading-none font-bold tracking-[-0.05em]">
              4.9 <span className="text-[16px] font-medium tracking-normal text-muted transition-colors group-hover:text-accent-ink">from <Counter to={684} /> reviews</span>
            </dd>
          </div>
          <div data-stat className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl bg-card p-6">
              <dd className="font-display text-[48px] leading-none font-bold tracking-[-0.05em]"><Counter to={years} /></dd>
              <dt className="mt-2 text-[14px] text-muted">years on the street</dt>
            </div>
            <div className="rounded-3xl bg-alt p-6 text-bg">
              <dd className="font-display text-[48px] leading-none font-bold tracking-[-0.05em]">1</dd>
              <dt className="mt-2 text-[14px] opacity-60">family, all along</dt>
            </div>
          </div>
        </dl>
      </div>
      {/* the key blade: bitting for "ROSE1938", drawn like a cutting machine would trace it */}
      <figure data-cursor="Cut" className="mt-20 border-t border-line pt-10" aria-label={`Key blade cut to the code ${CUTS.join('-')}`}>
        <svg viewBox="100 40 800 150" preserveAspectRatio="xMinYMid meet" className="h-[clamp(80px,11vw,160px)] w-full overflow-visible">
          <path data-blade d={bladePath(CUTS)} fill="none" stroke="var(--fg)" strokeWidth="2" strokeLinejoin="round" />
          {CUTS.map((c, i) => (
            <g key={i} data-cut className="transition-opacity hover:opacity-60">
              <line x1={150 + i * w + w / 2} x2={150 + i * w + w / 2} y1={60 + c * 9 + 6} y2={165} stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 4" />
              <text x={150 + i * w + w / 2} y={180} textAnchor="middle" className="fill-muted font-mono text-[11px]">{c}</text>
            </g>
          ))}
        </svg>
        <figcaption className="mt-4 flex justify-between font-mono text-[12px] text-muted">
          <span>BLADE · ROSE1938</span>
          <span>CUT {CUTS.join('-')}</span>
        </figcaption>
      </figure>
    </section>
  );
}
