'use client';
import { useRef, type ReactNode } from 'react';
import { gsap, SplitText, useGSAP } from './gsap';

type Props = {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span' | 'blockquote';
  children: ReactNode;
  className?: string;
  /** lines (default) rise out of a mask; words stagger individually */
  by?: 'lines' | 'words' | 'chars';
  delay?: number;
  /** animate on mount instead of on scroll */
  immediate?: boolean;
};

/** Masked text reveal on scroll (GSAP SplitText). Text stays readable to screen readers and without JS. */
export function Reveal({ as = 'div', children, className, by = 'lines', delay = 0, immediate }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as as 'div';
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      SplitText.create(el, {
        type: by === 'chars' ? 'words,chars' : by === 'words' ? 'lines,words' : 'lines',
        mask: by === 'chars' ? 'words' : 'lines',
        autoSplit: true,
        aria: 'auto',
        onSplit(self) {
          const targets = by === 'chars' ? self.chars : by === 'words' ? self.words : self.lines;
          return gsap.from(targets, {
            yPercent: 110,
            rotate: by === 'lines' ? 2 : 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: by === 'chars' ? 0.018 : by === 'words' ? 0.04 : 0.09,
            delay,
            scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 88%', once: true },
          });
        },
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Fade-and-rise for any block, on scroll. */
export function FadeIn({ children, className, delay = 0, y = 40 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from(ref.current, { y, opacity: 0, duration: 1.2, ease: 'expo.out', delay, scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true } });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
