'use client';
import { gsap, HoverLetters, Magnetic, Reveal, RollText, Scramble, Skew, SplitText, Spotlight, Stagger, Tilt, useGSAP } from '@sc/ui';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState } from 'react';

export function Mark({ className }: { className?: string }) {
  // the shopfront arch, with four spine points inside
  return (
    <svg viewBox="0 0 28 34" className={className} aria-hidden>
      <path d="M2 33V14a12 12 0 0 1 24 0v19" fill="none" stroke="currentColor" strokeWidth="2" />
      {[11, 16.5, 22, 27.5].map((y) => (
        <circle key={y} cx="14" cy={y} r="1.9" fill="currentColor" />
      ))}
    </svg>
  );
}

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto mt-3 flex h-14 max-w-[1560px] items-center justify-between rounded-full border border-line bg-bg/80 px-5 backdrop-blur-md md:mx-8 md:px-6" aria-label="Main">
        <a href="#top" className="flex items-center gap-2.5 text-[16px] font-medium">
          <Mark className="h-6 w-5" /> Walthamstow Osteopaths
        </a>
        <div className="hidden items-center gap-7 text-[14px] text-muted md:flex">
          <a href="#treatments" className="hover:text-fg"><RollText>Treatments</RollText></a>
          <a href="#first-visit" className="hover:text-fg"><RollText>First visit</RollText></a>
          <a href="#no72" className="hover:text-fg"><RollText>No.72</RollText></a>
          <a href="#team" className="hover:text-fg"><RollText>Osteopaths</RollText></a>
        </div>
        <a href="#book" className="rounded-full bg-accent px-4 py-2 text-[14px] text-accent-ink"><RollText>Book</RollText></a>
      </nav>
    </header>
  );
}

const TREATMENTS = [
  ['Structural osteopathy', 'A hands-on approach to how your muscles, joints and spine work together, using soft tissue work, mobilisation and manipulation.', 'Our speciality'],
  ['Cranial osteopathy', 'A gentle, subtle form of osteopathy. Both our founders have postgraduate training from the Sutherland Cranial College.'],
  ['Acupuncture', 'Fine needles placed at specific points, as a treatment on its own or alongside osteopathy.'],
  ['Sports massage', 'Deep, focused massage for people who train, run or just carry a lot of tension.'],
  ['Aromatherapy', 'Massage with essential oils, for a slower and more relaxing session.'],
  ['Nutritional therapy', 'Advice on diet and lifestyle, to go with the rest of your care.'],
] as const;

