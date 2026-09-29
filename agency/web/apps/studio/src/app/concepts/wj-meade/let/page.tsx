import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { LandlordTools } from '../_components/tools';
import { P } from '../_components/media';

export const metadata: Metadata = { title: 'Landlords', description: 'Rental yield calculator and the deposit limits under the Tenant Fees Act, from a UKALA-accredited lettings team.' };

export default function Let() {
  return (
    <main>
      <PageHead media={P.whiteTerrace} crumb="Landlords" title={<>Letting, <span className="text-accent">done properly.</span></>} intro="Tenant-find or full management from a UKALA-accredited team. Check your yield, and what the law lets you take as a deposit." />
      <section className="mx-auto max-w-[1600px] px-5 pb-32 md:px-8">
        <LandlordTools />
      </section>
    </main>
  );
}
