'use client';
import { useReducedMotion } from '@sc/ui';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

type Pt = [number, number];
type Piece = { id: number; poly: Pt[]; dx: number; dy: number; rot: number; next?: [number, number, number] };

const cross = (a: Pt, b: Pt, p: Pt) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
const centroid = (poly: Pt[]): Pt => [poly.reduce((s, p) => s + p[0], 0) / poly.length, poly.reduce((s, p) => s + p[1], 0) / poly.length];

/** Split a convex polygon by the infinite line through a and b. */
function split(poly: Pt[], a: Pt, b: Pt): [Pt[], Pt[]] | null {
  const L: Pt[] = [], R: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i]!, q = poly[(i + 1) % poly.length]!;
    const sp = cross(a, b, p), sq = cross(a, b, q);
    if (sp >= 0) L.push(p);
    if (sp <= 0) R.push(p);
    if ((sp > 0 && sq < 0) || (sp < 0 && sq > 0)) {
      const t = sp / (sp - sq);
      const m: Pt = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
      L.push(m);
      R.push(m);
    }
  }
  return L.length > 2 && R.length > 2 ? [L, R] : null;
}

/** Undo a piece's move so the cut line lands in the piece's own (uncut) coordinates. */
function toLocal(p: Pt, pc: Piece): Pt {
  const c = centroid(pc.poly);
  const x = p[0] - pc.dx - c[0], y = p[1] - pc.dy - c[1];
  const r = (-pc.rot * Math.PI) / 180;
  return [x * Math.cos(r) - y * Math.sin(r) + c[0], x * Math.sin(r) + y * Math.cos(r) + c[1]];
}

/**
 * The salon's sliced headline, for real: drag across it and it's cut along your line, the pieces easing apart.
 * Leave it a few seconds and it grows back. The page opens with the brand's own diagonal cut.
 */
export function CutHeadline({ children, className }: { children: ReactNode; className: string }) {
  const box = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const [pieces, setPieces] = useState<Piece[] | null>(null);
  const [drag, setDrag] = useState<{ a: Pt; b: Pt } | null>(null);
  const [flash, setFlash] = useState<{ a: Pt; b: Pt; k: number } | null>(null);
  const [healed, setHealed] = useState(true);
  const nextId = useRef(1);
  const idle = useRef(0);

  const cut = useCallback((a: Pt, b: Pt) => {
    const el = box.current;
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 40) return;
    // normal to the cut, so the two sides can drift apart
    const n: Pt = [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
    setPieces((prev) => {
      const list = prev ?? [{ id: 0, poly: [[0, 0], [W, 0], [W, H], [0, H]], dx: 0, dy: 0, rot: 0 }];
      if (list.length > 18) return list;
      const out: Piece[] = [];
      for (const pc of list) {
        const halves = split(pc.poly, toLocal(a, pc), toLocal(b, pc));
        if (!halves) {
          out.push(pc);
          continue;
        }
        halves.forEach((poly, side) => {
          const s = side === 0 ? 1 : -1;
          // born where the parent was, then eased apart on the next frame
          out.push({ id: nextId.current++, poly, dx: pc.dx, dy: pc.dy, rot: pc.rot, next: [pc.dx + n[0] * 9 * s + ((b[0] - a[0]) / len) * 6 * s, pc.dy + n[1] * 9 * s, pc.rot + s * 0.9] });
        });
      }
      return out;
    });
    requestAnimationFrame(() => requestAnimationFrame(() => setPieces((p) => p && p.map((pc) => (pc.next ? { ...pc, dx: pc.next[0], dy: pc.next[1], rot: pc.next[2], next: undefined } : pc)))));
    setHealed(false);
    setFlash({ a, b, k: Date.now() });
    idle.current = Date.now();
  }, []);

  // the opening cut: the brand's diagonal, from 64% down the left to 36% down the right
  useEffect(() => {
    if (still) return;
    const t = window.setTimeout(() => {
      const el = box.current;
      if (!el) return;
      const W = el.clientWidth, H = el.clientHeight;
      cut([-10, H * 0.64], [W + 10, H * 0.36]);
    }, 700);
    return () => clearTimeout(t);
  }, [still, cut]);

  // it grows back: pieces ease home, then join up again
  useEffect(() => {
    if (!pieces || healed) return;
    const t = window.setInterval(() => {
      if (Date.now() - idle.current < 5200) return;
      setPieces((p) => p && p.map((pc) => ({ ...pc, dx: 0, dy: 0, rot: 0 })));
      window.setTimeout(() => {
        setPieces(null);
        setHealed(true);
      }, 1300);
      clearInterval(t);
    }, 400);
    return () => clearInterval(t);
  }, [pieces, healed]);

  const local = (e: React.PointerEvent): Pt => {
    const r = box.current!.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };

  return (
    <div
      ref={box}
      className="relative touch-pan-y select-none"
      data-cursor="Snip"
      onPointerDown={(e) => {
        if (still) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        const p = local(e);
        setDrag({ a: p, b: p });
      }}
      onPointerMove={(e) => drag && setDrag({ a: drag.a, b: local(e) })}
      onPointerUp={() => {
        if (drag) cut(drag.a, drag.b);
        setDrag(null);
      }}
      onPointerCancel={() => setDrag(null)}
    >
      {/* the real headline stays in place for screen readers and search, hidden once it's in pieces */}
      <h1 className={className} style={{ opacity: pieces ? 0 : 1 }}>
        {children}
      </h1>
      {pieces?.map((pc) => {
        const c = centroid(pc.poly);
        return (
          <div
            key={pc.id}
            aria-hidden
            className={`absolute inset-0 ${className}`}
            style={{
              clipPath: `polygon(${pc.poly.map(([x, y]) => `${x}px ${y}px`).join(',')})`,
              transform: `translate(${pc.dx}px, ${pc.dy}px) rotate(${pc.rot}deg)`,
              transformOrigin: `${c[0]}px ${c[1]}px`,
              transition: 'transform 1.1s cubic-bezier(.16,1,.3,1)',
            }}
          >
            {children}
          </div>
        );
      })}
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full overflow-visible">
        {drag && <line x1={drag.a[0]} y1={drag.a[1]} x2={drag.b[0]} y2={drag.b[1]} stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="6 6" />}
        {flash && (
          <line key={flash.k} x1={flash.a[0] - (flash.b[0] - flash.a[0]) * 2} y1={flash.a[1] - (flash.b[1] - flash.a[1]) * 2} x2={flash.b[0] + (flash.b[0] - flash.a[0]) * 2} y2={flash.b[1] + (flash.b[1] - flash.a[1]) * 2} stroke="var(--accent)" strokeWidth="2" className="animate-[snip_1.2s_ease-out_forwards]" />
        )}
      </svg>
      <p aria-live="polite" className="pointer-events-none absolute -bottom-9 left-0 text-[13px] text-muted">
        {pieces ? (healed ? '' : 'Snip. Don’t worry, it grows back.') : still ? '' : 'Drag across the headline to give it a trim.'}
      </p>
    </div>
  );
}
