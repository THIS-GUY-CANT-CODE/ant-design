'use client';
import { useReducedMotion } from '@sc/ui';
import { useEffect, useRef, useState } from 'react';

// Pin-tumbler cross-section. Shear line at y=170. A key pin of length L rests with its tip at y=250;
// the right key lifts it by (80 - L) so the gap between key pin and driver pin sits exactly on the shear line.
const PX = [150, 220, 290, 360, 430];
const L = [42, 58, 34, 52, 46];
const DRIVER = 44;
const RIGHT = L.map((l) => 170 + l);

function blade(cuts: number[]) {
  let d = 'M0 238 L50 238';
  PX.forEach((x, i) => {
    const k = x - 40;
    d += ` L${k - 22} 236 L${k - 6} ${cuts[i]} L${k + 6} ${cuts[i]} L${k + 22} 236`;
  });
  return d + ' L460 236 L476 252 L460 270 L0 270 Z';
}

type State = 'idle' | 'in' | 'open' | 'shut';

export function Lock() {
  const reduce = useReducedMotion();
  const [cuts, setCuts] = useState(RIGHT);
  const [state, setState] = useState<State>('idle');
  const [lifted, setLifted] = useState(false);
  const timers = useRef<number[]>([]);
  const run = (c: number[]) => {
    timers.current.forEach(clearTimeout);
    setCuts(c);
    setLifted(false);
    setState('in');
    const right = c.every((v, i) => v === RIGHT[i]);
    const t1 = reduce ? 0 : 1100, t2 = reduce ? 0 : 1600;
    timers.current = [window.setTimeout(() => setLifted(true), t1), window.setTimeout(() => setState(right ? 'open' : 'shut'), t2)];
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const inserted = state !== 'idle';
  const shear = state === 'open' ? '#22C55E' : state === 'shut' ? 'var(--accent)' : 'var(--steel)';

  return (
    <section id="lock" className="bg-alt text-bg">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 py-32 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <p className="font-mono text-[12px] opacity-60">FIG. 1 · PIN TUMBLER, CROSS-SECTION</p>
          <h2 className="mt-6 font-display text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.9] font-bold tracking-[-0.05em]">Why the right key turns.</h2>
          <p className="mt-6 max-w-sm text-[17px] leading-relaxed opacity-70">
            Each cut lifts a pin to exactly the shear line. One cut out and the lock stays shut. That&apos;s why a badly copied key sticks, and why we take the time to cut it properly.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <button onClick={() => run(RIGHT)} className="rounded-full bg-bg px-6 py-3.5 text-[15px] font-medium text-fg">Try the right key</button>
            <button onClick={() => run(L.map(() => 205 + Math.round(Math.random() * 25)))} className="rounded-full border border-bg/30 px-6 py-3.5 text-[15px] font-medium">Try a bad copy</button>
          </div>
          <p className="mt-8 font-mono text-[13px]" aria-live="polite">
            STATUS: <span style={{ color: shear }}>{state === 'idle' ? 'READY' : state === 'in' ? 'INSERTING…' : state === 'open' ? 'UNLOCKED' : 'STILL LOCKED'}</span>
          </p>
        </div>
        <div className="md:col-span-8">
          <svg viewBox="-20 20 640 300" className="w-full" role="img" aria-label="Cross-section of a pin-tumbler lock">
            <rect x="80" y="30" width="440" height="270" rx="10" fill="none" stroke="var(--steel)" strokeOpacity=".5" />
            <rect x="80" y="170" width="440" height="110" fill={state === 'open' ? 'rgb(34 197 94 / .08)' : 'rgb(255 255 255 / .03)'} stroke="var(--steel)" strokeOpacity=".5" style={{ transition: 'fill .4s' }} />
            {PX.map((x, i) => {
              const lift = lifted ? 250 - cuts[i]! : 0;
              const top = 30, bot = 250 - L[i]! - DRIVER;
              let spring = `M${x - 10} ${top}`;
              for (let y = top, k = 0; y < bot; y += 8, k++) spring += ` L${x + (k % 2 ? -10 : 10)} ${Math.min(y + 8, bot)}`;
              return (
                <g key={x}>
                  <path d={spring} fill="none" stroke="var(--steel)" strokeOpacity=".6" strokeWidth="1.2" style={{ transformOrigin: `${x}px ${top}px`, transform: `scaleY(${Math.max(0.25, (bot - top - lift) / (bot - top))})`, transition: 'transform .45s cubic-bezier(.3,1.5,.5,1)' }} />
                  <g style={{ transform: `translateY(${-lift}px)`, transition: 'transform .45s cubic-bezier(.3,1.5,.5,1)' }}>
                    <rect x={x - 12} y={250 - L[i]! - DRIVER} width="24" height={DRIVER} rx="3" fill="none" stroke="var(--steel)" strokeWidth="1.5" />
                    <path d={`M${x - 12} ${250 - L[i]!} h24 v${L[i]! - 10} l-12 10 l-12 -10z`} fill="var(--accent)" />
                  </g>
                </g>
              );
            })}
            <line x1="80" x2="520" y1="170" y2="170" stroke={shear} strokeWidth="2" strokeDasharray="7 6" style={{ transition: 'stroke .3s' }} />
            <text x="524" y="174" className="font-mono text-[10px]" fill={shear}>SHEAR LINE</text>
            <g style={{ transform: `translateX(${inserted ? 40 : -380}px)`, transition: reduce ? 'none' : 'transform 1.1s cubic-bezier(.6,0,.2,1)' }}>
              <path d={blade(cuts)} fill="none" stroke="var(--bg)" strokeWidth="1.8" strokeLinejoin="round" />
              <circle cx="-40" cy="254" r="38" fill="none" stroke="var(--bg)" strokeWidth="1.8" />
              <circle cx="-40" cy="254" r="11" fill="none" stroke="var(--bg)" strokeWidth="1.8" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
