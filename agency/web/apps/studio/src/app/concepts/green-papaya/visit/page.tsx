import type { Metadata } from 'next';
import { DinnerPlanner } from '../_components/dinner-planner';
import { PageHead } from '../_components/page-head';
import { Hours, VisitDirections, VisitMap, VisitTrains } from '../_components/visit-live';
import { ADDRESS, PHONE } from '../_components/site';

export const metadata: Metadata = { title: 'Visit', description: '191 Mare Street, Hackney E8. Opening hours, map, live trains and a dinner planner.' };

export default function VisitPage() {
  return (
    <main>
      <PageHead crumb="Visit" title="Mare St" intro="Walk-ins welcome. For groups of six or more, please call ahead." />
      <section className="mx-auto grid max-w-[1600px] gap-3 px-4 py-16 md:grid-cols-12 md:px-8">
        <VisitMap className="min-h-[420px] rounded-[2rem] md:col-span-7 md:min-h-[600px]" />
        <div className="grid gap-3 md:col-span-5">
          <div className="rounded-[2rem] bg-card p-7"><Hours /></div>
          <div className="rounded-[2rem] bg-card p-7">
            <p className="text-[13px] text-muted">Address</p>
            <p className="mt-2 text-[22px] font-bold tracking-[-0.02em]">{ADDRESS}</p>
            <div className="mt-4"><VisitDirections /></div>
            <a href={`tel:${PHONE[1]}`} className="mt-4 inline-block text-[18px] font-bold underline underline-offset-4">Call {PHONE[0]}</a>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1600px] gap-3 px-4 pb-32 md:grid-cols-2 md:px-8">
        <DinnerPlanner />
        <div className="rounded-[2rem] bg-card p-7 md:p-10">
          <p className="text-[13px] text-muted">Getting here</p>
          <h2 className="mt-3 mb-8 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.92] font-extrabold tracking-[-0.045em]" style={{ fontStretch: '85%' }}>Next trains nearby</h2>
          <VisitTrains />
        </div>
      </section>
    </main>
  );
}
