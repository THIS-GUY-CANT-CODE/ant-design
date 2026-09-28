import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { ValuationForm } from '../_components/tools';
import { P } from '../_components/media';

export const metadata: Metadata = { title: 'Sell', description: 'Free, honest valuations from an independent East London agent, marketed on Rightmove, OnTheMarket and PrimeLocation.' };

const STEPS = [
  ['We visit', 'A local negotiator walks round with you and asks what matters to you: price, timing, chain.'],
  ['We value it honestly', 'A figure based on what similar homes nearby actually sold for, not what wins the instruction.'],
  ['We market it', 'Photos, floorplan and listings on Rightmove, OnTheMarket and PrimeLocation.'],
  ['We see it through', 'Viewings, offers, and chasing the chain until the keys change hands.'],
];

export default function Sell() {
  return (
    <main>
      <PageHead media={P.handover} crumb="Sell" title={<>What&apos;s your home <span className="text-accent">really</span> worth?</>} intro="A free valuation from people who have sold homes on these streets since 1953." />
      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 pb-32 md:grid-cols-12 md:px-8">
        <div className="md:col-span-6"><ValuationForm /></div>
        <ol className="grid content-start gap-3 md:col-span-6">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="grid grid-cols-[3.5rem_1fr] gap-4 rounded-[1.5rem] bg-card p-6">
              <span className="font-display text-[44px] leading-none font-bold tracking-[-0.05em] text-accent">{i + 1}</span>
              <div>
                <p className="text-[21px] font-bold tracking-[-0.02em]">{t}</p>
                <p className="mt-1 text-[15px] text-muted">{d}</p>
              </div>
            </li>
          ))}
          <li className="rounded-[1.5rem] bg-[var(--mist)] p-6 text-[15px]">Fees: [add sales fee structure]. Bow sales were featured in the Best Estate Agent Guide 2018.</li>
        </ol>
      </section>
    </main>
  );
}
