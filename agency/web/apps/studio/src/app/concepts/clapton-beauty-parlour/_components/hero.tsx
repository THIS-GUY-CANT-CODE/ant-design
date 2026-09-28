'use client';
import { Magnetic, RollText, Scramble } from '@sc/ui';
import { CutHeadline } from './cut-headline';

export { FRESHA } from './site';
import { FRESHA } from './site';


export function Hero() {
  const headline = (
    <>
      Doing Clapton&apos;s hair <em className="text-accent">since 1930.</em>
    </>
  );
  const cls = 'font-display text-[clamp(3.8rem,11vw,12rem)] leading-[0.86] tracking-[-0.04em]';
  return (
    <section
      id="top"
      className="mx-auto max-w-[1600px] px-5 pt-36 pb-20 md:px-8 md:pt-44"
    >
      <p className="mb-10 flex items-center justify-between text-[14px] text-muted">
        <Scramble>21 Lower Clapton Road · London E5</Scramble>
        <span className="hidden md:inline"><Scramble>Hair · Beauty · Electrolysis</Scramble></span>
      </p>
      <CutHeadline className={cls}>{headline}</CutHeadline>
      <div className="mt-20 grid gap-8 border-t border-line pt-8 md:grid-cols-12">
        <p className="max-w-md text-[18px] leading-snug text-muted md:col-span-6">
          Cuts, colour, extensions and beauty at a family salon on Lower Clapton Road since 1930, with one very famous former guest.
        </p>
        <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
          <Magnetic>
            <a href={FRESHA} rel="noopener" className="block rounded-full bg-accent px-8 py-4 text-[16px] font-medium text-accent-ink"><RollText>Book online</RollText></a>
          </Magnetic>
          <Magnetic>
            <a href="tel:+442089854329" className="block rounded-full border border-fg/20 px-8 py-4 text-[16px] font-medium"><RollText>020 8985 4329</RollText></a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
