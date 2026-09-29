import { Banner, Breadcrumbs, Reveal, type PhotoSrc, type VideoSrc } from '@sc/ui';
import { BASE } from './site';

export function PageHead({ crumbs, title, intro, children, media }: { crumbs: { href?: string; label: string }[]; title: React.ReactNode; intro: string; children?: React.ReactNode; media?: PhotoSrc | VideoSrc }) {
  return (
    <header className="mx-auto max-w-[1600px] px-5 pt-32 pb-16 md:px-8 md:pt-40">
      <Breadcrumbs items={[{ href: BASE, label: 'Home' }, ...crumbs]} />
      <Reveal as="h1" immediate className="mt-8 max-w-[15ch] font-display text-[clamp(3.6rem,9vw,9rem)] leading-[0.88] tracking-[-0.035em]">
        {title}
      </Reveal>
      <p className="mt-8 max-w-xl text-[19px] leading-relaxed text-muted">{intro}</p>
      {children}
      {media && <Banner media={media} />}
    </header>
  );
}
