import { HoverLetters, Marquee } from '@sc/ui';
import Link from 'next/link';
import { BASE, PAGES, SERVICES, VIMEO } from './site';

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
        <div className="grid gap-10 border-t border-line py-14 md:grid-cols-12">
          <p className="max-w-xs text-[15px] text-muted md:col-span-4">A full-service video production company in a converted dog biscuit factory in Shoreditch. Since 2014.</p>
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="font-mono text-[12px] text-muted">(PAGES)</p>
            <ul className="mt-3 space-y-2 text-[17px]">
              <li><Link href={BASE} className="u-draw">Home</Link></li>
              {PAGES.map((p) => (
                <li key={p.href}><Link href={p.href} className="u-draw">{p.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="font-mono text-[12px] text-muted">(SERVICES)</p>
            <ul className="mt-3 space-y-2 text-[15px]">
              {SERVICES.map((s) => (
                <li key={s.slug}><Link href={`${BASE}/services/${s.slug}`} className="u-draw">{s.name}</Link></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="font-mono text-[12px] text-muted">(ELSEWHERE)</p>
            <ul className="mt-3 space-y-2 text-[15px]">
              <li><a href={VIMEO} rel="noopener" className="u-draw">Vimeo</a></li>
              <li><a href="https://uk.linkedin.com/company/biscuit-bunker" rel="noopener" className="u-draw">LinkedIn</a></li>
              <li><a href="https://www.facebook.com/biscuitbunkeruk/" rel="noopener" className="u-draw">Facebook</a></li>
            </ul>
          </div>
        </div>
        <p className="font-display text-[12.4vw] leading-[0.78] font-semibold tracking-[-0.075em] whitespace-nowrap max-[1600px]:text-[12.1vw]">
          <HoverLetters>biscuit bunker</HoverLetters>
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
