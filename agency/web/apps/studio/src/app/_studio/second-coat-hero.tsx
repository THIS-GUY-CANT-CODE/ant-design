'use client';
import { Magnetic, RollText, Scramble } from '@sc/ui';
import { useEffect, useRef, useState } from 'react';
import { PlaceCycle } from './reach';

const ORANGE = '#FF4F1F';

/**
 * The first coat: a deliberately tired small-business website, drawn on a canvas so it can be painted over.
 * It's the "before" that most of our clients start from.
 */
function drawOldSite(cx: CanvasRenderingContext2D, w: number, h: number, s: number) {
  cx.save();
  cx.scale(s, s);
  const W = w / s, H = h / s;
  cx.fillStyle = '#d4d0c8';
  cx.fillRect(0, 0, W, H);
  // faint tiled background
  cx.fillStyle = '#cbc7bf';
  for (let y = 0; y < H; y += 24) for (let x = (y / 24) % 2 ? 12 : 0; x < W; x += 24) cx.fillRect(x, y, 12, 12);
  // banner
  const g = cx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, '#000080');
  g.addColorStop(1, '#1084d0');
  cx.fillStyle = g;
  cx.fillRect(0, 0, W, 118);
  cx.fillStyle = '#ffffff';
  cx.font = 'bold 44px "Times New Roman", Times, serif';
  cx.fillText('Welcome To Our Website!!!', 36, 72);
  cx.font = 'italic 17px "Times New Roman", Times, serif';
  cx.fillText('Quality Service at Affordable Prices ~ Family Run Since 1987', 38, 100);
  // bevelled nav
  const nav = ['HOME', 'ABOUT US', 'SERVICES', 'PRICES', 'GUESTBOOK', 'CONTACT'];
  nav.forEach((n, i) => {
    const y = 150 + i * 46;
    cx.fillStyle = '#c0c0c0';
    cx.fillRect(28, y, 170, 34);
    cx.fillStyle = '#ffffff';
    cx.fillRect(28, y, 170, 2);
    cx.fillRect(28, y, 2, 34);
    cx.fillStyle = '#808080';
    cx.fillRect(28, y + 32, 170, 2);
    cx.fillRect(196, y, 2, 34);
    cx.fillStyle = '#000000';
    cx.font = 'bold 14px Arial, sans-serif';
    cx.fillText(n, 44, y + 22);
  });
  // body copy
  const left = 240;
  cx.fillStyle = '#800000';
  cx.font = 'bold 34px "Comic Sans MS", "Comic Sans", "Chalkboard SE", cursive';
  cx.fillText('Family Business Since 1987', left, 190);
  cx.fillStyle = '#000000';
  cx.font = '19px "Times New Roman", Times, serif';
  ['We are a family run business offering a quality service at affordable', 'prices. No job too big or too small! Please call us for a FREE quote', 'or visit our shop. We look forward to hearing from you!!'].forEach((l, i) => cx.fillText(l, left, 236 + i * 28));
  cx.fillStyle = '#0000ee';
  cx.font = 'underline 19px "Times New Roman", Times, serif';
  cx.fillText('>> Click here for our latest offers <<', left, 346);
  cx.fillRect(left, 350, 318, 1.5);
  // under construction strip
  for (let x = left; x < Math.min(W - 40, left + 560); x += 28) {
    cx.fillStyle = (x / 28) % 2 ? '#111111' : '#ffd400';
    cx.beginPath();
    cx.moveTo(x, 390);
    cx.lineTo(x + 28, 390);
    cx.lineTo(x + 14, 420);
    cx.lineTo(x - 14, 420);
    cx.fill();
  }
  cx.fillStyle = '#000000';
  cx.font = 'bold 18px Arial, sans-serif';
  cx.fillText('!! PAGE UNDER CONSTRUCTION !!', left, 452);
  // footer bits
  cx.fillStyle = '#000000';
  cx.fillRect(left, 486, 150, 30);
  cx.fillStyle = '#00ff00';
  cx.font = 'bold 20px "Courier New", monospace';
  cx.fillText('0 0 4 1 7 2', left + 12, 508);
  cx.fillStyle = '#333333';
  cx.font = '14px Arial, sans-serif';
  cx.fillText('You are visitor number 004172. Best viewed at 800x600 in Internet Explorer.', left + 166, 506);
  cx.fillText('Last updated 14/03/2011  |  (c) All rights reserved  |  Webmaster', left, 548);
  cx.restore();
}

/**
 * Hero: the page opens on a tired old website. Your cursor is a paint roller. Roll it and fresh orange goes on,
 * dries, and the new brand shows through. Past about half, the roller finishes the job for you.
 */
