import type { Metadata } from 'next';
import { BriefBuilder } from '../_components/brief';
import { PageHead } from '../_components/page-head';
import { P } from '../_components/media';

export const metadata: Metadata = { title: 'Start a brief', description: 'Five questions: what, why, where, when and who. We work out the formats and turn it into a brief.' };

export default function Brief() {
  return (
    <main>
      <PageHead media={P.edit} crumbs={[{ label: 'Start a brief' }]} title="Got a brief?" accent="Build it here." intro="Five quick questions. We work out every aspect ratio you’ll need, check your timeline, and hand you a brief ready to send." />
      <section className="mx-auto max-w-[1600px] px-5 pb-40 md:px-8">
        <BriefBuilder />
      </section>
    </main>
  );
}
