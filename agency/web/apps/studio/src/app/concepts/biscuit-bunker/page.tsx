import { Reveal } from '@sc/ui';
import { Contact } from './_components/contact';
import { Footer } from './_components/footer';
import { Hero } from './_components/hero';
import { Nav } from './_components/nav';
import { Process } from './_components/process';
import { Services } from './_components/services';
import { Statement } from './_components/statement';
import { Studio } from './_components/studio';
import { Work } from './_components/work';

export default function BiscuitBunker() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Work />
        <Services />
        <Studio />
        <Process />
        <section className="mx-auto max-w-[1600px] px-5 pb-40 md:px-8">
          <Reveal as="blockquote" className="max-w-[24ch] font-display text-[clamp(2rem,4vw,3.8rem)] leading-[1.02] font-medium tracking-[-0.045em]">
            &ldquo;[Client testimonial: one or two sentences about the result.]&rdquo;
          </Reveal>
          <p className="mt-6 font-mono text-[12px] text-muted">Name, role, company</p>
        </section>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
