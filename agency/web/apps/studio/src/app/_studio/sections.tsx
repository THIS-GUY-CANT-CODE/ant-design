import { HoverLetters, Marquee, Reveal, RollText, Stagger, Tilt } from '@sc/ui';
import Link from 'next/link';
import { BRANDS, ORDER } from '@/brands';
import { gbp, PIPELINE, STUDIO } from '@/content/studio';
import { ContactForm } from './contact-form';

export function Logo({ className }: { className?: string }) {
  // two strokes of paint, the second coat overlapping the first
  return (
    <svg viewBox="0 0 34 22" className={className} aria-hidden>
      <rect x="1" y="2" width="24" height="9" rx="4.5" fill="currentColor" />
      <rect x="9" y="11" width="24" height="9" rx="4.5" fill="#FF4F1F" />
    </svg>
  );
}

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-4">
      <nav className="mx-auto flex h-14 max-w-[1600px] items-center justify-between rounded-full bg-bg/80 pr-2 pl-5 ring-1 ring-line backdrop-blur-md" aria-label="Main">
        <Link href="/" className="group flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.03em]">
          <Logo className="h-4 w-6 transition-transform duration-500 ease-expo group-hover:-rotate-12" /> Second Coat
        </Link>
        <div className="hidden gap-7 text-[14px] text-muted md:flex">
          <a href="#work" className="hover:text-fg"><RollText>Work</RollText></a>
          <a href="#how" className="hover:text-fg"><RollText>How it works</RollText></a>
          <a href="#reach" className="hover:text-fg"><RollText>Where we work</RollText></a>
          <a href="#pricing" className="hover:text-fg"><RollText>Pricing</RollText></a>
          <a href="#faq" className="hover:text-fg"><RollText>FAQ</RollText></a>
        </div>
        <a href="#contact" className="rounded-full bg-fg px-5 py-2.5 text-[14px] font-medium text-bg"><RollText>Get a free redesign</RollText></a>
      </nav>
    </header>
  );
}

export function Names() {
  return (
    <Marquee className="border-y border-line py-6" speed={26}>
      {ORDER.map((s) => (
        <span key={s} className="flex items-center gap-10 pr-10 text-[clamp(1.4rem,2.6vw,2.2rem)] font-semibold tracking-[-0.04em] transition-colors hover:text-accent">
          {BRANDS[s].name}
          <span className="size-2.5 rounded-full bg-accent" />
        </span>
      ))}
    </Marquee>
  );
}

const STEPS = [
  ['We find your story', 'Your history, your street, your reviews. What makes you the only one of you, wherever you are.'],
  ['We rebrand you', 'A modern identity: name treatment, colour, type and a signature idea only you could own.'],
  ['We build it', 'A fast, mobile-first website on a modern stack, with your real details.'],
  ['You decide', 'We send a private link. Love it and we put it live within a week. If not, you owe nothing.'],
];

export function How() {
  return (
    <section id="how" className="mx-auto max-w-[1600px] px-5 py-32 md:px-8">
      <Reveal as="h2" className="mb-14 max-w-[12ch] font-display text-[clamp(2.8rem,6.5vw,6.6rem)] leading-[0.88] font-semibold tracking-[-0.055em]">
        See it first. <span className="font-serif font-normal italic">Pay after.</span>
      </Reveal>
      <Stagger as="ol" className="grid gap-3 md:grid-cols-4">
        {STEPS.map(([t, d], i) => (
          <Tilt key={t} className="flex h-full min-h-72 flex-col justify-between rounded-[1.75rem] bg-card p-7">
            <span className="font-serif text-[64px] leading-none text-accent italic transition-transform duration-700 ease-expo group-hover/tilt:-rotate-12 group-hover/tilt:scale-125">{i + 1}</span>
            <div>
              <h3 className="text-[24px] font-semibold tracking-[-0.03em]">{t}</h3>
              <p className="mt-2 text-[15px] leading-snug text-muted">{d}</p>
            </div>
          </Tilt>
        ))}
      </Stagger>
    </section>
  );
}

