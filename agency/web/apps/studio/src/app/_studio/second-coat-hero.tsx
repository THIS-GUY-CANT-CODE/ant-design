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
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = host.current!, oc = oldRef.current!, wc = wetRef.current!, roller = rollerRef.current!;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      queueMicrotask(() => setDone(true));
      return;
    }
    const o = oc.getContext('2d')!, wet = wc.getContext('2d')!;
    const dpr = Math.min(2, window.devicePixelRatio);
    let w = 0, h = 0, raf = 0, finished = false, last: [number, number] | null = null, painted = 0;
    const size = () => {
      w = oc.width = wc.width = el.clientWidth * dpr;
      h = oc.height = wc.height = el.clientHeight * dpr;
      drawOldSite(o, w, h, dpr * Math.max(0.6, Math.min(1.4, el.clientWidth / 1150, el.clientHeight / 640)));
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);

    // one roller pass between two points: erase the old site, lay wet paint with a ragged edge
    const roll = (a: [number, number], b: [number, number], width = 150) => {
      const W = width * dpr;
      o.globalCompositeOperation = 'destination-out';
      o.lineCap = 'round';
      o.lineWidth = W;
      o.beginPath();
      o.moveTo(a[0], a[1]);
      o.lineTo(b[0], b[1]);
      o.stroke();
      o.globalCompositeOperation = 'source-over';
      wet.lineCap = 'round';
      for (let k = 0; k < 3; k++) {
        wet.strokeStyle = k ? `rgba(255,79,31,${0.35 / k})` : ORANGE;
        wet.lineWidth = W * (1 + k * 0.06) + Math.random() * 6;
        wet.beginPath();
        wet.moveTo(a[0] + (Math.random() - 0.5) * 4, a[1]);
        wet.lineTo(b[0] + (Math.random() - 0.5) * 4, b[1]);
        wet.stroke();
      }
      painted += Math.hypot(b[0] - a[0], b[1] - a[1]) * W;
    };

    // wet paint dries off to reveal the new site underneath
    const dry = () => {
      wet.globalCompositeOperation = 'destination-out';
      wet.fillStyle = 'rgba(0,0,0,0.035)';
      wet.fillRect(0, 0, w, h);
      wet.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(dry);
    };
    raf = requestAnimationFrame(dry);

    // finish: big overlapping passes, top to bottom, then hand the page over
    const finish = () => {
      if (finished) return;
      finished = true;
      const rows = Math.ceil(h / (150 * dpr)) + 1;
      let r = 0;
      const pass = () => {
        const y = r * 150 * dpr;
        const from: [number, number] = r % 2 ? [w + 80, y] : [-80, y];
        const to: [number, number] = r % 2 ? [-80, y] : [w + 80, y];
        roll(from, to, 190);
        if (++r <= rows) window.setTimeout(pass, 70);
        else
          window.setTimeout(() => {
            cancelAnimationFrame(raf);
            setDone(true);
          }, 900);
      };
      pass();
    };

    const toLocal = (e: PointerEvent): [number, number] => {
      const r = el.getBoundingClientRect();
      return [(e.clientX - r.left) * dpr, (e.clientY - r.top) * dpr];
    };
    const move = (e: PointerEvent) => {
      if (finished) return;
      const r = el.getBoundingClientRect();
      roller.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
      if (e.pointerType !== 'mouse') return;
      const p = toLocal(e);
      if (last) roll(last, p);
      last = p;
      setStarted(true);
      if (painted > w * h * 0.5) finish();
    };
    const leave = () => (last = null);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);

    // a first pass on its own so it's obvious what to do; touch screens get the whole job done for them
    const touch = window.matchMedia('(hover: none)').matches;
    const demo = window.setTimeout(() => {
      const y = h * 0.42;
      let x = -60;
      const step = () => {
        if (finished) return;
        const nx = x + 70 * dpr;
        roll([x, y + Math.sin(x / 300) * 30], [nx, y + Math.sin(nx / 300) * 30], 170);
        roller.style.transform = `translate(${nx / dpr}px, ${(y + Math.sin(nx / 300) * 30) / dpr}px)`;
        x = nx;
        if (x < w * (touch ? 1.1 : 0.62)) window.setTimeout(step, 16);
        else if (touch) window.setTimeout(finish, 300);
      };
      step();
    }, 900);

    const onFinish = () => finish();
    el.addEventListener('second-coat:finish', onFinish);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(demo);
      ro.disconnect();
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      el.removeEventListener('second-coat:finish', onFinish);
    };
  }, []);

  return (
    <section ref={host} className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pt-32 pb-10 md:px-8" data-cursor={done ? undefined : 'Roll'}>
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
          <canvas ref={wetRef} aria-hidden className="pointer-events-none absolute inset-0 z-10 size-full" />
          <div ref={rollerRef} aria-hidden className="pointer-events-none absolute top-0 left-0 z-20 hidden md:block" style={{ transform: 'translate(55vw, 45vh)' }}>
            <svg viewBox="0 0 120 200" className="-mt-4 -ml-[60px] h-40 w-24 drop-shadow-[0_14px_20px_rgb(0_0_0/.3)]" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="112" height="46" rx="18" fill={ORANGE} stroke="#0c0c0c" strokeWidth="5" />
              <path d="M18 14 H102 M18 27 H102 M18 40 H102" stroke="#0c0c0c" strokeOpacity=".18" strokeWidth="3" />
              <path d="M60 50 V70 H96 V110" stroke="#0c0c0c" strokeWidth="7" />
              <rect x="86" y="108" width="20" height="80" rx="10" fill="#0c0c0c" />
            </svg>
          </div>
          <div className="absolute inset-x-0 bottom-6 z-20 flex justify-center px-5">
            <div className="flex items-center gap-3 rounded-full bg-[#0c0c0c] py-2 pr-2 pl-5 text-[14px] text-white shadow-2xl">
              <span>{started ? 'Keep rolling…' : 'This is the site most businesses have. Roll a second coat on it.'}</span>
              <button type="button" onClick={() => host.current?.dispatchEvent(new Event('second-coat:finish'))} className="rounded-full bg-[#FF4F1F] px-4 py-2 font-medium text-white">
                Paint it for me
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
