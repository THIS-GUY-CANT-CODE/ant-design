'use client';
import { Chrome, Counter, Magnetic, RollText, Scramble, useReducedMotion } from '@sc/ui';
import { useEffect, useRef, useState } from 'react';
import { bitting, PHONE } from './data';

// Key blank in SVG units. The blade's top edge is at TOP; cuts go down to TOP + MAX.
const X0 = 250, X1 = 930, TOP = 118, BOT = 196, MAX = 52, COLS = 170, R = 64;
const colX = (i: number) => X0 + (i / (COLS - 1)) * (X1 - X0);

function keyPath(depth: Float32Array) {
  let d = `M232 ${TOP} L${X0} ${TOP}`;
  for (let i = 0; i < COLS; i++) d += ` L${colX(i).toFixed(1)} ${(TOP + depth[i]!).toFixed(1)}`;
  return `${d} L${X1 + 8} ${TOP + 4} L975 ${(TOP + BOT) / 2} L${X1 + 8} ${BOT} L232 ${BOT} Z`;
}
// bow with its hole (even-odd), joined to the blade at x=232
const BOW = 'M232 96 L232 218 L214 218 A92 92 0 1 1 214 96 Z M174 157 A24 24 0 1 0 126 157 A24 24 0 1 0 174 157 Z';

// The shop's own key, for visitors who'd rather not cut: bitting for "ROSE1938"
function presetDepth() {
  const cuts = bitting('ROSE1938'), d = new Float32Array(COLS);
  for (let i = 0; i < COLS; i++) {
    const x = colX(i);
    cuts.forEach((c, k) => {
      const cx = X0 + 40 + k * ((X1 - X0 - 80) / (cuts.length - 1));
      d[i] = Math.max(d[i]!, Math.max(0, (c + 1) * 6 - Math.abs(x - cx) * 1.1));
    });
  }
  return d;
}

/**
 * Hero: a key-cutting machine. The cutter follows your pointer: how low you hold it is how deep it cuts,
 * with sparks where it bites. Run it to the tip and your one-off key turns to polished steel.
 */
