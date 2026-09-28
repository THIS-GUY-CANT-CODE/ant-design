import { Magnetic, Reveal } from '@sc/ui';
import Link from 'next/link';
import { BASE, VIMEO } from './site';

/** Home-page call to action: the brief builder does the real work. */
export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-[1600px] px-5 pb-40 md:px-8">
      <div className="grid gap-16 border-t border-line pt-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <Reveal as="h2" className="font-display text-[clamp(3.4rem,8vw,8rem)] leading-[0.84] font-semibold tracking-[-0.065em]">
            Got a brief?
          </Reveal>
          <Reveal as="p" delay={0.2} className="mt-2 font-serif text-[clamp(2.4rem,5vw,4.6rem)] leading-none text-accent italic">
            Throw us a bone.
          </Reveal>
        </div>
        <div className="flex flex-col justify-end gap-6 md:col-span-6">
          <p className="max-w-md text-[18px] text-muted">Answer five quick questions and we&apos;ll work out every format you need, check your timeline and turn it into a brief you can send.</p>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <Link href={`${BASE}/brief`} className="group flex items-center gap-3 rounded-full bg-accent px-8 py-5 text-[17px] font-medium text-accent-ink">
                Build your brief <span aria-hidden className="transition-transform duration-500 ease-expo group-hover:translate-x-1.5 group-hover:-rotate-45">→</span>
              </Link>
            </Magnetic>
            <a href={VIMEO} rel="noopener" className="rounded-full border border-line px-8 py-5 text-[17px]">Watch on Vimeo ↗</a>
          </div>
        </div>
      </div>
    </section>
  );
}
