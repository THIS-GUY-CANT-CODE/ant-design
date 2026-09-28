import type { Metadata } from 'next';
import { Kitchens } from '../_components/kitchens';
import { PageHead } from '../_components/page-head';
import { Story } from '../_components/visit';
import { P } from '../_components/media';

export const metadata: Metadata = { title: 'Our story', description: "A family kitchen on Mare Street for over twenty years: Northern Vietnamese cooking, and later the noodles and street food of Xi'an." };

export default function StoryPage() {
  return (
    <main>
      <PageHead media={P.openKitchen} crumb="Our story" title="20 years" intro="A family kitchen in Hackney that started Northern Vietnamese and fell for Xi'an along the way." />
      <Story />
      <Kitchens />
    </main>
  );
}
