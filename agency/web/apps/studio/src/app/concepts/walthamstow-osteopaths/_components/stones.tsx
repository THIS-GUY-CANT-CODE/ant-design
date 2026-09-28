'use client';
import { useReducedMotion } from '@sc/ui';
import Matter from 'matter-js';
import { useEffect, useRef, useState } from 'react';

const { Engine, Bodies, Body, Composite, Sleeping } = Matter;

// the stack from the mark, bottom to top: half-width, half-height, tilt, colour
const STONES: [number, number, number, string][] = [
  [0.34, 0.075, 0, '#EEEAE3'],
  [0.27, 0.068, -0.05, '#E4DFD5'],
  [0.21, 0.06, 0.07, '#EEEAE3'],
  [0.16, 0.052, -0.04, '#E8E3DA'],
  [0.11, 0.046, 0.05, '#E3B49A'],
];

/** Where each stone sits when the stack is balanced. */
function stack(w: number, h: number) {
  const out: { x: number; y: number; a: number }[] = [];
  let y = h * 0.9;
  STONES.forEach(([, ry, a], i) => {
    const RY = ry * w;
    y -= RY;
    out.push({ x: w / 2 + (i % 2 ? -1 : 1) * w * 0.012, y, a });
    y -= RY - 1;
  });
  return out;
}

const ellipse = (rx: number, ry: number, n = 22) => Array.from({ length: n }, (_, i) => ({ x: Math.cos((i / n) * Math.PI * 2) * rx, y: Math.sin((i / n) * Math.PI * 2) * ry }));

/**
 * Hero art: the balanced stones from the mark, as real physics inside the No.72 arch.
 * Pick one up, knock the stack over, and after a moment it puts itself back in balance.
 */
