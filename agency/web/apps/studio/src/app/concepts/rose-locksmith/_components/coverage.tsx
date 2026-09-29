'use client';
import { distanceKm, formatMiles, lookupPostcode, useGeocode, type Place } from '@sc/ui';
import { useState } from 'react';
import { APPROX, CALLOUT_DISTRICTS, PHONE, POSTCODE } from './data';

type Result = { place: Place; km: number; covered: boolean } | { error: string } | null;

/** Checks a postcode against the areas the shop names for emergency call-outs (postcodes.io). */
export function CoverageCheck() {
  const shop = useGeocode(POSTCODE, APPROX);
  const [pc, setPc] = useState('');
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Result>(null);
  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const place = await lookupPostcode(pc);
      setRes({ place, km: distanceKm(shop, place), covered: CALLOUT_DISTRICTS.includes(place.district) });
    } catch (err) {
      setRes({ error: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };
  return (
    <div id="coverage" className="scroll-mt-32 rounded-[2rem] bg-card p-7 md:p-10">
      <p className="font-mono text-[12px] text-muted">DO WE COVER YOU?</p>
      <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] font-bold tracking-[-0.045em]">Check your postcode.</h2>
      <form onSubmit={check} className="mt-8 flex flex-wrap gap-2">
        <label htmlFor="cov-pc" className="sr-only">Your postcode</label>
        <input id="cov-pc" value={pc} onChange={(e) => setPc(e.target.value)} required placeholder="e.g. E2 7DG" autoComplete="postal-code" className="min-w-0 flex-1 rounded-2xl border border-line bg-bg px-5 py-4 font-mono text-[18px] uppercase outline-none focus:border-accent" />
        <button disabled={busy} className="rounded-2xl bg-fg px-6 py-4 font-medium text-bg disabled:opacity-60">{busy ? 'Checking…' : 'Check'}</button>
      </form>
      <div aria-live="polite" className="mt-6 min-h-24">
        {res && 'error' in res && <p className="text-[16px] text-accent">{res.error}</p>}
        {res && 'place' in res && (
          <div className={`rounded-2xl p-5 ${res.covered ? 'bg-[#16A34A]/10' : 'bg-fg/5'}`}>
            <p className="text-[20px] font-bold tracking-[-0.02em]">
              {res.covered ? `Yes, ${res.place.postcode} is in our call-out area.` : `${res.place.postcode} is outside the areas we list.`}
            </p>
            <p className="mt-1 text-[15px] text-muted">
              {res.place.ward ? `${res.place.ward}, ` : ''}
              {res.place.district} · {formatMiles(res.km)} from the shop
            </p>
            <p className="mt-4 text-[15px]">
              {res.covered ? 'Call the emergency line and tell us your postcode.' : 'We list Tower Hamlets and Hackney, but call and ask. If we can’t come, we’ll say so straight away.'}
            </p>
            <a href={`tel:${PHONE.emergency[1]}`} className="mt-4 inline-block rounded-full bg-accent px-6 py-3 font-medium text-accent-ink">Call {PHONE.emergency[0]}</a>
          </div>
        )}
      </div>
      <p className="text-[13px] text-muted">Areas we list: {CALLOUT_DISTRICTS.join(' and ')}. Postcode data from postcodes.io.</p>
    </div>
  );
}
