'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { CopyButton, Num, distanceKm, formatMiles, LiveDepartures, lookupPostcode, MapView, useGeocode, type MapPin } from '@sc/ui';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { BOW, depositCaps, gbp, MAP_THEME, mortgagePayment, OFFICES, ORIGIN, rentalYield, stampDuty, type Buyer } from './site';

const GBP0 = { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 } as const;
const GBP2 = { style: 'currency', currency: 'GBP', minimumFractionDigits: 2, maximumFractionDigits: 2 } as const;
const PCT = { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 } as const;

const box = 'rounded-[1.75rem] bg-card p-7 md:p-10';
const input = 'w-full min-w-0 bg-transparent px-4 py-3.5 text-[20px] font-semibold tabular-nums outline-none';
const n = (v: string) => Math.max(0, parseFloat(v.replace(/[£,\s]/g, '')) || 0);

function Money({ label, value, onChange, hint, suffix }: { label: string; value: string; onChange: (v: string) => void; hint?: string; suffix?: string }) {
  return (
    <label className="block">
      <span className="text-[13px] text-muted">{label}</span>
      <span className="mt-1 flex items-center rounded-2xl border border-line bg-bg focus-within:border-accent">
        {!suffix && <span className="pl-4 text-[18px] text-muted">£</span>}
        <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} className={input} />
        {suffix && <span className="pr-4 text-[14px] text-muted">{suffix}</span>}
      </span>
      {hint && <span className="mt-1 block text-[12px] text-muted">{hint}</span>}
    </label>
  );
}

