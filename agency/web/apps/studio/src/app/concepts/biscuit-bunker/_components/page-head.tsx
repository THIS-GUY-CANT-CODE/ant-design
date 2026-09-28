import { Breadcrumbs, Reveal } from '@sc/ui';
import { BASE } from './site';

export function PageHead({ crumbs, title, accent, intro, children }: { crumbs: { href?: string; label: string }[]; title: string; accent?: string; intro: string; children?: React.ReactNode }) {
  return (
    <header className="mx-auto max-w-[1600px] px-5 pt-36 pb-16 md:px-8 md:pt-44">
      <Breadcrumbs items={[{ href: BASE, label: 'Home' }, ...crumbs]} />
      <Reveal as="h1" by="chars" immediate className="mt-8 font-display text-[clamp(3.6rem,11vw,11rem)] leading-[0.84] font-semibold tracking-[-0.065em]">
        {title}
      </Reveal>
      {accent && <Reveal as="p" by="chars" immediate delay={0.3} className="font-serif text-[clamp(3rem,9vw,9rem)] leading-[0.9] tracking-[-0.03em] text-accent italic">{accent}</Reveal>}
      <p className="mt-8 max-w-xl text-[18px] leading-snug text-muted">{intro}</p>
      {children}
    </header>
  );
}
