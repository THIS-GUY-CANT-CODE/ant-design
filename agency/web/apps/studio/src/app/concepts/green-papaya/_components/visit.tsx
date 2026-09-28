'use client';
import { Counter, FadeIn, HoverLetters, isOpenAt, Magnetic, Reveal, RollText, Stagger, Tilt, useLondonTime } from '@sc/ui';
import { HOURS, HOURS_TEXT } from './hours';

const MAPS = 'https://www.google.com/maps/search/?api=1&query=Green+Papaya+191+Mare+Street+London+E8+3QE';

export function Story() {
  return (
    <section className="mx-auto grid max-w-[1600px] gap-16 px-4 py-32 md:grid-cols-12 md:px-8 md:py-44">
      <div className="md:col-span-7">
        <Reveal as="h2" by="words" className="font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.86] font-extrabold tracking-[-0.045em]">
          A Hackney family kitchen.
        </Reveal>
        <FadeIn className="mt-10 max-w-xl space-y-5 text-[18px] leading-relaxed text-muted">
          <p>Green Papaya has been cooking on this corner of Hackney for over twenty years. It started as a Northern Vietnamese kitchen, and over time the family brought in the noodles and street food of Xi&apos;an.</p>
          <p>It&apos;s still family-run, and everything is still cooked fresh.</p>
        </FadeIn>
      </div>
      <Stagger className="grid gap-3 self-end md:col-span-5">
        {[
          [<><Counter to={20} />+</>, 'years on Mare Street'],
          [<Counter key="c" to={2} />, 'cuisines, one kitchen'],
          [<Counter key="f" to={1} />, 'family, still cooking'],
        ].map(([n, l], i) => (
          <Tilt key={i} max={6} className="flex items-baseline justify-between rounded-3xl bg-card px-7 py-6">
            <dl className="contents">
              <dt className="order-2 text-[15px] text-muted">{l}</dt>
              <dd className="font-display text-[64px] leading-none font-extrabold tracking-[-0.05em] transition-colors duration-500 group-hover/tilt:text-accent">{n}</dd>
            </dl>
          </Tilt>
        ))}
      </Stagger>
      <blockquote className="border-t border-line pt-12 md:col-span-12">
        <Reveal as="p" className="max-w-[26ch] font-display text-[clamp(2rem,4.2vw,4rem)] leading-[1] font-bold tracking-[-0.035em]">
          &ldquo;One of the greatest Vietnamese restaurants I&apos;ve been to in London. Totally fresh ingredients.&rdquo;
        </Reveal>
        <footer className="mt-5 text-[14px] text-muted">Tripadvisor review</footer>
      </blockquote>
    </section>
  );
}

export function Visit() {
  const now = useLondonTime();
  const today = now?.day ?? null;
  const open = now ? isOpenAt(HOURS, now.day, now.mins) : null;
  return (
    <section id="visit" className="bg-accent">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-4 py-32 md:grid-cols-12 md:px-8 md:py-40">
        <div className="md:col-span-7">
          <p className="mb-6 flex items-center gap-2 text-[14px] font-semibold">
            {open !== null && <span className={`size-2.5 rounded-full ${open ? 'bg-[#0B7A3B]' : 'bg-fg/40'}`} />}
            {open === null ? 'Hours' : open ? 'Open now' : 'Closed right now'}
          </p>
          <h2 className="font-display text-[clamp(3.4rem,9vw,9rem)] leading-[0.82] font-extrabold tracking-[-0.05em]" style={{ fontStretch: '80%' }}>
            <HoverLetters className="[--accent:var(--bg)]">191 Mare Street</HoverLetters>
            <br />
            <HoverLetters className="[--accent:var(--bg)]">London E8 3QE</HoverLetters>
          </h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <a href="tel:+442089855486" className="block rounded-full bg-fg px-7 py-4 text-[16px] font-medium text-bg"><RollText>Call 020 8985 5486</RollText></a>
            </Magnetic>
            <Magnetic>
              <a href={MAPS} rel="noopener" className="block rounded-full border-2 border-fg px-7 py-4 text-[16px] font-medium"><RollText>Directions ↗</RollText></a>
            </Magnetic>
          </div>
        </div>
        <table className="self-end text-[16px] md:col-span-5" aria-label="Opening hours">
          <tbody>
            {HOURS_TEXT.map(([d, name, h]) => (
              <tr key={d} className={`border-b border-fg/15 transition-[padding] duration-500 ease-expo hover:[&>td:first-child]:pl-3 ${today === d ? 'font-bold' : ''}`}>
                <td className="py-3 transition-[padding] duration-500 ease-expo">{name}{today === d && <span className="ml-2 rounded-full bg-fg px-2 py-0.5 text-[11px] text-bg">Today</span>}</td>
                <td className="py-3 text-right">{h}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[14px] md:col-span-12">Walk-ins welcome. For groups of 6 or more, please call ahead.</p>
      </div>
    </section>
  );
}
