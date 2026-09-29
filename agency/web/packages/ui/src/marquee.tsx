'use client';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { useRef, type ReactNode } from 'react';

/** Infinite marquee that speeds up, skews and flips direction with scroll velocity. */
export function Marquee({ children, speed = 40, className }: { children: ReactNode; speed?: number; className?: string }) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const skew = useTransform(vel, [-3000, 0, 3000], [8, 0, -8]);
  const dir = useRef(1);
  const x = useTransform(base, (v) => `${((((v % 50) + 50) % 50) - 50).toFixed(3)}%`);
  useAnimationFrame((_, delta) => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    base.set(base.get() - dir.current * (speed / 1000) * (delta / 16) * (1 + Math.abs(f)) * 0.1);
  });
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className ?? ''}`}>
      <motion.div className="inline-flex" style={{ x, skewX: skew }}>
        <div className="inline-flex shrink-0">{children}</div>
        <div className="inline-flex shrink-0" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
