import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { OpenNow } from '../_components/open-now';
import { StockSearch } from '../_components/stock-search';
import { VisitDirections, VisitMap, VisitTrains } from '../_components/visit-live';
import { ADDRESS, PHONE } from '../_components/data';

export const metadata: Metadata = { title: 'Visit', description: '149 Bethnal Green Road, London E2 7DG. Opening hours, map, directions and live trains from Bethnal Green.' };

export default function Visit() {
  return (
    <main>
      <PageHead eyebrow="Visit" title={<>149 Bethnal Green Road.</>} intro="A short walk from Bethnal Green and Shoreditch High Street. Open six days a week.">
        <div className="mt-8"><OpenNow /></div>
      </PageHead>
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 md:grid-cols-12 md:px-8">
        <VisitMap className="min-h-[420px] rounded-[2rem] md:col-span-8 md:min-h-[560px]" />
        <div className="flex flex-col gap-3 md:col-span-4">
          <div className="rounded-[2rem] bg-card p-7">
            <p className="font-mono text-[12px] text-muted">ADDRESS</p>
            <p className="mt-3 text-[22px] font-bold tracking-[-0.02em]">{ADDRESS}</p>
            <div className="mt-5"><VisitDirections /></div>
          </div>
          <div className="rounded-[2rem] bg-card p-7">
            <p className="font-mono text-[12px] text-muted">CALL</p>
            <a href={`tel:${PHONE.shop[1]}`} className="mt-3 block text-[22px] font-bold">Shop {PHONE.shop[0]}</a>
            <a href={`tel:${PHONE.emergency[1]}`} className="mt-1 block text-[22px] font-bold text-accent">Emergency {PHONE.emergency[0]}</a>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 py-3 md:grid-cols-2 md:px-8">
        <div id="trains" className="scroll-mt-32 rounded-[2rem] bg-card p-7 md:p-10">
          <p className="font-mono text-[12px] text-muted">GETTING HERE</p>
          <h2 className="mt-4 mb-8 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] font-bold tracking-[-0.045em]">Next trains nearby.</h2>
          <VisitTrains />
        </div>
        <StockSearch />
      </section>
      <div className="h-32" />
    </main>
  );
}
