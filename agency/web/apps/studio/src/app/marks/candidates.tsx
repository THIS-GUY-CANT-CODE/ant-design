/* Mark exploration. Each candidate is drawn on a 64×64 grid. */

const f = (n: number) => +n.toFixed(2);

/** Rounded n-point star (papaya seed cavity). */
function starPath(cx: number, cy: number, R: number, r: number, n = 5, rot = -90) {
  const pts: [number, number][] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = ((rot + (i * 180) / n) * Math.PI) / 180;
    const rad = i % 2 ? r : R;
    pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
  }
  // smooth: quadratic through each vertex, starting at midpoints
  const mid = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] as [number, number];
  let d = '';
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]!, nx = pts[(i + 1) % pts.length]!;
    const m = mid(p, nx);
    if (i === 0) d += `M${f(mid(pts[pts.length - 1]!, p)[0])} ${f(mid(pts[pts.length - 1]!, p)[1])}`;
    d += ` Q${f(p[0])} ${f(p[1])} ${f(m[0])} ${f(m[1])}`;
  }
  return d + 'Z';
}

/** Rose petals: open arcs of growing radius, each turned on from the last. */
function petals(cx: number, cy: number, n: number, r0: number, dr: number, sweep = 250, turn = 118) {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const r = r0 + i * dr, a0 = ((i * turn - 90) * Math.PI) / 180, a1 = a0 + (sweep * Math.PI) / 180;
    const p = (a: number) => `${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`;
    out.push(`M${p(a0)}A${r} ${r} 0 1 1 ${p(a1)}`);
  }
  return out;
}

// ---------- Second Coat ----------
/** Stroke path for a circular arc (degrees, clockwise in SVG space). */
function arc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => `${f(cx + Math.cos((a * Math.PI) / 180) * r)} ${f(cy + Math.sin((a * Math.PI) / 180) * r)}`;
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 1 : 0;
  return `M${p(a0)}A${r} ${r} 0 ${large} ${sweep} ${p(a1)}`;
}
// An S from two roller passes. Top pass: from upper right, over the top, round to the middle.
const S_TOP = arc(32, 21.5, 11.5, 20, -270 + 360 - 360); // placeholder, replaced below
const S1 = arc(32, 21.5, 11.5, -20, -270);
const S2 = arc(32, 42.5, 11.5, -90, 160);
export const SC = {
  a: () => (
    <svg viewBox="0 0 64 64">
      <defs><mask id="sc-a"><path d={S1} fill="none" stroke="#fff" strokeWidth="10" /></mask></defs>
      <path d={S1} fill="none" stroke="#0C0C0C" strokeWidth="10" />
      <path d={S2} fill="none" stroke="#FF4F1F" strokeWidth="10" />
      <path d={S2} fill="none" stroke="#A92A07" strokeWidth="10" mask="url(#sc-a)" />
    </svg>
  ),
  b: () => (
    <svg viewBox="0 0 64 64">
      <path d={S1} fill="none" stroke="#FF4F1F" strokeWidth="10" opacity=".55" />
      <path d={S2} fill="none" stroke="#FF4F1F" strokeWidth="10" opacity=".85" />
    </svg>
  ),
  c: () => (
    <svg viewBox="0 0 64 64">
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FF4F1F" />
      <defs><mask id="sc-c"><path d={S1} fill="none" stroke="#fff" strokeWidth="9" /></mask></defs>
      <path d={S1} fill="none" stroke="#F3F2EE" strokeWidth="9" />
      <path d={S2} fill="none" stroke="#0C0C0C" strokeWidth="9" />
      <path d={S2} fill="none" stroke="#7A1E05" strokeWidth="9" mask="url(#sc-c)" />
    </svg>
  ),
};
void S_TOP;

