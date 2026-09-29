'use client';
import { animate, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';

/** Counts up to `to` when scrolled into view. Renders the final value for reduced motion and no-JS. */
export function Counter({ to, from = 0, duration = 1.6, className }: { to: number; from?: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  useEffect(() => {
    if (!inView || !ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    const c = animate(from, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => (el.textContent = Math.round(v).toString()) });
    return () => c.stop();
  }, [inView, from, to, duration]);
  return (
    <span ref={ref} className={className}>
      {to}
    </span>
  );
}
