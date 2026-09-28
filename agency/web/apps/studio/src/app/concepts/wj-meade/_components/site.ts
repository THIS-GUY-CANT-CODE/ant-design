export const BASE = '/concepts/wj-meade';
export const BOW = { phone: ['020 8981 3331', '+442089813331'] as const, address: '391 Mile End Road, Bow, London E3 4QS', postcode: 'E3 4QS' };

export const PAGES = [
  { href: `${BASE}/sell`, label: 'Sell', sub: 'Free valuation' },
  { href: `${BASE}/buy`, label: 'Buy', sub: 'Stamp duty & mortgages' },
  { href: `${BASE}/let`, label: 'Landlords', sub: 'Yield & deposit rules' },
  { href: `${BASE}/offices`, label: 'Offices', sub: 'Five across the east' },
  { href: `${BASE}/about`, label: 'Since 1953', sub: 'Our story' },
] as const;

export type Office = { id: string; name: string; lat: number; lng: number; address: string; postcode?: string; phone?: readonly [string, string]; past?: boolean; approx?: boolean };
// Bow's address is confirmed; the other four are placed at their town centres until addresses are added.
export const OFFICES: Office[] = [
  { id: 'bow', name: 'Bow', lat: 51.5262, lng: -0.0327, address: BOW.address, postcode: BOW.postcode, phone: BOW.phone },
  { id: 'stratford', name: 'Stratford', lat: 51.5416, lng: -0.0034, address: 'Stratford, E15 · [Address]', approx: true },
  { id: 'wood-green', name: 'Wood Green', lat: 51.5975, lng: -0.1097, address: 'Wood Green, N22 · [Address]', approx: true },
  { id: 'highams-park', name: 'Highams Park', lat: 51.6083, lng: -0.0003, address: 'Highams Park, E4 · [Address]', approx: true },
  { id: 'enfield', name: 'Enfield', lat: 51.6522, lng: -0.0808, address: 'Enfield Town, EN1 · [Address]', approx: true },
];
export const ORIGIN = { id: 'hoe-street', name: 'Hoe Street, 1953', lat: 51.5836, lng: -0.0199, address: 'Hoe Street, Walthamstow. Where it started.', past: true } satisfies Office;

export const MAP_THEME = { land: '#F8F8F5', water: '#D5DBFF', park: '#E7ECE3', building: '#EEEEEA', road: '#FFFFFF', roadMajor: '#DADCEA', label: '#6B6F7A', halo: '#F8F8F5', pin: '#2F49FF', pinInk: '#FFFFFF' };

/* ---------------- Stamp Duty Land Tax (England & Northern Ireland) ----------------
   Residential rates from 1 April 2025. Additional-property surcharge is 5 points on every band
   (from 31 October 2024) for purchases of £40,000 or more. Non-UK residents pay 2 points more.
   First-time buyers pay nothing up to £300,000 and 5% up to £500,000; above £500,000 the relief is lost. */
export const SDLT_BANDS: [upTo: number, rate: number][] = [
  [125_000, 0],
  [250_000, 0.02],
  [925_000, 0.05],
  [1_500_000, 0.1],
  [Infinity, 0.12],
];
export const FTB_BANDS: [number, number][] = [
  [300_000, 0],
  [500_000, 0.05],
];
export type Buyer = 'mover' | 'first' | 'additional';

export function stampDuty(price: number, buyer: Buyer, nonResident = false) {
  const p = Math.max(0, Math.floor(price));
  const ftb = buyer === 'first' && p <= 500_000;
  const bands = ftb ? FTB_BANDS : SDLT_BANDS;
  const extra = (buyer === 'additional' && p >= 40_000 ? 0.05 : 0) + (nonResident ? 0.02 : 0);
  let prev = 0, total = 0;
  const rows: { from: number; to: number; rate: number; tax: number }[] = [];
  for (const [upTo, rate] of bands) {
    if (p <= prev) break;
    const slice = Math.min(p, upTo) - prev;
    const r = rate + extra;
    const tax = slice * r;
    rows.push({ from: prev, to: Math.min(p, upTo), rate: r, tax });
    total += tax;
    prev = upTo;
  }
  return { total: Math.floor(total), rows, ftbApplied: ftb, ftbLost: buyer === 'first' && p > 500_000, effective: p ? total / p : 0 };
}

/* ---------------- Mortgage ---------------- */
export function mortgagePayment(principal: number, annualRatePct: number, years: number, interestOnly = false) {
  const r = annualRatePct / 100 / 12, n = Math.round(years * 12);
  if (principal <= 0 || n <= 0) return { monthly: 0, total: 0, interest: 0 };
  if (interestOnly) {
    const monthly = principal * r;
    return { monthly, total: monthly * n + principal, interest: monthly * n };
  }
  const monthly = r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));
  return { monthly, total: monthly * n, interest: monthly * n - principal };
}

/* ---------------- Landlords ---------------- */
export function rentalYield(price: number, monthlyRent: number, annualCosts: number) {
  const annual = monthlyRent * 12;
  return { gross: price > 0 ? (annual / price) * 100 : 0, net: price > 0 ? ((annual - annualCosts) / price) * 100 : 0, annual };
}
/** Tenant Fees Act 2019 (England): deposit capped at 5 weeks' rent, or 6 weeks if annual rent is £50,000 or more; holding deposit at 1 week. */
export function depositCaps(monthlyRent: number) {
  const weekly = (monthlyRent * 12) / 52;
  const weeks = monthlyRent * 12 >= 50_000 ? 6 : 5;
  return { weekly, weeks, deposit: Math.floor(weekly * weeks * 100) / 100, holding: Math.floor(weekly * 100) / 100 };
}

export const gbp = (n: number, dp = 0) => n.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: dp, maximumFractionDigits: dp });
