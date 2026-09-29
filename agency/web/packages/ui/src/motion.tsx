'use client';
import { motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'motion/react';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { gsap, useGSAP } from './gsap';
import { scrollToTop } from './smooth-scroll';
import { useReducedMotion } from './use-reduced-motion';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Thin accent bar across the top that fills as you scroll the page. */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden style={{ scaleX }} className={`fixed inset-x-0 top-0 z-[160] h-[3px] origin-left bg-accent ${className ?? ''}`} />;
}

/**
 * Brand curtain on first paint: the name rises, then the panel wipes up and away.
 * Pure CSS (see `.intro` in globals.css), so it clears itself without JS and never blocks clicks.
 */
export function PageIntro({ label, className }: { label: string; className?: string }) {
  return (
    <div aria-hidden className={`intro pointer-events-none fixed inset-0 z-[300] grid place-items-center ${className ?? 'bg-fg text-bg'}`}>
      <span className="intro-label overflow-hidden font-display text-[clamp(2rem,6vw,5rem)] leading-none font-semibold tracking-[-0.05em]">
        <span className="block">{label}</span>
      </span>
    </div>
  );
}

/** Card that tilts towards the pointer in 3D, with a soft glare that follows it. */
export function Tilt({ children, className, max = 8, glare = true, style }: { children: ReactNode; className?: string; max?: number; glare?: boolean; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 18 });
  return (
    <motion.div
      ref={ref}
      className={`group/tilt relative [transform-style:preserve-3d] ${className ?? ''}`}
      style={{ ...style, rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || reduced()) return;
        const r = ref.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set((0.5 - py) * max * 2);
        ref.current!.style.setProperty('--mx', `${px * 100}%`);
        ref.current!.style.setProperty('--my', `${py * 100}%`);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
      {glare && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
          style={{ background: 'radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgb(255 255 255 / .22), transparent 55%)' }}
        />
      )}
    </motion.div>
  );
}

/** A soft accent glow that follows the pointer inside a block (lists, cards, rows). */
export function Spotlight({ children, className, color = 'var(--accent)', size = 360 }: { children: ReactNode; className?: string; color?: string; size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`group/spot relative isolate ${className ?? ''}`}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty('--sx', `${e.clientX - r.left}px`);
        ref.current!.style.setProperty('--sy', `${e.clientY - r.top}px`);
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spot:opacity-100"
        style={{ background: `radial-gradient(${size}px circle at var(--sx,50%) var(--sy,50%), color-mix(in srgb, ${color} 26%, transparent), transparent 70%)` }}
      />
      {children}
    </div>
  );
}

/**
 * Hover text roll: each letter slides up and is replaced by a copy from below, staggered.
 * Triggers when the nearest link, button or `.roll-host` is hovered. Screen readers get the plain text.
 */
export function RollText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={`roll ${className ?? ''}`}>
      <span className="sr-only">{children}</span>
      <span aria-hidden className="roll-inner">
        {Array.from(children).map((c, i) => {
          const ch = c === ' ' ? ' ' : c;
          return (
            <span key={i} data-t={ch} style={{ transitionDelay: `${i * 14}ms` }}>
              {ch}
            </span>
          );
        })}
      </span>
    </span>
  );
}

/** Letters that lift and take the accent colour as the pointer passes over them. For giant wordmarks. Lines only break between words. */
export function HoverLetters({ children, className }: { children: string; className?: string }) {
  const words = children.split(' ');
  return (
    <span className={`hover-letters ${className ?? ''}`}>
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="whitespace-nowrap">
              {Array.from(w).map((c, i) => (
                <span key={i} data-l>
                  {c}
                </span>
              ))}
            </span>
            {wi < words.length - 1 && ' '}
          </span>
        ))}
      </span>
    </span>
  );
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>';

/** Decodes from random glyphs into the real text when it scrolls into view, and again on hover. */
export function Scramble({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const len = children.length;
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / 700);
        const done = Math.floor(p * len);
        let out = '';
        for (let i = 0; i < len; i++) {
          const c = children[i];
          out += i < done || c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { rootMargin: '-10% 0px' },
    );
    io.observe(el);
    el.addEventListener('pointerenter', run);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener('pointerenter', run);
      el.textContent = children;
    };
  }, [children]);
  return (
    <span ref={ref} aria-label={children} className={`whitespace-pre-wrap ${className ?? ''}`}>
      {children}
    </span>
  );
}

/** Leans (skews) with scroll speed, then settles. Makes big type feel physical. */
export function Skew({ children, className, amount = 6 }: { children: ReactNode; className?: string; amount?: number }) {
  const off = useReducedMotion();
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 40, stiffness: 300 });
  const skewY = useTransform(vel, [-2500, 0, 2500], [amount, 0, -amount], { clamp: true });
  return (
    <motion.div className={className} style={off ? undefined : { skewY }}>
      {children}
    </motion.div>
  );
}

/** Moves at a different speed to the page as it scrolls past. `speed` is roughly px per 100px scrolled. */
export function Parallax({ children, className, speed = 12 }: { children: ReactNode; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const off = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 4, -speed * 4]);
  return (
    <motion.div ref={ref} className={className} style={off ? undefined : { y }}>
      {children}
    </motion.div>
  );
}

/** Opens a block from a rounded inset window to full size as it enters, while its contents settle from a zoom. */
export function ClipReveal({ children, className, radius = 28 }: { children: ReactNode; className?: string; radius?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
      tl.from(el, { clipPath: `inset(14% 10% 14% 10% round ${radius}px)`, duration: 1.4, ease: 'expo.out' });
      if (el.firstElementChild) tl.from(el.firstElementChild, { scale: 1.18, duration: 1.6, ease: 'expo.out' }, 0);
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className} style={{ clipPath: `inset(0% 0% 0% 0% round ${radius}px)` }}>
      {children}
    </div>
  );
}

/** Children rise in one after another when the group scrolls into view. */
export function Stagger({ children, className, as = 'div', y = 36, gap = 0.07 }: { children: ReactNode; className?: string; as?: 'div' | 'ul' | 'ol'; y?: number; gap?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as as 'div';
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced()) return;
      gsap.from(el.children, { y, opacity: 0, duration: 1, ease: 'expo.out', stagger: gap, clearProps: 'transform,opacity', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Round button, bottom right, whose ring fills with scroll progress. Click to glide back up. */
export function BackToTop({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const dash = useTransform(scrollYProgress, [0, 1], [132, 0]);
  const opacity = useTransform(scrollYProgress, [0.08, 0.16], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.08, 0.16], [0.6, 1]);
  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      data-cursor="Top"
      onClick={() => scrollToTop()}
      style={{ opacity, scale }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.9 }}
      className={`fixed right-4 bottom-4 z-[140] hidden size-14 place-items-center rounded-full bg-fg text-bg shadow-[0_10px_30px_rgba(0,0,0,.18)] md:grid ${className ?? ''}`}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <motion.circle cx="24" cy="24" r="21" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeDasharray="132" style={{ strokeDashoffset: dash }} strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.button>
  );
}

/** Everything a page gets for free: scroll progress, back to top, and a brand intro curtain. */
export function MotionKit({ intro, introClassName }: { intro?: string; introClassName?: string }) {
  return (
    <>
      {intro && <PageIntro label={intro} className={introClassName} />}
      <ScrollProgress />
      <BackToTop />
    </>
  );
}
