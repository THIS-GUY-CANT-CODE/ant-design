import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { Visit } from '../_components/sections';
import { PriceList, ServiceFinder, WeddingPlanner } from '../_components/tools';

export const metadata: Metadata = { title: 'Services', description: 'Hair, colour, extensions, beauty, electrolysis and more. Search the price list and book online.' };

export default function ServicesPage() {
  return (
    <main>
      <PageHead crumb="Services" title={<>The <em className="text-accent">price list.</em></>} intro="Hair, beauty and body treatments on Lower Clapton Road. Search it, find what suits the occasion, and book online." />
      <section className="mx-auto max-w-[1600px] px-5 md:px-8"><PriceList /></section>
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 py-24 md:grid-cols-2 md:px-8">
        <ServiceFinder />
        <WeddingPlanner />
      </section>
      <Visit />
    </main>
  );
}
