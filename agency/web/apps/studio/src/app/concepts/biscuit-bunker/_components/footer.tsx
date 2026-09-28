import { Marquee } from '@sc/ui';

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-line pt-10">
      <Marquee className="py-6 text-muted" speed={30}>
        {['Commercials', 'Branded content', 'Corporate film', 'Animation', 'Motion', 'Podcasts'].map((w) => (
          <span key={w} className="flex items-center gap-8 pr-8 font-display text-[clamp(1.6rem,3vw,2.6rem)] font-medium tracking-[-0.04em]">
            {w}
            <span className="size-3 rounded-full bg-accent" />
          </span>
        ))}
      </Marquee>
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        <p aria-hidden className="font-display text-[12.4vw] leading-[0.78] font-semibold tracking-[-0.075em] whitespace-nowrap max-[1600px]:text-[12.1vw]">
          biscuit bunker
        </p>
        <div className="flex flex-wrap justify-between gap-4 border-t border-line py-6 pb-24 text-[13px] text-muted">
          <span>© {new Date().getFullYear()} Biscuit Bunker · EC2A 4NE</span>
          <span>Good content. Fetched.</span>
          <span>Concept by Second Coat</span>
        </div>
      </div>
    </footer>
  );
}
