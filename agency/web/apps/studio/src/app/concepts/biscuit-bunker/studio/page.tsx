import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { Studio } from '../_components/studio';
import { StudioDirections, StudioMap, StudioTrains } from '../_components/studio-live';
import { P } from '../_components/media';

export const metadata: Metadata = { title: 'Studio', description: 'A converted dog biscuit factory in Shoreditch, London EC2A. How to find us.' };

export default function StudioPage() {
  return (
    <main>
      <PageHead media={P.podcastSet} crumbs={[{ label: 'Studio' }]} title="The bunker." intro="A converted dog biscuit factory in Shoreditch. The ovens are gone; the good stuff still comes out in batches." />
      <Studio />
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 py-32 md:grid-cols-12 md:px-8">
        <StudioMap className="min-h-[420px] rounded-3xl md:col-span-7 md:min-h-[600px]" />
        <div className="rounded-3xl border border-line bg-card p-7 md:col-span-5 md:p-10">
          <p className="font-mono text-[12px] text-muted">(GETTING HERE)</p>
          <p className="mt-4 text-[24px] font-medium tracking-[-0.03em]">Shoreditch, London EC2A 4NE</p>
          <div className="mt-5"><StudioDirections /></div>
          <div className="mt-10"><StudioTrains /></div>
        </div>
      </section>
    </main>
  );
}
