'use client';
import { GreenPapayaMark } from '@/brands/marks';
import { isOpenAt, Magnetic, MobileMenu, RollText, SearchButton, useLondonTime } from '@sc/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BASE, PAGES, PHONE } from './site';
import { HOURS } from './hours';

export function Nav() {
  const now = useLondonTime();
  const open = now ? isOpenAt(HOURS, now.day, now.mins) : null;
  const path = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 md:px-8" aria-label="Main">
        <Link href={BASE} className="group flex items-center gap-2.5 rounded-full bg-bg py-1.5 pr-4 pl-1.5 font-display text-[20px] font-extrabold tracking-[-0.03em]" style={{ fontStretch: '80%' }}>
          <Mark className="size-7 transition-transform duration-700 ease-expo group-hover:rotate-[20deg]" />
          green papaya
        </Link>
        <div className="hidden items-center gap-1 rounded-full bg-bg p-1 text-[14px] md:flex">
          {PAGES.map((p) => (
            <Link key={p.href} href={p.href} aria-current={path === p.href ? 'page' : undefined} className="rounded-full px-4 py-2 transition-colors hover:bg-fg hover:text-bg aria-[current=page]:bg-accent"><RollText>{p.label}</RollText></Link>
          ))}
          {open !== null && (
            <span className="flex items-center gap-2 px-4 text-[13px]">
              <span className={`size-2 rounded-full ${open ? 'bg-[#1DB954]' : 'bg-fg/30'}`} />
              {open ? 'Open now' : 'Closed now'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <SearchButton className="flex h-10 items-center gap-2 rounded-full bg-bg px-3.5 text-[13px]" />
          <span className="hidden sm:inline-block"><Magnetic>
            <a href={`tel:${PHONE[1]}`} className="block rounded-full bg-fg px-5 py-2.5 text-[14px] font-medium text-bg ring-2 ring-bg"><RollText>Book a table</RollText></a>
          </Magnetic></span>
          <MobileMenu
            title="Green Papaya"
            className="grid size-10 place-items-center rounded-full bg-fg text-bg md:hidden"
            current={path}
            links={[{ href: BASE, label: 'Home' }, ...PAGES]}
            actions={
              <>
                <a href={`tel:${PHONE[1]}`} className="rounded-2xl bg-fg py-4 text-center font-medium text-bg">Call</a>
                <Link href={`${BASE}/menu`} className="rounded-2xl bg-accent py-4 text-center font-medium text-accent-ink">Menu</Link>
              </>
            }
          />
        </div>
      </nav>
    </header>
  );
}

/** Papaya half: flesh, and the seed cluster that doubles as a table of friends. */
export function Mark({ className }: { className?: string }) {
  return <GreenPapayaMark className={className} />;
}
