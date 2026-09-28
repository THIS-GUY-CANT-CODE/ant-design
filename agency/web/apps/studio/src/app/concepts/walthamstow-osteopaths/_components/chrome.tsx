'use client';
import { CommandMenu, Toaster, type CommandItem } from '@sc/ui';
import { ADDRESS, BASE, EMAIL, FAQS, PAGES, PHONE, TREATMENTS } from './site';

const ITEMS: CommandItem[] = [
  { group: 'Pages', label: 'Home', href: BASE },
  ...PAGES.map((p) => ({ group: 'Pages', label: p.label, hint: p.sub, href: p.href })),
  ...TREATMENTS.map((t) => ({ group: 'Treatments', label: t.name, href: `${BASE}/treatments/${t.slug}`, keywords: t.areas })),
  { group: 'Tools', label: 'Which treatment is for me?', href: `${BASE}/treatments#finder` },
  { group: 'Tools', label: 'First visit checklist', href: `${BASE}/first-visit#checklist` },
  { group: 'Tools', label: 'Add my appointment to my calendar', href: `${BASE}/first-visit#calendar` },
  { group: 'Tools', label: 'Send us a question', href: `${BASE}/first-visit#ask` },
  ...FAQS.slice(0, 6).map(([q]) => ({ group: 'Questions', label: q, href: `${BASE}/faq` })),
  { group: 'Contact', label: 'Call to book', hint: PHONE[0], href: `tel:${PHONE[1]}` },
  { group: 'Contact', label: 'Email us', hint: EMAIL, href: `mailto:${EMAIL}` },
  { group: 'Contact', label: 'Directions', hint: ADDRESS, href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Walthamstow Osteopaths, ' + ADDRESS)}` },
];

export function OsteoChrome() {
  return (
    <>
      <CommandMenu items={ITEMS} placeholder="Search treatments, questions, directions…" />
      <Toaster />
    </>
  );
}
