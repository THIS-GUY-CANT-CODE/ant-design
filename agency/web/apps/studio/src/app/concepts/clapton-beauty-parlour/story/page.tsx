import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { Decades, Story, Visit } from '../_components/sections';
import { Centenary } from '../_components/tools';
import { FILM_2 } from '../_components/media';

export const metadata: Metadata = { title: 'Our story', description: 'Opened in 1930 by Jean and Emanuel Manning. A teenage Vidal Sassoon once worked here. Turning 100 in 2030.' };

export default function StoryPage() {
  return (
    <main>
      <PageHead media={FILM_2} crumb="Our story" title={<>Since <em className="text-accent">1930.</em></>} intro="Newlyweds Jean and Emanuel Manning opened the Parlour in 1930. A teenage Vidal Sassoon worked here in the 1940s. We turn 100 in 2030." />
      <Story />
      <Decades />
      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-8"><Centenary /></section>
      <Visit />
    </main>
  );
}
