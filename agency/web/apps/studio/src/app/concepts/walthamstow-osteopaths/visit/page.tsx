import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { ADDRESS, EMAIL, PHONE } from '../_components/site';
import { VisitDirections, VisitMap, VisitTrains } from '../_components/visit-live';

export const metadata: Metadata = { title: 'Visit', description: '72 St Mary Road, Walthamstow Village, London E17 9RE. Map, directions and live trains from Walthamstow Central.' };

export default function Visit() {
  return (
    <main>
      <PageHead crumbs={[{ label: 'Visit' }]} title={<>No.72 St Mary Road.</>} intro="On the edge of Walthamstow Village, a short walk from Walthamstow Central." />
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 md:grid-cols-12 md:px-8">
        <VisitMap className="min-h-[420px] rounded-[1.75rem] md:col-span-7 md:min-h-[600px]" />
        <div className="grid gap-3 md:col-span-5">
          <div className="rounded-[1.75rem] bg-card p-7">
            <p className="text-[13px] text-muted">Address</p>
            <p className="mt-2 font-display text-[30px] leading-tight">{ADDRESS}</p>
            <div className="mt-5"><VisitDirections /></div>
          </div>
          <div className="rounded-[1.75rem] bg-card p-7">
            <p className="text-[13px] text-muted">Opening hours</p>
            <p className="mt-2 text-[16px]">[Add opening hours]</p>
            <p className="mt-5 text-[13px] text-muted">Book</p>
            <a href={`tel:${PHONE[1]}`} className="mt-1 block font-display text-[30px]">{PHONE[0]}</a>
            <a href={`mailto:${EMAIL}`} className="u-draw text-[15px] break-all">{EMAIL}</a>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1600px] px-5 py-3 md:px-8">
        <div className="rounded-[1.75rem] bg-card p-7 md:p-10">
          <p className="text-[13px] text-muted">Getting here</p>
          <h2 className="mt-3 mb-8 font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-none tracking-[-0.03em]">Next trains from Walthamstow</h2>
          <VisitTrains />
        </div>
      </section>
    </main>
  );
}
