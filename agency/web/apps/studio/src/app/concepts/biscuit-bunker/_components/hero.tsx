'use client';
import { Magnetic, Reveal, RollText, Scramble } from '@sc/ui';
import { Timecode } from './timecode';
import { HeroBall } from './hero-ball';

export function Hero() {
  return (
    <section id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <HeroBall />
      {/* soft chartreuse bloom behind the ball */}
      <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-5 top-24 flex justify-between text-muted md:inset-x-8 md:top-28">
        <Timecode />
        <span className="hidden font-mono text-[12px] md:inline">4K · 25P · EC2A</span>
      </div>
      {/* viewfinder corners */}
      <div aria-hidden className="pointer-events-none absolute inset-5 top-20 hidden md:block">
        {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((c) => (
          <span key={c} className={`absolute size-6 border-fg/30 ${c}`} />
        ))}
      </div>
      <div className="pointer-events-none relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-8 md:px-8 md:pb-10">
        <Reveal as="h1" by="chars" immediate delay={0.2} className="font-display text-[clamp(3.6rem,13vw,13.5rem)] leading-[0.82] font-semibold tracking-[-0.065em]">
          Good content.
        </Reveal>
        <Reveal as="p" by="chars" immediate delay={0.55} className="-mt-[0.05em] font-serif text-[clamp(3.6rem,13vw,13.5rem)] leading-[0.9] tracking-[-0.03em] text-accent italic">
          Fetched.
        </Reveal>
        <div className="pointer-events-auto mt-8 grid gap-6 border-t border-line pt-6 md:grid-cols-12">
          <p className="max-w-sm text-[15px] leading-snug text-muted md:col-span-5">
            A full-service video production company in a converted dog biscuit factory in Shoreditch. Making things people choose to watch since 2014.
          </p>
          <div className="flex items-center gap-4 md:col-span-7 md:justify-end">
            <Magnetic>
              <a href="https://vimeo.com/biscuitbunker" rel="noopener" data-cursor="Play" className="group flex items-center gap-3 rounded-full bg-accent py-2 pr-6 pl-2 text-[15px] font-medium text-accent-ink">
                <span className="grid size-10 place-items-center rounded-full bg-black text-accent transition-transform duration-500 ease-expo group-hover:scale-110 group-hover:rotate-[120deg]">
                  <svg viewBox="0 0 12 12" className="ml-0.5 size-3 fill-current" aria-hidden><path d="M2 1l9 5-9 5z" /></svg>
                </span>
                <RollText>Watch the showreel</RollText>
              </a>
            </Magnetic>
            <span className="hidden font-mono text-[12px] text-muted md:inline"><Scramble>Click the ball</Scramble></span>
          </div>
        </div>
      </div>
    </section>
  );
}
