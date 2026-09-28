'use client';
import { Magnetic, Parallax, Reveal, RollText, Scramble } from '@sc/ui';
import Link from 'next/link';
import { BASE } from './site';
import { KeyWall } from './key-wall';
import { ValuationForm } from './tools';

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-7">
          <p className="mb-8 text-[14px] text-muted"><Scramble>Independent estate & letting agents · East London</Scramble></p>
          <Reveal as="h1" immediate className="font-display text-[clamp(3.4rem,8.2vw,8.6rem)] leading-[0.88] font-bold tracking-[-0.05em]">
            East London&apos;s estate agent. <span className="text-accent">Since 1953.</span>
          </Reveal>
          <p className="mt-8 max-w-lg text-[19px] leading-snug text-muted">For more than seventy years we&apos;ve helped East London buy, sell, let and rent. Still independent, and we still know the streets.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <a href="#homes" className="block rounded-full bg-fg px-7 py-4 text-[16px] font-medium text-bg"><RollText>Homes &amp; tools</RollText></a>
            </Magnetic>
            <Magnetic>
              <Link href={`${BASE}/offices`} className="block rounded-full border border-fg/20 px-7 py-4 text-[16px] font-medium"><RollText>Five local offices</RollText></Link>
            </Magnetic>
          </div>
        </div>
        <Parallax speed={-6} className="md:col-span-5 md:col-start-8">
          <ValuationForm compact />
        </Parallax>
      </div>
      <div className="mt-14 border-t border-line">
        <KeyWall className="h-[clamp(260px,38vh,400px)]" />
        <p className="mx-auto max-w-[1600px] px-5 pb-6 text-[13px] text-muted md:px-8">A tag for every street in our patch, from Roman Road to Chase Side. Brush past them; stop on one to read it.</p>
      </div>
    </section>
  );
}
