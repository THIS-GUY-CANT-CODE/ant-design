import { InPictures } from '@sc/ui';
import { Hero } from './_components/hero';
import { Help, Homes, Offices, Stats, Story } from './_components/sections';
import { FILM, HOME_PHOTOS } from './_components/media';

export default function WJMeade() {
  return (
    <main>
      <Hero />
      <Stats />
      <InPictures title={<>The streets <span className="text-accent">we know.</span></>} intro="Victorian terraces, new-builds and flats across East London, sold and let by the same local team since 1953." film={FILM} photos={HOME_PHOTOS} titleClassName="font-bold tracking-[-0.05em]" frameClassName="rounded-2xl" />
      <Help />
      <Homes />
      <Story />
      <Offices />
    </main>
  );
}