export function Hero() {
  const still = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const bladeRef = useRef<SVGPathElement>(null);
  const wheelRef = useRef<SVGGElement>(null);
  const sparksRef = useRef<HTMLCanvasElement>(null);
  const depth = useRef(new Float32Array(COLS));
  const [done, setDone] = useState<string | null>(null);
  const [cutting, setCutting] = useState(false);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const svg = svgRef.current, blade = bladeRef.current, wheel = wheelRef.current, cv = sparksRef.current;
    if (!svg || !blade || !wheel || !cv) return;
    const d = depth.current;
    if (still) {
      d.set(presetDepth());
      blade.setAttribute('d', keyPath(d));
      return;
    }
    d.fill(0);
    blade.setAttribute('d', keyPath(d));
    const cx = cv.getContext('2d')!;
    const dpr = Math.min(2, window.devicePixelRatio);
    const sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = [];
    let raf = 0, finished = false, maxX = 0, touched = 0, auto = 0;
    const wheelPos = { x: X1 - 30, y: TOP - 6 };

    const toSvg = (clientX: number, clientY: number) => {
      const m = svg.getScreenCTM();
      if (!m) return null;
      const p = new DOMPoint(clientX, clientY).matrixTransform(m.inverse());
      return { x: p.x, y: p.y };
    };
    const toScreen = (x: number, y: number) => {
      const m = svg.getScreenCTM()!, r = cv.getBoundingClientRect();
      const p = new DOMPoint(x, y).matrixTransform(m);
      return { x: (p.x - r.left) * dpr, y: (p.y - r.top) * dpr };
    };

    const cutAt = (x: number, y: number) => {
      const want = Math.max(0, Math.min(MAX, y - TOP));
      if (want <= 0) return;
      let bit = 0;
      for (let i = 0; i < COLS; i++) {
        const dx = Math.abs(colX(i) - x);
        if (dx > want) continue;
        const v = want - dx; // a 90° cutter leaves a V
        if (v > d[i]!) {
          if (d[i] === 0) touched++;
          bit += v - d[i]!;
          d[i] = v;
        }
      }
      if (bit > 0.3) {
        const s = toScreen(x, TOP + want);
        for (let k = 0; k < Math.min(8, 2 + bit); k++) sparks.push({ x: s.x, y: s.y, vx: (Math.random() * 7 + 2) * dpr, vy: (-Math.random() * 7 - 1) * dpr, life: 1 });
        blade.setAttribute('d', keyPath(d));
      }
      maxX = Math.max(maxX, x);
      if (!finished && maxX > X1 - 14 && touched > COLS * 0.35) finish();
    };

    const finish = () => {
      finished = true;
      const svgText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="50 30 940 250" width="1880" height="500"><path d="${BOW}" fill="#000" fill-rule="evenodd"/><path d="${keyPath(d)}" fill="#000"/></svg>`;
      window.setTimeout(() => setDone(`data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`), 500);
    };

    const place = (x: number, y: number) => {
      wheelPos.x = x;
      wheelPos.y = Math.min(TOP + MAX, y);
      wheel.setAttribute('transform', `translate(${wheelPos.x} ${wheelPos.y - R})`);
    };
    place(wheelPos.x, wheelPos.y);

    const move = (e: PointerEvent) => {
      if (finished) return;
      const p = toSvg(e.clientX, e.clientY);
      if (!p) return;
      clearInterval(auto);
      auto = 0;
      place(p.x, p.y);
      if (p.x > X0 - 10 && p.x < X1 + 10) cutAt(p.x, wheelPos.y);
      setCutting(p.y > TOP);
    };
    const host = svg.closest('section')!;
    host.addEventListener('pointermove', move);

    // no mouse (phones), or nobody touching it for a while: the machine cuts a key by itself
    const demo = () => {
      if (finished || auto) return;
      const cuts = bitting(String(Math.floor(Math.random() * 1e8)));
      let x = X0 - 40;
      auto = window.setInterval(() => {
        x += 5;
        const k = Math.floor(((x - X0) / (X1 - X0)) * cuts.length);
        const y = TOP + (x < X0 || k >= cuts.length ? -10 : (cuts[k]! + 1) * 6 + Math.sin(x / 9) * 3);
        place(x, y);
        cutAt(x, wheelPos.y);
        if (x > X1 + 10) {
          clearInterval(auto);
          auto = 0;
        }
      }, 16);
    };
    const idle = window.setTimeout(demo, window.matchMedia('(hover: none)').matches ? 800 : 4500);

    const frame = () => {
      const W = cv.clientWidth * dpr, H = cv.clientHeight * dpr;
      if (cv.width !== W || cv.height !== H) {
        cv.width = W;
        cv.height = H;
      } else cx.clearRect(0, 0, W, H);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]!;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.45 * dpr;
        s.life -= 0.035;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        cx.strokeStyle = `rgba(255,${Math.round(120 + 110 * s.life)},${Math.round(90 * s.life)},${s.life})`;
        cx.lineWidth = 2 * dpr;
        cx.beginPath();
        cx.moveTo(s.x, s.y);
        cx.lineTo(s.x - s.vx * 1.6, s.y - s.vy * 1.6);
        cx.stroke();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(auto);
      clearTimeout(idle);
      host.removeEventListener('pointermove', move);
    };
  }, [still, run]);

  const years = new Date().getFullYear() - 1938;
  return (
    <section id="top" className="relative overflow-hidden bg-alt text-bg" data-cursor={done ? undefined : 'Cut'}>
      <div className="mx-auto max-w-[1600px] px-5 pt-14 md:px-8 md:pt-20">
        <p className="font-mono text-[12px] opacity-60"><Scramble>149 BETHNAL GREEN ROAD · LONDON E2 · KEY MACHINE Nº1</Scramble></p>
        <h1 className="mt-6 max-w-[14ch] font-display text-[clamp(3.4rem,9vw,9.5rem)] leading-[0.84] font-bold tracking-[-0.055em]">
          Keys cut since <span className="text-accent">1938.</span>
        </h1>
      </div>

      <div className="relative mx-auto mt-16 max-w-[1600px] px-2 md:mt-20 md:px-6">
        <svg ref={svgRef} viewBox="50 30 940 250" className="relative z-10 block w-full touch-pan-y overflow-visible select-none" role="img" aria-label={done ? 'A freshly cut key, polished' : 'A key blank in a cutting machine. Move your pointer along it to cut a key.'}>
          <defs>
            <linearGradient id="rl-steel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F2F4F6" />
              <stop offset=".45" stopColor="#C9CDD2" />
              <stop offset="1" stopColor="#8D939B" />
            </linearGradient>
          </defs>
          <g opacity={done ? 0 : 1} style={{ transition: 'opacity .6s' }}>
            <path d={BOW} fill="url(#rl-steel)" fillRule="evenodd" />
            <path ref={bladeRef} fill="url(#rl-steel)" />
            <path d={`M262 ${TOP + 40} L${X1 - 10} ${TOP + 40}`} stroke="#8D939B" strokeWidth="5" strokeLinecap="round" />
          </g>
          {/* the cutter: a toothed wheel that follows the pointer */}
          {!done && !still && (
            <g ref={wheelRef}>
              <g className={cutting ? 'animate-[spin_.35s_linear_infinite]' : 'animate-[spin_2.5s_linear_infinite]'} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
                <circle r={R} fill="#2a2a2a" stroke="var(--accent)" strokeWidth="3" />
                {Array.from({ length: 24 }, (_, i) => (
                  <path key={i} d={`M0 ${-R} l5 -9 l5 9`} fill="var(--accent)" transform={`rotate(${i * 15})`} />
                ))}
                <circle r="14" fill="var(--accent)" />
                <circle r="5" fill="var(--alt)" />
              </g>
            </g>
          )}
        </svg>
        <canvas ref={sparksRef} aria-hidden className="pointer-events-none absolute inset-0 z-20 size-full" />
        {done && <Chrome image={done} colorTint="#FFD3E2" className="absolute inset-x-2 top-0 bottom-0 z-10 md:inset-x-6" />}
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-8 px-5 pt-6 pb-14 md:px-8">
        <div className="max-w-md">
          <p className="text-[18px] leading-snug opacity-75" aria-live="polite">
            {done
              ? 'That’s your key. Only one like it. Bring the real one in and we’ll cut it properly, while you wait.'
              : still
                ? 'Keys, remotes, locks, paint and hardware. The same family has run this shop since it opened.'
                : 'Run your pointer along the blank to cut a key. Lower is deeper. Mind the sparks.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Magnetic>
              <a href="#visit" className="block rounded-full bg-bg px-7 py-4 text-[16px] font-medium text-fg"><RollText>Visit the shop</RollText></a>
            </Magnetic>
            <Magnetic>
              <a href={`tel:${PHONE.emergency[1]}`} className="block rounded-full bg-accent px-7 py-4 text-[16px] font-medium text-accent-ink">Emergency: {PHONE.emergency[0]}</a>
            </Magnetic>
            {done && (
              <button type="button" onClick={() => (setDone(null), setRun((r) => r + 1))} className="rounded-full border border-bg/30 px-6 py-4 text-[15px]">
                Cut another
              </button>
            )}
          </div>
        </div>
        <dl className="flex gap-8 font-mono text-[13px]">
          <div><dd className="font-display text-[44px] leading-none font-bold tracking-[-0.05em]">4.9</dd><dt className="mt-1 opacity-60">Google, <Counter to={684} /> reviews</dt></div>
          <div><dd className="font-display text-[44px] leading-none font-bold tracking-[-0.05em]"><Counter to={years} /></dd><dt className="mt-1 opacity-60">years on the street</dt></div>
          <div><dd className="font-display text-[44px] leading-none font-bold tracking-[-0.05em]">1</dd><dt className="mt-1 opacity-60">family, all along</dt></div>
        </dl>
      </div>
    </section>
  );
}
