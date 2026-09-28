import { InPictures } from '@sc/ui';
import { Hero } from './_components/hero';
import { Kitchens } from './_components/kitchens';
import { Menu } from './_components/menu';
import { Story, Visit } from './_components/visit';
import { FILM, HOME_PHOTOS } from './_components/media';

export default function GreenPapaya() {
  return (
    <main>
      <Hero />
      <Kitchens />
      <InPictures title={<>Smoke, broth <span className="text-accent">&amp; noodles.</span></>} intro="Northern Vietnamese broths and Xi'an wok fire, cooked to order on Mare Street." film={FILM} photos={HOME_PHOTOS} titleClassName="font-extrabold uppercase tracking-[-0.05em] [font-stretch:75%]" frameClassName="rounded-[28px]" />
      <Menu />
      <Story />
      <Visit />
    </main>
  );
}
