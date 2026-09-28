'use client';
import { CommandMenu, Toaster, type CommandItem } from '@sc/ui';
import { BASE, BOW, OFFICES, PAGES } from './site';

const ITEMS: CommandItem[] = [
  { group: 'Pages', label: 'Home', href: BASE },
  ...PAGES.map((p) => ({ group: 'Pages', label: p.label, hint: p.sub, href: p.href })),
  { group: 'Tools', label: 'Stamp duty calculator', href: `${BASE}/buy#stamp-duty`, keywords: ['sdlt', 'tax'] },
  { group: 'Tools', label: 'Mortgage calculator', href: `${BASE}/buy#mortgage`, keywords: ['repayment', 'monthly'] },
  { group: 'Tools', label: 'Rental yield calculator', href: `${BASE}/let#yield`, keywords: ['landlord', 'return'] },
  { group: 'Tools', label: 'Deposit limits for tenants', href: `${BASE}/let#deposit`, keywords: ['tenant fees act'] },
  { group: 'Tools', label: 'Free valuation', href: `${BASE}/sell`, keywords: ['worth', 'price'] },
  { group: 'Tools', label: 'Find my nearest office', href: `${BASE}/offices` },
  ...OFFICES.map((o) => ({ group: 'Offices', label: o.name, hint: o.address, href: `${BASE}/offices` })),
  { group: 'Contact', label: 'Call Bow', hint: BOW.phone[0], href: `tel:${BOW.phone[1]}` },
  { group: 'Contact', label: 'Homes for sale and to let', hint: 'wjmeade.co.uk', href: 'https://www.wjmeade.co.uk/' },
];

export function MeadeChrome() {
  return (
    <>
      <CommandMenu items={ITEMS} placeholder="Search tools, offices, services…" />
      <Toaster />
    </>
  );
}
