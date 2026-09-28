'use client';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';

/**
 * Context cursor: a dot plus a trailing disc. Anything with data-cursor="View" grows the disc
 * and shows that label; links and buttons grow it slightly. Fine pointers only.
 */
export function Cursor({ color = 'var(--accent)', ink = 'var(--bg)' }: { color?: string; ink?: string }) {
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState('');
  const [hot, setHot] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('has-cursor');
    const move = (e: PointerEvent) => {
      setOn(true);
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-cursor],a,button,[role=button]') : null;
      setLabel(t?.dataset.cursor ?? '');
      setHot(!!t);
    };
    const leave = () => setOn(false);
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', leave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  }, [x, y]);

  const size = label ? 96 : hot ? 44 : 14;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[200] grid place-items-center rounded-full"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%', background: color, color: ink, mixBlendMode: label ? 'normal' : 'difference' }}
      animate={{ width: size, height: size, opacity: on ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <span className="text-[11px] font-medium tracking-tight">{label}</span>
    </motion.div>
  );
}
