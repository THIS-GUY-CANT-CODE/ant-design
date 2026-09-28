import type { Metadata } from 'next';
import { Lock } from '../_components/lock';
import { Faq, PageHead } from '../_components/page-head';
import { RemoteCheck } from '../_components/remote-check';
import { KeyCutter } from '../_components/services';
import { HOURS_TEXT, PHONE } from '../_components/data';
import { P } from '../_components/media';

export const metadata: Metadata = { title: 'Keys & remotes', description: 'Key cutting, including difficult and worn keys, and 433MHz garage and gate remotes copied while you wait. 149 Bethnal Green Road.' };

export default function Keys() {
  return (
    <main>
      <PageHead media={P.keysLaid} eyebrow="Keys & remotes" title={<>Keys other shops <span className="text-accent">send away.</span></>} intro="Difficult, worn and unusual keys are what we’re known for, and we copy garage and gate remotes while you wait." />
      <section className="mx-auto grid max-w-[1600px] gap-3 px-5 md:grid-cols-2 md:px-8">
        <div className="flex flex-col rounded-[2rem] bg-alt p-7 text-bg md:p-10">
          <p className="font-mono text-[12px] opacity-60">JUST FOR FUN</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] font-bold tracking-[-0.045em]">Every name cuts a different key.</h2>
          <p className="mt-4 max-w-md opacity-70">Type anything and watch the blade re-cut. A real copy is traced from your original on the machine, cut for cut.</p>
          <div className="mt-10 flex flex-1 flex-col"><KeyCutter /></div>
        </div>
        <div id="remotes" className="scroll-mt-32">
          <RemoteCheck />
          <div className="mt-3 rounded-[2rem] bg-card p-7 md:p-10">
            <h2 className="text-[26px] font-bold tracking-[-0.03em]">What to bring</h2>
            <ul className="mt-5 space-y-3 text-[17px]">
              {['The key or remote you want copied (the original works best)', 'For a remote, the one that currently opens the door or gate', 'Nothing else. No appointment needed during opening hours'].map((t) => (
                <li key={t} className="flex gap-3"><span className="mt-2 size-2 shrink-0 rounded-full bg-accent" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <div className="pt-32"><Lock /></div>
      <section className="mx-auto grid max-w-[1600px] gap-12 px-5 py-32 md:grid-cols-12 md:px-8">
        <h2 className="font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-bold tracking-[-0.05em] md:col-span-4">Keys, answered.</h2>
        <div className="md:col-span-8">
          <Faq
            items={[
              ['Can you cut a key that’s worn, bent or unusual?', 'That’s what we’re known for. Bring it in and we’ll tell you straight away whether we can copy it.'],
              ['Do you copy garage and parking remotes?', 'Yes. 433MHz remotes and fobs are copied while you wait. Use the check above if you’re not sure what yours is.'],
              ['Do I need to book?', 'No. Come in during opening hours.'],
              ['When are you open?', HOURS_TEXT.map(([, d, h]) => `${d} ${h}`).join(', ') + '.'],
              ['I’m locked out right now.', `Call the emergency line on ${PHONE.emergency[0]}.`],
            ]}
          />
        </div>
      </section>
    </main>
  );
}