// ---------- Biscuit Bunker ----------
// A dog biscuit whose middle is a strip of film
const BONE = 'M13 20a7.5 7.5 0 1 1 7-10.2h24A7.5 7.5 0 1 1 51 20v24a7.5 7.5 0 1 1-7 10.2H20A7.5 7.5 0 1 1 13 44Z';
const BONE_H = 'M14 23.5a8.5 8.5 0 1 1 11.2-8H38.8A8.5 8.5 0 1 1 50 23.5v0A8.5 8.5 0 1 1 38.8 32h0H25.2A8.5 8.5 0 1 1 14 23.5Z';
const boneH = 'M10.5 20.5a7.5 7.5 0 1 1 11-7h21a7.5 7.5 0 1 1 11 7 7.5 7.5 0 1 1-11 7h-21a7.5 7.5 0 1 1-11-7Z';
export const BB = {
  a: () => (
    <svg viewBox="0 0 64 64">
      <path d={boneH} fill="#F2F1ED" transform="translate(0 11.5)" />
      {[24, 30, 36].map((x) => <rect key={x} x={x} y="26.2" width="3.4" height="3" rx=".8" fill="#0A0A0A" />)}
      {[24, 30, 36].map((x) => <rect key={x} x={x} y="34.8" width="3.4" height="3" rx=".8" fill="#0A0A0A" />)}
      <circle cx="47" cy="32" r="2.6" fill="#D7FF3F" />
    </svg>
  ),
  b: () => (
    <svg viewBox="0 0 64 64">
      <path d={boneH} fill="#F2F1ED" transform="translate(0 11.5)" />
      <path d="M28.5 26.5v11l9-5.5Z" fill="#0A0A0A" strokeLinejoin="round" stroke="#0A0A0A" strokeWidth="1.5" />
    </svg>
  ),
  c: () => (
    <svg viewBox="0 0 64 64">
      <path d={boneH} fill="#D7FF3F" transform="translate(0 11.5)" />
      <path d="M28.5 26.5v11l9-5.5Z" fill="#0A0A0A" strokeLinejoin="round" stroke="#0A0A0A" strokeWidth="1.5" />
    </svg>
  ),
};
void BONE; void BONE_H;