export function Treatments() {
  const [open, setOpen] = useState(0);
  return (
    <section id="treatments" className="mx-auto max-w-[1600px] px-5 py-32 md:px-8 md:py-44">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Reveal as="h2" className="font-display text-[clamp(3rem,6vw,5.6rem)] leading-[0.92] tracking-[-0.03em]">
            Osteopathy first, with the right <em>support</em> around it.
          </Reveal>
        </div>
        <Stagger as="ul" className="border-t border-line md:col-span-8">
          {TREATMENTS.map(([t, d, tag], i) => (
            <li key={t} className="border-b border-line">
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="group flex w-full items-baseline gap-6 py-7 text-left">
                <span className="w-8 shrink-0 font-mono text-[12px] text-muted">0{i + 1}</span>
                <span className="font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-none tracking-[-0.02em] transition-transform duration-500 ease-expo group-hover:translate-x-3">{t}</span>
                {tag && <span className="rounded-full bg-alt px-3 py-1 text-[12px]">{tag}</span>}
                <span className={`ml-auto grid size-10 shrink-0 place-items-center self-center rounded-full border border-line transition-transform duration-500 ${open === i ? 'rotate-45 bg-accent text-accent-ink' : ''}`} aria-hidden>+</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden pl-14 text-[18px] leading-relaxed text-muted">
                    <span className="block max-w-xl pb-8">{d}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const STEPS = [
  ['We listen', 'We ask about your symptoms, history, work and lifestyle.'],
  ['We examine', 'We look at how you move and gently assess the areas involved.'],
  ['We explain', 'We tell you what we think is going on and agree a plan together.'],
  ['We treat', 'Hands-on treatment usually starts in the same session, with advice to take home.'],
];

export function FirstVisit() {
  return (
    <section id="first-visit" className="bg-accent text-accent-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-32 md:px-8 md:py-40">
        <div className="mb-16 grid gap-8 md:grid-cols-12">
          <Reveal as="h2" className="font-display text-[clamp(3rem,6vw,5.6rem)] leading-[0.92] tracking-[-0.03em] md:col-span-7">
            Never seen an osteopath? Here&apos;s what happens.
          </Reveal>
          <p className="self-end text-[17px] leading-relaxed opacity-75 md:col-span-4 md:col-start-9">You don&apos;t need a GP referral. Wear something comfortable, and bring a list of any medication you take.</p>
        </div>
        <Stagger as="ol" className="grid gap-3 md:grid-cols-4">
          {STEPS.map(([t, d], i) => (
            <Tilt key={t} className="flex h-full min-h-64 flex-col justify-between rounded-[1.75rem] bg-white/[0.06] p-7 ring-1 ring-white/10">
              <span className="font-display text-[64px] leading-none italic opacity-50">{i + 1}</span>
              <div>
                <h3 className="font-display text-[34px] leading-none">{t}</h3>
                <p className="mt-3 text-[15px] leading-snug opacity-75">{d}</p>
              </div>
            </Tilt>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/** No.72's past lives light up one line at a time as you scroll past. */
export function No72() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.utils.toArray<HTMLElement>('[data-era]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0.15 }, { opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 45%', scrub: true } });
      });
      const s = SplitText.create('[data-years]', { type: 'words' });
      gsap.from(s.words, { yPercent: 100, opacity: 0, stagger: 0.05, scrollTrigger: { trigger: '[data-years]', start: 'top 85%', once: true } });
    },
    { scope: ref },
  );
  const eras = ['A brewery.', 'A music shop.', 'A hairdresser.'];
  return (
    <section id="no72" ref={ref} className="mx-auto max-w-[1600px] px-5 py-32 md:px-8 md:py-44">
      <p className="mb-10 text-[14px] text-muted"><Scramble>No.72 St Mary Road</Scramble></p>
      <Skew className="font-display text-[clamp(3.4rem,9vw,9rem)] leading-[0.95] tracking-[-0.035em]">
        {eras.map((e) => (
          <p key={e} data-era>{e}</p>
        ))}
        <p data-era className="italic text-accent">Then us.</p>
      </Skew>
      <p className="mt-12 max-w-xl text-[18px] leading-relaxed text-muted">
        Older E17 residents might remember No.72 as a brewery, a music shop and, most recently, a hairdresser. By the time we found it, it had fallen into disrepair. We restored the shopfront and the original quarry tiling.
      </p>
      <dl data-years className="mt-20 grid gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line md:grid-cols-4">
        {[
          ['2000', 'Iain and Stephen start out in a dental centre on Walthamstow High Street.'],
          ['2002', 'With a growing patient list, we take on a run-down Victorian shop on St Mary Road.'],
          ['2003', 'In August we open, with the restored shopfront, original quarry tiles and two rooms.'],
          ['2010', 'A second phase of building work adds a third room and space for more therapies.'],
        ].map(([y, d]) => (
          <div key={y} className="group bg-bg p-7 transition-colors duration-500 hover:bg-card">
            <dt className="font-display text-[56px] leading-none transition-[color,translate] duration-500 group-hover:-translate-y-1 group-hover:text-accent">{y}</dt>
            <dd className="mt-4 text-[15px] leading-snug text-muted">{d}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function Team() {
  const people = ['Iain Chapman', 'Stephen Moore'];
  return (
    <section id="team" className="mx-auto max-w-[1600px] px-5 pb-32 md:px-8">
      <Reveal as="h2" className="mb-14 font-display text-[clamp(3rem,6vw,5.6rem)] leading-[0.92] tracking-[-0.03em]">
        The same two founders, <em>since 2000.</em>
      </Reveal>
      <Stagger className="grid gap-4 md:grid-cols-2">
        {people.map((p) => (
          <Tilt key={p} max={4} className="grid grid-cols-[140px_1fr] gap-6 rounded-[1.75rem] bg-card p-6 md:grid-cols-[180px_1fr]">
            <div className="grid aspect-[3/4] place-items-center rounded-t-full rounded-b-2xl bg-gradient-to-b from-alt to-[#E3B49A] text-[12px] text-fg/60">Photo</div>
            <div className="self-end">
              <h3 className="font-display text-[40px] leading-none">{p}</h3>
              <p className="mt-2 text-[13px] text-muted">Osteopath · Co-founder</p>
              <p className="mt-4 text-[15px] leading-snug text-muted">Graduated from Andrew Still College of Osteopathy and Kingston University, with postgraduate training in cranial osteopathy at the Sutherland Cranial College.</p>
            </div>
          </Tilt>
        ))}
      </Stagger>
    </section>
  );
}

const FAQ = [
  ['Do I need a referral from my GP?', 'No. You can book directly with us.'],
  ['How long is an appointment and how much does it cost?', '[Add appointment lengths and prices for first and follow-up visits.]'],
  ['Can I claim on my health insurance?', '[Confirm which insurers the practice is registered with.]'],
  ['Where exactly are you?', "72 St Mary Road, E17 9RE, on the edge of Walthamstow Village. It's a short walk from Walthamstow Central (Victoria line and Overground)."],
];

export function Faq() {
  return (
    <section className="mx-auto grid max-w-[1600px] gap-12 px-5 pb-32 md:grid-cols-12 md:px-8">
      <h2 className="font-display text-[clamp(3rem,5vw,4.6rem)] leading-none tracking-[-0.03em] md:col-span-4">Good to know.</h2>
      <Stagger className="md:col-span-8">
        {FAQ.map(([q, a]) => (
          <details key={q} className="group border-b border-line py-6 transition-colors hover:border-fg/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[22px]">
              {q}
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-[rotate,background-color,color] duration-500 group-open:rotate-45 group-open:bg-accent group-open:text-accent-ink group-hover:border-fg/40" aria-hidden>+</span>
            </summary>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">{a}</p>
          </details>
        ))}
      </Stagger>
    </section>
  );
}

export function Book() {
  return (
    <section id="book" className="px-3 pb-3 md:px-4 md:pb-4">
      <div className="relative overflow-hidden rounded-[2.25rem] bg-alt px-6 py-28 text-center md:py-40">
        <span aria-hidden className="absolute top-1/2 left-1/2 size-[46vmin] animate-[breathe_10s_ease-in-out_infinite] rounded-full border border-fg/15" />
        <span aria-hidden className="absolute top-1/2 left-1/2 size-[70vmin] animate-[breathe_14s_ease-in-out_infinite_reverse] rounded-full border border-fg/10" />
        <p className="relative text-[14px] text-muted">Book an appointment</p>
        <Reveal as="h2" className="relative mt-6 font-display text-[clamp(3.4rem,9vw,8.4rem)] leading-[0.9] tracking-[-0.035em]">
          Let&apos;s find you <em>a time.</em>
        </Reveal>
        <div className="relative mt-12 flex flex-wrap justify-center gap-3">
          <Magnetic>
            <a href="tel:+442085217888" className="block rounded-full bg-accent px-8 py-4 text-[16px] text-accent-ink"><RollText>Call 020 8521 7888</RollText></a>
          </Magnetic>
          <Magnetic>
            <a href="mailto:walthamstowosteopaths@gmail.com" className="block rounded-full border border-fg/25 bg-bg/40 px-8 py-4 text-[16px]"><RollText>Email us</RollText></a>
          </Magnetic>
        </div>
        <p className="relative mt-10 text-[15px] text-muted">No.72 St Mary Road, Walthamstow, London E17 9RE · <a className="underline" href="https://www.google.com/maps/search/?api=1&query=72+St+Mary+Road+London+E17+9RE" rel="noopener">Directions</a></p>
      </div>
      <Spotlight className="overflow-hidden rounded-[2.25rem] px-4 pt-16 pb-4 md:px-8">
        <p aria-hidden className="font-display text-[9.5vw] leading-[0.85] tracking-[-0.05em] whitespace-nowrap">
          <HoverLetters>No.72</HoverLetters> <em className="text-accent"><HoverLetters className="[--accent:var(--fg)]">Walthamstow</HoverLetters></em>
        </p>
      </Spotlight>
      <footer className="flex flex-wrap justify-between gap-4 px-4 pt-6 pb-20 text-[13px] text-muted md:pb-4">
        <span>© {new Date().getFullYear()} Walthamstow Osteopaths · 72 St Mary Road, E17 9RE</span>
        <span>Concept by Second Coat</span>
      </footer>
    </section>
  );
}
