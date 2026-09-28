import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead } from '../_components/page-head';
import { TREATMENTS, BASE } from '../_components/site';
import { TreatmentFinder } from '../_components/tools';

export const metadata: Metadata = { title: 'Treatments', description: 'Structural and cranial osteopathy, acupuncture, sports massage, aromatherapy and nutritional therapy at No.72, Walthamstow.' };

export default function Treatments() {
  return (
    <main>
      <PageHead crumbs={[{ label: 'Treatments' }]} title={<>Osteopathy first, with the right <em>support</em> around it.</>} intro="Six treatments under one roof. Osteopathy is our speciality; the rest work on their own or alongside it." />
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 md:grid-cols-2 md:px-8 lg:grid-cols-3">
        {TREATMENTS.map((t, i) => (
          <Link key={t.slug} href={`${BASE}/treatments/${t.slug}`} className="group flex min-h-72 flex-col justify-between rounded-[1.75rem] bg-card p-7 transition-[background-color,translate] duration-500 ease-expo hover:-translate-y-1 hover:bg-accent hover:text-accent-ink">
            <span className="flex items-center justify-between font-mono text-[12px] text-muted group-hover:text-accent-ink/70">
              0{i + 1}
              {t.tag && <span className="rounded-full bg-alt px-3 py-1 font-sans text-[12px] text-fg">{t.tag}</span>}
            </span>
            <div>
              <h2 className="font-display text-[40px] leading-none">{t.name}</h2>
              <p className="mt-3 text-[15px] leading-snug opacity-75">{t.short}</p>
              <span className="mt-5 inline-block transition-transform group-hover:translate-x-1" aria-hidden>→</span>
            </div>
          </Link>
        ))}
      </section>
      <section className="mx-auto max-w-[1600px] px-5 py-3 md:px-8">
        <TreatmentFinder />
      </section>
    </main>
  );
}