export function Stones() {
  const box = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const [state, setState] = useState<'still' | 'off' | 'mending'>('still');
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = box.current;
    const { w, h } = size;
    if (!el || !w || still) return;
    const engine = Engine.create({ enableSleeping: true, gravity: { x: 0, y: 1 } });
    const floor = h * 0.9;
    const T = 200;
    const homes = stack(w, h);
    const bodies = STONES.map(([rx, ry], i) => {
      const b = Bodies.fromVertices(homes[i]!.x, homes[i]!.y, [ellipse(rx * w, ry * w)], { friction: 0.9, frictionStatic: 1.2, restitution: 0.05, density: 0.004 });
      Body.setAngle(b, homes[i]!.a);
      return b;
    });
    Composite.add(engine.world, [
      ...bodies,
      Bodies.rectangle(w / 2, floor + T / 2, w * 2, T, { isStatic: true, friction: 1 }),
      Bodies.rectangle(-T / 2, h / 2, T, h * 3, { isStatic: true }),
      Bodies.rectangle(w + T / 2, h / 2, T, h * 3, { isStatic: true }),
    ]);
    const nodes = Array.from(el.querySelectorAll<SVGGElement>('[data-stone]'));

    // drag a stone
    let drag: { b: Matter.Body; id: number; ox: number; oy: number; vx: number; vy: number; px: number; py: number } | null = null;
    let quiet = 0, mending = false;
    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent) => {
      const p = local(e);
      const hit = Matter.Query.point(bodies, p)[0];
      if (!hit || mending) return;
      el.setPointerCapture(e.pointerId);
      drag = { b: hit, id: e.pointerId, ox: hit.position.x - p.x, oy: hit.position.y - p.y, vx: 0, vy: 0, px: p.x, py: p.y };
      Body.setStatic(hit, true);
      setState('off');
    };
    const move = (e: PointerEvent) => {
      if (!drag) {
        // brushing past the stack gives it a little nudge
        const p = local(e);
        const hit = Matter.Query.point(bodies, p)[0];
        if (hit && !mending) {
          Sleeping.set(hit, false);
          Body.applyForce(hit, p, { x: (e.movementX || 0) * 0.00018 * hit.mass, y: 0 });
        }
        return;
      }
      const p = local(e);
      drag.vx = p.x - drag.px;
      drag.vy = p.y - drag.py;
      drag.px = p.x;
      drag.py = p.y;
      Body.setPosition(drag.b, { x: Math.max(20, Math.min(w - 20, p.x + drag.ox)), y: Math.max(20, Math.min(floor - 10, p.y + drag.oy)) });
    };
    const up = () => {
      if (!drag) return;
      Body.setStatic(drag.b, false);
      Sleeping.set(drag.b, false);
      Body.setVelocity(drag.b, { x: drag.vx * 0.8, y: drag.vy * 0.8 });
      bodies.forEach((b) => Sleeping.set(b, false));
      drag = null;
      quiet = performance.now();
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);

    // is the stack out of place?
    const off = () => bodies.some((b, i) => Math.hypot(b.position.x - homes[i]!.x, b.position.y - homes[i]!.y) > 12 || Math.abs(b.angle - homes[i]!.a) > 0.25);

    // put it back: every stone floats home, bottom first
    const mend = () => {
      mending = true;
      setState('mending');
      const from = bodies.map((b) => ({ x: b.position.x, y: b.position.y, a: b.angle }));
      bodies.forEach((b) => Body.setStatic(b, true));
      const t0 = performance.now();
      const step = () => {
        let all = true;
        bodies.forEach((b, i) => {
          const k = Math.min(1, Math.max(0, (performance.now() - t0 - i * 180) / 1100));
          const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
          if (k < 1) all = false;
          const lift = Math.sin(k * Math.PI) * 60;
          Body.setPosition(b, { x: from[i]!.x + (homes[i]!.x - from[i]!.x) * e, y: from[i]!.y + (homes[i]!.y - from[i]!.y) * e - lift });
          Body.setAngle(b, from[i]!.a + (homes[i]!.a - from[i]!.a) * e);
        });
        if (!all) return void (mendRaf = requestAnimationFrame(step));
        bodies.forEach((b) => {
          Body.setStatic(b, false);
          Body.setVelocity(b, { x: 0, y: 0 });
          Body.setAngularVelocity(b, 0);
          Sleeping.set(b, true);
        });
        mending = false;
        quiet = 0;
        setState('still');
      };
      mendRaf = requestAnimationFrame(step);
    };

    let raf = 0, mendRaf = 0, last = performance.now();
    const tick = (now: number) => {
      Engine.update(engine, Math.min(32, now - last));
      last = now;
      bodies.forEach((b, i) => nodes[i]?.setAttribute('transform', `translate(${b.position.x} ${b.position.y}) rotate(${(b.angle * 180) / Math.PI})`));
      if (!drag && !mending) {
        if (off()) {
          if (!quiet) quiet = now;
          if (now - quiet > 2400 && bodies.every((b) => b.speed < 0.6)) mend();
        } else quiet = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    // settle for a moment before showing, so the first frame is already balanced
    for (let i = 0; i < 30; i++) Engine.update(engine, 16);
    homes.forEach((hm, i) => {
      hm.x = bodies[i]!.position.x;
      hm.y = bodies[i]!.position.y;
      hm.a = bodies[i]!.angle;
    });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(mendRaf);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      Engine.clear(engine);
    };
  }, [size, still]);

  const { w, h } = size;
  // static layout (and the first paint before physics): the mark's stack
  const statics = stack(w, h);

  return (
    <div ref={box} className="absolute inset-0 cursor-grab touch-pan-y select-none active:cursor-grabbing" data-cursor="Nudge">
      {w > 0 && (
        <svg width={w} height={h} className="absolute inset-0" role="img" aria-label="Five stones balanced in a stack, the practice's mark">
          <defs>
            <radialGradient id="wo-stone" cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#fff" stopOpacity=".55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx={w / 2} cy={h * 0.9 + 6} rx={w * 0.36} ry={w * 0.03} fill="#1F2A22" opacity=".18" />
          {STONES.map(([rx, ry, , c], i) => (
            <g key={i} data-stone transform={`translate(${statics[i]!.x} ${statics[i]!.y}) rotate(${(statics[i]!.a * 180) / Math.PI})`}>
              <ellipse rx={rx * w} ry={ry * w} fill={c} />
              <ellipse rx={rx * w} ry={ry * w} fill="url(#wo-stone)" />
              <ellipse rx={rx * w * 0.96} ry={ry * w * 0.9} cy={ry * w * 0.12} fill="none" stroke="#1F2A22" strokeOpacity=".08" strokeWidth="2" />
            </g>
          ))}
        </svg>
      )}
      <p aria-live="polite" className="pointer-events-none absolute inset-x-0 top-[16%] text-center font-display text-[22px] text-[#F8F6F1] italic transition-opacity duration-500" style={{ opacity: state === 'still' ? 0 : 1 }}>
        {state === 'mending' ? 'Back in balance.' : 'Easy. We’ll put that right.'}
      </p>
    </div>
  );
}
