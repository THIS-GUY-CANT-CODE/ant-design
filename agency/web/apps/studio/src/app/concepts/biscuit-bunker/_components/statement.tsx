'use client';
import { gsap, SplitText, useGSAP } from '@sc/ui';
import { useRef } from 'react';

/** Words light up as the paragraph scrolls through the viewport. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const s = SplitText.create(ref.current, { type: 'words', aria: 'auto' });
      gsap.fromTo(s.words, { opacity: 0.14 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    },
    { scope: ref },
  );
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-40 md:px-8 md:py-56">
      <p className="mb-10 font-mono text-[12px] text-muted">(About)</p>
      <p ref={ref} className="max-w-[20ch] font-display text-[clamp(2.2rem,5.4vw,5.6rem)] leading-[0.98] font-medium tracking-[-0.05em]">
        We make commercials, branded content, corporate film, animation and podcasts, for agencies and brands of every size. <span className="font-serif font-normal tracking-[-0.02em] text-accent italic">From a converted dog biscuit factory.</span>
      </p>
    </section>
  );
}
