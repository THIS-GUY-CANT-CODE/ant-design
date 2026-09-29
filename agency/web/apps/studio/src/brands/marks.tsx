'use client';
/**
 * The seven marks. Each is drawn on a 64×64 grid and was chosen from three rounds of sketches (see /marks).
 * Every idea comes from something true about the business; the notes say what.
 */
import { useId } from 'react';

type P = { className?: string; title?: string };
const f = (n: number) => +n.toFixed(2);

function Svg({ className, title, children }: P & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {children}
    </svg>
  );
}

/** Stroke path for a circular arc between two angles (degrees). */
function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => `${f(cx + Math.cos((a * Math.PI) / 180) * r)} ${f(cy + Math.sin((a * Math.PI) / 180) * r)}`;
  return `M${p(a0)}A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${p(a1)}`;
}

/** Rounded n-point star. */
function star(cx: number, cy: number, R: number, r: number, n = 5) {
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const a = ((-90 + (i * 180) / n) * Math.PI) / 180;
    const rad = i % 2 ? r : R;
    return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad] as const;
  });
  const mid = (a: readonly number[], b: readonly number[]) => `${f((a[0]! + b[0]!) / 2)} ${f((a[1]! + b[1]!) / 2)}`;
  let d = `M${mid(pts.at(-1)!, pts[0]!)}`;
  pts.forEach((p, i) => (d += ` Q${f(p[0])} ${f(p[1])} ${mid(p, pts[(i + 1) % pts.length]!)}`));
  return d + 'Z';
}

/** Rose petals: open arcs of growing radius, each turned on from the last. */
function petals(cx: number, cy: number, n: number, r0: number, dr: number, sweep: number, turn: number) {
  return Array.from({ length: n }, (_, i) => {
    const r = r0 + i * dr;
    const a0 = ((i * turn - 90) * Math.PI) / 180;
    const a1 = a0 + (sweep * Math.PI) / 180;
    const p = (a: number) => `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`;
    return `M${p(a0)}A${r} ${r} 0 1 1 ${p(a1)}`;
  });
}

/* ------------------------------------------------------------------ */

const S1 = arc(32, 21.5, 11.5, -20, -270);
const S2 = arc(32, 42.5, 11.5, -90, 160);

/**
 * Second Coat: an S made of two roller passes. The first coat is ink; the second is fresh orange,
 * and where the passes overlap the paint doubles up. That overlap is the second coat.
 */
export function SecondCoatMark({ className, title, first = '#0C0C0C', second = '#FF4F1F', overlap = '#A92A07' }: P & { first?: string; second?: string; overlap?: string }) {
  const id = useId();
  return (
    <Svg className={className} title={title}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
          <path d={S1} fill="none" stroke="#fff" strokeWidth="10" />
        </mask>
      </defs>
      <path d={S1} fill="none" stroke={first} strokeWidth="10" />
      <path d={S2} fill="none" stroke={second} strokeWidth="10" />
      <path d={S2} fill="none" stroke={overlap} strokeWidth="10" mask={`url(#${id})`} />
    </Svg>
  );
}

const BONE = 'M10.5 32a7.5 7.5 0 1 1 11-7h21a7.5 7.5 0 1 1 11 7 7.5 7.5 0 1 1-11 7h-21a7.5 7.5 0 1 1-11-7Z';
const PLAY = 'M28.5 26.8v10.4q0 1.6 1.4.8l8.2-4.9q1.3-.9 0-1.7l-8.2-5.1q-1.4-.9-1.4.5Z';

/** Biscuit Bunker: a dog biscuit (the building was a dog biscuit factory) with a play button punched through it. */
export function BiscuitBunkerMark({ className, title, color = '#D7FF3F' }: P & { color?: string }) {
  return (
    <Svg className={className} title={title}>
      <path d={BONE + PLAY} fillRule="evenodd" fill={color} />
    </Svg>
  );
}

const STAR_HALO = star(32, 33, 15.5, 7.5);
const STAR = star(32, 33, 13, 6);

/**
 * Green Papaya: a papaya cut across. Green skin, orange flesh, and the five-pointed star
 * that the seed cavity really makes. A star belongs to both Vietnam and China.
 */
export function GreenPapayaMark({ className, title }: P) {
  return (
    <Svg className={className} title={title}>
      <ellipse cx="32" cy="32" rx="27" ry="29" fill="#1F7A4D" />
      <ellipse cx="32" cy="32" rx="24.5" ry="26.5" fill="#FF6A2B" />
      <path d={STAR_HALO} fill="#FFA36B" stroke="#FFA36B" strokeWidth="6" strokeLinejoin="round" />
      <path d={STAR} fill="#1A120D" stroke="#1A120D" strokeWidth="3" strokeLinejoin="round" />
    </Svg>
  );
}

