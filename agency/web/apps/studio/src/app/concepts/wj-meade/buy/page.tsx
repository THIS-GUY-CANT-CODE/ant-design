import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { MortgageCalculator, StampDutyCalculator } from '../_components/tools';

export const metadata: Metadata = { title: 'Buy', description: 'Stamp duty and mortgage calculators, with current England rates and first-time buyer relief.' };

export default function Buy() {
  return (
    <main>
      <PageHead crumb="Buy" title={<>Know the numbers <span className="text-accent">before</span> you view.</>} intro="Stamp duty at today’s rates and what a mortgage would cost you each month. Then register with us to hear about homes first.">
        <a href="https://www.wjmeade.co.uk/" rel="noopener" className="mt-8 inline-block rounded-full bg-fg px-7 py-4 font-semibold text-bg">Homes for sale on wjmeade.co.uk ↗</a>
      </PageHead>
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 pb-32 md:px-8">
        <StampDutyCalculator />
        <MortgageCalculator />
      </section>
    </main>
  );
}
