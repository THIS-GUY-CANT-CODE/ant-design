import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { BowTrains, OfficeFinder } from '../_components/tools';

export const metadata: Metadata = { title: 'Offices', description: 'Five W J Meade offices: Bow, Stratford, Wood Green, Highams Park and Enfield. Find your nearest by postcode.' };

export default function Offices() {
  return (
    <main>
      <PageHead crumb="Offices" title={<>Five offices, <span className="text-accent">all local.</span></>} intro="Put in your postcode to find your nearest branch, or explore them on the map." />
      <section className="mx-auto max-w-[1600px] px-5 md:px-8">
        <OfficeFinder />
      </section>
      <section className="mx-auto max-w-[1600px] px-5 py-3 pb-32 md:px-8">
        <div className="rounded-[1.75rem] bg-card p-7 md:p-10">
          <p className="text-[13px] font-semibold text-accent">GETTING TO BOW</p>
          <h2 className="mt-3 mb-8 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] font-bold tracking-[-0.045em]">Next trains near 391 Mile End Road</h2>
          <BowTrains />
        </div>
      </section>
    </main>
  );
}
