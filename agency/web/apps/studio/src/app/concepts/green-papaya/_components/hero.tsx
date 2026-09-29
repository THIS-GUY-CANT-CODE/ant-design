'use client';
import { gsap, Magnetic, RollText, useGSAP } from '@sc/ui';
import { useRef } from 'react';
import { Noodles } from './noodles';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('[data-row="a"]', { xPercent: -18, scrollTrigger: st });
      gsap.to('[data-row="b"]', { xPercent: 18, scrollTrigger: st });
      gsap.from('[data-row]', { yPercent: 100, duration: 1.4, ease: 'expo.out', stagger: 0.12, delay: 0.1 });
    },
    { scope: ref },
  );
  return (
    <section
      id="top"
      ref={ref}
      className="relative flex h-[100svh] min-h-[640px] flex-col justify-center overflow-hidden bg-accent"
      data-cursor="Swipe"
    >
      <h1 className="relative font-display leading-[0.78] font-extrabold tracking-[-0.045em] uppercase" style={{ fontStretch: '75%' }}>
        <span className="sr-only">Hanoi meets Xi&apos;an on Mare Street</span>
        <span aria-hidden className="block overflow-hidden px-4 text-[27vw] md:px-8">
          <span data-row="a" className="block">Hanoi</span>
        </span>
        <span aria-hidden className="block overflow-hidden px-4 text-right text-[27vw] md:px-8">
          <span data-row="b" className="block">Xi&apos;an</span>
        </span>
      </h1>
      <Noodles className="pointer-events-none absolute inset-0 z-10 size-full" />
      {/* spinning sticker between the two cities */}
      <div aria-hidden className="group/sticker absolute z-20 top-[14%] right-5 grid size-28 place-items-center md:top-1/2 md:right-auto md:left-[58%] md:size-44 md:-translate-y-1/2">
        <svg viewBox="0 0 200 200" className="absolute inset-0 animate-[spin_16s_linear_infinite] transition-[scale] duration-700 ease-expo group-hover/sticker:scale-110">
          <defs>
            <path id="gp-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
          </defs>
          <circle cx="100" cy="100" r="98" fill="var(--hanoi)" />
          <text fontSize="15" fontWeight="700" letterSpacing="3" fill="#1A120D" style={{ fontFamily: 'var(--ff-inter)' }}>
            <textPath href="#gp-ring" textLength="486" lengthAdjust="spacing">ONE KITCHEN · TWO CITIES · MARE ST E8 ·</textPath>
          </text>
        </svg>
        <span className="relative font-display text-5xl font-extrabold transition-transform duration-700 ease-expo group-hover/sticker:rotate-90 md:text-7xl">×</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-4 px-4 pb-6 md:px-8 md:pb-8">
        <p className="max-w-sm text-[15px] leading-snug font-medium">
          Northern Vietnamese and Xi&apos;an street food, cooked side by side by one family on Mare Street for over twenty years. <span className="hidden opacity-70 md:inline">Go on, run your hand through the noodles.</span>
        </p>
        <Magnetic>
          <a href="#menu" className="block rounded-full bg-fg px-6 py-3.5 text-[15px] font-medium text-bg">
            <RollText>See the menu ↓</RollText>
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
