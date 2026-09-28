'use client';
import { Magnetic, RollText, Scramble, useReducedMotion } from '@sc/ui';
import { animate, motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect } from 'react';

export { FRESHA } from './site';
import { FRESHA } from './site';

// The cut runs from 64% down the left edge to 36% on the right.
const TOP = 'polygon(0 0, 100% 0, 100% 36%, 0 64%)';
const BOTTOM = 'polygon(0 64%, 100% 36%, 100% 100%, 0 100%)';

export function Hero() {
  const reduce = useReducedMotion();
  const raw = useMotionValue(0);
  const x = useSpring(raw, { stiffness: 120, damping: 18 });
  useEffect(() => {
    if (reduce) return;
    raw.jump(90);
    const c = animate(raw, 0, { duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.4 });
    return () => c.stop();
  }, [raw, reduce]);
  const headline = (
    <>
      Doing Clapton&apos;s hair <em className="text-accent">since 1930.</em>
    </>
  );
  const cls = 'font-display text-[clamp(3.8rem,11vw,12rem)] leading-[0.86] tracking-[-0.04em]';
  return (
    <section
      id="top"
      className="mx-auto max-w-[1600px] px-5 pt-36 pb-20 md:px-8 md:pt-44"
      onPointerMove={(e) => !reduce && raw.set(((e.clientX / window.innerWidth) - 0.5) * 70)}
      onPointerLeave={() => raw.set(0)}
    >
      <p className="mb-10 flex items-center justify-between text-[14px] text-muted">
        <Scramble>21 Lower Clapton Road · London E5</Scramble>
        <span className="hidden md:inline"><Scramble>Hair · Beauty · Electrolysis</Scramble></span>
      </p>
      <div className="relative" data-cursor="Cut">
        <h1 className={cls} style={{ clipPath: TOP }}>{headline}</h1>
        <motion.p aria-hidden className={`absolute inset-0 ${cls}`} style={{ clipPath: BOTTOM, x }}>
          {headline}
        </motion.p>
        <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
          <line x1="-2" y1="64.8" x2="102" y2="35.2" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="mt-14 grid gap-8 border-t border-line pt-8 md:grid-cols-12">
        <p className="max-w-md text-[18px] leading-snug text-muted md:col-span-6">
          Cuts, colour, extensions and beauty at a family salon on Lower Clapton Road since 1930, with one very famous former guest.
        </p>
        <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
          <Magnetic>
            <a href={FRESHA} rel="noopener" className="block rounded-full bg-accent px-8 py-4 text-[16px] font-medium text-accent-ink"><RollText>Book online</RollText></a>
          </Magnetic>
          <Magnetic>
            <a href="tel:+442089854329" className="block rounded-full border border-fg/20 px-8 py-4 text-[16px] font-medium"><RollText>020 8985 4329</RollText></a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
