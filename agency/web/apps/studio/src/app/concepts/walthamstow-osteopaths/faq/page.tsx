import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { FaqSearch } from '../_components/tools';
import { P } from '../_components/media';

export const metadata: Metadata = { title: 'Questions', description: 'Referrals, what to wear, what to bring, insurance and more.' };

export default function Faq() {
  return (
    <main>
      <PageHead media={P.acupunctureMan} crumbs={[{ label: 'FAQ' }]} title={<>Good to <em>know.</em></>} intro="The questions people ask before their first visit. Can’t find yours? Call or email and we’ll answer." />
      <section className="mx-auto max-w-4xl px-5 pb-24 md:px-8">
        <FaqSearch />
      </section>
    </main>
  );
}
