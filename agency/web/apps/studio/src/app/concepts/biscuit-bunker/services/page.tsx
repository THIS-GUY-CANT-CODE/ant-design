import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHead } from '../_components/page-head';
import { Process } from '../_components/process';
import { BASE, SERVICES } from '../_components/site';
import { P } from '../_components/media';

export const metadata: Metadata = { title: 'Services', description: 'Commercials, branded content, corporate film, animation and motion, and podcasts.' };

export default function Services() {
  return (
    <main>
      <PageHead media={P.crew} crumbs={[{ label: 'Services' }]} title="Pitch deck" accent="to final cut." intro="Five disciplines under one roof, and one team that sees the job through from the first idea to the last export." />
      <section className="mx-auto max-w-[1600px] px-5 md:px-8">
        <ul className="border-t border-line">
          {SERVICES.map((s, i) => (
            <li key={s.slug} className="group relative overflow-hidden border-b border-line">
              <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-expo group-hover:scale-x-100" />
              <Link href={`${BASE}/services/${s.slug}`} className="relative grid gap-3 py-10 transition-colors duration-500 group-hover:text-accent-ink md:grid-cols-12 md:items-center">
                <span className="font-mono text-[12px] opacity-60 md:col-span-1">0{i + 1}</span>
                <span className="font-display text-[clamp(2.2rem,5vw,4.6rem)] leading-none font-medium tracking-[-0.05em] transition-transform duration-700 ease-expo group-hover:translate-x-4 md:col-span-6">{s.name}</span>
                <span className="max-w-md text-[15px] opacity-70 md:col-span-4">{s.line}</span>
                <span aria-hidden className="hidden justify-self-end text-[24px] md:col-span-1 md:block">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Process />
    </main>
  );
}
