'use client';
import { useEffect, useRef } from 'react';

type Strand = { pts: Float32Array; prev: Float32Array; seg: number; width: number; phase: number; thick: boolean };

/**
 * A curtain of noodles hanging over the hero, simulated as ropes (Verlet integration).
 * Fine rice vermicelli on the Hanoi side, wide hand-pulled belt noodles on the Xi'an side.
 * Sweep the pointer through and they swing, tangle a little, and settle.
 */
export function Noodles({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const cx = cv.getContext('2d')!;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(2, window.devicePixelRatio);
    const N = 22; // points per strand
    let w = 0, h = 0, strands: Strand[] = [], raf = 0, t = 0;
    const pointer = { x: -999, y: -999, vx: 0, vy: 0, on: false };

    const build = () => {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      strands = [];
      const add = (x: number, thick: boolean, i: number) => {
        const len = h * (thick ? 0.5 + ((i * 37) % 23) / 100 : 0.42 + ((i * 53) % 31) / 100);
        const seg = len / (N - 1);
        const pts = new Float32Array(N * 2);
        for (let k = 0; k < N; k++) {
          pts[k * 2] = x;
          pts[k * 2 + 1] = -8 + k * seg;
        }
        strands.push({ pts, prev: pts.slice(), seg, width: thick ? 11 + (i % 3) * 3 : 2.2 + (i % 3) * 0.6, phase: i * 1.7, thick });
      };
      // Hanoi: fine and many
      const fine = Math.round((w / 2) / 18);
      for (let i = 0; i < fine; i++) add(((i + 0.5) / fine) * w * 0.48 + ((i * 7) % 9) - 4, false, i);
      // Xi'an: wide and few
      const wide = Math.max(6, Math.round((w / 2) / 58));
      for (let i = 0; i < wide; i++) add(w * 0.52 + ((i + 0.5) / wide) * w * 0.48, true, i);
    };

    const step = () => {
      t += 1 / 60;
      const R = Math.max(60, w * 0.05);
      for (const s of strands) {
        const p = s.pts, q = s.prev;
        for (let k = 1; k < N; k++) {
          const ix = k * 2, iy = ix + 1;
          const vx = (p[ix]! - q[ix]!) * 0.982, vy = (p[iy]! - q[iy]!) * 0.982;
          q[ix] = p[ix]!;
          q[iy] = p[iy]!;
          // gravity and a faint kitchen draught
          p[ix] = p[ix]! + vx + Math.sin(t * 0.9 + s.phase + k * 0.15) * 0.012 * k;
          p[iy] = p[iy]! + vy + 0.42;
          if (pointer.on) {
            const dx = p[ix]! - pointer.x, dy = p[iy]! - pointer.y, d = Math.hypot(dx, dy);
            if (d < R) {
              const f = (1 - d / R) * (s.thick ? 0.35 : 0.6);
              p[ix] = p[ix]! + pointer.vx * f;
              p[iy] = p[iy]! + pointer.vy * f * 0.6;
            }
          }
        }
        // keep each segment its length; the top point is pinned
        for (let it = 0; it < 8; it++) {
          for (let k = 0; k < N - 1; k++) {
            const a = k * 2, b = a + 2;
            const dx = p[b]! - p[a]!, dy = p[b + 1]! - p[a + 1]!;
            const d = Math.hypot(dx, dy) || 1;
            const diff = (d - s.seg) / d;
            if (k === 0) {
              p[b] = p[b]! - dx * diff;
              p[b + 1] = p[b + 1]! - dy * diff;
            } else {
              p[a] = p[a]! + dx * diff * 0.5;
              p[a + 1] = p[a + 1]! + dy * diff * 0.5;
              p[b] = p[b]! - dx * diff * 0.5;
              p[b + 1] = p[b + 1]! - dy * diff * 0.5;
            }
          }
        }
      }
      pointer.vx *= 0.5;
      pointer.vy *= 0.5;
    };

    const path = (p: Float32Array) => {
      cx.beginPath();
      cx.moveTo(p[0]!, p[1]!);
      for (let k = 1; k < N - 1; k++) {
        const mx = (p[k * 2]! + p[k * 2 + 2]!) / 2, my = (p[k * 2 + 1]! + p[k * 2 + 3]!) / 2;
        cx.quadraticCurveTo(p[k * 2]!, p[k * 2 + 1]!, mx, my);
      }
      cx.lineTo(p[(N - 1) * 2]!, p[(N - 1) * 2 + 1]!);
    };

    const draw = () => {
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx.clearRect(0, 0, w, h);
      cx.lineCap = 'round';
      cx.lineJoin = 'round';
      for (const s of strands) {
        // soft shadow on the papaya behind
        cx.save();
        cx.translate(4, 6);
        cx.strokeStyle = 'rgba(26,18,13,.16)';
        cx.lineWidth = s.width;
        path(s.pts);
        cx.stroke();
        cx.restore();
        cx.strokeStyle = s.thick ? '#FFE9B8' : '#FFF6EC';
        cx.lineWidth = s.width;
        path(s.pts);
        cx.stroke();
        if (s.thick) {
          // a sheen down the middle of the wide noodles
          cx.strokeStyle = 'rgba(255,255,255,.7)';
          cx.lineWidth = s.width * 0.18;
          path(s.pts);
          cx.stroke();
        }
      }
    };

    const loop = () => {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    };

    build();
    if (still) {
      for (let i = 0; i < 120; i++) step();
      draw();
    } else {
      // on load the noodles start bunched at the top and unfurl as they fall
      for (const s of strands)
        for (let k = 2; k < s.pts.length; k += 2) {
          s.pts[k] = s.pts[0]! + ((k * 13) % 7) - 3;
          s.pts[k + 1] = -8 + k * 0.4;
          s.prev[k] = s.pts[k]!;
          s.prev[k + 1] = s.pts[k + 1]!;
        }
    }

    const host = cv.parentElement!;
    const move = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (pointer.on) {
        pointer.vx = Math.max(-40, Math.min(40, x - pointer.x));
        pointer.vy = Math.max(-40, Math.min(40, y - pointer.y));
      }
      pointer.x = x;
      pointer.y = y;
      pointer.on = true;
    };
    const leave = () => (pointer.on = false);
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);

    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e?.isIntersecting && !still) raf = requestAnimationFrame(loop);
    });
    io.observe(cv);
    const ro = new ResizeObserver(() => {
      build();
      if (still) {
        for (let i = 0; i < 120; i++) step();
        draw();
      }
    });
    ro.observe(cv);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
    };
  }, []);
  return <canvas ref={ref} aria-hidden className={className} />;
}
