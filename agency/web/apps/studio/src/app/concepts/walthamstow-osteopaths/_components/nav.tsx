'use client';
import { Magnetic, MobileMenu, RollText, SearchButton } from '@sc/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mark } from './sections';
import { BASE, EMAIL, PAGES, PHONE } from './site';

export function Nav() {
  const path = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-3 mt-3 flex h-14 items-center justify-between gap-3 rounded-full border border-line bg-bg/80 pr-2 pl-4 backdrop-blur-md md:mx-8 md:pl-5" aria-label="Main">
        <Link href={BASE} className="group flex items-center gap-2.5 text-[16px] font-medium">
          <Mark className="size-8 transition-transform duration-700 ease-expo group-hover:-translate-y-0.5" /> <span className="hidden sm:inline">Walthamstow Osteopaths</span>
        </Link>
        <div className="hidden items-center gap-6 text-[14px] text-muted lg:flex">
          {PAGES.map((p) => (
            <Link key={p.href} href={p.href} aria-current={path.startsWith(p.href) ? 'page' : undefined} className="transition-colors hover:text-fg aria-[current=page]:text-fg aria-[current=page]:underline aria-[current=page]:underline-offset-[6px]">
              <RollText>{p.label}</RollText>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <SearchButton className="flex h-10 items-center gap-2 rounded-full px-3 text-[13px] text-muted transition-colors hover:text-fg" />
          <span className="hidden sm:inline-block"><Magnetic>
            <a href={`tel:${PHONE[1]}`} className="block rounded-full bg-accent px-4 py-2.5 text-[14px] text-accent-ink"><RollText>Book a visit</RollText></a>
          </Magnetic></span>
          <MobileMenu
            title="Walthamstow Osteopaths"
            className="grid size-10 place-items-center rounded-full bg-accent text-accent-ink lg:hidden"
            current={path}
            links={[{ href: BASE, label: 'Home' }, ...PAGES]}
            actions={
              <>
                <a href={`tel:${PHONE[1]}`} className="rounded-2xl bg-accent py-4 text-center text-accent-ink">Call</a>
                <a href={`mailto:${EMAIL}`} className="rounded-2xl bg-card py-4 text-center">Email</a>
              </>
            }
          />
        </div>
      </nav>
    </header>
  );
}
