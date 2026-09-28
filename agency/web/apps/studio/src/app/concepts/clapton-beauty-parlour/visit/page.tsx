import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { ADDRESS, FRESHA, PHONE } from '../_components/site';
import { Hours, VisitDirections, VisitMap, VisitTrains } from '../_components/tools';
import { P } from '../_components/media';

export const metadata: Metadata = { title: 'Visit', description: '21 Lower Clapton Road, London E5 0NS. Opening hours, map, directions and live trains nearby.' };

export default function VisitPage() {
  return (
    <main>
      <PageHead media={P.scissors} crumb="Visit" title={<>21 Lower <em className="text-accent">Clapton Road.</em></>} intro="Tuesday to Saturday. Book online or pop in." />
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 md:grid-cols-12 md:px-8">
        <VisitMap className="min-h-[420px] rounded-[2rem] md:col-span-7 md:min-h-[600px]" />
        <div className="grid gap-3 md:col-span-5">
          <div className="rounded-[2rem] bg-card p-7"><Hours /></div>
          <div className="rounded-[2rem] bg-card p-7">
            <p className="text-[13px] text-muted">Address</p>
            <p className="mt-2 font-display text-[28px] leading-tight">{ADDRESS}</p>
            <div className="mt-4"><VisitDirections /></div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={FRESHA} rel="noopener" className="rounded-full bg-accent px-5 py-3 text-[14px] text-accent-ink">Book online</a>
              <a href={`tel:${PHONE[1]}`} className="rounded-full border border-line px-5 py-3 text-[14px]">Call {PHONE[0]}</a>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1600px] px-5 py-3 pb-32 md:px-8">
        <div className="rounded-[2rem] bg-card p-7 md:p-10">
          <p className="text-[13px] text-muted">Getting here</p>
          <h2 className="mt-3 mb-8 font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-none tracking-[-0.03em]">Next trains nearby</h2>
          <VisitTrains />
        </div>
      </section>
    </main>
  );
}
