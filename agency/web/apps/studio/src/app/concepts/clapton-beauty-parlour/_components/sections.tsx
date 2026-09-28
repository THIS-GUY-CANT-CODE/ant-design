'use client';
import { FadeIn, gsap, isOpenAt, Magnetic, Reveal, useGSAP, useLondonTime } from '@sc/ui';
import { useRef } from 'react';
import { FRESHA } from './hero';

export function Mark({ className }: { className?: string }) {
  // a circle, cut on the diagonal, the lower half slid across
  return (
    <svg viewBox="0 0 36 32" className={className} aria-hidden>
      <path d="M3 21.2 28.9 7.5A14 14 0 0 0 3 21.2Z" fill="currentColor" />
      <path d="M8.2 24.3 34.1 10.6A14 14 0 0 1 8.2 24.3Z" fill="var(--accent)" />
    </svg>
  );
}

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-8" aria-label="Main">
        <a href="#top" className="flex items-center gap-2 rounded-full bg-bg/80 py-2 pr-4 pl-3 font-display text-[21px] tracking-[-0.02em] backdrop-blur-md">
          <Mark className="h-6 w-7" /> Clapton Beauty Parlour
        </a>
        <div className="hidden items-center gap-1 rounded-full bg-bg/80 p-1 text-[14px] backdrop-blur-md md:flex">
          {[['#services', 'Services'], ['#story', 'Our story'], ['#decades', 'Decades'], ['#visit', 'Visit']].map(([h, l]) => (
            <a key={h} href={h} className="rounded-full px-4 py-2 hover:bg-fg hover:text-bg">{l}</a>
          ))}
        </div>
        <a href={FRESHA} rel="noopener" className="rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-accent-ink">Book</a>
      </nav>
    </header>
  );
}

