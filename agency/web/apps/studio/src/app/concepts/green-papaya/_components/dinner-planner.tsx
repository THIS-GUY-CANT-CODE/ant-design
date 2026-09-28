'use client';
import { AddToCalendar, londonDate, ShareButton } from '@sc/ui';
import { useState } from 'react';
import { HOURS } from './hours';
import { ADDRESS, PHONE } from './site';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const pad = (n: number) => String(n).padStart(2, '0');
const label = (m: number) => `${((Math.floor(m / 60) + 11) % 12) + 1}:${pad(m % 60)}${m >= 720 ? 'pm' : 'am'}`;

/** Start times every 30 minutes, from opening to an hour before closing, for a weekday. */
export function slotsFor(day: number) {
  return (HOURS[day] ?? []).flatMap(([a, b]) => {
    const out: number[] = [];
    for (let m = a; m <= b - 60; m += 30) out.push(m);
    return out;
  });
}

function todayIso() {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Pick a date and time the kitchen is open, then add it to a calendar or send it to friends. */
export function DinnerPlanner() {
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState<number | null>(null);
  const [people, setPeople] = useState(4);
  const iso = date || todayIso();
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const slots = slotsFor(weekday);
  const chosen = slot !== null && slots.includes(slot) ? slot : null;
  const start = chosen !== null ? londonDate(y, m, d, Math.floor(chosen / 60), chosen % 60) : null;
  const when = start ? `${DAYS[weekday]} ${d} ${new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { month: 'long', timeZone: 'UTC' })}, ${label(chosen!)}` : '';
  const text = start ? `Dinner at Green Papaya, ${when}, table for ${people}. ${ADDRESS}` : '';
  return (
    <div id="plan" className="scroll-mt-28 rounded-[2rem] bg-alt p-7 text-bg md:p-10">
      <p className="text-[13px] opacity-60">Plan a dinner</p>
      <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.92] font-extrabold tracking-[-0.045em]" style={{ fontStretch: '85%' }}>
        When are we eating?
      </h2>
      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="text-[13px] opacity-60">Date</span>
          <input type="date" min={todayIso()} value={iso} onChange={(e) => (setDate(e.target.value), setSlot(null))} className="mt-1 w-full rounded-2xl bg-bg/10 px-4 py-3 text-[17px] text-bg outline-none [color-scheme:dark] focus:ring-2 focus:ring-accent" />
        </label>
        <div>
          <span className="text-[13px] opacity-60">People</span>
          <div className="mt-1 flex items-center gap-2">
            <button onClick={() => setPeople(Math.max(1, people - 1))} aria-label="Fewer people" className="grid size-12 place-items-center rounded-2xl bg-bg/10">−</button>
            <span className="w-8 text-center text-[20px] font-bold tabular-nums">{people}</span>
            <button onClick={() => setPeople(Math.min(30, people + 1))} aria-label="More people" className="grid size-12 place-items-center rounded-2xl bg-bg/10">+</button>
          </div>
        </div>
      </div>
      <div className="mt-6" aria-live="polite">
        {slots.length === 0 ? (
          <p className="rounded-2xl bg-bg/10 p-4 text-[15px]">We&apos;re closed on {DAYS[weekday]}s. Pick another day.</p>
        ) : (
          <>
            <p className="text-[13px] opacity-60">{DAYS[weekday]} times</p>
            <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Pick a time">
              {slots.map((s) => (
                <button key={s} aria-pressed={chosen === s} onClick={() => setSlot(s)} className={`rounded-full px-3.5 py-2 text-[14px] tabular-nums transition-colors ${chosen === s ? 'bg-accent text-accent-ink' : 'bg-bg/10 hover:bg-bg/20'}`}>
                  {label(s)}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {start && (
        <div className="mt-8 border-t border-bg/15 pt-6">
          <p className="text-[22px] font-bold tracking-[-0.02em]">{when}, table for {people}</p>
          {people >= 6 && <p className="mt-2 text-[14px] text-accent">For groups of 6 or more, please call ahead.</p>}
          <div className="mt-5 flex flex-wrap gap-2">
            <a href={`tel:${PHONE[1]}`} className="rounded-full bg-accent px-5 py-3 text-[14px] font-semibold text-accent-ink">Call to book</a>
            <ShareButton title="Dinner at Green Papaya" text={text} className="rounded-full border border-bg/25 px-5 py-3 text-[14px]">Tell your friends</ShareButton>
          </div>
          <AddToCalendar
            className="mt-2"
            itemClassName="rounded-full border border-bg/25 px-5 py-3 text-[14px] transition-colors hover:bg-bg hover:text-fg"
            filename="green-papaya-dinner.ics"
            event={{ title: `Dinner at Green Papaya (${people})`, start, end: new Date(start.getTime() + 2 * 3600_000), location: `Green Papaya, ${ADDRESS}`, details: `Table for ${people}. Book on ${PHONE[0]}.` }}
          />
        </div>
      )}
    </div>
  );
}
