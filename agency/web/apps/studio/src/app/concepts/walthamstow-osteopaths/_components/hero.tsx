'use client';
import { Magnetic, Parallax, Reveal, RollText, Scramble, ShaderCanvas, Tilt } from '@sc/ui';
import { Stones } from './stones';

/** Arch window (the No.72 shopfront) holding the mark's balanced stones, as physics you can knock over. */
export function Hero() {
  return (
    <section id="top" className="mx-auto grid max-w-[1600px] gap-10 px-5 pt-32 pb-24 md:grid-cols-12 md:px-8 md:pt-40">
      <div className="flex flex-col justify-end md:col-span-7">
        <p className="mb-8 text-[14px] text-muted"><Scramble>Walthamstow Village · E17 · Since 2000</Scramble></p>
        <Reveal as="h1" immediate className="font-display text-[clamp(4rem,10vw,10.5rem)] leading-[0.86] tracking-[-0.035em]">
          Hands-on care at <em>No.72.</em>
        </Reveal>
        <p className="mt-8 max-w-md text-[19px] leading-relaxed text-muted">Osteopathy, acupuncture and massage in a restored Victorian shopfront, a short walk from Walthamstow Central.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Magnetic>
            <a href="tel:+442085217888" className="block rounded-full bg-accent px-7 py-4 text-[16px] text-accent-ink"><RollText>Call 020 8521 7888</RollText></a>
          </Magnetic>
          <Magnetic>
            <a href="#first-visit" className="block rounded-full border border-fg/25 px-7 py-4 text-[16px]"><RollText>What to expect</RollText></a>
          </Magnetic>
        </div>
      </div>
      <Parallax speed={-10} className="md:col-span-5">
        <Tilt max={3} glare={false} className="mx-auto w-full max-w-[480px]">
        <div className="relative aspect-[3/4.2] w-full overflow-hidden rounded-t-full rounded-b-[2rem] bg-accent">
          <ShaderCanvas palette={['#2E4A3A', '#35543F', '#27402F', '#3F604B']} className="absolute inset-0 size-full opacity-80" zoom={1.1} flow={0.35} grain={0.05} />
          <Stones />
        </div>
        <p className="mt-4 text-center text-[13px] text-muted">Pick up a stone. Knock it over. It finds its balance again.</p>
        </Tilt>
      </Parallax>
    </section>
  );
}