export function Pricing() {
  const { refresh, rebrand, care } = STUDIO.prices;
  const tiers = [
    { name: 'Refresh', price: gbp(refresh), per: 'one-off', items: ['The site we built for you, on your domain', 'Contact, booking and click-to-call', 'Google-ready: schema and SEO basics', 'One round of edits'] },
    { name: 'Rebrand', price: gbp(rebrand), per: 'one-off', pop: true, items: ['Everything in Refresh', 'The full identity: mark, colour, type, voice', 'Up to five pages', 'Social templates and signage artwork', 'Two rounds of edits'] },
    { name: 'Care', price: gbp(care), per: 'a month', items: ['Hosting and SSL', 'Monthly content updates', 'Uptime monitoring', 'Quarterly Google report', 'Cancel anytime'] },
  ];
  return (
    <section id="pricing" className="bg-alt text-bg">
      <div className="mx-auto max-w-[1600px] px-5 py-32 md:px-8">
        <Reveal as="h2" className="mb-14 max-w-[14ch] font-display text-[clamp(2.8rem,6.5vw,6.6rem)] leading-[0.88] font-semibold tracking-[-0.055em]">
          Simple, fixed prices.
        </Reveal>
        <Stagger className="grid gap-3 md:grid-cols-3">
          {tiers.map((t) => (
            <Tilt key={t.name} max={5} className={`flex h-full flex-col gap-8 rounded-[1.75rem] p-8 ${t.pop ? 'bg-accent text-accent-ink' : 'bg-white/[0.06] ring-1 ring-white/10'}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-[20px] font-semibold">{t.name}</h3>
                {t.pop && <span className="rounded-full bg-fg px-3 py-1 text-[12px] text-bg">Most chosen</span>}
              </div>
              <p className="font-display text-[72px] leading-none font-semibold tracking-[-0.05em]">
                {t.price} <span className="text-[16px] font-normal tracking-normal opacity-60">{t.per}</span>
              </p>
              <ul className="space-y-2 text-[15px]">
                {t.items.map((it) => (
                  <li key={it} className="flex gap-3 transition-transform duration-500 ease-expo hover:translate-x-1"><span aria-hidden>+</span>{it}</li>
                ))}
              </ul>
            </Tilt>
          ))}
        </Stagger>
        <p className="mt-8 text-[14px] opacity-60">Fixed prices in pounds, wherever you are. Outside the UK? We&apos;ll quote in your currency.</p>
      </div>
    </section>
  );
}

export function Pipeline() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-32 md:px-8">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 className="font-display text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[0.9] font-semibold tracking-[-0.05em]">Next on the list.</h2>
          <p className="mt-5 max-w-xs text-[15px] text-muted">Twelve more on our home patch in East London, scouted and audited. Further afield? Get in touch and we&apos;ll add you to the list.</p>
        </div>
        <Stagger as="ul" gap={0.035} className="grid border-t border-line md:col-span-8 md:grid-cols-2 md:gap-x-10">
          {PIPELINE.map(([n, ind, area]) => (
            <li key={n} className="group flex items-baseline justify-between gap-4 border-b border-line py-4 transition-colors hover:border-fg">
              <span className="text-[18px] font-medium tracking-[-0.02em] transition-[translate,color] duration-500 ease-expo group-hover:translate-x-2 group-hover:text-accent">{n}</span>
              <span className="text-right text-[13px] text-muted">{ind} · {area}</span>
            </li>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const FAQ = [
  ['Why build it before I’ve paid?', 'Because showing beats telling. Most small businesses have been burned by an agency that took a deposit and delivered something generic. We would rather do the work and let it speak.'],
  ['What if I don’t want it?', 'Then you don’t pay, and we take the preview down. No hard feelings and no follow-up spam.'],
  ['Do I own it?', 'Yes. Once it’s paid for, the site, the code and the brand files are yours.'],
  ['What do I need to do?', 'Tell us what’s wrong with the draft. We handle the domain, the hosting and the tech.'],
  ['Do you only work in East London?', 'No. East London is home, and it’s where we started: every concept on this page is one of our neighbours. We work with independent businesses all over the UK and further afield too. If you’re nearby we’ll pop in and take photos. If you’re not, we do it over video and your phone camera, and it works just as well.'],
  ['I’m outside the UK. Can you still help?', 'Yes. We work across time zones, write in plain English, and reply within one working day. Prices are fixed in pounds, and we can quote in your currency.'],
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto grid max-w-[1600px] gap-12 px-5 pb-32 md:grid-cols-12 md:px-8">
      <h2 className="font-display text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[0.9] font-semibold tracking-[-0.05em] md:col-span-4">Fair questions.</h2>
      <Stagger className="md:col-span-8">
        {FAQ.map(([q, a], i) => (
          <details key={q} open={i === 0} className="group border-b border-line py-6 transition-colors hover:border-fg/40">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[22px] font-medium tracking-[-0.02em]">
              {q}
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-accent transition-[rotate,background-color,color,border-color] duration-500 ease-expo group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-accent-ink" aria-hidden>+</span>
            </summary>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">{a}</p>
          </details>
        ))}
      </Stagger>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="px-3 md:px-4">
      <div className="mx-auto grid max-w-[1600px] gap-12 rounded-[2.25rem] bg-accent p-8 text-accent-ink md:grid-cols-12 md:p-16">
        <div className="md:col-span-7">
          <Reveal as="h2" className="font-display text-[clamp(3rem,7vw,7rem)] leading-[0.86] font-semibold tracking-[-0.06em]">
            Want a <span className="font-serif font-normal italic">second coat?</span>
          </Reveal>
          <p className="mt-6 max-w-md text-[17px] leading-snug opacity-80">Wherever your business is, send us its name. We&apos;ll come back with ideas, and then with the finished thing.</p>
        </div>
        <div className="md:col-span-5">
          <ContactForm email={STUDIO.email} />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden px-5 pt-20 md:px-8">
      <div className="mx-auto max-w-[1600px]">
        <p className="font-display text-[15.6vw] leading-[0.8] font-semibold tracking-[-0.075em] whitespace-nowrap">
          <HoverLetters>Second</HoverLetters> <span className="font-serif font-normal tracking-[-0.03em] text-accent italic"><HoverLetters className="[--accent:var(--fg)]">Coat</HoverLetters></span>
        </p>
        <div className="grid gap-4 border-t border-line py-8 text-[13px] text-muted md:grid-cols-12">
          <span className="md:col-span-3">© {new Date().getFullYear()} Second Coat · Made in East London, working UK-wide and worldwide</span>
          <span className="md:col-span-9">
            The businesses shown are unsolicited redesign concepts made to show our work. They are not clients and have not endorsed us, and all names and trademarks belong to their owners. If you own one of these businesses and would like your concept taken down, email {STUDIO.email} and we will remove it.
          </span>
        </div>
      </div>
    </footer>
  );
}
