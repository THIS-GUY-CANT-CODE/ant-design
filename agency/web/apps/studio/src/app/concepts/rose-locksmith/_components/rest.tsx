'use client';
import { Counter, HoverLetters, isOpenAt, Magnetic, Reveal, RollText, Spotlight, Stagger, useLondonTime } from '@sc/ui';
import { HOURS, HOURS_TEXT, PHONE } from './data';
import { Mark } from './nav';

export function Story() {
  const steps = [
    ['1938', 'Car and cycle parts', 'The shop opens on Bethnal Green Road, selling parts for cars and bicycles.'],
    ['Then', 'Home improvement', 'As the neighbourhood changed, so did the shelves: hardware, tools, paint and key cutting.'],
    ['Now', 'Your local locksmith', 'Still family-owned, now with remote copying, uPVC repair and an emergency line.'],
  ];
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-32 md:px-8">
      <Reveal as="h2" className="mb-16 max-w-[14ch] font-display text-[clamp(2.8rem,6.5vw,6.4rem)] leading-[0.88] font-bold tracking-[-0.05em]">
        Same family. Same street.
      </Reveal>
      <Stagger as="ol" className="grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line md:grid-cols-3">
        {steps.map(([y, t, d], i) => (
          <li key={y} className="group bg-bg p-8 transition-colors duration-500 hover:bg-card md:p-10">
            <div>
              <p className={`font-display text-[clamp(4rem,8vw,7rem)] leading-none font-bold tracking-[-0.06em] transition-[color,translate] duration-500 ease-expo group-hover:-translate-y-2 group-hover:text-accent ${i === 0 ? 'text-accent' : ''}`}>{y}</p>
              <h3 className="mt-10 text-[22px] font-bold tracking-[-0.03em]">{t}</h3>
              <p className="mt-2 max-w-xs text-[16px] text-muted">{d}</p>
            </div>
          </li>
        ))}
      </Stagger>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-32 md:px-8">
      <div className="grid gap-10 border-t border-line pt-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-[clamp(7rem,18vw,16rem)] leading-[0.8] font-bold tracking-[-0.07em]"><HoverLetters>4.9</HoverLetters></p>
          <p className="mt-4 text-[18px]">
            <span className="text-accent" aria-hidden>{[0, 1, 2, 3, 4].map((k) => <span key={k} className="inline-block animate-[pop_.5s_cubic-bezier(.16,1,.3,1)_both] transition-transform hover:scale-150 hover:rotate-12" style={{ animationDelay: `${k * 90}ms` }}>★</span>)}</span> from <Counter to={684} /> Google reviews
          </p>
        </div>
        <Stagger className="grid gap-3 md:col-span-7">
          {['key cutting', 'remote copy', 'emergency call-out'].map((k) => (
            <Spotlight key={k} className="lift rounded-3xl bg-card">
            <blockquote className="p-7 text-[19px] leading-snug">
              &ldquo;[Paste a real Google review here: {k}]&rdquo;
              <footer className="mt-3 font-mono text-[12px] text-muted">GOOGLE REVIEW</footer>
            </blockquote>
            </Spotlight>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function Visit() {
  const now = useLondonTime();
  const open = now ? isOpenAt(HOURS, now.day, now.mins) : null;
  return (
    <section id="visit" className="mx-auto max-w-[1600px] px-5 pb-32 md:px-8">
      <div className="grid gap-12 rounded-[2rem] bg-card p-8 md:grid-cols-12 md:p-14">
        <div className="md:col-span-7">
          <p className="flex items-center gap-2 font-mono text-[12px]">
            {open !== null && <span className={`size-2 rounded-full ${open ? 'bg-[#16A34A]' : 'bg-fg/30'}`} />}
            {open === null ? 'HOURS' : open ? 'OPEN NOW' : 'CLOSED NOW'}
          </p>
          <Reveal as="h2" className="mt-6 font-display text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.88] font-bold tracking-[-0.05em]">
            149 Bethnal Green Road, London E2 7DG
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <a href={`tel:${PHONE.shop[1]}`} className="block rounded-full bg-fg px-7 py-4 text-bg"><RollText>Call the shop</RollText></a>
            </Magnetic>
            <Magnetic>
              <a href="https://www.google.com/maps/search/?api=1&query=Rose+Locksmith+149+Bethnal+Green+Road+E2+7DG" rel="noopener" className="block rounded-full border border-fg px-7 py-4"><RollText>Directions ↗</RollText></a>
            </Magnetic>
          </div>
        </div>
        <div className="md:col-span-5">
          <table className="w-full text-[16px]" aria-label="Opening hours">
            <tbody>
              {HOURS_TEXT.map(([d, name, h]) => (
                <tr key={d} className={`border-b border-line transition-colors hover:text-accent ${now?.day === d ? 'font-bold' : ''}`}>
                  <td className="py-3">{name}</td>
                  <td className="py-3 text-right">{h}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-5 text-[15px] text-muted">
            Outside shop hours, call the emergency locksmith on <a className="font-medium text-fg underline" href={`tel:${PHONE.emergency[1]}`}>{PHONE.emergency[0]}</a>.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden bg-alt pb-24 text-bg md:pb-10">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        <p className="flex items-center gap-[2vw] pt-16 font-display text-[23vw] leading-[0.8] font-bold tracking-[-0.08em] text-accent">
          <HoverLetters className="[--accent:var(--bg)]">rose</HoverLetters>
          <Mark className="size-[15vw] shrink-0 transition-transform duration-1000 ease-expo hover:rotate-[200deg]" />
        </p>
        <div className="mt-10 flex flex-wrap justify-between gap-4 text-[13px] opacity-60">
          <span>© {new Date().getFullYear()} Rose Locksmith &amp; DIY · Since 1938</span>
          <span>Concept by Second Coat</span>
        </div>
      </div>
    </footer>
  );
}
