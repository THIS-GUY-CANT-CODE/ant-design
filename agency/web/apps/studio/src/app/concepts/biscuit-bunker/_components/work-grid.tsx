'use client';
import { useSearch } from '@sc/ui';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import type { Video } from './vimeo';
import { VIMEO } from './site';

const KEYS = ['title', 'description', 'tags'];
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Real videos from Vimeo: search, filter by tag, play in place. */
export function WorkGrid({ videos }: { videos: Video[] }) {
  const [q, setQ] = useState('');
  const [tag, setTag] = useState('All');
  const [playing, setPlaying] = useState<Video | null>(null);
  const tags = useMemo(() => {
    const count = new Map<string, number>();
    videos.forEach((v) => v.tags.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
    return ['All', ...[...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t)];
  }, [videos]);
  const found = useSearch(videos, KEYS, q);
  const list = found.filter((v) => tag === 'All' || v.tags.includes(tag));
  useEffect(() => {
    if (!playing) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setPlaying(null);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [playing]);
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-6">
        <label htmlFor="work-q" className="sr-only">Search the work</label>
        <input id="work-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the work" className="min-w-0 flex-1 rounded-full border border-line bg-card px-5 py-3.5 text-[16px] outline-none focus:border-accent" />
        {tags.length > 1 && (
          <div className="flex flex-wrap gap-1 rounded-full border border-line p-1" role="group" aria-label="Filter by tag">
            {tags.map((t) => (
              <button key={t} aria-pressed={tag === t} onClick={() => setTag(t)} className={`rounded-full px-4 py-2 text-[13px] capitalize transition-colors ${tag === t ? 'bg-fg text-bg' : 'text-muted hover:text-fg'}`}>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="mt-4 font-mono text-[12px] text-muted" aria-live="polite">{list.length} FILMS</p>
      <ul className="mt-6 grid gap-x-4 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {list.map((v) => (
          <li key={v.id}>
            <button onClick={() => setPlaying(v)} data-cursor="Play" className="group block w-full text-left">
              <span className="relative block aspect-video overflow-hidden rounded-2xl bg-card">
                {v.thumbnail && <Image src={v.thumbnail} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-expo group-hover:scale-105" />}
                <span className="absolute right-3 bottom-3 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[11px] text-white">{mmss(v.duration)}</span>
                <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="grid size-16 place-items-center rounded-full bg-accent text-accent-ink">▶</span>
                </span>
              </span>
              <span className="mt-4 block text-[20px] leading-tight font-medium tracking-[-0.03em] transition-colors group-hover:text-accent">{v.title}</span>
              <span className="mt-1 block font-mono text-[12px] text-muted">{new Date(v.date.replace(' ', 'T')).getFullYear()}</span>
            </button>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="py-16 text-[17px] text-muted">Nothing matches that. Try another word.</p>}
      <AnimatePresence>
        {playing && (
          <motion.div role="dialog" aria-modal="true" aria-label={playing.title} className="fixed inset-0 z-[450] grid place-items-center bg-black/85 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPlaying(null)}>
            <motion.div className="w-full max-w-6xl" initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 26 }} onClick={(e) => e.stopPropagation()}>
              <div className="mb-3 flex items-center justify-between gap-4 text-white">
                <p className="truncate text-[18px] font-medium">{playing.title}</p>
                <button onClick={() => setPlaying(null)} className="rounded-full bg-white/10 px-4 py-2 text-[14px]" autoFocus>
                  Close
                </button>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
                <iframe src={`https://player.vimeo.com/video/${playing.id}?autoplay=1&dnt=1&title=0&byline=0`} title={playing.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 size-full" />
              </div>
              {playing.description && <p className="mt-4 max-w-3xl text-[15px] text-white/70">{playing.description}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="mt-16 text-[14px] text-muted">
        Everything here comes straight from <a href={VIMEO} rel="noopener" className="underline">our Vimeo</a>.
      </p>
    </>
  );
}
