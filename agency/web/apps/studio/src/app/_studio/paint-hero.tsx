'use client';
import { Magnetic, Reveal } from '@sc/ui';
import { useEffect, useRef } from 'react';

/** Wet paint: the pointer leaves soft orange brush strokes behind the headline that slowly dry away. */
function PaintCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const cx = cv.getContext('2d')!;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let w = 0, h = 0, last: [number, number] | null = null, raf = 0, live = false;
    const dpr = Math.min(2, window.devicePixelRatio);
    const size = () => {
      w = cv.width = cv.clientWidth * dpr;
      h = cv.height = cv.clientHeight * dpr;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    const dry = () => {
      cx.globalCompositeOperation = 'destination-out';
      cx.fillStyle = 'rgba(0,0,0,0.018)';
      cx.fillRect(0, 0, w, h);
      cx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(dry);
    };
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const p: [number, number] = [(e.clientX - r.left) * dpr, (e.clientY - r.top) * dpr];
      if (last) {
        const speed = Math.hypot(p[0] - last[0], p[1] - last[1]);
        cx.strokeStyle = '#FF4F1F';
        cx.lineCap = cx.lineJoin = 'round';
        cx.lineWidth = Math.max(28, 90 - speed * 0.35) * dpr;
        cx.beginPath();
        cx.moveTo(last[0], last[1]);
        cx.lineTo(p[0], p[1]);
        cx.stroke();
      }
      last = p;
      if (!live) {
        live = true;
        dry();
      }
    };
    const leave = () => (last = null);
    const host = cv.parentElement!;
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
    };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 size-full" />;
}

export function PaintHero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pt-32 pb-10 md:px-8">
      <PaintCanvas />
      <div className="relative mx-auto w-full max-w-[1600px]">
        <p className="mb-8 flex items-center gap-3 text-[14px] text-muted">
          <span className="size-2 rounded-full bg-accent" /> East London brand &amp; web studio
        </p>
        <Reveal as="h1" immediate className="max-w-[16ch] font-display text-[clamp(3.4rem,9.4vw,10rem)] leading-[0.88] font-semibold tracking-[-0.06em]">
          We give East London&apos;s best businesses a <span className="font-serif font-normal tracking-[-0.02em] italic">second coat.</span>
        </Reveal>
        <div className="mt-12 grid gap-6 border-t border-line pt-6 md:grid-cols-12">
          <p className="max-w-md text-[18px] leading-snug text-muted md:col-span-6">
            A new brand and a modern website, built on your real story. You see the finished thing before you pay a penny.
          </p>
          <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
            <Magnetic>
              <a href="#work" className="block rounded-full bg-fg px-7 py-4 text-[16px] font-medium text-bg">See the work</a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="block rounded-full bg-accent px-7 py-4 text-[16px] font-medium text-accent-ink">Get a free redesign</a>
            </Magnetic>
          </div>
        </div>
        <p className="mt-6 hidden text-[12px] text-muted md:block">Go on, move your cursor. Wet paint.</p>
      </div>
    </section>
  );
}
