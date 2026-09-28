'use client';
import { CommandMenu, Toaster, type CommandItem } from '@sc/ui';
import { ADDRESS, BASE, FRESHA, PAGES, PHONE, SERVICES } from './site';

const ITEMS: CommandItem[] = [
  { group: 'Pages', label: 'Home', href: BASE },
  ...PAGES.map((p) => ({ group: 'Pages', label: p.label, hint: p.sub, href: p.href })),
  ...SERVICES.map((s) => ({ group: 'Services', label: s.name, hint: s.cat, href: `${BASE}/services`, keywords: s.occasions })),
  { group: 'Tools', label: 'What should I book?', href: `${BASE}/services#finder` },
  { group: 'Tools', label: 'Wedding hair planner', href: `${BASE}/services#wedding` },
  { group: 'Tools', label: 'Countdown to our 100th year', href: `${BASE}/story#centenary` },
  { group: 'Book', label: 'Book online on Fresha', href: FRESHA },
  { group: 'Book', label: 'Call the salon', hint: PHONE[0], href: `tel:${PHONE[1]}` },
  { group: 'Book', label: 'Directions', hint: ADDRESS, href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Clapton Beauty Parlour, ' + ADDRESS)}` },
];

export function ClaptonChrome() {
  return (
    <>
      <CommandMenu items={ITEMS} placeholder="Search services, hours, booking…" />
      <Toaster />
    </>
  );
}
