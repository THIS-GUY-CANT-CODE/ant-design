export const PHONE = { shop: ['020 7739 6724', '+442077396724'], emergency: ['07944 199472', '07944199472'] } as const;
// Mon to Fri 9 to 6, Sat 10 to 5 (minutes from midnight). 0 = Sunday.
export const HOURS: Record<number, [number, number][]> = { 1: [[540, 1080]], 2: [[540, 1080]], 3: [[540, 1080]], 4: [[540, 1080]], 5: [[540, 1080]], 6: [[600, 1020]] };
export const HOURS_TEXT: [number, string, string][] = [
  [1, 'Monday', '9am to 6pm'], [2, 'Tuesday', '9am to 6pm'], [3, 'Wednesday', '9am to 6pm'], [4, 'Thursday', '9am to 6pm'],
  [5, 'Friday', '9am to 6pm'], [6, 'Saturday', '10am to 5pm'], [0, 'Sunday', 'Closed'],
];
/** Key-cut depths (1 to 6) from any text, so a name becomes a repeatable bitting code. */
export function bitting(text: string, n = 6) {
  const s = (text.toUpperCase().replace(/[^A-Z0-9]/g, '') || 'ROSE').split('');
  return Array.from({ length: n }, (_, i) => 1 + ((s[i % s.length]!.charCodeAt(0) * 7 + i * 3) % 6));
}
/** SVG path for a key blade outline with the given cut depths, drawn left to right. */
export function bladePath(cuts: number[], x0 = 150, x1 = 860, top = 60, depth = 9) {
  const w = (x1 - 40 - x0) / cuts.length;
  let d = `M${x0 - 30} ${top} L${x0} ${top}`;
  cuts.forEach((c, i) => {
    const x = x0 + i * w;
    d += ` L${x + w * 0.22} ${top} L${x + w * 0.44} ${top + c * depth} L${x + w * 0.56} ${top + c * depth} L${x + w * 0.78} ${top}`;
  });
  return d + ` L${x1 - 40} ${top} L${x1} ${top + 40} L${x1 - 40} ${top + 90} L${x0 - 30} ${top + 90}`;
}

export const BASE = '/concepts/rose-locksmith';
export const ADDRESS = '149 Bethnal Green Road, London E2 7DG';
export const POSTCODE = 'E2 7DG';
/** Approximate; refined from the postcode at runtime. */
export const APPROX = { lat: 51.5266, lng: -0.0684 };
/** Areas the shop names for emergency call-outs. */
export const CALLOUT_DISTRICTS = ['Tower Hamlets', 'Hackney'];

export const PAGES = [
  { href: `${BASE}/keys`, label: 'Keys & remotes', sub: 'Cut while you wait' },
  { href: `${BASE}/emergency`, label: 'Locks & emergency', sub: 'Lockouts, uPVC doors' },
  { href: `${BASE}/paint`, label: 'Paint & DIY', sub: 'Dulux mixed in store' },
  { href: `${BASE}/visit`, label: 'Visit', sub: 'Hours, map, trains' },
] as const;

/** What the shop sells, from its own listing. Used by "Do you stock…?" */
export const STOCK: { name: string; words: string[] }[] = [
  { name: 'Key cutting', words: ['key', 'keys', 'copy', 'spare', 'yale', 'mortice', 'cut'] },
  { name: 'Garage & parking remotes (433MHz)', words: ['remote', 'fob', 'garage', 'gate', 'parking', 'clicker', '433'] },
  { name: 'Locks & security', words: ['lock', 'padlock', 'latch', 'deadlock', 'cylinder', 'upvc', 'door'] },
  { name: 'Dulux paint, mixed to any colour', words: ['paint', 'dulux', 'emulsion', 'gloss', 'colour', 'color', 'primer', 'tester'] },
  { name: 'Hardware & ironmongery', words: ['screw', 'nail', 'hinge', 'handle', 'bolt', 'bracket', 'hook', 'fixing', 'plug', 'ironmongery', 'hardware'] },
  { name: 'Tools', words: ['tool', 'drill', 'hammer', 'saw', 'screwdriver', 'spanner', 'tape', 'level', 'brush', 'roller'] },
  { name: 'Heaters', words: ['heater', 'heating', 'radiator', 'fan heater', 'oil'] },
  { name: 'Cleaning products', words: ['clean', 'cleaning', 'bleach', 'mop', 'bucket', 'sponge', 'detergent'] },
  { name: 'Wood & timber', words: ['wood', 'timber', 'plank', 'batten', 'board', 'mdf', 'ply', 'plywood'] },
];

export const MAP_THEME = { land: '#F2F1EC', water: '#D3DAE0', park: '#E2E5D8', building: '#E7E4DC', road: '#FFFFFF', roadMajor: '#D8D4CC', label: '#6E6D68', halo: '#F2F1EC', pin: '#FF3D7F', pinInk: '#0F0F0F' };
