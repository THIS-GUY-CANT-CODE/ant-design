import { HoverLetters, Marquee } from '@sc/ui';
import Link from 'next/link';
import { Mark } from './nav';
import { ADDRESS, BASE, PAGES, PHONE } from './site';

export function Footer() {
  return (
    <footer className="overflow-hidden bg-alt pb-24 text-bg md:pb-10">
      <Marquee className="border-b border-bg/10 py-5" speed={28}>
        {['Banana leaf tilapia', 'Concubine noodles', 'Bún thịt nem nướng', 'Zha jiang noodles', 'Rou jia mo', 'Green papaya salad', 'Summer rolls', 'Crispy squid'].map((d) => (
          <span key={d} className="flex items-center gap-6 pr-6 font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-bold tracking-[-0.03em]">
            {d}
            <Mark className="size-7" />
          </span>
        ))}
      </Marquee>
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="grid gap-10 border-b border-bg/10 py-14 md:grid-cols-12">
          <div className="flex items-start gap-4 md:col-span-4">
            <Mark className="size-14 shrink-0" />
            <p className="max-w-xs text-[15px] opacity-70">Northern Vietnamese and Xi&apos;an street food, cooked side by side by one family on Mare Street.</p>
          </div>
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="text-[13px] opacity-50">Pages</p>
            <ul className="mt-3 space-y-2 text-[17px]">
              <li><Link href={BASE} className="u-draw">Home</Link></li>
              {PAGES.map((p) => (
                <li key={p.href}><Link href={p.href} className="u-draw">{p.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-2">
            <p className="text-[13px] opacity-50">Hours</p>
            <ul className="mt-3 space-y-1 text-[14px] opacity-80">
              <li>Tue to Fri, 12 to 3pm and 5 to 10:30pm</li>
              <li>Sat, 1 to 10:30pm</li>
              <li>Sun, 1 to 10pm</li>
              <li>Mon, closed</li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="text-[13px] opacity-50">Book &amp; find us</p>
            <a href={`tel:${PHONE[1]}`} className="u-draw mt-3 inline-block text-[22px] font-bold">{PHONE[0]}</a>
            <p className="mt-2 text-[14px] opacity-70">{ADDRESS}</p>
          </div>
        </div>
        <p className="pt-10 font-display text-[21.6vw] leading-[0.76] font-extrabold tracking-[-0.06em] whitespace-nowrap text-accent uppercase" style={{ fontStretch: '75%' }}>
          <HoverLetters className="[--accent:var(--hanoi)]">Green Papaya</HoverLetters>
        </p>
        <div className="mt-8 flex flex-wrap justify-between gap-4 text-[13px] opacity-60">
          <span>© {new Date().getFullYear()} Green Papaya Xi&apos;Viet · {ADDRESS}</span>
          <span>Concept by Second Coat</span>
        </div>
      </div>
    </footer>
  );
}
