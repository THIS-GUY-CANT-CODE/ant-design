import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHead } from '../../_components/page-head';
import { BASE, EMAIL, PHONE, TREATMENTS } from '../../_components/site';
import { P, TREATMENT_PHOTO } from '../../_components/media';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => TREATMENTS.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = TREATMENTS.find((x) => x.slug === slug);
  return t ? { title: t.name, description: t.short } : {};
}

export default async function Treatment({ params }: Props) {
  const { slug } = await params;
  const t = TREATMENTS.find((x) => x.slug === slug);
  if (!t) notFound();
  const others = TREATMENTS.filter((x) => x.slug !== slug);
  const mail = `mailto:${EMAIL}?subject=${encodeURIComponent(`Booking: ${t.name}`)}&body=${encodeURIComponent(`Hello,\n\nI'd like to book ${t.name.toLowerCase()}.\n\nName:\nPhone:\nBest days and times:\n`)}`;
  return (
    <main>
      <PageHead media={TREATMENT_PHOTO[t.slug] ?? P.examine} crumbs={[{ href: `${BASE}/treatments`, label: 'Treatments' }, { label: t.name }]} title={t.name} intro={t.short}>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href={`tel:${PHONE[1]}`} className="rounded-full bg-accent px-7 py-4 text-[16px] text-accent-ink">Book: {PHONE[0]}</a>
          <a href={mail} className="rounded-full border border-fg/25 px-7 py-4 text-[16px]">Email to book</a>
        </div>
      </PageHead>
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 md:grid-cols-12 md:px-8">
        <div className="rounded-[1.75rem] bg-card p-7 md:col-span-7 md:p-10">
          <h2 className="font-display text-[34px] leading-none">What it is</h2>
          <p className="mt-5 text-[18px] leading-relaxed">{t.what}</p>
          <h2 className="mt-12 font-display text-[34px] leading-none">What a session is like</h2>
          <ol className="mt-5 space-y-4">
            {t.session.map((s, i) => (
              <li key={s} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-2 text-[17px]">
                <span className="font-display text-[28px] text-accent italic">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <aside className="rounded-[1.75rem] bg-accent p-7 text-accent-ink md:col-span-5 md:p-10">
          <h2 className="font-display text-[34px] leading-none">Good to know</h2>
          <ul className="mt-5 space-y-3 text-[16px]">
            {t.good.map((g) => (
              <li key={g} className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-ink" />{g}</li>
            ))}
          </ul>
          <p className="mt-8 border-t border-white/15 pt-6 text-[14px] opacity-75">We&apos;ll always explain what we recommend and why before we start, and you can stop or change anything at any time.</p>
          <Link href={`${BASE}/first-visit`} className="mt-6 inline-block rounded-full bg-accent-ink px-6 py-3 text-[15px] text-accent">Your first visit →</Link>
        </aside>
      </section>
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-8">
        <h2 className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-none tracking-[-0.03em]">Other treatments</h2>
        <ul className="mt-8 border-t border-line">
          {others.map((o) => (
            <li key={o.slug} className="border-b border-line">
              <Link href={`${BASE}/treatments/${o.slug}`} className="group flex items-baseline justify-between gap-6 py-5">
                <span className="font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-none transition-transform duration-500 ease-expo group-hover:translate-x-3">{o.name}</span>
                <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
