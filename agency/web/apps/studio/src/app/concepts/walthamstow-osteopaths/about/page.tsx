import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { No72, Team } from '../_components/sections';
import { P } from '../_components/media';

export const metadata: Metadata = { title: 'No.72 and the team', description: 'A restored Victorian shop on St Mary Road, and the two osteopaths who have run the practice since 2000.' };

export default function About() {
  return (
    <main>
      <PageHead media={P.table} crumbs={[{ label: 'No.72' }]} title={<>A brewery, a music shop, a hairdresser. <em>Then us.</em></>} intro="Iain Chapman and Stephen Moore started out in 2000, and restored No.72 St Mary Road into the practice it is today." />
      <No72 />
      <Team />
    </main>
  );
}
