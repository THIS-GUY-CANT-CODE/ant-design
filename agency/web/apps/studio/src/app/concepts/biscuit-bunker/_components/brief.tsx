'use client';
import { CopyButton, toast, useStored } from '@sc/ui';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { CONTACT_URL } from './site';

const FORMATS = ['Commercial', 'Branded content', 'Corporate film', 'Animation', 'Podcast', 'Not sure yet'];
const GOALS = ['Launch something new', 'Build awareness', 'Explain a product', 'Recruit or train', 'Cover an event', 'Something else'];
const PLATFORMS: [string, string[]][] = [
  ['TV', ['16:9 broadcast master (Clearcast)']],
  ['YouTube', ['16:9 main edit', '9:16 Shorts cutdown']],
  ['Instagram', ['9:16 Reels', '4:5 feed', '1:1 feed']],
  ['TikTok', ['9:16 vertical']],
  ['LinkedIn', ['16:9 or 1:1 with burned-in captions']],
  ['Website', ['16:9 hero loop (silent)', '16:9 full edit']],
  ['Events / screens', ['16:9 high-bitrate master']],
  ['Podcast feeds', ['Mastered audio', 'Video episode']],
];
const BUDGETS = ['Under £10k', '£10k to £25k', '£25k to £50k', '£50k+', 'Not sure yet'];

export type Brief = { format: string; goal: string; audience: string; platforms: string[]; budget: string; deadline: string; name: string; company: string; email: string; notes: string };
const EMPTY: Brief = { format: '', goal: '', audience: '', platforms: [], budget: '', deadline: '', name: '', company: '', email: '', notes: '' };

/** Every version the chosen platforms need, without duplicates. */
export const deliverablesFor = (platforms: string[]) => [...new Set(PLATFORMS.filter(([p]) => platforms.includes(p)).flatMap(([, d]) => d))];

/** Plain-English read on how much time there is before a deadline. */
export function timeline(deadline: string, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return null;
  const weeks = Math.floor((Date.parse(deadline) - Date.parse(today.toISOString().slice(0, 10))) / (7 * 86_400_000));
  if (weeks < 0) return { weeks, note: 'That date has passed.' };
  if (weeks < 3) return { weeks, note: 'Tight. Possible for simpler jobs, so tell us early.' };
  if (weeks < 8) return { weeks, note: 'Workable for most projects.' };
  return { weeks, note: 'Comfortable. Plenty of room to get it right.' };
}

export function briefText(b: Brief) {
  const t = timeline(b.deadline);
  return [
    `PROJECT BRIEF · ${b.company || b.name}`,
    '',
    `What: ${b.format}`,
    `Goal: ${b.goal}`,
    `Audience: ${b.audience || 'Not specified'}`,
    `Where it runs: ${b.platforms.join(', ') || 'Not decided'}`,
    ...(b.platforms.length ? ['Versions needed:', ...deliverablesFor(b.platforms).map((d) => `  • ${d}`)] : []),
    `Budget: ${b.budget}`,
    `Deadline: ${b.deadline || 'Flexible'}${t && t.weeks >= 0 ? ` (${t.weeks} weeks away)` : ''}`,
    '',
    `Contact: ${b.name}${b.company ? `, ${b.company}` : ''}, ${b.email}`,
    ...(b.notes ? ['', b.notes] : []),
  ].join('\n');
}

const STEPS = ['What', 'Why', 'Where', 'When & how much', 'You'] as const;
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

