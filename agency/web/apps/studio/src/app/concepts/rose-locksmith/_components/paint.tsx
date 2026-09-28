'use client';
import { Reveal } from '@sc/ui';
import { useState } from 'react';

// Inspiration colours; the shop mixes the exact Dulux shade.
const COLOURS = [
  ['Chalk', '#ECE7DD'], ['Rose', '#E0607E'], ['Olive', '#7C8363'], ['Ink', '#1F2330'], ['Clay', '#C0714F'], ['Sky', '#A9C3D6'], ['Butter', '#F1D98A'], ['Graphite', '#3C3D40'],
] as const;
const light = (hex: string) => {
  const v = parseInt(hex.slice(1), 16);
  return ((v >> 16) & 255) * 0.299 + ((v >> 8) & 255) * 0.587 + (v & 255) * 0.114 > 150;
};

export function Paint() {
  const [i, setI] = useState(1);
  const [name, hex] = COLOURS[i]!;
  const ink = light(hex) ? '#0F0F0F' : '#F2F1EC';
  return (
    <section id="paint" className="transition-colors duration-700 ease-expo" style={{ background: hex, color: ink }}>
      <div className="mx-auto grid min-h-[90vh] max-w-[1600px] content-between gap-12 px-5 py-24 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <Reveal as="h2" className="max-w-[12ch] font-display text-[clamp(2.8rem,6.5vw,6.4rem)] leading-[0.88] font-bold tracking-[-0.05em]">
            Any Dulux colour, mixed here.
          </Reveal>
          <p className="max-w-xs text-[16px] leading-snug opacity-80">Bring a chip, a photo or a colour name and we&apos;ll mix it while you wait. No trip to a retail park.</p>
        </div>
        <div>
          <p className="font-display text-[clamp(5rem,18vw,18rem)] leading-[0.8] font-bold tracking-[-0.06em]" aria-live="polite">{name}</p>
          <div className="mt-10 flex flex-wrap items-center gap-3" role="group" aria-label="Try a colour">
            {COLOURS.map(([n, h], k) => (
              <button key={n} onClick={() => setI(k)} aria-pressed={i === k} aria-label={n} className="size-14 rounded-full transition-transform duration-300 hover:scale-110" style={{ background: h, boxShadow: i === k ? `0 0 0 3px ${hex}, 0 0 0 5px ${ink}` : `inset 0 0 0 1px ${ink}33` }} />
            ))}
            <span className="ml-2 font-mono text-[12px] opacity-70">Inspiration only · we mix the exact shade in store</span>
          </div>
        </div>
      </div>
    </section>
  );
}
