import { HoverLetters, Marquee } from '@sc/ui';
import { Mark } from './nav';

export function Footer() {
  return (
    <footer className="overflow-hidden bg-alt pb-24 text-bg md:pb-10">
      <Marquee className="border-b border-bg/10 py-5" speed={28}>
        {['Banana leaf tilapia', 'Concubine noodles', 'Bún thịt nem nướng', 'Zha jiang noodles', 'Rou jia mo', 'Green papaya salad', 'Summer rolls', 'Crispy squid'].map((d) => (
          <span key={d} className="flex items-center gap-6 pr-6 font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-bold tracking-[-0.03em]">
            {d}
            <Mark className="size-6" />
          </span>
        ))}
      </Marquee>
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <p className="pt-10 font-display text-[21.6vw] leading-[0.76] font-extrabold tracking-[-0.06em] whitespace-nowrap text-accent uppercase" style={{ fontStretch: '75%' }}>
          <HoverLetters className="[--accent:var(--hanoi)]">Green Papaya</HoverLetters>
        </p>
        <div className="mt-8 flex flex-wrap justify-between gap-4 text-[13px] opacity-60">
          <span>© {new Date().getFullYear()} Green Papaya Xi&apos;Viet · 191 Mare Street, E8</span>
          <span>Concept by Second Coat</span>
        </div>
      </div>
    </footer>
  );
}
