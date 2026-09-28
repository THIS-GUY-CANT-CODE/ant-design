'use client';
import { CommandMenu, Toaster, type CommandItem } from '@sc/ui';
import { ADDRESS, BASE, PAGES, PHONE } from './data';

const ITEMS: CommandItem[] = [
  { group: 'Pages', label: 'Home', href: BASE },
  ...PAGES.map((p) => ({ group: 'Pages', label: p.label, hint: p.sub, href: p.href })),
  { group: 'Services', label: 'Key cutting', hint: 'Including difficult keys', href: `${BASE}/keys`, keywords: ['spare', 'copy'] },
  { group: 'Services', label: 'Remote & fob copying', hint: '433MHz, while you wait', href: `${BASE}/keys#remotes`, keywords: ['garage', 'gate'] },
  { group: 'Services', label: 'Emergency locksmith', hint: PHONE.emergency[0], href: `${BASE}/emergency`, keywords: ['locked out', 'break in'] },
  { group: 'Services', label: 'uPVC door repair', href: `${BASE}/emergency#upvc`, keywords: ['door', 'sticking', 'handle'] },
  { group: 'Services', label: 'Paint mixing', hint: 'Any Dulux colour', href: `${BASE}/paint`, keywords: ['dulux', 'colour'] },
  { group: 'Tools', label: 'Do you cover my area?', hint: 'Postcode check', href: `${BASE}/emergency#coverage` },
  { group: 'Tools', label: 'How much paint do I need?', hint: 'Calculator', href: `${BASE}/paint#calculator` },
  { group: 'Tools', label: 'Is it a good week to paint outside?', hint: 'Forecast', href: `${BASE}/paint#forecast` },
  { group: 'Tools', label: 'Do you stock…?', href: `${BASE}/visit#stock` },
  { group: 'Tools', label: 'Next trains from Bethnal Green', href: `${BASE}/visit#trains` },
  { group: 'Contact', label: 'Call the shop', hint: PHONE.shop[0], href: `tel:${PHONE.shop[1]}` },
  { group: 'Contact', label: 'Call the emergency line', hint: PHONE.emergency[0], href: `tel:${PHONE.emergency[1]}` },
  { group: 'Contact', label: 'Directions', hint: ADDRESS, href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Rose Locksmith, ' + ADDRESS)}` },
];

export function RoseChrome() {
  return (
    <>
      <CommandMenu items={ITEMS} placeholder="Search keys, paint, opening hours…" />
      <Toaster />
    </>
  );
}
