import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { ColourRoom, PaintCalculator, PaintForecast } from '../_components/paint-tools';
import { STOCK } from '../_components/data';

export const metadata: Metadata = { title: 'Paint & DIY', description: 'Any Dulux colour mixed while you wait on Bethnal Green Road, plus a paint calculator and a painting forecast for E2.' };

export default function Paint() {
  return (
    <main>
      <PageHead eyebrow="Paint & DIY" title={<>Any colour. <span className="text-accent">Mixed here.</span></>} intro="Bring a chip, a photo or a colour name and we mix the Dulux shade while you wait. Work out how much you need before you come." />
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 md:px-8">
        <ColourRoom />
        <PaintCalculator />
        <PaintForecast />
      </section>
      <section className="mx-auto max-w-[1600px] px-5 py-32 md:px-8">
        <h2 className="max-w-[16ch] font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.05em]">And the rest of the job.</h2>
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STOCK.slice(3).map((s) => (
            <li key={s.name} className="rounded-3xl bg-card p-6 text-[19px] font-bold tracking-[-0.02em]">{s.name}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
