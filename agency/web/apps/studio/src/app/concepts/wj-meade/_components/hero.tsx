'use client';
import { gsap, Magnetic, Parallax, Reveal, RollText, Scramble, useGSAP } from '@sc/ui';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import Link from 'next/link';
import { useRef } from 'react';
import { BASE } from './site';
import { skyline } from './skyline';
import { ValuationForm } from './tools';

gsap.registerPlugin(DrawSVGPlugin);
const SKY = skyline();

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
          <p className="mb-8 text-[14px] text-muted"><Scramble>Independent estate & letting agents · East London</Scramble></p>
          <Reveal as="h1" immediate className="font-display text-[clamp(3.4rem,8.2vw,8.6rem)] leading-[0.88] font-bold tracking-[-0.05em]">
            East London&apos;s estate agent. <span className="text-accent">Since 1953.</span>
          </Reveal>
          <p className="mt-8 max-w-lg text-[19px] leading-snug text-muted">For more than seventy years we&apos;ve helped East London buy, sell, let and rent. Still independent, and we still know the streets.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <a href="#homes" className="block rounded-full bg-fg px-7 py-4 text-[16px] font-medium text-bg"><RollText>Homes &amp; tools</RollText></a>
            </Magnetic>
            <Magnetic>
              <Link href={`${BASE}/offices`} className="block rounded-full border border-fg/20 px-7 py-4 text-[16px] font-medium"><RollText>Five local offices</RollText></Link>
            </Magnetic>
          </div>
        </div>
        <Parallax speed={-6} className="md:col-span-5 md:col-start-8">
          <ValuationForm compact />
        </Parallax>
      </div>
      <svg viewBox="0 0 1600 224" className="mt-16 block w-full" data-cursor="Light up" preserveAspectRatio="xMidYMax slice">
        {SKY.wins.map(([x, y], i) => (
          <rect key={i} data-win x={x} y={y} width="14" height="18" rx="1.5" fill={i % 4 === 0 ? 'var(--accent)' : 'var(--mist)'} className="transition-[fill] duration-300 hover:fill-[var(--accent)]" />
        ))}
        <path data-sky d={SKY.d} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </section>
  );
}
