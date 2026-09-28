import { Breadcrumbs, Reveal } from '@sc/ui';
import { BASE } from './data';

export function PageHead({ eyebrow, title, intro, children }: { eyebrow: string; title: React.ReactNode; intro: string; children?: React.ReactNode }) {
  return (
    <header className="mx-auto max-w-[1600px] px-5 pt-14 pb-16 md:px-8 md:pt-20">
      <Breadcrumbs items={[{ href: BASE, label: 'Home' }, { label: eyebrow }]} />
      <Reveal as="h1" immediate className="mt-8 max-w-[14ch] font-display text-[clamp(3.2rem,9vw,9rem)] leading-[0.86] font-bold tracking-[-0.055em]">
        {title}
      </Reveal>
      <p className="mt-8 max-w-xl text-[19px] leading-snug text-muted">{intro}</p>
      {children}
    </header>
  );
}

export function Faq({ items }: { items: [string, string][] }) {
  return (
    <div className="border-t border-line">
      {items.map(([q, a], i) => (
        <details key={q} open={i === 0} className="group border-b border-line py-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[21px] font-bold tracking-[-0.02em]">
            {q}
            <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition-[rotate,background-color] duration-500 group-open:rotate-45 group-open:bg-accent">+</span>
          </summary>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-muted">{a}</p>
        </details>
      ))}
    </div>
  );
}
