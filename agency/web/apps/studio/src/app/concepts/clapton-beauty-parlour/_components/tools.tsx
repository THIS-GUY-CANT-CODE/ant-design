'use client';
import { AddToCalendar, Directions, LiveDepartures, londonDate, MapView, OpenNow, useGeocode, useSearch, useToday } from '@sc/ui';
import { useEffect, useMemo, useState } from 'react';
import { ADDRESS, APPROX, FRESHA, HOURS, HOURS_TEXT, MAP_THEME, OCCASIONS, PHONE, POSTCODE, SERVICES, type Service } from './site';

/* ---------- Price list with search ---------- */
const KEYS = ['name', 'desc', 'cat'];
export function PriceList() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<'All' | Service['cat']>('All');
  const found = useSearch<Service>(SERVICES, KEYS, q);
  const list = found.filter((s) => cat === 'All' || s.cat === cat);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="svc-q" className="sr-only">Search services</label>
        <input id="svc-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: colour, nails, wedding…" className="min-w-0 flex-1 rounded-full border border-line bg-card px-6 py-4 text-[17px] outline-none focus:border-accent" />
        <div className="flex rounded-full bg-card p-1" role="group" aria-label="Category">
          {(['All', 'Hair', 'Beauty', 'Body'] as const).map((c) => (
            <button key={c} aria-pressed={cat === c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2.5 text-[14px] transition-colors ${cat === c ? 'bg-fg text-bg' : 'hover:bg-fg/5'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <ul className="mt-8 border-t border-line">
        {list.map((s) => (
          <li key={s.name} className="group grid gap-2 border-b border-line py-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-baseline gap-4">
              <span className="w-16 shrink-0 text-[13px] text-muted">{s.cat}</span>
              <div>
                <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-none transition-colors group-hover:text-accent">
                  {s.name} {s.note && <span className="align-middle font-sans text-[12px] text-muted">({s.note})</span>}
                </p>
                <p className="mt-1.5 text-[15px] text-muted">{s.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pl-20 sm:pl-0">
              <span className="text-[15px] text-muted">£ TBC</span>
              {s.cat === 'Body' && s.note ? (
                <a href={`tel:${PHONE[1]}`} className="rounded-full border border-line px-4 py-2 text-[14px]">Call</a>
              ) : (
                <a href={FRESHA} rel="noopener" className="rounded-full bg-accent px-4 py-2 text-[14px] text-accent-ink transition-transform hover:-translate-y-0.5">Book</a>
              )}
            </div>
          </li>
        ))}
        {list.length === 0 && <li className="py-10 text-[17px] text-muted">Nothing matches. Try another word, or call us on {PHONE[0]}.</li>}
      </ul>
      <p className="mt-5 text-[13px] text-muted">Prices to come from the salon&apos;s price list. Booking opens our Fresha page.</p>
    </div>
  );
}

/* ---------- What should I book? ---------- */
export function ServiceFinder() {
  const [o, setO] = useState<string | null>(null);
  const picks = o ? SERVICES.filter((s) => s.occasions.includes(o)) : [];
  return (
    <div id="finder" className="scroll-mt-28 rounded-[2rem] bg-alt p-7 text-bg md:p-10">
      <p className="text-[14px] opacity-60">Not sure what to book?</p>
      <h2 className="mt-3 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.92] tracking-[-0.035em]">What&apos;s the <em className="text-accent">occasion?</em></h2>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Occasion">
        {OCCASIONS.map(([k, l]) => (
          <button key={k} aria-pressed={o === k} onClick={() => setO(k)} className={`rounded-full px-5 py-3 text-[15px] transition-colors ${o === k ? 'bg-accent text-accent-ink' : 'bg-bg/10 hover:bg-bg/20'}`}>
            {l}
          </button>
        ))}
      </div>
      <div className="mt-8 min-h-24" aria-live="polite">
        {o && (
          <ul className="grid gap-2 md:grid-cols-3">
            {picks.map((s) => (
              <li key={s.name} className="flex items-center justify-between gap-3 rounded-2xl bg-bg/10 p-5">
                <span className="font-display text-[26px] leading-tight">{s.name}</span>
                <a href={FRESHA} rel="noopener" className="shrink-0 rounded-full bg-bg px-4 py-2 text-[13px] text-fg">Book</a>
              </li>
            ))}
          </ul>
        )}
        {!o && <p className="text-[16px] opacity-60">Pick one and we&apos;ll suggest where to start.</p>}
      </div>
    </div>
  );
}

/* ---------- Wedding planner ---------- */
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);
const fmt = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', timeZone: 'Europe/London' });

/** Works back from the wedding date: when to book, trial, colour and the morning itself. Rules of thumb, adjusted in the salon. */
export function weddingPlan(wedding: Date) {
  return [
    { when: addDays(wedding, -84), what: 'Book your trial and the day', note: 'About three months ahead, before Saturdays fill up.' },
    { when: addDays(wedding, -42), what: 'Hair trial', note: 'Six weeks out: bring photos, a veil or accessories, and wear a top like your dress neckline.' },
    { when: addDays(wedding, -14), what: 'Colour, if you’re having it', note: 'Two weeks out lets the colour settle.' },
    { when: addDays(wedding, -2), what: 'Nails and any beauty treatments', note: 'A day or two before.' },
    { when: wedding, what: 'Wedding morning', note: 'Hair on the day. Timing agreed at your trial.' },
  ];
}

export function WeddingPlanner() {
  const [date, setDate] = useState('');
  const plan = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
    const [y, m, d] = date.split('-').map(Number) as [number, number, number];
    return weddingPlan(londonDate(y, m, d, 9));
  }, [date]);
  const now = useToday();
  return (
    <div id="wedding" className="scroll-mt-28 rounded-[2rem] bg-card p-7 md:p-10">
      <p className="text-[14px] text-muted">Wedding hair</p>
      <h2 className="mt-3 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.92] tracking-[-0.035em]">Getting married?</h2>
      <label className="mt-6 block max-w-xs text-[13px] text-muted">
        Your wedding date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-2xl border border-line bg-bg px-4 py-3 text-[17px] text-fg outline-none focus:border-accent" />
      </label>
      {plan && (
        <ol className="mt-8 grid gap-2" aria-live="polite">
          {plan.map((p, i) => {
            const past = p.when.getTime() < now && i < plan.length - 1;
            return (
              <li key={p.what} className={`grid gap-2 rounded-2xl p-5 md:grid-cols-[14rem_1fr_auto] md:items-center ${i === plan.length - 1 ? 'bg-accent text-accent-ink' : 'bg-bg'}`}>
                <span className="font-display text-[22px]">{fmt(p.when)}</span>
                <span>
                  <b className="block text-[16px]">{p.what}{past && <span className="ml-2 text-[12px] font-normal opacity-70">(date passed: book as soon as you can)</span>}</b>
                  <span className="text-[14px] opacity-75">{p.note}</span>
                </span>
                {i === 1 && (
                  <AddToCalendar
                    filename="hair-trial.ics"
                    itemClassName="rounded-full border border-current/20 px-3 py-1.5 text-[12px]"
                    event={{ title: 'Hair trial at Clapton Beauty Parlour', start: new Date(p.when.getTime() + 3600_000), end: new Date(p.when.getTime() + 3 * 3600_000), location: `Clapton Beauty Parlour, ${ADDRESS}`, details: 'Bring photos and any accessories. Rebook or change on 020 8985 4329.' }}
                  />
                )}
              </li>
            );
          })}
        </ol>
      )}
      <div className="mt-6 flex flex-wrap gap-2">
        <a href={FRESHA} rel="noopener" className="rounded-full bg-accent px-6 py-3 text-[15px] text-accent-ink">Book a trial</a>
        <a href={`tel:${PHONE[1]}`} className="rounded-full border border-line px-6 py-3 text-[15px]">Call {PHONE[0]}</a>
      </div>
    </div>
  );
}

/* ---------- Centenary countdown ---------- */
const CENTENARY = Date.UTC(2030, 0, 1);
export function Centenary() {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    queueMicrotask(() => setNow(Date.now()));
    return () => clearInterval(t);
  }, []);
  const ms = Math.max(0, CENTENARY - (now || CENTENARY));
  const parts = [
    ['days', Math.floor(ms / 86_400_000)],
    ['hours', Math.floor(ms / 3_600_000) % 24],
    ['minutes', Math.floor(ms / 60_000) % 60],
    ['seconds', Math.floor(ms / 1000) % 60],
  ] as const;
  return (
    <div id="centenary" className="scroll-mt-28 rounded-[2rem] bg-accent p-7 text-accent-ink md:p-12">
      <p className="text-[14px] opacity-80">Opened 1930 · turning 100 in 2030</p>
      <h2 className="mt-3 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.92] tracking-[-0.035em]">Countdown to our 100th year</h2>
      <dl className="mt-10 grid grid-cols-4 gap-2" aria-live="off">
        {parts.map(([l, v]) => (
          <div key={l} className="rounded-2xl bg-white/10 p-4 text-center">
            <dd className="font-display text-[clamp(2.2rem,6vw,5rem)] leading-none tabular-nums">{now ? String(v).padStart(l === 'days' ? 1 : 2, '0') : '–'}</dd>
            <dt className="mt-2 text-[13px] opacity-80">{l}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ---------- Visit ---------- */
export function VisitMap({ className }: { className?: string }) {
  return <MapView label="Map showing Clapton Beauty Parlour on Lower Clapton Road" theme={MAP_THEME} zoom={16} className={className} pins={[{ id: 'cbp', label: 'Clapton Beauty Parlour', address: ADDRESS, postcode: POSTCODE, position: APPROX, note: 'Since 1930' }]} />;
}
export function VisitTrains() {
  const pos = useGeocode(POSTCODE, APPROX);
  return <LiveDepartures lat={pos.lat} lng={pos.lng} />;
}
export function VisitDirections() {
  const pos = useGeocode(POSTCODE, APPROX);
  return <Directions to={pos} name="Clapton Beauty Parlour" address={ADDRESS} />;
}
export function Hours() {
  return <OpenNow hours={HOURS} hoursText={HOURS_TEXT} />;
}
