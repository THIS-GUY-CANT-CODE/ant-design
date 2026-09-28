'use client';
import { Reveal, ShaderCanvas, type ShaderPalette } from '@sc/ui';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { useState } from 'react';

// Placeholder titles until the live site pulls real projects from their Vimeo.
const PROJECTS: { title: string; type: string; filter: string; palette: ShaderPalette }[] = [
  { title: 'Brand launch film', type: 'Commercial', filter: 'Commercial', palette: ['#0A0A0A', '#2A2A26', '#D7FF3F', '#F2F1ED'] },
  { title: 'Product explainer', type: 'Animation', filter: 'Animation', palette: ['#07080A', '#1B2130', '#8FA2FF', '#F2F1ED'] },
  { title: 'Social series', type: 'Branded content', filter: 'Commercial', palette: ['#0A0A0A', '#3A1A12', '#FF6B3D', '#FFD7C2'] },
  { title: 'Podcast, season one', type: 'Podcast', filter: 'Podcast', palette: ['#0A0A0A', '#1E1E1C', '#BFBDB5', '#D7FF3F'] },
  { title: 'Title sequence', type: 'Motion', filter: 'Animation', palette: ['#050505', '#12291F', '#3DDC97', '#E9FFF4'] },
  { title: 'Internal brand film', type: 'Corporate', filter: 'Commercial', palette: ['#0A0A0A', '#242018', '#E8C98E', '#F2F1ED'] },
];
const FILTERS = ['All', 'Commercial', 'Animation', 'Podcast'];

export function Work() {
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.6 });
  const list = PROJECTS.map((p, i) => ({ ...p, i })).filter((p) => filter === 'All' || p.filter === filter);
  const cur = active !== null ? PROJECTS[active] : undefined;

  return (
    <section id="work" className="mx-auto max-w-[1600px] px-5 pb-40 md:px-8" onPointerMove={(e) => (x.set(e.clientX), y.set(e.clientY))}>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
        <Reveal as="h2" className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.85] font-semibold tracking-[-0.06em]">
          Selected work
        </Reveal>
        <div className="flex gap-1 rounded-full border border-line p-1" role="group" aria-label="Filter work">
          {FILTERS.map((f) => (
            <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-2 text-[13px] transition-colors ${filter === f ? 'bg-fg text-bg' : 'text-muted hover:text-fg'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <ul>
        {list.map((p) => (
          <li key={p.title} className="border-b border-line">
            <a
              href="https://vimeo.com/biscuitbunker"
              rel="noopener"
              data-cursor="Play"
              onPointerEnter={() => setActive(p.i)}
              onPointerLeave={() => setActive(null)}
              className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 py-7 md:grid-cols-[5rem_1fr_14rem_6rem] md:py-9"
            >
              <span className="font-mono text-[12px] text-muted">{String(p.i + 1).padStart(2, '0')}</span>
              <span className="font-display text-[clamp(1.8rem,4.6vw,4.4rem)] leading-none font-medium tracking-[-0.05em] transition-[transform,color] duration-700 ease-expo group-hover:translate-x-4 group-hover:text-accent md:group-hover:translate-x-8">
                {p.title}
              </span>
              <span className="hidden text-[14px] text-muted md:block">[Client name]</span>
              <span className="hidden text-right text-[14px] text-muted md:block">{p.type}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 font-mono text-[12px] text-muted">Placeholder projects. The live site pulls titles and stills from their Vimeo.</p>

      {/* floating preview that follows the pointer (desktop only) */}
      <motion.div aria-hidden className="pointer-events-none fixed top-0 left-0 z-40 hidden md:block" style={{ x, y }}>
        <AnimatePresence>
          {cur && (
            <motion.div
              key="pv"
              initial={{ opacity: 0, scale: 0.7, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7, rotate: 4 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="relative -mt-40 ml-10 aspect-[16/10] w-[380px] overflow-hidden rounded-2xl"
            >
              <ShaderCanvas palette={cur.palette} className="absolute inset-0 size-full" zoom={1.2} flow={1.6} />
              <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur">Still to come</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
