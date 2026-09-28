'use client';
import { gsap, Magnetic, Parallax, Reveal, RollText, Scramble, ShaderCanvas, Tilt, useGSAP } from '@sc/ui';
import { useRef } from 'react';

const V = 15;

/** Arch window (the No.72 shopfront) holding a slow living gradient and a spine that straightens as you scroll. */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const verts = gsap.utils.toArray<HTMLElement>('[data-vert]');
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      verts.forEach((v, i) => {
        const t = i / (V - 1);
        const x = Math.sin(t * Math.PI * 1.6 + 0.4) * 34;
        const r = Math.cos(t * Math.PI * 1.6 + 0.4) * 16;
        if (still) return;
        gsap.fromTo(v, { x, rotate: r }, { x: 0, rotate: 0, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom 30%', scrub: 0.6 } });
      });
    },
    { scope: ref },
  );
  return (
    <section ref={ref} id="top" className="mx-auto grid max-w-[1600px] gap-10 px-5 pt-32 pb-24 md:grid-cols-12 md:px-8 md:pt-40">
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
        <Tilt max={5} glare={false} className="mx-auto w-full max-w-[480px]">
        <div data-cursor="Breathe" className="relative aspect-[3/4.2] w-full overflow-hidden rounded-t-full rounded-b-[2rem]">
          <ShaderCanvas palette={['#EEEAE3', '#C9D4BC', '#E3B49A', '#6F8A74']} className="absolute inset-0 size-full" zoom={1.1} flow={0.45} grain={0.04} />
          <div aria-hidden className="absolute inset-0 flex flex-col items-center justify-center gap-[1.1%] pt-[14%]">
            {Array.from({ length: V }, (_, i) => {
              const w = 18 + Math.sin((i / (V - 1)) * Math.PI) * 12 + i * 0.8;
              return <span key={i} data-vert className="block h-[3.2%] rounded-full bg-[#F8F6F1]/90 shadow-[0_2px_10px_rgba(31,42,34,.08)]" style={{ width: `${w}%` }} />;
            })}
          </div>
        </div>
        </Tilt>
      </Parallax>
    </section>
  );
}