export function SecondCoatHero() {
  const host = useRef<HTMLElement>(null);
  const oldRef = useRef<HTMLCanvasElement>(null);
  const wetRef = useRef<HTMLCanvasElement>(null);
  const rollerRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const [drying, setDrying] = useState(false);

  useEffect(() => {
    const el = host.current!, oc = oldRef.current!, wc = wetRef.current!, roller = rollerRef.current!;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      queueMicrotask(() => setDone(true));
      return;
    }
    const o = oc.getContext('2d')!, wet = wc.getContext('2d')!;
    const dpr = Math.min(2, window.devicePixelRatio);
    const w = (oc.width = wc.width = el.clientWidth * dpr);
    const h = (oc.height = wc.height = el.clientHeight * dpr);
    drawOldSite(o, w, h, dpr * Math.max(0.6, Math.min(1.4, el.clientWidth / 1150, el.clientHeight / 640)));

    // one stroke of the roller: take the old site off, put wet orange on
    const roll = (a: [number, number], b: [number, number], W: number) => {
      o.globalCompositeOperation = 'destination-out';
      o.lineCap = wet.lineCap = 'round';
      o.lineWidth = W;
      o.beginPath();
      o.moveTo(a[0], a[1]);
      o.lineTo(b[0], b[1]);
      o.stroke();
      wet.strokeStyle = ORANGE;
      wet.lineWidth = W;
      wet.beginPath();
      wet.moveTo(a[0], a[1]);
      wet.lineTo(b[0], b[1]);
      wet.stroke();
    };

    // the pointer can join in while it runs
    let last: [number, number] | null = null;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      const p: [number, number] = [(e.clientX - r.left) * dpr, (e.clientY - r.top) * dpr];
      if (last) roll(last, p, 140 * dpr);
      last = p;
    };
    el.addEventListener('pointermove', move);

    // one quick, continuous take: a beat on the old site, then the roller zig-zags down the page
    const rows = el.clientWidth < 700 ? 5 : 4;
    const rowH = h / rows, W = rowH * 1.3, pad = W * 0.6;
    const BEAT = 250, SWEEP = 2000;
    roller.style.setProperty('--band', `${W / dpr}px`);
    let raf = 0, start = 0, head: [number, number] | null = null;
    const at = (t: number): [number, number] => {
      const k = Math.min(rows - 1e-6, t * rows), r = Math.floor(k), f = k - r;
      const e = f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2; // ease each pass
      const x = r % 2 ? w + pad - e * (w + 2 * pad) : -pad + e * (w + 2 * pad);
      return [x, rowH * (r + 0.5)];
    };
    const frame = (now: number) => {
      if (!start) start = now;
      const t = (now - start - BEAT) / SWEEP;
      if (t >= 0) {
        const p = at(Math.min(1, t));
        // don't draw the jump from the end of one row to the start of the next
        if (head && Math.abs(p[1] - head[1]) < 1) roll(head, p, W);
        else roll(p, p, W);
        head = p;
        roller.style.transform = `translate(${p[0] / dpr}px, ${p[1] / dpr}px)`;
      }
      if (t < 1) raf = requestAnimationFrame(frame);
      else {
        setDrying(true);
        window.setTimeout(() => setDone(true), 720);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', move);
    };
  }, []);

  return (
    <section ref={host} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pt-32 pb-10 md:px-8" >
      {/* the new coat, underneath */}
      <div className="relative mx-auto w-full max-w-[1600px]">
        <p className="mb-8 flex items-center gap-3 text-[14px] text-muted">
          <span className="size-2 shrink-0 animate-pulse rounded-full bg-accent" /> <Scramble>Brand & web studio · Made in East London · Working UK-wide and worldwide</Scramble>
        </p>
        <h1 className="max-w-[16ch] font-display text-[clamp(3.4rem,9.4vw,10rem)] leading-[0.88] font-semibold tracking-[-0.06em]">
          We give brilliant independent businesses a <span className="font-serif font-normal tracking-[-0.02em] text-accent italic">second coat.</span>
        </h1>
        <div className="mt-12 grid gap-6 border-t border-line pt-6 md:grid-cols-12">
          <p className="max-w-md text-[18px] leading-snug text-muted md:col-span-6">
            A new brand and a modern website, built on your real story. We started on our own high streets in East London. Now we work with independents from <PlaceCycle className="font-medium text-fg" />
            <span className="mt-3 block">You see the finished thing before you pay a penny.</span>
          </p>
          <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
            <Magnetic>
              <a href="#work" className="block rounded-full bg-fg px-7 py-4 text-[16px] font-medium text-bg"><RollText>See the work</RollText></a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="block rounded-full bg-accent px-7 py-4 text-[16px] font-medium text-accent-ink"><RollText>Get a free redesign</RollText></a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* the old coat, on top, until it's painted over */}
      {!done && (
        <>
          <canvas ref={oldRef} aria-hidden className="pointer-events-none absolute inset-0 z-10 size-full" />
          <canvas ref={wetRef} aria-hidden className={`pointer-events-none absolute inset-0 z-10 size-full transition-opacity duration-700 ease-out ${drying ? 'opacity-0' : 'opacity-100'}`} />
          <div ref={rollerRef} aria-hidden className={`pointer-events-none absolute top-0 left-0 z-20 transition-opacity duration-300 ${drying ? 'opacity-0' : 'opacity-100'}`} style={{ transform: 'translate(-300px, -300px)' }}>
            {/* the sleeve is as tall as the stripe it lays, the handle rises off the top */}
            <div className="relative -translate-x-1/2 -translate-y-1/2" style={{ height: 'var(--band, 200px)' }}>
              <div className="h-full w-11 rounded-2xl border-4 border-[#0c0c0c] shadow-[0_16px_30px_rgb(0_0_0/.3)]" style={{ background: `repeating-linear-gradient(0deg, ${ORANGE} 0 14px, #d9400f 14px 17px)` }} />
              <svg viewBox="0 0 80 130" className="absolute bottom-full left-1/2 -mb-1 h-32 w-20 -translate-x-[10px]" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 130 V100 H56 V52" stroke="#0c0c0c" strokeWidth="7" />
                <rect x="46" y="2" width="20" height="54" rx="10" fill="#0c0c0c" />
              </svg>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
