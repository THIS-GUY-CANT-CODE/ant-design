'use client';
import { Reveal, RollText, ShaderCanvas, Stagger, type ShaderPalette } from '@sc/ui';
import Image from 'next/image';
import Link from 'next/link';
import { BASE, SERVICES, VIMEO } from './site';
import type { Video } from './vimeo';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { useState } from 'react';

// Each row is a real film when Vimeo answers; otherwise the five disciplines, each with its own shader.
type Row = { title: string; type: string; filter: string; palette: ShaderPalette; href: string; thumb?: string; meta: string };
const PALETTES: ShaderPalette[] = [
  ['#0A0A0A', '#2A2A26', '#D7FF3F', '#F2F1ED'],
  ['#07080A', '#1B2130', '#8FA2FF', '#F2F1ED'],
  ['#0A0A0A', '#3A1A12', '#FF6B3D', '#FFD7C2'],
  ['#0A0A0A', '#1E1E1C', '#BFBDB5', '#D7FF3F'],
  ['#050505', '#12291F', '#3DDC97', '#E9FFF4'],
  ['#0A0A0A', '#242018', '#E8C98E', '#F2F1ED'],
];
const FILTERS = ['All', 'Commercial', 'Animation', 'Podcast'];
const guess = (t: string) => (/anim|motion|explainer|title/i.test(t) ? 'Animation' : /podcast/i.test(t) ? 'Podcast' : 'Commercial');

export function Work({ videos }: { videos: Video[] | null }) {
  const PROJECTS: Row[] = videos?.length
    ? videos.slice(0, 6).map((v, i) => ({ title: v.title, type: String(new Date(v.date.replace(' ', 'T')).getFullYear()), filter: guess(`${v.title} ${v.tags.join(' ')}`), palette: PALETTES[i % 6]!, href: v.url, thumb: v.thumbnail, meta: `${Math.floor(v.duration / 60)}:${String(v.duration % 60).padStart(2, '0')}` }))
    : SERVICES.map((sv, i) => ({ title: sv.name, type: 'Service', filter: guess(sv.name), palette: PALETTES[i]!, href: `${BASE}/services/${sv.slug}`, meta: sv.line }));
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 22, mass: 0.6 });
  const list = PROJECTS.map((p, i) => ({ ...p, i })).filter((p) => filter === 'All' || p.filter === filter);
  const cur = active !== null ? PROJECTS[active] : undefined;
  void VIMEO;

  return (
    <section id="work" className="mx-auto max-w-[1600px] px-5 pb-40 md:px-8" onPointerMove={(e) => (x.set(e.clientX), y.set(e.clientY))}>
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
        <Reveal as="h2" className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.85] font-semibold tracking-[-0.06em]">
          Selected work
        </Reveal>
        <div className="flex gap-1 rounded-full border border-line p-1" role="group" aria-label="Filter work">
          {FILTERS.map((f) => (
            <button key={f} aria-pressed={filter === f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-2 text-[13px] transition-colors ${filter === f ? 'bg-fg text-bg' : 'text-muted hover:text-fg'}`}>
              <RollText>{f}</RollText>
            </button>
          ))}
        </div>
      </div>
      <Stagger as="ul">
        {list.map((p) => (
          <li key={p.title} className="animate-[pop_.5s_cubic-bezier(.16,1,.3,1)] border-b border-line">
            <a
              href={p.href}
              rel="noopener"
              data-cursor="Play"
              onPointerEnter={() => setActive(p.i)}
              onPointerLeave={() => setActive(null)}
              className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 py-7 md:grid-cols-[5rem_1fr_14rem_10rem] md:py-9"
            >
              <span className="font-mono text-[12px] text-muted">{String(p.i + 1).padStart(2, '0')}</span>
              <span className="font-display text-[clamp(1.8rem,4.6vw,4.4rem)] leading-none font-medium tracking-[-0.05em] transition-[transform,color] duration-700 ease-expo group-hover:translate-x-4 group-hover:text-accent md:group-hover:translate-x-8">
                {p.title}
              </span>
              <span className="hidden truncate text-[14px] text-muted md:block">{p.meta}</span>
              <span className="hidden items-center justify-end gap-3 text-right text-[14px] text-muted transition-colors group-hover:text-fg md:flex">
                {p.type}
                <span aria-hidden className="grid size-8 scale-0 place-items-center rounded-full bg-accent text-[11px] text-accent-ink transition-transform duration-500 ease-expo group-hover:scale-100">▶</span>
              </span>
            </a>
          </li>
        ))}
      </Stagger>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[12px] text-muted">{videos?.length ? 'LATEST FROM OUR VIMEO' : 'VIMEO IS UNREACHABLE RIGHT NOW, SO HERE’S WHAT WE DO'}</p>
        <Link href={`${BASE}/work`} className="rounded-full bg-fg px-6 py-3 text-[14px] font-medium text-bg">All work →</Link>
      </div>

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
              {cur.thumb ? <Image src={cur.thumb} alt="" fill sizes="380px" className="object-cover" /> : <ShaderCanvas palette={cur.palette} className="absolute inset-0 size-full" zoom={1.2} flow={1.6} />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
