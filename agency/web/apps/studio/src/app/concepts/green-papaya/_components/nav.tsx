'use client';
import { isOpenAt, Magnetic, useLondonTime } from '@sc/ui';
import { HOURS } from './hours';

export function Nav() {
  const now = useLondonTime();
  const open = now ? isOpenAt(HOURS, now.day, now.mins) : null;
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-8" aria-label="Main">
        <a href="#top" className="flex items-center gap-2.5 rounded-full bg-bg py-1.5 pr-4 pl-1.5 font-display text-[20px] font-extrabold tracking-[-0.03em]" style={{ fontStretch: '80%' }}>
          <Mark className="size-7" />
          green papaya
        </a>
        <div className="hidden items-center gap-1 rounded-full bg-bg p-1 text-[14px] md:flex">
          {[['#kitchens', 'Kitchens'], ['#menu', 'Menu'], ['#visit', 'Visit']].map(([h, l]) => (
            <a key={h} href={h} className="rounded-full px-4 py-2 transition-colors hover:bg-fg hover:text-bg">{l}</a>
          ))}
          {open !== null && (
            <span className="flex items-center gap-2 px-4 text-[13px]">
              <span className={`size-2 rounded-full ${open ? 'bg-[#1DB954]' : 'bg-fg/30'}`} />
              {open ? 'Open now' : 'Closed now'}
            </span>
          )}
        </div>
        <Magnetic>
          <a href="tel:+442089855486" className="rounded-full bg-fg px-5 py-2.5 text-[14px] font-medium text-bg ring-2 ring-bg">Book a table</a>
        </Magnetic>
      </nav>
    </header>
  );
}

/** Papaya half: flesh, and the seed cluster that doubles as a table of friends. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <ellipse cx="16" cy="16" rx="13" ry="15" fill="#FF6A2B" />
      <ellipse cx="16" cy="17" rx="5.5" ry="7.5" fill="#FFF4EA" />
      {[[14, 13], [18, 14], [15, 17.5], [18.5, 18.5], [15.5, 21.5]].map(([x, y]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx="1.5" ry="1.9" fill="#1A120D" />
      ))}
    </svg>
  );
}
