'use client';
import { RoseMark } from '@/brands/marks';
import { isOpenAt, Magnetic, MobileMenu, RollText, SearchButton, useLondonTime } from '@sc/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BASE, HOURS, PAGES, PHONE } from './data';

export function Mark({ className, body, ink }: { className?: string; body?: string; ink?: string }) {
  return <RoseMark className={className} body={body} ink={ink} />;
}

export function Nav() {
  const now = useLondonTime();
  const path = usePathname();
  const open = now ? isOpenAt(HOURS, now.day, now.mins) : null;
  return (
    <header className="sticky top-0 z-50">
      <a href={`tel:${PHONE.emergency[1]}`} className="flex items-center justify-center gap-3 bg-accent px-4 py-2.5 text-[14px] font-medium text-accent-ink">
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-fg/60" />
          <span className="relative size-2 rounded-full bg-fg" />
        </span>
        Locked out? Emergency locksmith <span className="font-mono tabular-nums">{PHONE.emergency[0]}</span> →
      </a>
      <nav className="border-b border-line bg-bg/85 backdrop-blur-md" aria-label="Main">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-5 md:px-8">
          <Link href={BASE} className="group flex items-center gap-2.5 text-[18px] font-bold tracking-[-0.03em]">
            <Mark className="size-8 transition-transform duration-700 ease-expo group-hover:rotate-[-8deg]" /> Rose Locksmith <span className="hidden font-normal text-muted sm:inline">&amp; DIY</span>
          </Link>
          <div className="hidden items-center gap-6 text-[14px] lg:flex">
            {PAGES.map((p) => (
              <Link key={p.href} href={p.href} aria-current={path === p.href ? 'page' : undefined} className="relative transition-colors hover:text-accent aria-[current=page]:text-accent">
                <RollText>{p.label}</RollText>
              </Link>
            ))}
            {open !== null && (
              <span className="flex items-center gap-2 font-mono text-[12px]">
                <span className={`size-2 rounded-full ${open ? 'bg-[#16A34A]' : 'bg-fg/30'}`} /> {open ? 'OPEN' : 'CLOSED'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SearchButton className="flex h-10 items-center gap-2 rounded-full border border-line px-3.5 text-[13px] transition-colors hover:border-fg" />
            <span className="hidden sm:inline-block"><Magnetic>
              <a href={`tel:${PHONE.shop[1]}`} className="block rounded-full bg-fg px-5 py-2.5 font-mono text-[13px] text-bg tabular-nums">{PHONE.shop[0]}</a>
            </Magnetic></span>
            <MobileMenu
              title="Rose Locksmith & DIY"
              className="grid size-10 place-items-center rounded-full bg-fg text-bg lg:hidden"
              current={path}
              links={[{ href: BASE, label: 'Home' }, ...PAGES]}
              actions={
                <>
                  <a href={`tel:${PHONE.shop[1]}`} className="rounded-2xl bg-fg py-4 text-center font-medium text-bg">Call shop</a>
                  <a href={`tel:${PHONE.emergency[1]}`} className="rounded-2xl bg-accent py-4 text-center font-medium text-accent-ink">Emergency</a>
                </>
              }
            />
          </div>
        </div>
      </nav>
    </header>
  );
}

/** Thumb-reach actions on phones. */
export function QuickBar() {
  return (
    <nav aria-label="Quick actions" className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-2 gap-2 md:hidden">
      <a href={`tel:${PHONE.emergency[1]}`} className="rounded-2xl bg-accent py-4 text-center font-medium text-accent-ink">Emergency</a>
      <a href={`tel:${PHONE.shop[1]}`} className="rounded-2xl bg-fg py-4 text-center font-medium text-bg">Call shop</a>
    </nav>
  );
}
