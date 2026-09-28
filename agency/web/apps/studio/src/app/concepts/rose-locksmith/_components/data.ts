export const PHONE = { shop: ['020 7739 6724', '+442077396724'], emergency: ['07944 199472', '07944199472'] } as const;
// Mon–Fri 9–6, Sat 10–5 (minutes from midnight). 0 = Sunday.
export const HOURS: Record<number, [number, number][]> = { 1: [[540, 1080]], 2: [[540, 1080]], 3: [[540, 1080]], 4: [[540, 1080]], 5: [[540, 1080]], 6: [[600, 1020]] };
export const HOURS_TEXT: [number, string, string][] = [
  [1, 'Monday', '9am – 6pm'], [2, 'Tuesday', '9am – 6pm'], [3, 'Wednesday', '9am – 6pm'], [4, 'Thursday', '9am – 6pm'],
  [5, 'Friday', '9am – 6pm'], [6, 'Saturday', '10am – 5pm'], [0, 'Sunday', 'Closed'],
];
/** Key-cut depths (1–6) from any text, so a name becomes a repeatable bitting code. */
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