function Chips({ options, value, onChange, multi }: { options: string[]; value: string | string[]; onChange: (v: string) => void; multi?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = multi ? (value as string[]).includes(o) : value === o;
        return (
          <button type="button" key={o} aria-pressed={on} onClick={() => onChange(o)} className={`rounded-full border px-5 py-3 text-[15px] transition-colors ${on ? 'border-accent bg-accent text-accent-ink' : 'border-line hover:border-fg'}`}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function BriefBuilder() {
  const [b, setB] = useStored<Brief>('bb-brief', EMPTY);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const set = <K extends keyof Brief>(k: K, v: Brief[K]) => setB((prev) => ({ ...prev, [k]: v }));
  const valid = [!!b.format, !!b.goal, true, !!b.budget, b.name.trim().length > 1 && emailOk(b.email)];
  const t = timeline(b.deadline);
  const text = useMemo(() => briefText(b), [b]);
  const field = 'mt-1 w-full border-b border-line bg-transparent py-3 text-[20px] outline-none placeholder:text-muted focus:border-accent';

  if (done)
    return (
      <div className="grid gap-8 lg:grid-cols-12" aria-live="polite">
        <div className="lg:col-span-5">
          <p className="font-mono text-[12px] text-accent">BRIEF READY</p>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.9] font-semibold tracking-[-0.06em]">That&apos;s a wrap.</h2>
          <p className="mt-4 max-w-sm text-[16px] text-muted">Copy it or download it, then send it to the studio through their contact page. It stays saved in this browser until you clear it.</p>
          <div className="mt-8 flex flex-wrap gap-2">
            <CopyButton value={text} label="Brief copied" className="rounded-full bg-accent px-6 py-3.5 text-[15px] font-medium text-accent-ink">Copy brief</CopyButton>
            <button
              onClick={() => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
                a.download = `brief-${(b.company || b.name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
                a.click();
                toast.success('Brief downloaded');
              }}
              className="rounded-full border border-line px-6 py-3.5 text-[15px]"
            >
              Download .txt
            </button>
            <button onClick={() => window.print()} className="rounded-full border border-line px-6 py-3.5 text-[15px]">Print / PDF</button>
            <a href={CONTACT_URL} rel="noopener" className="rounded-full border border-line px-6 py-3.5 text-[15px]">Send via biscuitbunker.com ↗</a>
          </div>
          <div className="mt-6 flex gap-4 text-[14px] text-muted">
            <button onClick={() => (setDone(false), setStep(0))} className="underline">Edit</button>
            <button onClick={() => (setB(EMPTY), setDone(false), setStep(0))} className="underline">Start a new brief</button>
          </div>
        </div>
        <pre className="rounded-3xl border border-line bg-card p-7 font-mono text-[13px] leading-relaxed whitespace-pre-wrap lg:col-span-7">{text}</pre>
      </div>
    );

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <ol className="flex gap-2 lg:col-span-3 lg:flex-col" aria-label="Steps">
        {STEPS.map((s, i) => (
          <li key={s} className="min-w-0 flex-1 lg:flex-none">
            <button onClick={() => i <= step && setStep(i)} disabled={i > step} aria-current={i === step ? 'step' : undefined} className="flex w-full items-center gap-3 text-left disabled:opacity-40">
              <span className={`grid size-8 shrink-0 place-items-center rounded-full font-mono text-[12px] transition-colors ${i < step ? 'bg-accent text-accent-ink' : i === step ? 'bg-fg text-bg' : 'border border-line'}`}>{i < step ? '✓' : i + 1}</span>
              <span className="hidden truncate text-[15px] sm:inline">{s}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="lg:col-span-9">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            {step === 0 && (
              <fieldset>
                <legend className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-none font-semibold tracking-[-0.05em]">What are we making?</legend>
                <div className="mt-8"><Chips options={FORMATS} value={b.format} onChange={(v) => set('format', v)} /></div>
              </fieldset>
            )}
            {step === 1 && (
              <fieldset>
                <legend className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-none font-semibold tracking-[-0.05em]">What should it do?</legend>
                <div className="mt-8"><Chips options={GOALS} value={b.goal} onChange={(v) => set('goal', v)} /></div>
                <label className="mt-8 block text-[13px] text-muted">
                  Who is it for? (optional)
                  <input value={b.audience} onChange={(e) => set('audience', e.target.value)} placeholder="e.g. first-time buyers in their thirties" className={field} />
                </label>
              </fieldset>
            )}
            {step === 2 && (
              <fieldset>
                <legend className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-none font-semibold tracking-[-0.05em]">Where will it run?</legend>
                <div className="mt-8"><Chips multi options={PLATFORMS.map(([p]) => p)} value={b.platforms} onChange={(v) => set('platforms', b.platforms.includes(v) ? b.platforms.filter((x) => x !== v) : [...b.platforms, v])} /></div>
                <div className="mt-8 rounded-3xl bg-card p-6" aria-live="polite">
                  <p className="font-mono text-[12px] text-muted">VERSIONS YOU&apos;LL NEED</p>
                  {b.platforms.length ? (
                    <ul className="mt-3 grid gap-1.5 text-[16px] sm:grid-cols-2">
                      {deliverablesFor(b.platforms).map((d) => (
                        <li key={d} className="flex gap-2"><span className="text-accent">▸</span>{d}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-[15px] text-muted">Pick where it will run and we&apos;ll list every format to plan for at the shoot.</p>
                  )}
                </div>
              </fieldset>
            )}
            {step === 3 && (
              <fieldset>
                <legend className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-none font-semibold tracking-[-0.05em]">Budget and timing</legend>
                <p className="mt-8 font-mono text-[12px] text-muted">BUDGET</p>
                <div className="mt-3"><Chips options={BUDGETS} value={b.budget} onChange={(v) => set('budget', v)} /></div>
                <label className="mt-8 block max-w-xs font-mono text-[12px] text-muted">
                  DEADLINE (OPTIONAL)
                  <input type="date" value={b.deadline} onChange={(e) => set('deadline', e.target.value)} className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 font-sans text-[17px] text-fg outline-none [color-scheme:dark] focus:border-accent" />
                </label>
                {t && (
                  <p className="mt-3 text-[15px]" aria-live="polite">
                    {t.weeks >= 0 && <b className="text-accent">{t.weeks} week{t.weeks === 1 ? '' : 's'} away. </b>}
                    {t.note}
                  </p>
                )}
              </fieldset>
            )}
            {step === 4 && (
              <fieldset>
                <legend className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-none font-semibold tracking-[-0.05em]">And you are?</legend>
                <div className="mt-6 grid gap-2 md:grid-cols-2 md:gap-8">
                  <label className="block text-[13px] text-muted">Name<input value={b.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" className={field} /></label>
                  <label className="block text-[13px] text-muted">Company<input value={b.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" className={field} /></label>
                  <label className="block text-[13px] text-muted md:col-span-2">
                    Email
                    <input value={b.email} onChange={(e) => set('email', e.target.value)} type="email" autoComplete="email" aria-invalid={!!b.email && !emailOk(b.email)} className={field} />
                    {b.email && !emailOk(b.email) && <span className="mt-1 block text-accent">That email doesn&apos;t look right.</span>}
                  </label>
                  <label className="block text-[13px] text-muted md:col-span-2">Anything else? (optional)<textarea value={b.notes} onChange={(e) => set('notes', e.target.value)} rows={3} className={`${field} resize-y`} /></label>
                </div>
              </fieldset>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-6">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="rounded-full px-5 py-3 text-[15px] text-muted disabled:opacity-0">← Back</button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => valid[step] && setStep(step + 1)} disabled={!valid[step]} className="rounded-full bg-accent px-8 py-4 text-[16px] font-medium text-accent-ink disabled:opacity-40">Next →</button>
          ) : (
            <button onClick={() => valid[4] && setDone(true)} disabled={!valid[4]} className="rounded-full bg-accent px-8 py-4 text-[16px] font-medium text-accent-ink disabled:opacity-40">Build my brief</button>
          )}
        </div>
      </div>
    </div>
  );
}
