'use client';
import { MobileMenu, RollText, SearchButton } from '@sc/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mark } from './sections';
import { BASE, BOW, PAGES } from './site';

export function Nav() {
  const path = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-5 md:px-8" aria-label="Main">
        <Link href={BASE} className="group flex items-center gap-2.5 text-[19px] font-bold tracking-[-0.03em]">
          <Mark className="size-8 transition-transform duration-700 ease-expo group-hover:rotate-[-8deg]" /> W J Meade
        </Link>
        <div className="hidden gap-7 text-[14px] lg:flex">
          {PAGES.map((p) => (
            <Link key={p.href} href={p.href} aria-current={path === p.href ? 'page' : undefined} className="text-muted transition-colors hover:text-fg aria-[current=page]:text-accent">
              <RollText>{p.label}</RollText>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <SearchButton className="flex h-10 items-center gap-2 rounded-full border border-line px-3.5 text-[13px] transition-colors hover:border-fg" />
          <Link href={`${BASE}/sell`} className="hidden rounded-full bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-ink sm:block"><RollText>Free valuation</RollText></Link>
          <MobileMenu
            title="W J Meade"
            className="grid size-10 place-items-center rounded-full bg-accent text-accent-ink lg:hidden"
            current={path}
            links={[{ href: BASE, label: 'Home' }, ...PAGES]}
            actions={
              <>
                <a href={`tel:${BOW.phone[1]}`} className="rounded-2xl bg-fg py-4 text-center font-semibold text-bg">Call Bow</a>
                <Link href={`${BASE}/sell`} className="rounded-2xl bg-accent py-4 text-center font-semibold text-accent-ink">Valuation</Link>
              </>
            }
          />
        </div>
      </nav>
    </header>
  );
}
