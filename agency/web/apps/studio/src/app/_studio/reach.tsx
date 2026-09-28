'use client';
import { Reveal, Spotlight, Stagger, useLondonTime } from '@sc/ui';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, useSyncExternalStore } from 'react';

const PLACES = ['Manchester', 'Margate', 'Glasgow', 'Bristol', 'Cardiff', 'Belfast', 'Leeds', 'Lisbon', 'Brooklyn', 'Melbourne', 'your high street'];

/** One place name at a time, rolling up out of a mask. */
export function PlaceCycle({ className }: { className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % PLACES.length), 1700);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={`relative inline-grid overflow-hidden align-bottom ${className ?? ''}`}>
      <span className="sr-only">anywhere in the UK and beyond</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={PLACES[i]}
          aria-hidden
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {PLACES[i]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// The visitor's own clock, as "HH:MM|Area/City"; null on the server.
const sub = (cb: () => void) => {
  const t = setInterval(cb, 15_000);
  return () => clearInterval(t);
};
const localSnap = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}|${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
};

function Clocks() {
  const london = useLondonTime();
  const local = useSyncExternalStore(sub, localSnap, () => null);
  if (!london || !local) return <p className="h-7" />;
  const [time, tz] = local.split('|') as [string, string];
  const city = tz.split('/').pop()!.replace(/_/g, ' ');
  const same = time === london.label;
  return (
    <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-muted">
      <span className="flex items-center gap-2">
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative size-2 rounded-full bg-accent" />
        </span>
        Studio time, London <b className="font-mono font-medium text-fg tabular-nums">{london.label}</b>
      </span>
      {!same && (
        <span>
          Your time, {city} <b className="font-mono font-medium text-fg tabular-nums">{time}</b>
        </span>
      )}
    </p>
  );
}

const RINGS = [
  ['Home', 'East London', 'Where we started, and where the six concepts live. Our neighbours get a knock on the door, photos taken in person and a coffee on us.'],
  ['Nationwide', 'Across the UK', 'Margate to Manchester, Cardiff to Glasgow. Same fixed prices, same see-it-first promise. We work over video, shared links and one clear update a week.'],
  ['Worldwide', 'Anywhere', 'If your business has a story and a website that undersells it, we can help. We work across time zones and reply within one working day.'],
] as const;

/** Where we work: rooted in East London, open to everyone. */
export function Reach() {
  return (
    <section id="reach" className="mx-auto max-w-[1600px] px-5 py-32 md:px-8">
      <div className="mb-14 grid gap-8 md:grid-cols-12">
        <Reveal as="h2" className="font-display text-[clamp(2.8rem,6.5vw,6.6rem)] leading-[0.88] font-semibold tracking-[-0.055em] md:col-span-8">
          Made in East London. <span className="font-serif font-normal tracking-[-0.02em] italic">Open to everywhere.</span>
        </Reveal>
        <div className="self-end md:col-span-4">
          <Clocks />
        </div>
      </div>
      <Stagger className="grid gap-3 md:grid-cols-3">
        {RINGS.map(([k, t, d], i) => (
          <Spotlight key={k} className="h-full rounded-[1.75rem] bg-card">
            <div className="flex h-full min-h-80 flex-col justify-between p-7 md:p-8">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-muted">{k}</span>
                {/* rings widen from one dot to a whole circle: home, country, world */}
                <svg viewBox="0 0 48 48" className="size-12 text-accent" aria-hidden>
                  {[6, 13, 20].map((r, j) => (
                    <circle key={r} cx="24" cy="24" r={r} fill={j === 0 && i === 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" opacity={j <= i ? 1 : 0.2} className="origin-center transition-transform duration-700 ease-expo group-hover/spot:scale-110" />
                  ))}
                </svg>
              </div>
              <div>
                <h3 className="font-display text-[clamp(2rem,3vw,2.8rem)] leading-none font-semibold tracking-[-0.04em]">{t}</h3>
                <p className="mt-3 text-[16px] leading-snug text-muted">{d}</p>
              </div>
            </div>
          </Spotlight>
        ))}
      </Stagger>
    </section>
  );
}