// ---------- Green Papaya ----------
export const GP = {
  a: () => (
    <svg viewBox="0 0 64 64">
      <ellipse cx="32" cy="32" rx="27" ry="29" fill="#1F7A4D" />
      <ellipse cx="32" cy="32" rx="24.5" ry="26.5" fill="#FF6A2B" />
      <path d={starPath(32, 33, 15.5, 7.5)} fill="#FFA36B" stroke="#FFA36B" strokeWidth="6" strokeLinejoin="round" />
      <path d={starPath(32, 33, 13, 6)} fill="#1A120D" stroke="#1A120D" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  ),
  b: () => (
    <svg viewBox="0 0 64 64">
      <ellipse cx="32" cy="32" rx="27" ry="29" fill="#1F7A4D" />
      <ellipse cx="32" cy="32" rx="24.5" ry="26.5" fill="#FF6A2B" />
      <path d={starPath(32, 33, 13.5, 6.2)} fill="#1A120D" stroke="#1A120D" strokeWidth="3" strokeLinejoin="round" />
      {[0, 1, 2, 3, 4].map((k) => {
        const a = ((-90 + k * 72) * Math.PI) / 180;
        return <circle key={k} cx={f(32 + Math.cos(a) * 9)} cy={f(33 + Math.sin(a) * 9)} r="1.5" fill="#3B2A20" />;
      })}
    </svg>
  ),
  c: () => (
    <svg viewBox="0 0 64 64">
      <path d="M32 4c15 0 26 12 26 28S47 60 32 60 6 48 6 32 17 4 32 4Z" fill="#FF6A2B" />
      <path d={starPath(32, 33, 13.5, 6.2)} fill="#1A120D" stroke="#1A120D" strokeWidth="3" strokeLinejoin="round" />
      <path d="M32 4c3-2 6-2 8 0" fill="none" stroke="#1F7A4D" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
};

// ---------- Rose Locksmith ----------
const KEYHOLE = 'M32 4a17 17 0 0 1 9 31.4L46 60H18l5-24.6A17 17 0 0 1 32 4Z';
const ROSE = petals(32, 21, 4, 2.4, 3.1, 220, 132);
export const RL = {
  a: () => (
    <svg viewBox="0 0 64 64">
      <path d={KEYHOLE} fill="#FF3D7F" />
      {ROSE.map((d, i) => <path key={i} d={d} fill="none" stroke="#F2F1EC" strokeWidth="2.4" strokeLinecap="round" />)}
      <path d="M32 38.5V56" fill="none" stroke="#F2F1EC" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M32 50c-1-3.6-3.6-5.4-7-5.6 .7 3.4 3.2 5.4 7 5.6ZM32 46.5c1-3.2 3.3-4.8 6.3-5 -.6 3-2.9 4.8-6.3 5Z" fill="#F2F1EC" />
    </svg>
  ),
  b: () => (
    <svg viewBox="0 0 64 64">
      <path d={KEYHOLE} fill="#0F0F0F" />
      {ROSE.map((d, i) => <path key={i} d={d} fill="none" stroke="#FF3D7F" strokeWidth="2.4" strokeLinecap="round" />)}
      <path d="M32 38.5V56" fill="none" stroke="#FF3D7F" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M32 50c-1-3.6-3.6-5.4-7-5.6 .7 3.4 3.2 5.4 7 5.6ZM32 46.5c1-3.2 3.3-4.8 6.3-5 -.6 3-2.9 4.8-6.3 5Z" fill="#FF3D7F" />
    </svg>
  ),
};

// ---------- Walthamstow Osteopaths ----------
const cairn = (top: string, body: string) => (
  <>
    <ellipse cx="32" cy="53" rx="12" ry="5" fill={body} />
    <ellipse cx="33" cy="43.5" rx="9.5" ry="4.4" fill={body} transform="rotate(-4 33 43.5)" />
    <ellipse cx="31.5" cy="35" rx="7.4" ry="3.9" fill={body} transform="rotate(5 31.5 35)" />
    <ellipse cx="32.5" cy="27.5" rx="5.4" ry="3.4" fill={top} />
  </>
);
export const WO = {
  a: () => (
    <svg viewBox="0 0 64 64">
      <path d="M12 60V28a20 20 0 0 1 40 0v32" fill="none" stroke="#2E4A3A" strokeWidth="5" />
      {cairn('#E3B49A', '#2E4A3A')}
    </svg>
  ),
  b: () => (
    <svg viewBox="0 0 64 64">
      <path d="M10 60V28a22 22 0 0 1 44 0v32Z" fill="#2E4A3A" />
      {cairn('#E3B49A', '#EEEAE3')}
    </svg>
  ),
};

// ---------- W J Meade ----------
const TAG = 'M32 16 52 34v21a5 5 0 0 1-5 5H17a5 5 0 0 1-5-5V34Zm0 8a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM26.5 60V49a5.5 5.5 0 0 1 11 0v11Z';
export const WJ = {
  a: () => (
    <svg viewBox="0 0 64 64">
      <g transform="rotate(-9 32 20)">
        <path d="M32 28.5A10 10 0 1 1 41.5 17" fill="none" stroke="#0E0E10" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M34.5 29A10 10 0 0 0 44 17.8" fill="none" stroke="#0E0E10" strokeWidth="2.4" strokeLinecap="round" transform="translate(-3 -1)" />
      </g>
      <path fillRule="evenodd" d={TAG} fill="#2F49FF" transform="rotate(8 32 26)" />
    </svg>
  ),
  b: () => (
    <svg viewBox="0 0 64 64">
      <path fillRule="evenodd" d={TAG} fill="#2F49FF" transform="translate(0 -6) rotate(8 32 26)" />
    </svg>
  ),
};

// ---------- Clapton Beauty Parlour ----------
// A Didone C (heavy left bowl, hairline right, ball terminal), sliced on the diagonal like the hero headline.
function DidoneC({ fill, id }: { fill: string; id: string }) {
  return (
    <>
      <defs>
        <mask id={id}>
          <circle cx="32" cy="32" r="25" fill="#fff" />
          <circle cx="36.5" cy="31" r="19.2" fill="#000" />
          <path d="M40 32 70 6V58Z" fill="#000" />
        </mask>
      </defs>
      <rect width="64" height="64" fill={fill} mask={`url(#${id})`} />
      <circle cx="49.2" cy="16.2" r="5.2" fill={fill} />
      <path d="M50.5 46.5 55 52" stroke={fill} strokeWidth="2.2" strokeLinecap="round" />
    </>
  );
}
export const CB = {
  a: () => (
    <svg viewBox="0 0 64 64">
      <defs>
        <clipPath id="cbx-t"><path d="M0 0H64V22L0 44Z" /></clipPath>
        <clipPath id="cbx-b"><path d="M0 44L64 22V64H0Z" /></clipPath>
      </defs>
      <g clipPath="url(#cbx-t)"><DidoneC fill="#141212" id="cbx-m1" /></g>
      <g clipPath="url(#cbx-b)" transform="translate(3.6 -1.2)"><DidoneC fill="#E0122F" id="cbx-m2" /></g>
    </svg>
  ),
  b: () => (
    <svg viewBox="0 0 64 64">
      <defs>
        <clipPath id="cby-t"><path d="M0 0H64V22L0 44Z" /></clipPath>
        <clipPath id="cby-b"><path d="M0 44L64 22V64H0Z" /></clipPath>
      </defs>
      <g clipPath="url(#cby-t)"><DidoneC fill="#E0122F" id="cby-m1" /></g>
      <g clipPath="url(#cby-b)" transform="translate(3.6 -1.2)"><DidoneC fill="#E0122F" id="cby-m2" /></g>
    </svg>
  ),
};

