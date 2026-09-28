import { InPictures } from '@sc/ui';
import { Hero } from './_components/hero';
import { Decades, Services, Story, Visit } from './_components/sections';
import { FILM, HOME_PHOTOS } from './_components/media';

export default function ClaptonBeautyParlour() {
  return (
    <main>
      <Hero />
      <Services />
      <InPictures title={<>Cut, colour, <em className="text-accent">nails &amp; skin.</em></>} intro="Everything under one roof on Lower Clapton Road, as it has been since 1930." film={FILM} photos={HOME_PHOTOS} titleClassName="tracking-[-0.04em]" frameClassName="rounded-none" />
      <Story />
      <Decades />
      <Visit />
    </main>
  );
}
