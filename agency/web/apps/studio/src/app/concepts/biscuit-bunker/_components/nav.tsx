'use client';
import { BiscuitBunkerMark } from '@/brands/marks';
import { Magnetic, MobileMenu, RollText, SearchButton, useLondonTime } from '@sc/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BASE, PAGES } from './site';

export function Nav() {
  const time = useLondonTime()?.label ?? '';
  const path = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-4 px-5 text-[#F2F1ED] md:px-8" aria-label="Main">
        <Link href={BASE} className="group flex items-center gap-2 text-[17px] font-semibold tracking-[-0.04em]">
          <BiscuitBunkerMark color="#F2F1ED" className="size-8 transition-transform duration-500 ease-expo group-hover:-rotate-12" />
          biscuit bunker
        </Link>
        <div className="hidden items-center gap-8 text-[14px] lg:flex">
          {PAGES.slice(0, 3).map((p) => (
            <Link key={p.href} href={p.href} aria-current={path.startsWith(p.href) ? 'page' : undefined} className="opacity-70 transition hover:opacity-100 aria-[current=page]:opacity-100">
              <RollText>{p.label}</RollText>
            </Link>
          ))}
          <span className="font-mono text-[12px] opacity-50 tabular-nums">LDN {time}</span>
        </div>
        <div className="flex items-center gap-2">
          <SearchButton className="flex h-10 items-center gap-2 rounded-full border border-[#F2F1ED]/30 px-3.5 text-[13px]" />
          <span className="hidden sm:inline-block"><Magnetic>
            <Link href={`${BASE}/brief`} className="block rounded-full bg-[#F2F1ED] px-5 py-2.5 text-[14px] font-medium text-black">
              <RollText>Start a project</RollText>
            </Link>
          </Magnetic></span>
          <MobileMenu
            title="Biscuit Bunker"
            className="grid size-10 place-items-center rounded-full bg-[#F2F1ED] text-black lg:hidden"
            current={path}
            links={[{ href: BASE, label: 'Home' }, ...PAGES]}
          />
        </div>
      </nav>
    </header>
  );
}
