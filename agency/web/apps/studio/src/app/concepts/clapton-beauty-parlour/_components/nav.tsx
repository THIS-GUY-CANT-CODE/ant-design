'use client';
import { MobileMenu, RollText, SearchButton } from '@sc/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mark } from './sections';
import { BASE, FRESHA, PAGES, PHONE } from './site';

export function Nav() {
  const path = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-3 px-4 md:px-8" aria-label="Main">
        <Link href={BASE} className="group flex items-center gap-2 rounded-full bg-bg/80 py-2 pr-4 pl-3 font-display text-[19px] tracking-[-0.02em] backdrop-blur-md md:text-[21px]">
          <Mark className="size-8 transition-transform duration-700 ease-expo group-hover:rotate-[-10deg]" /> <span className="hidden sm:inline">Clapton Beauty Parlour</span>
        </Link>
        <div className="hidden items-center gap-1 rounded-full bg-bg/80 p-1 text-[14px] backdrop-blur-md md:flex">
          {PAGES.map((p) => (
            <Link key={p.href} href={p.href} aria-current={path === p.href ? 'page' : undefined} className="rounded-full px-4 py-2 transition-colors duration-300 hover:bg-fg hover:text-bg aria-[current=page]:bg-fg aria-[current=page]:text-bg">
              <RollText>{p.label}</RollText>
            </Link>
          ))}
          <SearchButton className="flex items-center gap-2 rounded-full px-4 py-2 transition-colors hover:bg-fg hover:text-bg" />
        </div>
        <div className="flex items-center gap-2">
          <a href={FRESHA} rel="noopener" className="rounded-full bg-accent px-5 py-2.5 text-[14px] font-medium text-accent-ink"><RollText>Book</RollText></a>
          <MobileMenu
            title="Clapton Beauty Parlour"
            className="grid size-10 place-items-center rounded-full bg-fg text-bg md:hidden"
            current={path}
            links={[{ href: BASE, label: 'Home' }, ...PAGES]}
            actions={
              <>
                <a href={FRESHA} rel="noopener" className="rounded-2xl bg-accent py-4 text-center text-accent-ink">Book online</a>
                <a href={`tel:${PHONE[1]}`} className="rounded-2xl bg-fg py-4 text-center text-bg">Call</a>
              </>
            }
          />
        </div>
      </nav>
    </header>
  );
}
