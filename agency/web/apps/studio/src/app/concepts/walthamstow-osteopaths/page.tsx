import { InPictures } from '@sc/ui';
import { Hero } from './_components/hero';
import { Faq, FirstVisit, No72, Team, Treatments } from './_components/sections';
import { FILM, HOME_PHOTOS } from './_components/media';

export default function WalthamstowOsteopaths() {
  return (
    <main>
      <Hero />
      <Treatments />
      <InPictures title={<>Hands-on care, <em>unhurried.</em></>} intro="Osteopathy, massage and acupuncture at No.72 St Mary Road, with time to listen before we treat." film={FILM} photos={HOME_PHOTOS} titleClassName="tracking-[-0.035em]" frameClassName="rounded-[32px]" />
      <FirstVisit />
      <No72 />
      <Team />
      <Faq />
    </main>
  );
}
