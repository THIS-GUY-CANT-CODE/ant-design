'use client';
import { isOpenAt, Magnetic, useLondonTime } from '@sc/ui';
import { HOURS, PHONE } from './data';

export function Mark({ className }: { className?: string }) {
  // a keyhole punched out of a rose disc
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#FF3D7F" />
      <path d="M16 8.5a4.2 4.2 0 0 0-2.3 7.7L12.6 24h6.8l-1.1-7.8A4.2 4.2 0 0 0 16 8.5z" fill="#0F0F0F" />
    </svg>
  );
}

export function Nav() {
  const now = useLondonTime();
  const open = now ? isOpenAt(HOURS, now.day, now.mins) : null;
  return (
    <header className="sticky top-0 z-50">
      <a href={`tel:${PHONE.emergency[1]}`} className="flex items-center justify-center gap-3 bg-accent px-4 py-2.5 text-[14px] font-medium text-accent-ink">
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-fg/60" />
          <span className="relative size-2 rounded-full bg-fg" />
        </span>
        Locked out? Emergency locksmith <span className="font-mono tabular-nums">{PHONE.emergency[0]}</span> →
      </a>
      <nav className="border-b border-line bg-bg/85 backdrop-blur-md" aria-label="Main">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:px-8">
          <a href="#top" className="flex items-center gap-2.5 text-[18px] font-bold tracking-[-0.03em]">
            <Mark className="size-7" /> Rose Locksmith <span className="font-normal text-muted">&amp; DIY</span>
          </a>
          <div className="hidden items-center gap-7 text-[14px] md:flex">
            <a href="#services" className="hover:text-accent">Services</a>
            <a href="#lock" className="hover:text-accent">How locks work</a>
            <a href="#paint" className="hover:text-accent">Paint</a>
            <a href="#visit" className="hover:text-accent">Visit</a>
            {open !== null && (
              <span className="flex items-center gap-2 font-mono text-[12px]">
                <span className={`size-2 rounded-full ${open ? 'bg-[#16A34A]' : 'bg-fg/30'}`} /> {open ? 'OPEN' : 'CLOSED'}
              </span>
            )}
          </div>
          <Magnetic>
            <a href={`tel:${PHONE.shop[1]}`} className="rounded-full bg-fg px-5 py-2.5 font-mono text-[13px] text-bg tabular-nums">{PHONE.shop[0]}</a>
          </Magnetic>
        </div>
      </nav>
    </header>
  );
}
