'use client';
import { ScrollTrigger, useGSAP } from '@sc/ui';
import { useRef } from 'react';

/**
 * The studio's name, acted out: a roller crosses the page as you scroll and lays a fresh coat of orange,
 * with the line underneath revealed as the paint goes on.
 */
export function Roller() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return el.style.setProperty('--p', '1');
      ScrollTrigger.create({ trigger: el, start: 'top 85%', end: 'bottom 35%', scrub: 0.4, onUpdate: (s) => el.style.setProperty('--p', s.progress.toFixed(4)) });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="relative mx-3 my-10 h-36 md:mx-4 md:h-44" style={{ ['--p' as string]: 0 }}>
      <div className="absolute inset-0 grid items-center rounded-[1.75rem] bg-accent px-6 text-accent-ink md:px-12" style={{ clipPath: 'inset(0 calc((1 - var(--p)) * 100%) 0 0 round 1.75rem)' }}>
        <p className="font-display text-[clamp(1.6rem,4.4vw,4.4rem)] leading-none font-semibold tracking-[-0.05em] whitespace-nowrap">
          A second coat, <span className="font-serif font-normal italic">for the places you love.</span>
        </p>
      </div>
      {/* the roller: a sleeve that turns as it travels, on a bent handle */}
      <div aria-hidden className="pointer-events-none absolute top-1/2 h-[150%] -translate-x-1/2 -translate-y-1/2 motion-reduce:hidden" style={{ left: 'calc(var(--p) * 100%)', opacity: 'clamp(0, (1 - var(--p)) * 12, 1)' }}>
        <svg viewBox="0 0 120 240" className="h-full overflow-visible" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M60 36 L60 16 L104 16 L104 -40" stroke="var(--fg)" strokeWidth="7" />
          <rect x="94" y="-110" width="20" height="74" rx="10" fill="var(--fg)" />
          <path d="M60 36 L60 44" stroke="var(--fg)" strokeWidth="7" />
        </svg>
        <div className="absolute top-[18%] left-1/2 h-[80%] w-12 -translate-x-1/2 rounded-2xl border-[3px] border-fg shadow-[0_12px_30px_rgb(0_0_0/.25)] md:w-14" style={{ background: 'repeating-linear-gradient(0deg, var(--accent) 0 14px, color-mix(in srgb, var(--accent) 80%, black) 14px 17px)', backgroundPositionY: 'calc(var(--p) * 1400px)' }} />
      </div>
    </div>
  );
}
