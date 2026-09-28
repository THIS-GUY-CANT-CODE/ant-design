'use client';
import { useState } from 'react';
import { PHONE } from './data';

const STEPS = [
  { q: 'Can you find a frequency on the remote?', hint: 'Look on the back, under the battery cover, or in the manual.', yes: 1, no: 3 },
  { q: 'Does it say 433 or 433.92 MHz?', hint: 'Sometimes written as 433M or 433.92M.', yes: 2, no: 4 },
] as const;
const ENDS = {
  2: ['Bring it in.', 'We copy 433MHz remotes and fobs while you wait. Bring the one that works, and the new copy goes home with you.'],
  3: ['Bring it anyway.', 'Plenty of remotes don’t say. We’ll test it at the counter and tell you straight away whether we can copy it.'],
  4: ['Call before you come.', `Other frequencies vary. Call ${PHONE.shop[0]} with the make and model and we’ll tell you if we can help.`],
} as const;

/** A two-question check for whether a garage or gate remote can be copied. */
export function RemoteCheck() {
  const [at, setAt] = useState<number>(0);
  const end = at >= 2 ? ENDS[at as 2 | 3 | 4] : null;
  const step = at < 2 ? STEPS[at] : null;
  return (
    <div className="rounded-[2rem] bg-alt p-7 text-bg md:p-10" aria-live="polite">
      <p className="font-mono text-[12px] opacity-60">REMOTE CHECK · {end ? 'DONE' : `STEP ${at + 1} OF 2`}</p>
      {step && (
        <>
          <p className="mt-5 text-[28px] leading-tight font-bold tracking-[-0.03em]">{step.q}</p>
          <p className="mt-2 text-[15px] opacity-60">{step.hint}</p>
          <div className="mt-8 flex gap-2">
            <button onClick={() => setAt(step.yes)} className="rounded-full bg-accent px-7 py-3.5 font-medium text-accent-ink">Yes</button>
            <button onClick={() => setAt(step.no)} className="rounded-full border border-bg/30 px-7 py-3.5 font-medium">No</button>
          </div>
        </>
      )}
      {end && (
        <>
          <p className="mt-5 text-[34px] leading-tight font-bold tracking-[-0.03em] text-accent">{end[0]}</p>
          <p className="mt-3 max-w-md text-[16px] leading-relaxed opacity-80">{end[1]}</p>
          <button onClick={() => setAt(0)} className="mt-8 rounded-full border border-bg/30 px-6 py-3 text-[14px]">Start again</button>
        </>
      )}
    </div>
  );
}
