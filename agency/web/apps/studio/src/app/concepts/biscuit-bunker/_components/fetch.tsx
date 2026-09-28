'use client';
import { useReducedMotion } from '@sc/ui';
import Matter from 'matter-js';
import { useEffect, useRef, useState } from 'react';

const { Engine, Bodies, Body, Composite, Sleeping, Events } = Matter;

const LINES: [string, string][] = [
  ['Good content.', 'font-display font-semibold tracking-[-0.065em] text-fg'],
  ['Fetched.', 'font-serif italic tracking-[-0.03em] text-accent'],
];

function Ball() {
  return (
    <svg viewBox="-50 -50 100 100" className="block size-full drop-shadow-[0_24px_30px_rgb(0_0_0/.55)]">
      <defs>
        <radialGradient id="bb-felt" cx="-0.25" cy="-0.3" r="1.05" gradientUnits="objectBoundingBox" fx="0.32" fy="0.28">
          <stop offset="0" stopColor="#F4FFB0" />
          <stop offset=".45" stopColor="#D7FF3F" />
          <stop offset="1" stopColor="#7C9A12" />
        </radialGradient>
        <filter id="bb-fuzz" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="4" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .18 0" />
          <feComposite in2="SourceGraphic" operator="in" />
          <feBlend in="SourceGraphic" mode="soft-light" />
        </filter>
      </defs>
      <circle r="48" fill="url(#bb-felt)" filter="url(#bb-fuzz)" />
      {/* only the seam turns, so the light stays put */}
      <g style={{ transform: 'rotate(var(--r, 0rad))' }}>
        <path d="M-44 -18 C-18 -4 -18 30 -30 38 M44 18 C18 4 18 -30 30 -38" fill="none" stroke="#F7F8EC" strokeWidth="4.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * Hero: "Good content. Fetched." with a tennis ball you can pick up and throw. Every letter is a physical body:
 * hit it and it tumbles. Leave it alone and the letters are fetched back into place.
 */
export function FetchHeadline() {
  const stage = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const [messy, setMessy] = useState(false);
  const api = useRef<{ tidy: () => void } | null>(null);

  useEffect(() => {
    const root = stage.current, ballEl = ballRef.current;
    if (!root || !ballEl || still) return;
    // coordinates are relative to the ball's positioned container
    const section = (ballEl.offsetParent as HTMLElement | null) ?? root.closest('section')!;
    // the ball scales with the screen: a tennis ball, not a boulder, on a phone
    const ballSize = Math.round(Math.max(80, Math.min(150, section.clientWidth * 0.11)));
    ballEl.style.width = ballEl.style.height = `${ballSize}px`;
    let raf = 0, idle = 0, alive = true;
    const engine = Engine.create({ enableSleeping: true, gravity: { x: 0, y: 1.15 } });
    const letters: { el: HTMLElement; body: Matter.Body; hx: number; hy: number }[] = [];

    const build = () => {
      Composite.clear(engine.world, false);
      letters.length = 0;
      const S = section.getBoundingClientRect();
      root.querySelectorAll<HTMLElement>('[data-ch]').forEach((el) => {
        el.style.transform = '';
        const r = el.getBoundingClientRect();
        if (!r.width) return;
        const x = r.left - S.left + r.width / 2, y = r.top - S.top + r.height * 0.56;
        const body = Bodies.rectangle(x, y, r.width * 0.86, r.height * 0.62, { chamfer: { radius: 6 }, friction: 0.4, restitution: 0.25, density: 0.0016 });
        Sleeping.set(body, true);
        letters.push({ el, body, hx: x, hy: y });
      });
      const floorY = Math.max(...letters.map((l) => l.hy)) + 70;
      const W = S.width, T = 400;
      Composite.add(engine.world, [
        ...letters.map((l) => l.body),
        Bodies.rectangle(W / 2, floorY + T / 2, W * 3, T, { isStatic: true }),
        Bodies.rectangle(-T / 2, 0, T, S.height * 4, { isStatic: true }),
        Bodies.rectangle(W + T / 2, 0, T, S.height * 4, { isStatic: true }),
        ball,
      ]);
    };

    // the ball arrives on its own: dropped in from the top right, straight onto the headline
    const ball = Bodies.circle(0, 0, ballSize / 2, { restitution: 0.78, friction: 0.02, frictionAir: 0.004, density: 0.004 });
    const drop = () => {
      const S = section.getBoundingClientRect();
      Body.setPosition(ball, { x: S.width * 0.92, y: -ballSize * 2 });
      Body.setVelocity(ball, { x: -5.5, y: 2 });
      Body.setAngularVelocity(ball, -0.15);
      Sleeping.set(ball, false);
    };
    build();
    // let people read the line before the ball lands on it
    Body.setPosition(ball, { x: -9999, y: -9999 });
    Body.setStatic(ball, true);
    const firstDrop = window.setTimeout(() => {
      Body.setStatic(ball, false);
      drop();
    }, 1800);

    Events.on(engine, 'collisionStart', (e) => {
      if (e.pairs.some((p) => p.bodyA === ball || p.bodyB === ball)) {
        idle = performance.now();
        setMessy(true);
      }
    });

    // pick up and throw
    let drag: { id: number; px: number; py: number; vx: number; vy: number; t: number } | null = null;
    const down = (e: PointerEvent) => {
      ballEl.setPointerCapture(e.pointerId);
      drag = { id: e.pointerId, px: e.clientX, py: e.clientY, vx: 0, vy: 0, t: performance.now() };
      Body.setStatic(ball, true);
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const now = performance.now(), dt = Math.max(8, now - drag.t);
      const dx = e.clientX - drag.px, dy = e.clientY - drag.py;
      drag.vx = drag.vx * 0.4 + (dx / dt) * 16 * 0.6;
      drag.vy = drag.vy * 0.4 + (dy / dt) * 16 * 0.6;
      Body.setPosition(ball, { x: ball.position.x + dx, y: ball.position.y + dy });
      drag.px = e.clientX;
      drag.py = e.clientY;
      drag.t = now;
    };
    const up = () => {
      if (!drag) return;
      const { vx, vy } = drag;
      drag = null;
      Body.setStatic(ball, false);
      Sleeping.set(ball, false);
      // a tap with no throw is a bounce
      const tap = Math.hypot(vx, vy) < 1.5;
      Body.setVelocity(ball, tap ? { x: (Math.random() - 0.5) * 6, y: -18 } : { x: Math.max(-40, Math.min(40, vx)), y: Math.max(-40, Math.min(40, vy)) });
      idle = performance.now();
    };
    ballEl.addEventListener('pointerdown', down);
    ballEl.addEventListener('pointermove', move);
    ballEl.addEventListener('pointerup', up);
    ballEl.addEventListener('pointercancel', up);

    // letters fetched back home, one after another
    let tidying = false;
    const tidy = () => {
      if (tidying) return;
      tidying = true;
      const from = letters.map((l) => ({ x: l.body.position.x, y: l.body.position.y, a: l.body.angle }));
      letters.forEach((l) => Body.setStatic(l.body, true));
      const t0 = performance.now();
      const step = () => {
        let doneAll = true;
        letters.forEach((l, i) => {
          const k = Math.min(1, Math.max(0, (performance.now() - t0 - i * 35) / 700));
          const e = 1 - Math.pow(1 - k, 3);
          if (k < 1) doneAll = false;
          Body.setPosition(l.body, { x: from[i]!.x + (l.hx - from[i]!.x) * e, y: from[i]!.y + (l.hy - from[i]!.y) * e });
          Body.setAngle(l.body, from[i]!.a * (1 - e));
        });
        if (!doneAll && alive) return requestAnimationFrame(step);
        letters.forEach((l) => {
          Body.setStatic(l.body, false);
          Body.setVelocity(l.body, { x: 0, y: 0 });
          Body.setAngularVelocity(l.body, 0);
          Sleeping.set(l.body, true);
        });
        tidying = false;
        setMessy(false);
      };
      requestAnimationFrame(step);
    };
    api.current = { tidy };

    let last = performance.now();
    const tick = (now: number) => {
      Engine.update(engine, Math.min(32, now - last));
      last = now;
      for (const l of letters) {
        const { x, y } = l.body.position;
        l.el.style.transform = `translate(${x - l.hx}px, ${y - l.hy}px) rotate(${l.body.angle}rad)`;
      }
      ballEl.style.transform = `translate(${ball.position.x - ballSize / 2}px, ${ball.position.y - ballSize / 2}px)`;
      ballEl.style.setProperty('--r', `${ball.angle}rad`);
      // off the bottom or the sides somehow: bring the ball back
      const S = section.clientHeight;
      if (ball.position.y > S + 400 || ball.position.x < -400 || ball.position.x > section.clientWidth + 400) drop();
      // untouched for a while: fetch the letters back
      if (idle && now - idle > 6500 && !drag) {
        idle = 0;
        tidy();
      }
      raf = requestAnimationFrame(tick);
    };

    // only run while on screen
    const io = new IntersectionObserver(([en]) => {
      cancelAnimationFrame(raf);
      if (en?.isIntersecting) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(section);

    let rt = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(rt);
      rt = window.setTimeout(() => {
        build();
        drop();
      }, 150);
    });
    document.fonts?.ready.then(() => alive && (build(), ro.observe(section)));

    return () => {
      alive = false;
      clearTimeout(firstDrop);
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      clearTimeout(rt);
      ballEl.removeEventListener('pointerdown', down);
      ballEl.removeEventListener('pointermove', move);
      ballEl.removeEventListener('pointerup', up);
      ballEl.removeEventListener('pointercancel', up);
      Engine.clear(engine);
    };
  }, [still]);

  return (
    <div ref={stage}>
      <h1 className="text-[clamp(3.6rem,13vw,13.5rem)] leading-[0.86] select-none">
        <span className="sr-only">Good content. Fetched.</span>
        {LINES.map(([line, cls]) => (
          <span key={line} aria-hidden className={`block ${cls}`}>
            {line.split(' ').map((word, wi) => (
              <span key={wi} className="inline-block whitespace-nowrap">
                {Array.from(word).map((c, ci) => (
                  <span key={ci} data-ch className="inline-block will-change-transform">
                    {c}
                  </span>
                ))}
                {wi < line.split(' ').length - 1 && <span className="inline-block w-[0.22em]" />}
              </span>
            ))}
          </span>
        ))}
      </h1>
      {!still && (
        <div ref={ballRef} data-cursor="Throw" className="pointer-events-auto absolute top-0 left-0 z-20 size-[150px] cursor-grab touch-none select-none active:cursor-grabbing" style={{ transform: 'translate(-400px,-400px)' }} aria-hidden>
          <Ball />
        </div>
      )}
      {messy && (
        <button type="button" onClick={() => api.current?.tidy()} className="pointer-events-auto absolute top-28 right-5 z-20 rounded-full border border-line bg-bg/70 px-4 py-2 font-mono text-[12px] text-muted backdrop-blur transition-colors hover:text-fg md:right-8">
          Fetch the letters back
        </button>
      )}
    </div>
  );
}
