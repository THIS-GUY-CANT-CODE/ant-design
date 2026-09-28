'use client';
import { gsap, useGSAP } from '@sc/ui';
import { useRef } from 'react';

const CUT = 'M-40 176 L1640 24';
const BLADE = 'M0 -1.5 C28 -11 58 -10 84 -3 C60 1 30 2.5 0 1.5 Z';

/**
 * Custom illustration: the brand's diagonal cut, made by a pair of scissors that travels the page
 * as you scroll, snipping as it goes. The cut line follows behind in cherry.
 */
export function Snip() {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const st = { trigger: el, start: 'top 85%', end: 'bottom 20%', scrub: 0.5 };
      gsap.from('[data-cut]', { drawSVG: '0%', ease: 'none', scrollTrigger: st });
      gsap.to('[data-scissors]', {
        motionPath: { path: '[data-cut]', align: '[data-cut]', alignOrigin: [0.5, 0.5], autoRotate: true },
        ease: 'none',
        scrollTrigger: {
          ...st,
          onUpdate: (self) => {
            const a = Math.abs(Math.sin(self.progress * Math.PI * 14)) * 16;
            gsap.set('[data-blade-top]', { rotation: -a, svgOrigin: '0 0' });
            gsap.set('[data-blade-bottom]', { rotation: a, svgOrigin: '0 0' });
          },
        },
      });
    },
    { scope: ref },
  );
  return (
    <svg ref={ref} viewBox="0 0 1600 200" className="block w-full overflow-visible" aria-hidden fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path data-cut d={CUT} stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="0" />
      <g data-scissors stroke="currentColor" strokeWidth="2.2" transform="translate(1440 60) rotate(-5)">
        <g transform="scale(1.6)">
        <g data-blade-top>
          <path d={BLADE} fill="var(--bg)" />
          <path d="M-2 -2 L-26 -12" />
          <circle cx="-40" cy="-17" r="13" fill="var(--bg)" />
        </g>
        <g data-blade-bottom>
          <path d={BLADE} transform="scale(1 -1)" fill="var(--bg)" />
          <path d="M-2 2 L-26 12" />
          <circle cx="-40" cy="17" r="13" fill="var(--bg)" />
        </g>
        <circle r="3.5" fill="currentColor" />
        </g>
      </g>
    </svg>
  );
}