const MENU: [string, string, string[]][] = [
  ['I', 'Hair', ['Cut & finish', 'Colour', 'Hair extensions', "Men's grooming", 'Wedding hair']],
  ['II', 'Beauty', ['Facials', 'Manicure', 'Pedicure', 'Beauty therapy']],
  ['III', 'Body', ['Advanced electrolysis', 'Spray tanning', 'Sunbeds (18+)']],
];

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-[1600px] px-5 py-32 md:px-8">
      <Reveal as="h2" className="mb-16 max-w-[14ch] font-display text-[clamp(3rem,7vw,7rem)] leading-[0.9] tracking-[-0.035em]">
        Hair, beauty and <em className="text-accent">a little glamour.</em>
      </Reveal>
      <div className="grid gap-3 md:grid-cols-3">
        {MENU.map(([n, t, items], i) => (
          <FadeIn key={t} delay={i * 0.1} className="rounded-[1.75rem] bg-card p-7 md:p-9">
            <div className="flex items-baseline justify-between border-b border-line pb-6">
              <h3 className="font-display text-[48px] leading-none">{t}</h3>
              <span className="font-display text-[28px] text-accent">{n}</span>
            </div>
            <ul className="mt-2">
              {items.map((it) => (
                <li key={it} className="group flex items-baseline gap-3 border-b border-line py-4 text-[17px] last:border-0">
                  <span className="transition-colors group-hover:text-accent">{it}</span>
                  <span aria-hidden className="flex-1 translate-y-[-4px] border-b border-dotted border-fg/25" />
                  <span className="text-muted">£—</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        ))}
      </div>
      <p className="mt-6 text-[14px] text-muted">Concept preview: prices to come from the salon&apos;s price list.</p>
    </section>
  );
}

export function Story() {
  return (
    <section id="story" className="bg-alt text-bg">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-32 md:grid-cols-12 md:px-8 md:py-44">
        <div className="md:col-span-5">
          <p className="text-[14px] opacity-60">A little salon history</p>
          <p className="mt-6 font-display text-[clamp(7rem,17vw,15rem)] leading-[0.8] tracking-[-0.05em] text-[var(--blush)]">1940s</p>
        </div>
        <div className="md:col-span-7">
          <Reveal as="h2" className="font-display text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.03em]">
            Our most famous former guest.
          </Reveal>
          <FadeIn className="mt-10 max-w-xl space-y-5 text-[18px] leading-relaxed opacity-75">
            <p>Newlyweds Jean and Emanuel Manning opened the Clapton Beauty Parlour in 1930. In the 1940s, a 15-year-old Vidal Sassoon, a relative of the family, needed somewhere to work after bomb damage to his own workplace, and he found it here.</p>
            <p>The Hackney Gazette remembers the Parlour as the &ldquo;in shop&rdquo; for the Beverley Sisters.</p>
          </FadeIn>
          <blockquote className="mt-14 border-l-2 border-accent pl-6">
            <p className="font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.1]">&ldquo;Vidal&apos;s aunt was the cousin of my grandmother.&rdquo;</p>
            <footer className="mt-3 text-[14px] opacity-60">Marcia Linch, daughter of the founders, to the Hackney Gazette</footer>
          </blockquote>
          <p className="mt-16 flex flex-wrap gap-x-8 gap-y-2 text-[14px] opacity-60">
            <span>As featured in</span>
            <span className="font-display text-[20px] opacity-100">Spitalfields Life</span>
            <span className="font-display text-[20px] opacity-100">Hackney Gazette</span>
            <span className="font-display text-[20px] opacity-100">Hackney Post</span>
          </p>
        </div>
      </div>
    </section>
  );
}

const DECADES: [string, string, string, string, string][] = [
  ['1930', 'Doors open', 'Jean and Emanuel Manning open on Lower Clapton Road.', 'var(--card)', 'var(--fg)'],
  ['1940s', 'A famous guest', 'A teenage Vidal Sassoon works from the Parlour after the bombing.', 'var(--blush)', 'var(--fg)'],
  ['Later', 'The "in shop"', 'The Beverley Sisters are among the regulars.', 'var(--alt)', 'var(--bg)'],
  ['Today', 'Still here', 'Hair, beauty and electrolysis on the same road, over ninety years on.', 'var(--accent)', 'var(--accent-ink)'],
];

/** Pinned: vertical scroll drives the decades sideways. Stacks normally on small screens and for reduced motion. */
export function Decades() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const t = track.current!;
        gsap.to(t, {
          x: () => -(t.scrollWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: { trigger: ref.current, pin: true, scrub: 0.6, end: () => '+=' + (t.scrollWidth - window.innerWidth), invalidateOnRefresh: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <section id="decades" ref={ref} className="overflow-hidden py-24 md:flex md:h-screen md:flex-col md:justify-center md:py-0">
      <div className="mx-auto mb-12 w-full max-w-[1600px] px-5 md:px-8">
        <h2 className="font-display text-[clamp(3rem,7vw,7rem)] leading-[0.9] tracking-[-0.035em]">
          Ninety-plus years <em className="text-accent">on one road.</em>
        </h2>
      </div>
      <div ref={track} className="flex flex-col gap-4 px-5 md:w-max md:flex-row md:px-8">
        {DECADES.map(([y, t, d, bg, ink]) => (
          <article key={y} className="flex min-h-[380px] flex-col justify-between rounded-[2rem] p-8 md:h-[56vh] md:w-[min(560px,40vw)] md:p-10" style={{ background: bg, color: ink }}>
            <p className="font-display text-[clamp(5rem,10vw,9rem)] leading-[0.8] tracking-[-0.05em]">{y}</p>
            <div>
              <h3 className="font-display text-[34px]">{t}</h3>
              <p className="mt-2 max-w-sm text-[16px] opacity-75">{d}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const HOURS: Record<number, [number, number][]> = { 2: [[600, 1080]], 3: [[600, 1080]], 4: [[600, 1080]], 5: [[600, 1080]], 6: [[540, 1020]] };
const HOURS_TEXT: [number, string, string][] = [
  [1, 'Monday', 'Closed'], [2, 'Tuesday', '10am – 6pm'], [3, 'Wednesday', '10am – 6pm'], [4, 'Thursday', '10am – 6pm'],
  [5, 'Friday', '10am – 6pm'], [6, 'Saturday', '9am – 5pm'], [0, 'Sunday', 'Closed'],
];

export function Visit() {
  const now = useLondonTime();
  const open = now ? isOpenAt(HOURS, now.day, now.mins) : null;
  return (
    <section id="visit">
      <a href={FRESHA} rel="noopener" className="group block bg-accent text-accent-ink">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-5 py-16 md:px-8 md:py-24">
          <span className="font-display text-[clamp(3.6rem,11vw,11rem)] leading-[0.85] tracking-[-0.045em]">Book online</span>
          <span className="grid size-20 shrink-0 place-items-center rounded-full bg-accent-ink text-[32px] text-accent transition-transform duration-500 ease-expo group-hover:rotate-[-45deg] md:size-32 md:text-[48px]">→</span>
        </div>
      </a>
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-24 md:grid-cols-12 md:px-8">
        <div className="md:col-span-6">
          <p className="flex items-center gap-2 text-[14px] text-muted">
            {open !== null && <span className={`size-2 rounded-full ${open ? 'bg-[#16A34A]' : 'bg-fg/30'}`} />}
            {open === null ? 'Hours' : open ? 'Open now' : 'Closed right now'}
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.03em]">21 Lower Clapton Road, London E5 0NS</h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <a href="tel:+442089854329" className="block rounded-full bg-fg px-7 py-4 text-bg">Call 020 8985 4329</a>
            </Magnetic>
            <Magnetic>
              <a href="https://www.google.com/maps/search/?api=1&query=Clapton+Beauty+Parlour+21+Lower+Clapton+Road+E5+0NS" rel="noopener" className="block rounded-full border border-fg/20 px-7 py-4">Directions ↗</a>
            </Magnetic>
          </div>
        </div>
        <table className="self-end text-[17px] md:col-span-5 md:col-start-8" aria-label="Opening hours">
          <tbody>
            {HOURS_TEXT.map(([d, name, h]) => (
              <tr key={d} className={`border-b border-line ${now?.day === d ? 'font-semibold text-accent' : ''}`}>
                <td className="py-3">{name}</td>
                <td className="py-3 text-right">{h}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="overflow-hidden border-t border-line">
        <div className="mx-auto max-w-[1600px] px-5 md:px-8">
          <p aria-hidden className="pt-8 font-display text-[17vw] leading-[0.82] tracking-[-0.06em] whitespace-nowrap">
            Since <em className="text-accent">1930</em>
          </p>
          <div className="flex flex-wrap justify-between gap-4 py-8 pb-24 text-[13px] text-muted md:pb-8">
            <span>© {new Date().getFullYear()} Clapton Beauty Parlour · Est. 1930</span>
            <span>Concept by Second Coat</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
