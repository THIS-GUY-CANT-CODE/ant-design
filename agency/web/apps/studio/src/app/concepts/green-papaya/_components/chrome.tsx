'use client';
import { CommandMenu, Toaster, type CommandItem } from '@sc/ui';
import { ADDRESS, BASE, DISHES, PAGES, PHONE, slug } from './site';

const ITEMS: CommandItem[] = [
  { group: 'Pages', label: 'Home', href: BASE },
  ...PAGES.map((p) => ({ group: 'Pages', label: p.label, hint: p.sub, href: p.href })),
  ...DISHES.map((d) => ({ group: 'Dishes', label: d.name, hint: d.city === 'hanoi' ? 'Hà Nội' : '西安 Xi’an', href: `${BASE}/menu#${slug(d.name)}`, keywords: d.tags })),
  { group: 'Tools', label: 'Plan your table', hint: 'Pick dishes, share the order', href: `${BASE}/menu#planner` },
  { group: 'Tools', label: 'Plan a dinner', hint: 'Pick a time, add to calendar', href: `${BASE}/visit#plan` },
  { group: 'Tools', label: 'Are you open now?', href: `${BASE}/visit` },
  { group: 'Contact', label: 'Call to book', hint: PHONE[0], href: `tel:${PHONE[1]}` },
  { group: 'Contact', label: 'Directions', hint: ADDRESS, href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Green Papaya, ' + ADDRESS)}` },
];

export function PapayaChrome() {
  return (
    <>
      <CommandMenu items={ITEMS} placeholder="Search dishes, hours, directions…" />
      <Toaster />
    </>
  );
}
