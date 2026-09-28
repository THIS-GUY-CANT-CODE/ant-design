import { Cursor, MotionKit } from '@sc/ui';
import Link from 'next/link';
import { StudioChrome } from './_studio/chrome';
import { SecondCoatHero } from './_studio/second-coat-hero';
import { Reach } from './_studio/reach';
import { Roller } from './_studio/roller';
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
        <SecondCoatHero />
        <Names />
        <div className="pt-24">
          <WorkStack />
        </div>
        <Roller />
        <How />
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
