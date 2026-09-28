'use client';
import { useEffect, useRef, useState } from 'react';

// Real streets in each office's patch.
const STREETS: [string, string[]][] = [
  ['Bow', ['Roman Road', 'Bow Road', 'Tredegar Square', 'Fairfield Road', 'Old Ford Road', 'Grove Road', 'Coborn Road', 'Malmesbury Road', 'Antill Road', 'Mile End Road', 'Lichfield Road', 'Driffield Road']],
  ['Stratford', ['Romford Road', 'Water Lane', 'West Ham Lane', 'Maryland Street', 'Leytonstone Road', 'Vicarage Lane', 'Chobham Road', 'Crownfield Road']],
  ['Wood Green', ['Lordship Lane', 'Bounds Green Road', 'Hornsey Park Road', 'Station Road', 'Mayes Road', 'Westbury Avenue', 'Sirdar Road', 'Turnpike Lane']],
  ['Highams Park', ['The Avenue', 'Hale End Road', 'Handsworth Avenue', 'Beech Hall Road', 'Selwyn Avenue', 'Winchester Road', 'Cavendish Avenue', 'Larkshall Road']],
  ['Enfield', ['Chase Side', 'Church Street', 'Silver Street', 'Baker Street', 'Lancaster Road', 'Gordon Road', 'Windmill Hill', 'Parsonage Lane']],
];
const ALL = STREETS.flatMap(([area, s]) => s.map((st) => `${st}, ${area}`));

// the key-tag mark (64 grid), hole at (32, 22)
const TAG_D = 'M32 10 52 28v21a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5V28Zm0 8a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM26.5 54V43a5.5 5.5 0 0 1 11 0v11Z';

type Tag = { x: number; y: number; a: number; w: number; street: string; tone: number; len: number };

/**
 * A wall of key tags, one per street across the five offices' patches, hanging on hooks like the board behind
 * any agent's desk. Brush the pointer across and they swing; rest on one to read its street.
 */
export function KeyWall({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    const cv = ref.current!;
    const cx = cv.getContext('2d')!;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(2, window.devicePixelRatio);
    const TAG = new Path2D(TAG_D);
    let tags: Tag[] = [], w = 0, h = 0, raf = 0, S = 1;
    const ptr = { x: -999, y: -999, vx: 0, on: false };
    const css = getComputedStyle(cv);
    const cobalt = css.getPropertyValue('--accent').trim() || '#2F49FF';
    const mist = css.getPropertyValue('--mist').trim() || '#E8EBFF';
    const ink = css.getPropertyValue('--fg').trim() || '#0E0E10';

    const build = () => {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      S = Math.max(0.6, Math.min(1.15, w / 1250)); // tag scale
      const gap = 74 * S, rows = 3;
      tags = [];
      let n = 0;
      for (let r = 0; r < rows; r++) {
        const y = 18 + r * ((h - 30) / rows);
        for (let x = gap / 2 + (r % 2 ? gap / 2 : 0); x < w; x += gap) {
          tags.push({ x, y, a: still ? 0 : (Math.random() - 0.5) * 1.2, w: 0, street: ALL[n % ALL.length]!, tone: (n * 7) % 11, len: 10 + ((n * 5) % 3) * 4 });
          n++;
        }
      }
    };

    const draw = () => {
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx.clearRect(0, 0, w, h);
      // the rails the hooks screw into
      cx.strokeStyle = 'rgba(14,14,16,.12)';
      cx.lineWidth = 1;
      for (const y of new Set(tags.map((t) => t.y))) {
        cx.beginPath();
        cx.moveTo(0, y - 6);
        cx.lineTo(w, y - 6);
        cx.stroke();
      }
      for (const t of tags) {
        cx.save();
        cx.translate(t.x, t.y);
        // hook
        cx.fillStyle = 'rgba(14,14,16,.55)';
        cx.beginPath();
        cx.arc(0, 0, 2.2, 0, Math.PI * 2);
        cx.fill();
        cx.rotate(t.a);
        // ring through the tag's hole
        cx.strokeStyle = 'rgba(14,14,16,.5)';
        cx.lineWidth = 1.2;
        cx.beginPath();
        cx.ellipse(0, t.len / 2, 3.2, t.len / 2 + 2, 0, 0, Math.PI * 2);
        cx.stroke();
        // tag, hung by its hole
        const k = 0.95 * S;
        cx.translate(0, t.len);
        cx.scale(k, k);
        cx.translate(-32, -22);
        cx.fillStyle = t.tone === 0 ? ink : t.tone < 4 ? mist : cobalt;
        cx.fill(TAG, 'evenodd');
        cx.restore();
      }
    };

    const step = () => {
      const R = 90;
      for (const t of tags) {
        // a pendulum: gravity pulls it straight, air slows it
        t.w += -0.012 * Math.sin(t.a) - 0.035 * t.w;
        if (ptr.on) {
          const d = Math.hypot(ptr.x - t.x, ptr.y - (t.y + 26 * S));
          if (d < R) t.w += ptr.vx * 0.0024 * (1 - d / R);
        }
        t.a += t.w;
      }
      ptr.vx *= 0.6;
    };

    const loop = () => {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };

    build();
    draw();
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (ptr.on) ptr.vx = Math.max(-60, Math.min(60, x - ptr.x));
      ptr.x = x;
      ptr.y = y;
      ptr.on = true;
      // which tag is under the pointer?
      let best: Tag | null = null, bd = 30 * S;
      for (const t of tags) {
        const d = Math.hypot(t.x - x, t.y + 30 * S - y);
        if (d < bd) {
          bd = d;
          best = t;
        }
      }
      setTip(best ? { x: best.x, y: best.y + 58 * S, text: best.street } : null);
    };
    const leave = () => {
      ptr.on = false;
      setTip(null);
    };
    cv.addEventListener('pointermove', move);
    cv.addEventListener('pointerleave', leave);
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e?.isIntersecting && !still) raf = requestAnimationFrame(loop);
    });
    io.observe(cv);
    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(cv);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      cv.removeEventListener('pointermove', move);
      cv.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div className={`relative ${className ?? ''}`}>
      <canvas ref={ref} className="block size-full touch-pan-y" role="img" aria-label={`A board of key tags, one for each street we cover, including ${ALL.slice(0, 4).join('; ')}`} data-cursor="Brush" />
      {tip && (
        <span className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-full bg-fg px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap text-bg shadow-lg" style={{ left: tip.x, top: tip.y }}>
          {tip.text}
        </span>
      )}
    </div>
  );
}
