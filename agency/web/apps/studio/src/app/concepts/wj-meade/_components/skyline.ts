// A single-stroke East London roofline: terraces with chimneys, a church spire and a tower block.
export function skyline(width = 1600, base = 220) {
  let d = `M0 ${base}`;
  const wins: [number, number][] = [];
  let x = 0, n = 0;
  while (x < width) {
    if (x > 700 && x < 780) {
      d += ` L${x} 140 L${x + 26} 140 L${x + 40} 20 L${x + 54} 140 L${x + 80} 140`;
      x += 80;
      continue;
    }
    if (x > 1180 && x < 1280) {
      d += ` L${x} 40 L${x + 110} 40`;
      for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) wins.push([x + 14 + c * 24, 58 + r * 24]);
      x += 110;
      continue;
    }
    const w = 84, top = 118 + (n++ % 3) * 7;
    d += ` L${x} ${top} L${x + w / 2} ${top - 36} L${x + w} ${top}`;
    d += ` M${x + w - 16} ${top - 14} L${x + w - 16} ${top - 34} L${x + w - 6} ${top - 34} L${x + w - 6} ${top - 5} M${x + w} ${top}`;
    wins.push([x + 16, top + 22], [x + 52, top + 22], [x + 16, top + 62]);
    x += w;
  }
  return { d: d + ` L${width} ${base}`, wins };
}
