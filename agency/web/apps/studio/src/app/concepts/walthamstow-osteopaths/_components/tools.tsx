'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddToCalendar, CopyButton, londonDate, toast, useSearch, useStored } from '@sc/ui';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ADDRESS, AREAS, BASE, EMAIL, FAQS, PHONE, TREATMENTS } from './site';

/* ---------- Which treatment? ---------- */
export function suggest(areas: string[]) {
  const score = new Map<string, number>();
  // one point per matching concern; osteopathy (the practice's speciality) wins ties
  for (const t of TREATMENTS) for (const a of areas) if (t.areas.includes(a)) score.set(t.slug, (score.get(t.slug) ?? 0) + 1 + (t.tag ? 0.5 : 0));
  return TREATMENTS.filter((t) => score.has(t.slug)).sort((a, b) => score.get(b.slug)! - score.get(a.slug)! || TREATMENTS.indexOf(a) - TREATMENTS.indexOf(b));
}

export function TreatmentFinder() {
  const [picked, setPicked] = useState<string[]>([]);
  const list = suggest(picked);
  const toggle = (a: string) => setPicked((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));
  return (
    <div id="finder" className="scroll-mt-28 rounded-[2rem] bg-accent p-7 text-accent-ink md:p-10">
      <p className="text-[14px] opacity-70">Not sure where to start?</p>
      <h2 className="mt-3 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.92] tracking-[-0.03em]">Where do you feel it?</h2>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Choose what brings you in">
        {AREAS.map(([k, l]) => (
          <button key={k} aria-pressed={picked.includes(k)} onClick={() => toggle(k)} className={`rounded-full px-5 py-3 text-[15px] transition-colors ${picked.includes(k) ? 'bg-accent-ink text-accent' : 'bg-white/10 hover:bg-white/20'}`}>
            {l}
          </button>
        ))}
      </div>
      <div className="mt-8 min-h-28" aria-live="polite">
        {picked.length === 0 ? (
          <p className="text-[16px] opacity-70">Choose one or more and we&apos;ll show where people usually start.</p>
        ) : (
          <ol className="grid gap-2 md:grid-cols-2">
            {list.map((t, i) => (
              <li key={t.slug}>
                <Link href={`${BASE}/treatments/${t.slug}`} className="group flex items-center justify-between gap-4 rounded-2xl bg-white/10 p-5 transition-colors hover:bg-white/20">
                  <span>
                    <span className="text-[13px] opacity-60">{i === 0 ? 'Often the place to start' : 'Also worth a look'}</span>
                    <span className="block font-display text-[28px] leading-tight">{t.name}</span>
                  </span>
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
      <p className="mt-6 text-[13px] opacity-60">This isn&apos;t a diagnosis. At your first visit we&apos;ll talk it through and recommend what suits you. Sudden severe pain, numbness or weakness: call NHS 111 or 999.</p>
    </div>
  );
}

/* ---------- First visit checklist ---------- */
const CHECK = ['Comfortable clothes you can move in', 'A list of any medication you take', 'Notes on when it started and what makes it better or worse', 'Any scans, or letters from your GP or consultant', 'Questions you want to ask us'];
const NONE: number[] = [];
export function Checklist() {
  const [done, setDone] = useStored<number[]>('osteo-checklist', NONE);
  const pct = Math.round((done.length / CHECK.length) * 100);
  return (
    <div id="checklist" className="scroll-mt-28 rounded-[2rem] bg-card p-7 md:p-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-none tracking-[-0.03em]">Before you come</h2>
        <span className="font-mono text-[13px] text-muted tabular-nums">{done.length}/{CHECK.length}</span>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-accent transition-[width] duration-700 ease-expo" style={{ width: `${pct}%` }} /></div>
      <ul className="mt-6 space-y-1">
        {CHECK.map((c, i) => (
          <li key={c}>
            <label className="flex cursor-pointer items-center gap-4 rounded-2xl px-2 py-3 text-[17px] transition-colors hover:bg-bg">
              <input type="checkbox" checked={done.includes(i)} onChange={() => setDone(done.includes(i) ? done.filter((x) => x !== i) : [...done, i])} className="size-5 accent-[var(--accent)]" />
              <span className={done.includes(i) ? 'text-muted line-through' : ''}>{c}</span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[13px] text-muted">{pct === 100 ? 'All set. See you at No.72.' : 'Ticks are saved on this device.'}</p>
    </div>
  );
}

/* ---------- Already booked? Add it to your calendar ---------- */
export function AppointmentCalendar() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [what, setWhat] = useState(TREATMENTS[0]!.name);
  const start = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
    const [y, m, d] = date.split('-').map(Number) as [number, number, number];
    const [hh, mm] = time.split(':').map(Number) as [number, number];
    return londonDate(y, m, d, hh, mm);
  }, [date, time]);
  const field = 'mt-1 w-full rounded-2xl border border-line bg-bg px-4 py-3 text-[16px] outline-none focus:border-accent';
  return (
    <div id="calendar" className="scroll-mt-28 rounded-[2rem] bg-card p-7 md:p-10">
      <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-none tracking-[-0.03em]">Booked already?</h2>
      <p className="mt-3 text-[16px] text-muted">Put it in your calendar with the address and a reminder two hours before.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <label className="block text-[13px] text-muted">Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} /></label>
        <label className="block text-[13px] text-muted">Time<input type="time" step={900} value={time} onChange={(e) => setTime(e.target.value)} className={field} /></label>
        <label className="block text-[13px] text-muted">
          Treatment
          <select value={what} onChange={(e) => setWhat(e.target.value)} className={field}>
            {TREATMENTS.map((t) => (
              <option key={t.slug}>{t.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-5 min-h-12">
        {start ? (
          <AddToCalendar filename="no72-appointment.ics" event={{ title: `${what} at No.72`, start, end: new Date(start.getTime() + 60 * 60_000), location: `Walthamstow Osteopaths, ${ADDRESS}`, details: `Bring a list of any medication and wear something comfortable. To change it, call ${PHONE[0]}.` }} />
        ) : (
          <p className="text-[14px] text-muted">Pick the date of your appointment.</p>
        )}
      </div>
    </div>
  );
}

/* ---------- Ask us / request an appointment ---------- */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
const schema = z
  .object({
    name: z.string().trim().min(2, 'Tell us your name'),
    email: z.union([z.literal(''), z.string().trim().email('That email doesn’t look right')]),
    phone: z.union([z.literal(''), z.string().trim().regex(/^[+\d][\d\s()-]{8,}$/, 'That number doesn’t look right')]),
    treatment: z.string(),
    days: z.array(z.string()),
    message: z.string().trim().max(1200, 'Keep it under 1,200 characters'),
  })
  .refine((v) => v.email || v.phone, { message: 'Give us an email or a phone number so we can reply', path: ['email'] });
type Enquiry = z.infer<typeof schema>;

export function enquiryEmail(v: Enquiry) {
  const head = [`Name: ${v.name}`];
  if (v.email) head.push(`Email: ${v.email}`);
  if (v.phone) head.push(`Phone: ${v.phone}`);
  head.push(`Interested in: ${v.treatment}`);
  if (v.days.length) head.push(`Best days: ${v.days.join(', ')}`);
  return { subject: `Appointment enquiry: ${v.treatment}`, body: v.message ? `${head.join('\n')}\n\n${v.message}` : head.join('\n') };
}

export function EnquiryForm() {
  const [sent, setSent] = useState<{ subject: string; body: string } | null>(null);
  const { register, handleSubmit, formState } = useForm<Enquiry>({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', phone: '', treatment: 'Not sure yet', days: [], message: '' } });
  const e = formState.errors;
  const field = 'mt-1 w-full rounded-2xl border border-line bg-bg px-4 py-3 text-[16px] outline-none focus:border-accent aria-[invalid=true]:border-[#C2410C]';
  const submit = (v: Enquiry) => {
    const mail = enquiryEmail(v);
    setSent(mail);
    window.location.assign(`mailto:${EMAIL}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`);
    toast.success('Opening your email app…');
  };
  if (sent)
    return (
      <div id="ask" className="scroll-mt-28 rounded-[2rem] bg-card p-7 md:p-10" aria-live="polite">
        <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-none tracking-[-0.03em]">Nearly there.</h2>
        <p className="mt-4 max-w-md text-[16px] text-muted">Your email app should have opened with the message ready to send to {EMAIL}. If it didn&apos;t, copy it and send it yourself.</p>
        <pre className="mt-5 max-h-60 overflow-auto rounded-2xl bg-bg p-4 font-sans text-[14px] whitespace-pre-wrap">{sent.body}</pre>
        <div className="mt-5 flex flex-wrap gap-2">
          <CopyButton value={`${sent.subject}\n\n${sent.body}`} label="Message copied" className="rounded-full bg-accent px-5 py-3 text-[14px] text-accent-ink">Copy message</CopyButton>
          <button onClick={() => setSent(null)} className="rounded-full border border-line px-5 py-3 text-[14px]">Edit</button>
        </div>
      </div>
    );
  return (
    <form id="ask" onSubmit={handleSubmit(submit)} noValidate className="scroll-mt-28 rounded-[2rem] bg-card p-7 md:p-10">
      <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-none tracking-[-0.03em]">Ask us, or ask for a time</h2>
      <p className="mt-3 text-[16px] text-muted">This writes an email to the practice for you. Or call {PHONE[0]}.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="block text-[13px] text-muted sm:col-span-2">
          Your name
          <input {...register('name')} autoComplete="name" aria-invalid={!!e.name} className={field} />
          {e.name && <span className="mt-1 block text-[#C2410C]">{e.name.message}</span>}
        </label>
        <label className="block text-[13px] text-muted">
          Email
          <input {...register('email')} type="email" autoComplete="email" aria-invalid={!!e.email} className={field} />
          {e.email && <span className="mt-1 block text-[#C2410C]">{e.email.message}</span>}
        </label>
        <label className="block text-[13px] text-muted">
          Phone
          <input {...register('phone')} type="tel" autoComplete="tel" aria-invalid={!!e.phone} className={field} />
          {e.phone && <span className="mt-1 block text-[#C2410C]">{e.phone.message}</span>}
        </label>
        <label className="block text-[13px] text-muted sm:col-span-2">
          Interested in
          <select {...register('treatment')} className={field}>
            <option>Not sure yet</option>
            {TREATMENTS.map((t) => (
              <option key={t.slug}>{t.name}</option>
            ))}
          </select>
        </label>
        <fieldset className="sm:col-span-2">
          <legend className="text-[13px] text-muted">Best days for you</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <label key={d} className="cursor-pointer">
                <input type="checkbox" value={d} {...register('days')} className="peer sr-only" />
                <span className="block rounded-full border border-line px-4 py-2 text-[14px] transition-colors peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-ink peer-focus-visible:ring-2 peer-focus-visible:ring-accent">{d}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-[13px] text-muted sm:col-span-2">
          Anything we should know? (optional)
          <textarea {...register('message')} rows={4} aria-invalid={!!e.message} className={`${field} resize-y`} />
          {e.message && <span className="mt-1 block text-[#C2410C]">{e.message.message}</span>}
        </label>
      </div>
      <button type="submit" className="mt-6 w-full rounded-full bg-accent py-4 text-[16px] text-accent-ink">Write the email</button>
      <p className="mt-3 text-center text-[12px] text-muted">Please don&apos;t include detailed medical history by email. We&apos;ll ask at your visit.</p>
    </form>
  );
}

/* ---------- Searchable FAQ ---------- */
const FAQ_ITEMS = FAQS.map(([q, a]) => ({ q, a }));
const FAQ_KEYS = ['q', 'a'];
export function FaqSearch() {
  const [q, setQ] = useState('');
  const list = useSearch(FAQ_ITEMS, FAQ_KEYS, q);
  return (
    <div>
      <label htmlFor="faq-q" className="sr-only">Search questions</label>
      <input id="faq-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: referral, insurance, what to wear…" className="w-full rounded-2xl border border-line bg-card px-5 py-4 text-[18px] outline-none focus:border-accent" />
      <p className="mt-3 text-[13px] text-muted" aria-live="polite">{list.length} of {FAQ_ITEMS.length} questions</p>
      <div className="mt-4 border-t border-line">
        {list.map(({ q: question, a }) => (
          <details key={question} open={!!q} className="group border-b border-line py-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[21px]">
              {question}
              <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition-[rotate,background-color,color] duration-500 group-open:rotate-45 group-open:bg-accent group-open:text-accent-ink">+</span>
            </summary>
            <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-muted">{a}</p>
          </details>
        ))}
        {list.length === 0 && (
          <p className="py-8 text-[17px]">
            No answer here yet. <a className="underline" href={`tel:${PHONE[1]}`}>Call {PHONE[0]}</a> or <a className="underline" href={`mailto:${EMAIL}`}>email us</a>.
          </p>
        )}
      </div>
    </div>
  );
}
