'use client';
/**
 * Extra flourishes built on open-source libraries:
 * rough-notation (hand-drawn marks), NumberFlow (rolling numbers), canvas-confetti, and Paper Shaders (liquid metal).
 */
import NumberFlow from '@number-flow/react';
import { LiquidMetal } from '@paper-design/shaders-react';
import confetti from 'canvas-confetti';
import { motion, useSpring } from 'motion/react';
import { useEffect, useRef, type ComponentProps, type ReactNode } from 'react';
import { annotate } from 'rough-notation';
import { gsap, useGSAP } from './gsap';
import { useReducedMotion } from './use-reduced-motion';

type Mark = 'underline' | 'box' | 'circle' | 'highlight' | 'strike-through' | 'crossed-off' | 'bracket';

/** A hand-drawn mark (underline, circle, highlight...) that sketches itself when the words scroll into view. */
export function Annotate({ children, type = 'underline', color = 'var(--accent)', strokeWidth = 2.5, padding = 4, delay = 0, multiline = true }: { children: ReactNode; type?: Mark; color?: string; strokeWidth?: number; padding?: number; delay?: number; multiline?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // rough-notation draws SVG with a literal colour, so resolve CSS variables first
    const resolved = color.startsWith('var(') ? getComputedStyle(el).getPropertyValue(color.slice(4, -1)).trim() || '#000' : color;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const a = annotate(el, { type, color: resolved, strokeWidth, padding, multiline, animate: !still, animationDuration: 900, iterations: 2 });
    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        timer = window.setTimeout(() => a.show(), delay);
        io.disconnect();
      },
      { rootMargin: '-15% 0px' },
    );
    io.observe(el);
    return () => {
      clearTimeout(timer);
      io.disconnect();
      a.remove();
    };
  }, [type, color, strokeWidth, padding, delay, multiline]);
  return <span ref={ref}>{children}</span>;
}

/**
 * Digits that roll into place when a number changes. Use for calculators and live figures.
 * The animated digits are hidden from screen readers, which get the whole formatted value instead.
 */
export function Num(props: ComponentProps<typeof NumberFlow>) {
  const { value, locales, format, prefix = '', suffix = '' } = props;
  const text = `${prefix}${new Intl.NumberFormat(locales, format).format(Number(value))}${suffix}`;
  return (
    <span>
      <span className="sr-only">{text}</span>
      <NumberFlow {...props} aria-hidden willChange />
    </span>
  );
}

/** A short burst of confetti in the brand's colours, fired from an element (or the centre). Skipped for reduced motion. */
export function burst({ from, colors, shapes = ['circle'], count = 90 }: { from?: Element | null; colors: string[]; shapes?: confetti.Shape[]; count?: number }) {
  if (typeof window === 'undefined') return;
  const r = from?.getBoundingClientRect();
  const origin = r ? { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight } : { x: 0.5, y: 0.6 };
  confetti({ particleCount: count, spread: 75, startVelocity: 38, gravity: 1.1, ticks: 220, scalar: 1.1, origin, colors, shapes, disableForReducedMotion: true });
}

/**
 * A line illustration that draws itself as it scrolls into view. Mark each stroke to draw with `data-draw`;
 * anything with `data-after` fades in once the lines are done.
 */
export function LineArt({ children, className, viewBox, label, scrub = false, duration = 2.2 }: { children: ReactNode; className?: string; viewBox: string; label?: string; scrub?: boolean; duration?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const tl = gsap.timeline({ scrollTrigger: scrub ? { trigger: el, start: 'top 85%', end: 'center 45%', scrub: 0.6 } : { trigger: el, start: 'top 80%', once: true } });
      tl.from(el.querySelectorAll('[data-draw]'), { drawSVG: '0%', duration, ease: 'power2.inOut', stagger: 0.12 });
      const after = el.querySelectorAll('[data-after]');
      if (after.length) tl.from(after, { opacity: 0, scale: 0.6, transformOrigin: 'center', duration: 0.6, stagger: 0.08, ease: 'back.out(2)' }, '-=0.4');
    },
    { scope: ref },
  );
  return (
    <svg ref={ref} viewBox={viewBox} className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

/** Liquid chrome poured into a shape (an SVG or PNG silhouette). Shows the plain silhouette for reduced motion. */
export function Chrome({ image, className, colorBack = '#00000000', colorTint = '#ffffff', speed = 0.6 }: { image: string; className?: string; colorBack?: string; colorTint?: string; speed?: number }) {
  const still = useReducedMotion();
  return (
    <div className={className}>
      <LiquidMetal image={image} colorBack={colorBack} colorTint={colorTint} speed={still ? 0 : speed} repetition={4} softness={0.3} shiftRed={0.3} shiftBlue={0.3} distortion={0.1} contour={0.4} shape="none" scale={0.8} fit="contain" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

/**
 * Hangs its child from a pivot at the top. Brush the pointer across it and it swings, then settles
 * like a key tag on a hook. Still for reduced motion.
 */
export function Swing({ children, className }: { children: ReactNode; className?: string }) {
  const rot = useSpring(0, { stiffness: 70, damping: 3.5, mass: 0.8 });
  const still = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ rotate: rot, transformOrigin: '50% 0%' }}
      onPointerMove={(e) => {
        if (still) return;
        rot.set(Math.max(-38, Math.min(38, e.movementX * 2.2)));
        window.setTimeout(() => rot.set(0), 70);
      }}
    >
      {children}
    </motion.div>
  );
}
