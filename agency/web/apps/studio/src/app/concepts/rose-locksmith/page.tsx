import { InPictures } from '@sc/ui';
import { Hero } from './_components/hero';
import { Lock } from './_components/lock';
import { Paint } from './_components/paint';
import { Reviews, Story, Visit } from './_components/rest';
import { Services } from './_components/services';
import { FILM, HOME_PHOTOS } from './_components/media';

export default function RoseLocksmith() {
  return (
    <main>
      <Hero />
      <Services />
      <InPictures title={<>Keys cut, <span className="text-accent">colours mixed.</span></>} intro="Thousands of blanks on the wall and a Dulux mixer behind the counter. Bring the key or the colour chip." film={FILM} photos={HOME_PHOTOS} titleClassName="font-bold tracking-[-0.055em]" frameClassName="rounded-2xl" />
      <Lock />
      <Story />
      <Paint />
      <div className="pt-32">
        <Reviews />
      </div>
      <Visit />
    </main>
  );
}
