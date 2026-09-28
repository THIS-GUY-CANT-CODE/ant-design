import { Cursor } from '@sc/ui';
import { PaintHero } from './_studio/paint-hero';
import { Contact, Faq, Footer, How, Names, Nav, Pipeline, Pricing } from './_studio/sections';
import { WorkStack } from './_studio/work-stack';

export default function Home() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <PaintHero />
        <Names />
        <div className="pt-24">
          <WorkStack />
        </div>
        <How />
        <Pricing />
        <Pipeline />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
