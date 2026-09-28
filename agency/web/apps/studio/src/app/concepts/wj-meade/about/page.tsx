import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { Stats, Story } from '../_components/sections';

export const metadata: Metadata = { title: 'Since 1953', description: 'Founded by Walter Joseph Meade on Hoe Street, Walthamstow, in 1953. Still independent, with only three owners in its history.' };

export default function About() {
  return (
    <main>
      <PageHead crumb="Since 1953" title={<>Seventy years. <span className="text-accent">Three owners.</span></>} intro="Walter Joseph Meade opened on Hoe Street, Walthamstow, in 1953. We’re still independent and still local." />
      <Stats />
      <Story />
    </main>
  );
}
