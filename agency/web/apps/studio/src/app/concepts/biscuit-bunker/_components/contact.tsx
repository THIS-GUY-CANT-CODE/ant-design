'use client';
import { Magnetic, Reveal } from '@sc/ui';
import { useState } from 'react';

const FORMATS = ['Commercial', 'Branded content', 'Corporate film', 'Animation', 'Podcast', 'Not sure yet'];
const BUDGETS = ['< £10k', '£10–25k', '£25–50k', '£50k+'];

function Chips({ options, value, onChange, label }: { options: string[]; value: string; onChange: (v: string) => void; label: string }) {
  return (
    <fieldset>
      <legend className="mb-3 font-mono text-[12px] text-muted">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button type="button" key={o} aria-pressed={value === o} onClick={() => onChange(o)} className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${value === o ? 'border-accent bg-accent text-accent-ink' : 'border-line hover:border-fg'}`}>
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Contact() {
  const [format, setFormat] = useState('Commercial');
  const [budget, setBudget] = useState('£10–25k');
  const [sent, setSent] = useState(false);
  const field = 'w-full border-b border-line bg-transparent py-4 text-[20px] outline-none transition-colors placeholder:text-muted focus:border-accent';
  return (
    <section id="contact" className="mx-auto max-w-[1600px] px-5 pb-40 md:px-8">
      <div className="grid gap-16 border-t border-line pt-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal as="h2" className="font-display text-[clamp(3.4rem,8vw,8rem)] leading-[0.84] font-semibold tracking-[-0.065em]">
            Got a brief?
          </Reveal>
          <p className="mt-2 font-serif text-[clamp(2.4rem,5vw,4.6rem)] leading-none text-accent italic">Throw us a bone.</p>
          <div className="mt-12 space-y-2 text-[15px] text-muted">
            <p>Shoreditch, London EC2A 4NE</p>
            <p className="flex gap-4">
              <a className="text-fg hover:text-accent" href="https://vimeo.com/biscuitbunker" rel="noopener">Vimeo</a>
              <a className="text-fg hover:text-accent" href="https://uk.linkedin.com/company/biscuit-bunker" rel="noopener">LinkedIn</a>
              <a className="text-fg hover:text-accent" href="https://www.facebook.com/biscuitbunkeruk/" rel="noopener">Facebook</a>
            </p>
          </div>
        </div>
        <div className="md:col-span-7">
          {sent ? (
            <p className="font-display text-[40px] font-medium tracking-[-0.04em]">That&apos;s a wrap. <span className="text-muted">Concept demo, so nothing was sent.</span></p>
          ) : (
            <form
              className="space-y-10"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid gap-2 md:grid-cols-2 md:gap-8">
                <input className={field} placeholder="Your name" aria-label="Your name" required autoComplete="name" />
                <input className={field} placeholder="Company" aria-label="Company" />
                <input className={`${field} md:col-span-2`} type="email" placeholder="Email" aria-label="Email" required autoComplete="email" />
              </div>
              <Chips label="What are we making?" options={FORMATS} value={format} onChange={setFormat} />
              <Chips label="Budget" options={BUDGETS} value={budget} onChange={setBudget} />
              <textarea className={`${field} min-h-32 resize-y`} placeholder="Tell us about it" aria-label="Tell us about it" />
              <Magnetic>
                <button type="submit" className="flex items-center gap-3 rounded-full bg-accent px-8 py-5 text-[17px] font-medium text-accent-ink">
                  Send the brief <span aria-hidden>→</span>
                </button>
              </Magnetic>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
