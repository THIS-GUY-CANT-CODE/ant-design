import type { Metadata } from 'next';
import { BiscuitBunkerMark, ClaptonMark, GreenPapayaMark, MeadeMark, No72Mark, RoseMark, SecondCoatMark } from '@/brands/marks';
import { BB, CB, GP, RL, SC, WJ, WO } from './candidates';

export const metadata: Metadata = { title: 'Marks', robots: { index: false, follow: false } };

const FINAL: { name: string; M: React.ComponentType<Record<string, string | undefined>>; bg: string; dark: string; why: string; onDark?: Record<string, string> }[] = [
  { name: 'Second Coat', M: SecondCoatMark, onDark: { first: '#F3F2EE', overlap: '#FFB199' }, bg: '#F3F2EE', dark: '#0C0C0C', why: 'An S made of two roller passes. The first coat is ink, the second is fresh orange, and where the passes overlap the paint doubles up. That overlap is the second coat.' },
  { name: 'Biscuit Bunker', M: BiscuitBunkerMark, bg: '#0A0A0A', dark: '#1A1A1A', why: 'The studio is a converted dog biscuit factory, so the mark is a dog biscuit with a play button punched through it. Good content, fetched.' },
  { name: 'Green Papaya', M: GreenPapayaMark, bg: '#FFF4EA', dark: '#1A120D', why: 'Cut a papaya across and the seed cavity is a five-pointed star. Green skin, papaya flesh, and a star that belongs to both Vietnam and China.' },
  { name: 'Rose Locksmith & DIY', M: RoseMark, bg: '#F2F1EC', dark: '#0F0F0F', why: 'A keyhole with a rose in bloom inside it: the trade and the family name in one shape, readable down to a favicon.' },
  { name: 'Walthamstow Osteopaths', M: No72Mark, onDark: { arch: '#C9D4BC', stones: '#1F2A22' }, bg: '#EEEAE3', dark: '#1F2A22', why: 'Stones balanced in the arched doorway of No.72. Balance and alignment, set in the building everyone in the village knows.' },
  { name: 'W J Meade', M: MeadeMark, bg: '#F8F8F5', dark: '#0E0E10', why: 'A house that is also a key tag: the door at its base, the ring hole in its roof, hanging slightly askew like every agent’s keys.' },
  { name: 'Clapton Beauty Parlour', M: ClaptonMark, onDark: { top: '#F6EFEA' }, bg: '#F6EFEA', dark: '#141212', why: 'A high-contrast C with a ball terminal, sliced on the diagonal like the site’s headline. The cut, in one letter.' },
];

const SKETCHES = [
  ['Second Coat', SC], ['Biscuit Bunker', BB], ['Green Papaya', GP], ['Rose Locksmith', RL], ['Walthamstow Osteopaths', WO], ['W J Meade', WJ], ['Clapton Beauty Parlour', CB],
] as const;

export default function Marks() {
  return (
    <main className="min-h-screen bg-[#F3F2EE] px-5 py-16 font-sans text-[#0C0C0C] md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[14px] text-[#6B6A66]">Second Coat · Identity work</p>
        <h1 className="mt-4 max-w-[16ch] font-display text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] font-semibold tracking-[-0.055em]">Seven marks, each from something true.</h1>
        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {FINAL.map(({ name, M, bg, dark, why, onDark }) => (
            <article key={name} className="overflow-hidden rounded-[2rem] bg-white">
              <div className="grid grid-cols-[1.6fr_1fr]">
                <div className="grid aspect-[4/3] place-items-center" style={{ background: bg }}>
                  <M className="size-[46%]" title={`${name} mark`} />
                </div>
                <div className="grid grid-rows-2">
                  <div className="grid place-items-center" style={{ background: dark }}>
                    <M className="size-16" {...onDark} />
                  </div>
                  <div className="flex items-center justify-center gap-4 bg-white">
                    <M className="size-8" />
                    <M className="size-5" />
                    <M className="size-4" />
                  </div>
                </div>
              </div>
              <div className="p-7">
                <h2 className="text-[22px] font-semibold tracking-[-0.03em]">{name}</h2>
                <p className="mt-2 max-w-lg text-[15px] leading-snug text-[#6B6A66]">{why}</p>
              </div>
            </article>
          ))}
        </div>
        <h2 className="mt-28 text-[28px] font-semibold tracking-[-0.03em]">Sketches</h2>
        <p className="mt-2 max-w-xl text-[15px] text-[#6B6A66]">Three rounds per brand. Most didn&apos;t survive: bunkers that read as robots, a bone that read as the ⌘ key, a spiral that read as a lollipop.</p>
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {SKETCHES.map(([name, set]) => (
            <div key={name} className="rounded-3xl bg-white p-6">
              <p className="text-[14px] font-medium">{name}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {Object.entries(set).map(([k, S]) => (
                  <div key={k} className="grid size-24 place-items-center rounded-2xl bg-[#F3F2EE] p-3">
                    <S />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
