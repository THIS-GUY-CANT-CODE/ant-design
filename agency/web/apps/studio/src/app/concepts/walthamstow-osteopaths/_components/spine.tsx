'use client';
import { gsap, useGSAP } from '@sc/ui';
import { useRef } from 'react';

const N = 10;
// a gentle S-curve out of line, which the scroll straightens
const off = (i: number) => ({ x: Math.sin((i / (N - 1)) * Math.PI * 2) * 16, rotation: Math.cos((i / (N - 1)) * Math.PI * 2) * 12 });

/** Custom illustration: ten vertebrae that start out of line and settle into alignment as you scroll past. */
export function Spine({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const bones = gsap.utils.toArray<SVGGElement>('[data-bone]', el);
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 90%', end: 'bottom 40%', scrub: 0.8 } });
      bones.forEach((b, i) => tl.from(b, { ...off(i), svgOrigin: `60 ${24 + i * 28}`, ease: 'power2.out', duration: 1 }, i * 0.04));
      tl.from('[data-aligned]', { opacity: 0, y: 6, duration: 0.3 }, '>-0.2');
    },
    { scope: ref },
  );
  return (
    <svg ref={ref} viewBox="0 0 120 310" className={className} role="img" aria-label="Illustration of a spine settling into alignment" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {Array.from({ length: N }, (_, i) => {
        const y = 14 + i * 28;
        const w = 30 + i * 1.6; // lower vertebrae are wider
        return (
          <g key={i} data-bone>
            <rect x={60 - w / 2} y={y} width={w} height={18} rx={7} stroke="currentColor" strokeWidth="3" />
            <path d={`M${60 - w / 2 - 10} ${y + 7} L${60 - w / 2} ${y + 9} M${60 + w / 2} ${y + 9} L${60 + w / 2 + 10} ${y + 7}`} stroke="currentColor" strokeWidth="3" />
            {i < N - 1 && <ellipse cx="60" cy={y + 23} rx={w / 2 - 4} ry="2.4" fill="var(--clay)" />}
          </g>
        );
      })}
      <text data-aligned x="60" y="306" textAnchor="middle" fontSize="11" fill="currentColor" opacity=".7" style={{ letterSpacing: '.18em' }}>
        ALIGNED
      </text>
    </svg>
  );
}
