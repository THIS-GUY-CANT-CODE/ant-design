'use client';
import { CommandMenu, Toaster, type CommandItem } from '@sc/ui';
import { BASE, PAGES, SERVICES, VIMEO } from './site';

const ITEMS: CommandItem[] = [
  { group: 'Pages', label: 'Home', href: BASE },
  ...PAGES.map((p) => ({ group: 'Pages', label: p.label, hint: p.sub, href: p.href })),
  ...SERVICES.map((s) => ({ group: 'Services', label: s.name, hint: s.line, href: `${BASE}/services/${s.slug}` })),
  { group: 'Tools', label: 'Build a brief', hint: 'Formats worked out for you', href: `${BASE}/brief` },
  { group: 'Tools', label: 'Which aspect ratios do I need?', href: `${BASE}/brief` },
  { group: 'Contact', label: 'Watch on Vimeo', href: VIMEO },
  { group: 'Contact', label: 'Find the studio', hint: 'Shoreditch, EC2A', href: `${BASE}/studio` },
];

export function BunkerChrome() {
  return (
    <>
      <CommandMenu items={ITEMS} placeholder="Search work, services, the brief builder…" accent="#D7FF3F" />
      <Toaster />
    </>
  );
}
