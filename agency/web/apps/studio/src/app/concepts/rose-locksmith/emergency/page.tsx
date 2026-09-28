import type { Metadata } from 'next';
import { CoverageCheck } from '../_components/coverage';
import { Lock } from '../_components/lock';
import { Faq, PageHead } from '../_components/page-head';
import { PHONE } from '../_components/data';

export const metadata: Metadata = { title: 'Locks & emergency', description: 'Emergency locksmith for lockouts and break-ins across Bethnal Green, Tower Hamlets and Hackney, plus uPVC door repair.' };

const STEPS = [
  ['Stay safe', 'If a child or someone vulnerable is shut inside, or you feel unsafe, call 999 first.'],
  ['Check the easy ways in', 'Try every door you can safely reach, and think about who else has a key.'],
  ['Call us', `Ring ${PHONE.emergency[0]} and tell us your postcode and what’s happened.`],
  ['Have ID ready', 'A good locksmith will ask for proof that you live there. Have something with your name and address to hand.'],
];

export default function Emergency() {
  return (
    <main>
      <PageHead eyebrow="Locks & emergency" title={<>Locked out? <span className="text-accent">Call now.</span></>} intro="Lockouts and break-ins across Bethnal Green, Tower Hamlets and Hackney, and uPVC doors that stick, drop or won’t lock.">
        <a href={`tel:${PHONE.emergency[1]}`} className="mt-10 inline-flex items-center gap-4 rounded-full bg-accent py-3 pr-8 pl-3 text-[20px] font-bold text-accent-ink">
          <span className="relative grid size-12 place-items-center rounded-full bg-fg text-bg">
            <span className="absolute inset-0 animate-ping rounded-full bg-fg/40" />☎
          </span>
          <span className="font-mono tabular-nums">{PHONE.emergency[0]}</span>
        </a>
      </PageHead>
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 md:grid-cols-2 md:px-8">
        <CoverageCheck />
        <div className="rounded-[2rem] bg-alt p-7 text-bg md:p-10">
          <p className="font-mono text-[12px] opacity-60">LOCKED OUT: WHAT TO DO</p>
          <ol className="mt-6 space-y-6">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[3rem_1fr] gap-3">
                <span className="font-display text-[40px] leading-none font-bold text-accent">{i + 1}</span>
                <div>
                  <p className="text-[20px] font-bold tracking-[-0.02em]">{t}</p>
                  <p className="mt-1 text-[15px] opacity-70">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section id="upvc" className="mx-auto grid max-w-[1600px] scroll-mt-32 gap-12 px-5 py-32 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <p className="font-mono text-[12px] text-muted">uPVC DOOR REPAIR</p>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.05em]">Doors that stick, drop or won&apos;t lock.</h2>
          <p className="mt-5 max-w-md text-[17px] text-muted">We repair uPVC doors, their mechanisms and multi-point locks. Tell us what it&apos;s doing and we&apos;ll tell you what it probably needs.</p>
          <a href={`tel:${PHONE.shop[1]}`} className="mt-8 inline-block rounded-full bg-fg px-7 py-4 font-medium text-bg">Call the shop, {PHONE.shop[0]}</a>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 md:col-span-7">
          {[
            ['It drags on the frame', 'Often dropped hinges, and usually adjustable.'],
            ['The handle won’t lift or is floppy', 'Often the gearbox inside a multi-point lock.'],
            ['The key won’t turn', 'Could be the cylinder, or the door pulling on the lock.'],
            ['It won’t lock at all', 'Worth sorting quickly. Call the emergency line if the house is insecure.'],
          ].map(([t, d]) => (
            <li key={t} className="rounded-3xl bg-card p-6 transition-transform duration-500 ease-expo hover:-translate-y-1">
              <p className="text-[19px] font-bold tracking-[-0.02em]">{t}</p>
              <p className="mt-2 text-[15px] text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>
      <Lock />
      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-32 md:grid-cols-12 md:px-8">
        <h2 className="font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.05em] md:col-span-4">Before you call.</h2>
        <div className="md:col-span-8">
          <Faq
            items={[
              ['Which areas do you cover?', 'We list Bethnal Green, Tower Hamlets and Hackney. Use the postcode check above, and if you’re just outside, call and ask.'],
              ['What should I tell you on the phone?', 'Your postcode, whether you’re locked out or it’s a break-in, and the type of door if you know it.'],
              ['Can you fix the door as well as open it?', 'For uPVC doors, mechanisms and multi-point locks, yes. That’s part of what we do in the shop every day.'],
            ]}
          />
        </div>
      </section>
    </main>
  );
}
