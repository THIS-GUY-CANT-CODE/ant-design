import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHead } from '../../_components/page-head';
import { BASE, SERVICES } from '../../_components/site';
import { P, SERVICE_PHOTO } from '../../_components/media';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  return s ? { title: s.name, description: s.line } : {};
}

export default async function Service({ params }: Props) {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) notFound();
  const i = SERVICES.indexOf(s);
  const next = SERVICES[(i + 1) % SERVICES.length]!;
  return (
    <main>
      <PageHead media={SERVICE_PHOTO[s.slug] ?? P.set} crumbs={[{ href: `${BASE}/services`, label: 'Services' }, { label: s.name }]} title={s.name} intro={s.intro}>
        <Link href={`${BASE}/brief`} className="mt-10 inline-block rounded-full bg-accent px-7 py-4 font-medium text-accent-ink">Brief us on a {s.name.toLowerCase().replace(/s$/, '')} →</Link>
      </PageHead>
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 md:grid-cols-2 md:px-8">
        <div className="rounded-3xl border border-line bg-card p-8">
          <p className="font-mono text-[12px] text-muted">(WHAT&apos;S INCLUDED)</p>
          <ul className="mt-6 space-y-3 text-[18px]">
            {s.includes.map((x) => (
              <li key={x} className="flex gap-3"><span className="text-accent">▸</span>{x}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-accent p-8 text-accent-ink">
          <p className="font-mono text-[12px] opacity-60">(WHAT YOU GET)</p>
          <ul className="mt-6 space-y-3 text-[18px]">
            {s.deliverables.map((x) => (
              <li key={x} className="flex gap-3"><span>●</span>{x}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mx-auto max-w-[1600px] px-5 py-32 md:px-8">
        <h2 className="font-display text-[clamp(2.6rem,6vw,6rem)] leading-[0.88] font-semibold tracking-[-0.06em]">How it runs.</h2>
        <ol className="mt-12 grid gap-3 md:grid-cols-4">
          {s.steps.map(([t, d], k) => (
            <li key={t} className="flex min-h-64 flex-col justify-between rounded-3xl border border-line bg-card p-7 transition-colors duration-500 hover:border-accent">
              <span className="font-mono text-[12px] text-muted">Step 0{k + 1}</span>
              <div>
                <h3 className="font-display text-[28px] font-semibold tracking-[-0.04em]">{t}</h3>
                <p className="mt-2 text-[15px] text-muted">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 pb-32 md:grid-cols-12 md:px-8">
        <h2 className="font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.9] font-semibold tracking-[-0.05em] md:col-span-4">Questions.</h2>
        <div className="border-t border-line md:col-span-8">
          {s.faq.map(([q, a], k) => (
            <details key={q} open={k === 0} className="group border-b border-line py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[21px] font-medium tracking-[-0.02em]">
                {q}
                <span aria-hidden className="text-accent transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-[17px] text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>
      <Link href={`${BASE}/services/${next.slug}`} className="group mx-auto block max-w-[1600px] border-t border-line px-5 py-16 md:px-8">
        <span className="font-mono text-[12px] text-muted">(NEXT SERVICE)</span>
        <span className="mt-3 block font-display text-[clamp(3rem,8vw,8rem)] leading-[0.86] font-semibold tracking-[-0.06em] transition-transform duration-700 ease-expo group-hover:translate-x-4">{next.name} →</span>
      </Link>
    </main>
  );
}