const KEYHOLE = 'M32 4a17 17 0 0 1 9 31.4L46 60H18l5-24.6A17 17 0 0 1 32 4Z';
const ROSE = petals(32, 21, 4, 2.4, 3.1, 220, 132);
const LEAVES = 'M32 50c-1-3.6-3.6-5.4-7-5.6.7 3.4 3.2 5.4 7 5.6ZM32 46.5c1-3.2 3.3-4.8 6.3-5-.6 3-2.9 4.8-6.3 5Z';

/** Rose Locksmith: a keyhole with a rose in bloom inside it. Keys and a family name since 1938. */
export function RoseMark({ className, title, body = '#FF3D7F', ink = '#F2F1EC' }: P & { body?: string; ink?: string }) {
  return (
    <Svg className={className} title={title}>
      <path d={KEYHOLE} fill={body} />
      {ROSE.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
      ))}
      <path d="M32 38.5V56" fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" />
      <path d={LEAVES} fill={ink} />
    </Svg>
  );
}

/** Walthamstow Osteopaths: stones balanced in the arched doorway of No.72. Balance, alignment, calm. */
export function No72Mark({ className, title, arch = '#2E4A3A', stones = '#EEEAE3', top = '#E3B49A' }: P & { arch?: string; stones?: string; top?: string }) {
  return (
    <Svg className={className} title={title}>
      <path d="M10 60V28a22 22 0 0 1 44 0v32Z" fill={arch} />
      <ellipse cx="32" cy="53" rx="12" ry="5" fill={stones} />
      <ellipse cx="33" cy="43.5" rx="9.5" ry="4.4" fill={stones} transform="rotate(-4 33 43.5)" />
      <ellipse cx="31.5" cy="35" rx="7.4" ry="3.9" fill={stones} transform="rotate(5 31.5 35)" />
      <ellipse cx="32.5" cy="27.5" rx="5.4" ry="3.4" fill={top} />
    </Svg>
  );
}

const TAG = 'M32 10 52 28v21a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5V28Zm0 8a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM26.5 54V43a5.5 5.5 0 0 1 11 0v11Z';

/** W J Meade: a house that is also a key tag, hanging slightly askew, the way every agent's keys do. */
export function MeadeMark({ className, title, color = '#2F49FF' }: P & { color?: string }) {
  return (
    <Svg className={className} title={title}>
      <path fillRule="evenodd" d={TAG} fill={color} transform="rotate(8 32 26)" />
    </Svg>
  );
}

/** Clapton Beauty Parlour: a high-contrast C with a ball terminal, sliced on the diagonal like the site's headline. */
export function ClaptonMark({ className, title, top = '#141212', bottom = '#E0122F' }: P & { top?: string; bottom?: string }) {
  const id = useId();
  const C = (fill: string, m: string) => (
    <>
      <mask id={m} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
        <circle cx="32" cy="32" r="25" fill="#fff" />
        <circle cx="36.5" cy="31" r="19.2" fill="#000" />
        <path d="M40 32 70 6V58Z" fill="#000" />
      </mask>
      <rect width="64" height="64" fill={fill} mask={`url(#${m})`} />
      <circle cx="49.2" cy="16.2" r="5.2" fill={fill} />
    </>
  );
  return (
    <Svg className={className} title={title}>
      <defs>
        <clipPath id={`${id}t`}><path d="M0 0H64V22L0 44Z" /></clipPath>
        <clipPath id={`${id}b`}><path d="M0 44L64 22V64H0Z" /></clipPath>
      </defs>
      <g clipPath={`url(#${id}t)`}>{C(top, `${id}m1`)}</g>
      <g clipPath={`url(#${id}b)`} transform="translate(3.6 -1.2)">{C(bottom, `${id}m2`)}</g>
    </Svg>
  );
}

/** The right mark for a concept, in its default colours. */
export function BrandMark({ slug, className }: { slug: string; className?: string }) {
  switch (slug) {
    case 'biscuit-bunker':
      return <BiscuitBunkerMark className={className} />;
    case 'green-papaya':
      return <GreenPapayaMark className={className} />;
    case 'rose-locksmith':
      return <RoseMark className={className} />;
    case 'walthamstow-osteopaths':
      return <No72Mark className={className} />;
    case 'wj-meade':
      return <MeadeMark className={className} />;
    case 'clapton-beauty-parlour':
      return <ClaptonMark className={className} />;
    default:
      return <SecondCoatMark className={className} />;
  }
}
