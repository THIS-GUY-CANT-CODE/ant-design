'use client';
import { CommandMenu, Toaster, type CommandItem } from '@sc/ui';
import { BRANDS, ORDER } from '@/brands';

const ITEMS: CommandItem[] = [
  { group: 'Pages', label: 'Home', href: '/' },
  { group: 'Pages', label: 'Free website check', hint: '12 checks, 10 seconds', href: '/check' },
  { group: 'Pages', label: 'The marks', hint: 'Seven identities', href: '/marks' },
  { group: 'Pages', label: 'Pricing', href: '/#pricing' },
  { group: 'Pages', label: 'Where we work', href: '/#reach' },
  { group: 'Pages', label: 'Questions', href: '/#faq' },
  ...ORDER.map((s) => ({ group: 'Case studies', label: BRANDS[s].name, hint: `${BRANDS[s].industry} · ${BRANDS[s].area}`, href: `/work/${s}` })),
  ...ORDER.map((s) => ({ group: 'Live concepts', label: BRANDS[s].name, hint: 'Open the site', href: `/concepts/${s}` })),
  { group: 'Contact', label: 'Get a free redesign', href: '/#contact' },
];

export function StudioChrome() {
  return (
    <>
      <CommandMenu items={ITEMS} placeholder="Search work, tools, pricing…" />
      <Toaster />
    </>
  );
}
