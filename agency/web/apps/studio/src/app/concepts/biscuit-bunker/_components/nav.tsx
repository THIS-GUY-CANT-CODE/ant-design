'use client';
import { Magnetic, useLondonTime, RollText } from '@sc/ui';

export function Nav() {
  const time = useLondonTime()?.label ?? '';
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 text-[#F2F1ED] md:px-8" aria-label="Main">
        <a href="#top" className="group flex items-center gap-2 text-[17px] font-semibold tracking-[-0.04em]">
          <span className="relative size-3.5 rounded-full bg-[#F2F1ED] transition-transform duration-500 ease-expo group-hover:scale-150 group-hover:-translate-y-1" aria-hidden />
          biscuit bunker
        </a>
        <div className="hidden items-center gap-8 text-[14px] md:flex">
          <a href="#work" className="opacity-70 transition hover:opacity-100"><RollText>Work</RollText></a>
          <a href="#services" className="opacity-70 transition hover:opacity-100"><RollText>Services</RollText></a>
          <a href="#studio" className="opacity-70 transition hover:opacity-100"><RollText>Studio</RollText></a>
          <span className="font-mono text-[12px] opacity-50 tabular-nums">LDN {time}</span>
        </div>
        <Magnetic>
          <a href="#contact" className="block rounded-full bg-[#F2F1ED] px-5 py-2.5 text-[14px] font-medium text-black">
            <RollText>Start a project</RollText>
          </a>
        </Magnetic>
      </nav>
    </header>
  );
}