function Seg<T extends string>({ value, options, onChange, label }: { value: T; options: [T, string][]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="grid rounded-2xl bg-bg p-1" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }} role="group" aria-label={label}>
      {options.map(([v, l]) => (
        <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)} className={`rounded-xl px-2 py-2.5 text-[14px] font-medium transition-colors ${value === v ? 'bg-fg text-bg' : 'text-muted hover:text-fg'}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

/* ---------- Stamp duty ---------- */
export function StampDutyCalculator() {
  const [price, setPrice] = useState('450,000');
  const [buyer, setBuyer] = useState<Buyer>('mover');
  const [nonRes, setNonRes] = useState(false);
  const r = stampDuty(n(price), buyer, nonRes);
  return (
    <div id="stamp-duty" className={`${box} grid scroll-mt-28 gap-8 md:grid-cols-2`}>
      <div>
        <p className="text-[13px] font-semibold text-accent">STAMP DUTY</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] font-bold tracking-[-0.045em]">What will I pay?</h2>
        <div className="mt-8 space-y-4">
          <Money label="Purchase price" value={price} onChange={setPrice} />
          <Seg label="Buyer type" value={buyer} onChange={setBuyer} options={[['mover', 'Moving home'], ['first', 'First-time buyer'], ['additional', 'Second home / buy-to-let']]} />
          <label className="flex items-center gap-3 text-[15px]">
            <input type="checkbox" checked={nonRes} onChange={(e) => setNonRes(e.target.checked)} className="size-5 accent-[var(--accent)]" /> I&apos;m not a UK resident (2% surcharge)
          </label>
        </div>
        <p className="mt-6 text-[12px] leading-relaxed text-muted">England and Northern Ireland residential rates from 1 April 2025. A guide, not tax advice: your conveyancer confirms the final figure. Check on GOV.UK if your situation is unusual.</p>
      </div>
      <div className="flex flex-col rounded-[1.5rem] bg-accent p-7 text-accent-ink" aria-live="polite">
        <p className="text-[14px] opacity-80">Stamp duty to pay</p>
        <p className="mt-2 font-display text-[clamp(3.4rem,7vw,5.6rem)] leading-none font-bold tracking-[-0.05em]"><Num value={r.total} locales="en-GB" format={GBP0} /></p>
        <p className="mt-2 text-[14px] opacity-80">
          {(r.effective * 100).toFixed(2)}% of the price
          {r.ftbApplied && ' · first-time buyer relief applied'}
        </p>
        {r.ftbLost && <p className="mt-3 rounded-xl bg-white/15 p-3 text-[13px]">First-time buyer relief only applies up to £500,000, so standard rates apply.</p>}
        <table className="mt-auto w-full pt-6 text-[13px]">
          <tbody>
            {r.rows.map((row) => (
              <tr key={row.from} className="border-t border-white/20">
                <td className="py-2">{gbp(row.from)} to {gbp(row.to)}</td>
                <td className="py-2 text-right tabular-nums">{(row.rate * 100).toFixed(0)}%</td>
                <td className="py-2 text-right tabular-nums">{gbp(row.tax)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Mortgage ---------- */
export function MortgageCalculator() {
  const [price, setPrice] = useState('450,000');
  const [deposit, setDeposit] = useState('45,000');
  const [rate, setRate] = useState('4.5');
  const [years, setYears] = useState('25');
  const [type, setType] = useState<'repay' | 'io'>('repay');
  const loan = Math.max(0, n(price) - n(deposit));
  const ltv = n(price) ? (loan / n(price)) * 100 : 0;
  const m = mortgagePayment(loan, n(rate), n(years), type === 'io');
  return (
    <div id="mortgage" className={`${box} grid scroll-mt-28 gap-8 md:grid-cols-2`}>
      <div>
        <p className="text-[13px] font-semibold text-accent">MORTGAGE</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] font-bold tracking-[-0.045em]">What would it cost a month?</h2>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <Money label="Property price" value={price} onChange={setPrice} />
          <Money label="Deposit" value={deposit} onChange={setDeposit} />
          <Money label="Interest rate" value={rate} onChange={setRate} suffix="%" />
          <Money label="Term" value={years} onChange={setYears} suffix="years" />
        </div>
        <div className="mt-3">
          <Seg label="Mortgage type" value={type} onChange={setType} options={[['repay', 'Repayment'], ['io', 'Interest only']]} />
        </div>
      </div>
      <div className="flex flex-col rounded-[1.5rem] bg-alt p-7 text-bg" aria-live="polite">
        <p className="text-[14px] opacity-60">Monthly payment</p>
        <p className="mt-2 font-display text-[clamp(3.4rem,7vw,5.6rem)] leading-none font-bold tracking-[-0.05em]"><Num value={m.monthly} locales="en-GB" format={GBP2} /></p>
        <dl className="mt-auto grid grid-cols-2 gap-4 pt-8 text-[14px]">
          <div><dt className="opacity-60">Borrowing</dt><dd className="text-[20px] font-bold tabular-nums">{gbp(loan)}</dd></div>
          <div><dt className="opacity-60">Loan to value</dt><dd className="text-[20px] font-bold tabular-nums">{ltv.toFixed(0)}%</dd></div>
          <div><dt className="opacity-60">Total interest</dt><dd className="text-[20px] font-bold tabular-nums">{gbp(m.interest)}</dd></div>
          <div><dt className="opacity-60">Total repaid</dt><dd className="text-[20px] font-bold tabular-nums">{gbp(m.total)}</dd></div>
        </dl>
        <p className="mt-6 text-[12px] opacity-50">An illustration only. Your lender&apos;s offer sets the real figures.</p>
      </div>
    </div>
  );
}

/* ---------- Landlords ---------- */
export function LandlordTools() {
  const [price, setPrice] = useState('400,000');
  const [rent, setRent] = useState('2,000');
  const [costs, setCosts] = useState('3,000');
  const y = rentalYield(n(price), n(rent), n(costs));
  const d = depositCaps(n(rent));
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div id="yield" className={`${box} scroll-mt-28`}>
        <p className="text-[13px] font-semibold text-accent">RENTAL YIELD</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] font-bold tracking-[-0.045em]">What does it earn?</h2>
        <div className="mt-8 space-y-3">
          <Money label="Property value" value={price} onChange={setPrice} />
          <Money label="Monthly rent" value={rent} onChange={setRent} />
          <Money label="Yearly costs" value={costs} onChange={setCosts} hint="Insurance, repairs, service charge, management fees" />
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-3" aria-live="polite">
          <div className="rounded-2xl bg-accent p-5 text-accent-ink"><dt className="text-[13px] opacity-80">Gross yield</dt><dd className="font-display text-[44px] leading-none font-bold"><Num value={y.gross / 100} locales="en-GB" format={PCT} /></dd></div>
          <div className="rounded-2xl bg-alt p-5 text-bg"><dt className="text-[13px] opacity-60">Net yield</dt><dd className="font-display text-[44px] leading-none font-bold"><Num value={y.net / 100} locales="en-GB" format={PCT} /></dd></div>
        </dl>
        <p className="mt-3 text-[13px] text-muted">{gbp(y.annual)} a year in rent.</p>
      </div>
      <div id="deposit" className={`${box} scroll-mt-28`}>
        <p className="text-[13px] font-semibold text-accent">DEPOSIT RULES</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[0.95] font-bold tracking-[-0.045em]">What can I take?</h2>
        <p className="mt-4 text-[15px] text-muted">Using the monthly rent of {gbp(n(rent))}, under the Tenant Fees Act 2019 in England:</p>
        <dl className="mt-8 space-y-3" aria-live="polite">
          <div className="flex items-baseline justify-between border-b border-line pb-3"><dt>Weekly rent</dt><dd className="text-[22px] font-bold tabular-nums">{gbp(d.weekly, 2)}</dd></div>
          <div className="flex items-baseline justify-between border-b border-line pb-3"><dt>Maximum tenancy deposit ({d.weeks} weeks)</dt><dd className="text-[22px] font-bold tabular-nums">{gbp(d.deposit, 2)}</dd></div>
          <div className="flex items-baseline justify-between border-b border-line pb-3"><dt>Maximum holding deposit (1 week)</dt><dd className="text-[22px] font-bold tabular-nums">{gbp(d.holding, 2)}</dd></div>
        </dl>
        <p className="mt-6 text-[13px] leading-relaxed text-muted">Five weeks&apos; rent where the annual rent is under £50,000, six weeks at £50,000 or more. Deposits must be protected in a government-approved scheme within 30 days.</p>
      </div>
    </div>
  );
}

/* ---------- Offices: map + nearest office ---------- */
const PINS: MapPin[] = [...OFFICES, ORIGIN].map((o) => ({ id: o.id, label: `W J Meade ${o.name}`, address: o.address, position: { lat: o.lat, lng: o.lng }, postcode: 'postcode' in o ? o.postcode : undefined, muted: !!o.past, note: 'past' in o && o.past ? 'Our first office' : o.phone ? o.phone[0] : 'Address to be confirmed' }));

export function OfficeFinder() {
  const [sel, setSel] = useState<string | undefined>(undefined);
  const [pc, setPc] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ postcode: string; list: { id: string; name: string; km: number; approx?: boolean }[] } | { error: string } | null>(null);
  const find = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const p = await lookupPostcode(pc);
      const list = OFFICES.map((o) => ({ id: o.id, name: o.name, approx: o.approx, km: distanceKm(p, o) })).sort((a, b) => a.km - b.km);
      setRes({ postcode: p.postcode, list });
      setSel(list[0]!.id);
    } catch (err) {
      setRes({ error: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="grid gap-3 md:grid-cols-12">
      <div className="flex flex-col gap-3 md:col-span-5">
        <form onSubmit={find} className={box}>
          <p className="text-[13px] font-semibold text-accent">NEAREST OFFICE</p>
          <label htmlFor="office-pc" className="mt-3 block font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none font-bold tracking-[-0.04em]">Which office is closest?</label>
          <div className="mt-6 flex gap-2">
            <input id="office-pc" value={pc} onChange={(e) => setPc(e.target.value)} required placeholder="Your postcode" autoComplete="postal-code" className="min-w-0 flex-1 rounded-2xl border border-line bg-bg px-4 py-3.5 text-[18px] uppercase outline-none focus:border-accent" />
            <button disabled={busy} className="rounded-2xl bg-accent px-6 font-semibold text-accent-ink disabled:opacity-60">{busy ? '…' : 'Find'}</button>
          </div>
          <div aria-live="polite" className="mt-4">
            {res && 'error' in res && <p className="text-[15px] text-[#C2410C]">{res.error}</p>}
            {res && 'list' in res && (
              <p className="text-[16px]">
                <b>{res.list[0]!.name}</b> is closest to {res.postcode}, about {formatMiles(res.list[0]!.km)} away.
              </p>
            )}
          </div>
        </form>
        <ul className="grid gap-2">
          {OFFICES.map((o) => {
            const dist = res && 'list' in res ? res.list.find((x) => x.id === o.id) : undefined;
            return (
              <li key={o.id}>
                <button onClick={() => setSel(o.id)} aria-pressed={sel === o.id} className={`flex w-full items-baseline justify-between gap-4 rounded-2xl px-5 py-4 text-left transition-[background-color,color,padding] duration-500 ease-expo ${sel === o.id ? 'bg-accent pl-7 text-accent-ink' : 'bg-card hover:bg-white'}`}>
                  <span>
                    <span className="block text-[22px] font-bold tracking-[-0.03em]">{o.name}</span>
                    <span className={`text-[13px] ${sel === o.id ? 'opacity-80' : 'text-muted'}`}>{o.address}</span>
                  </span>
                  <span className="shrink-0 text-right text-[13px] tabular-nums">
                    {dist ? `${formatMiles(dist.km)}${o.approx ? '*' : ''}` : o.phone ? o.phone[0] : ''}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {res && 'list' in res && <p className="text-[12px] text-muted">* Measured to the town centre until the office address is added.</p>}
      </div>
      <MapView label="Map of W J Meade offices across East and North London" theme={MAP_THEME} zoom={13} pins={PINS} selected={sel} onSelect={setSel} className="min-h-[480px] rounded-[1.75rem] md:col-span-7 md:min-h-[680px]" />
    </div>
  );
}

export function BowTrains() {
  const pos = useGeocode(BOW.postcode, OFFICES[0]!);
  return <LiveDepartures lat={pos.lat} lng={pos.lng} />;
}

/* ---------- Valuation request ---------- */
const valSchema = z.object({
  mode: z.enum(['Sell', 'Let']),
  postcode: z.string().trim().regex(/^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/, 'Enter a full UK postcode'),
  beds: z.number().min(0).max(6),
  type: z.string(),
  when: z.string(),
  name: z.string().trim().min(2, 'Tell us your name'),
  contact: z.string().trim().min(6, 'An email or phone number so we can reach you'),
});
type Val = z.infer<typeof valSchema>;
export const valuationSummary = (v: Val) =>
  `Valuation request (${v.mode.toLowerCase()})\n${v.beds === 0 ? 'Studio' : `${v.beds}${v.beds === 6 ? '+' : ''}-bed`} ${v.type.toLowerCase()}, ${v.postcode.toUpperCase()}\nTiming: ${v.when}\nName: ${v.name}\nContact: ${v.contact}`;

export function ValuationForm({ compact = false }: { compact?: boolean }) {
  const [done, setDone] = useState<string | null>(null);
  const { register, handleSubmit, control, setValue, formState } = useForm<Val>({ resolver: zodResolver(valSchema), defaultValues: { mode: 'Sell', postcode: '', beds: 2, type: 'Flat', when: 'In the next 3 months', name: '', contact: '' } });
  const e = formState.errors;
  const mode = useWatch({ control, name: 'mode' });
  const beds = useWatch({ control, name: 'beds' });
  const field = 'w-full rounded-xl border border-line bg-bg px-4 py-3.5 text-[16px] outline-none focus:border-accent aria-[invalid=true]:border-[#C2410C]';
  const summary = done;
  if (summary)
    return (
      <div className="rounded-[1.75rem] bg-card p-6 shadow-[0_30px_80px_-40px_rgba(14,14,16,.35)] md:p-8" aria-live="polite">
        <p className="text-[24px] leading-tight font-semibold tracking-[-0.02em]">Ready to send.</p>
        <p className="mt-2 text-[15px] text-muted">Call Bow and read this out, or copy it into an email. We&apos;ll book a time to see the property.</p>
        <pre className="mt-4 rounded-xl bg-bg p-4 font-sans text-[14px] whitespace-pre-wrap">{summary}</pre>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <a href={`tel:${BOW.phone[1]}`} className="rounded-xl bg-accent py-3.5 text-center text-[15px] font-semibold text-accent-ink">Call {BOW.phone[0]}</a>
          <CopyButton value={summary} label="Details copied" className="rounded-xl border border-line py-3.5 text-[15px] font-semibold">Copy details</CopyButton>
        </div>
        <button onClick={() => setDone(null)} className="mt-3 w-full text-[14px] text-muted underline">Edit</button>
      </div>
    );
  return (
    <form onSubmit={handleSubmit((v) => setDone(valuationSummary(v)))} noValidate className="space-y-3 rounded-[1.75rem] bg-card p-6 shadow-[0_30px_80px_-40px_rgba(14,14,16,.35)] md:p-8">
      <p className="text-[24px] leading-tight font-semibold tracking-[-0.02em]">What&apos;s your home worth?</p>
      <div className="grid grid-cols-2 rounded-xl bg-bg p-1" role="group" aria-label="Sell or let">
        {(['Sell', 'Let'] as const).map((m) => (
          <button type="button" key={m} aria-pressed={mode === m} onClick={() => setValue('mode', m)} className={`rounded-lg py-2.5 text-[15px] font-medium transition-colors ${mode === m ? 'bg-fg text-bg' : 'text-muted'}`}>
            {m}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
        <span className="text-[15px]">Bedrooms</span>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Fewer bedrooms" onClick={() => setValue('beds', Math.max(0, beds - 1))} className="size-9 rounded-full border border-line text-[18px] transition-colors hover:bg-fg hover:text-bg">−</button>
          <output key={beds} className="w-16 animate-[pop_.35s_cubic-bezier(.16,1,.3,1)] text-center text-[20px] font-semibold tabular-nums">{beds === 0 ? 'Studio' : beds > 5 ? '6+' : beds}</output>
          <button type="button" aria-label="More bedrooms" onClick={() => setValue('beds', Math.min(6, beds + 1))} className="size-9 rounded-full border border-line text-[18px] transition-colors hover:bg-fg hover:text-bg">+</button>
        </div>
      </div>
      {!compact && (
        <div className="grid grid-cols-2 gap-3">
          <select {...register('type')} aria-label="Property type" className={field}>
            {['Flat', 'House', 'Maisonette', 'Other'].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select {...register('when')} aria-label="When" className={field}>
            {['In the next 3 months', 'In 3 to 6 months', 'Just curious'].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
      )}
      <div>
        <input {...register('postcode')} className={field} placeholder="Property postcode" aria-label="Property postcode" autoComplete="postal-code" aria-invalid={!!e.postcode} />
        {e.postcode && <p className="mt-1 text-[13px] text-[#C2410C]">{e.postcode.message}</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <input {...register('name')} className={field} placeholder="Your name" aria-label="Your name" autoComplete="name" aria-invalid={!!e.name} />
          {e.name && <p className="mt-1 text-[13px] text-[#C2410C]">{e.name.message}</p>}
        </div>
        <div>
          <input {...register('contact')} className={field} placeholder="Email or phone" aria-label="Email or phone" aria-invalid={!!e.contact} />
          {e.contact && <p className="mt-1 text-[13px] text-[#C2410C]">{e.contact.message}</p>}
        </div>
      </div>
      <button type="submit" data-press className="w-full rounded-xl bg-accent py-4 text-[16px] font-semibold text-accent-ink transition-transform hover:-translate-y-0.5">Book my free valuation</button>
      <p className="text-center text-[14px] text-muted">
        Or call Bow on <a href={`tel:${BOW.phone[1]}`} className="text-fg underline">{BOW.phone[0]}</a>
      </p>
    </form>
  );
}
