import { Cursor, InPictures, MotionKit } from '@sc/ui';
import Link from 'next/link';
import { StudioChrome } from './_studio/chrome';
import { STUDIO_FILM, STUDIO_PHOTOS } from './_studio/media';
import { PaintHero } from './_studio/paint-hero';
import { Reach } from './_studio/reach';
import { Contact, Faq, Footer, How, Names, Nav, Pipeline, Pricing } from './_studio/sections';
import { WorkStack } from './_studio/work-stack';

export default function Home() {
  return (
    <>
      <Cursor />
      <MotionKit intro="Second Coat" />
      <StudioChrome />
      <Nav />
      <main>
        <PaintHero />
        <Names />
        <div className="pt-24">
          <WorkStack />
        </div>
        <How />
        <InPictures
          title={<>Real places, <span className="font-serif font-normal italic">fresh coats.</span></>}
          intro="Kitchens, workshops, salons, clinics and high streets. We rebrand the businesses that make a place worth visiting, from East London to wherever you are."
          film={STUDIO_FILM}
          photos={STUDIO_PHOTOS}
          titleClassName="font-semibold tracking-[-0.055em]"
          frameClassName="rounded-[1.75rem]"
          className="!px-3 md:!px-4"
        />
        <section className="mx-auto max-w-[1600px] px-3 md:px-4">
          <Link href="/check" className="group flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-fg px-8 py-10 text-bg md:px-14">
            <span>
              <span className="text-[14px] opacity-60">Free tool</span>
              <span className="mt-2 block font-display text-[clamp(2rem,4.4vw,4rem)] leading-none font-semibold tracking-[-0.05em]">How&apos;s your website doing? Find out in 10 seconds.</span>
            </span>
            <span className="grid size-16 place-items-center rounded-full bg-accent text-[24px] text-accent-ink transition-transform duration-500 group-hover:-rotate-45">→</span>
          </Link>
        </section>
        <Reach />
        <Pricing />
        <Pipeline />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
