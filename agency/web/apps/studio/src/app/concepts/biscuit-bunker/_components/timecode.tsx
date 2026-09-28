'use client';
import { useEffect, useRef } from 'react';

/** A camera-style running timecode (HH:MM:SS:FF at 25fps) with a blinking REC light. */
export function Timecode({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const start = performance.now();
    let raf = 0;
    const pad = (n: number) => String(n).padStart(2, '0');
    const tick = (t: number) => {
      const f = Math.floor(((t - start) / 1000) * 25);
      el.textContent = `${pad(Math.floor(f / 90000) % 24)}:${pad(Math.floor(f / 1500) % 60)}:${pad(Math.floor(f / 25) % 60)}:${pad(f % 25)}`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[12px] tabular-nums ${className ?? ''}`} aria-hidden>
      <span className="size-2 animate-[blink_1s_steps(2,start)_infinite] rounded-full bg-[#FF3B30]" />
      REC
      <span ref={ref}>00:00:00:00</span>
    </span>
  );
}
