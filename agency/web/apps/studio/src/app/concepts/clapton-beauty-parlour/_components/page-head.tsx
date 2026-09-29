import { Banner, Breadcrumbs, Reveal, type PhotoSrc, type VideoSrc } from '@sc/ui';
import { BASE } from './site';

export function PageHead({ crumb, title, intro, children, media }: { crumb: string; title: React.ReactNode; intro: string; children?: React.ReactNode; media?: PhotoSrc | VideoSrc }) {
  return (
    <header className="mx-auto max-w-[1600px] px-5 pt-36 pb-14 md:px-8 md:pt-44">
      <Breadcrumbs items={[{ href: BASE, label: 'Home' }, { label: crumb }]} />
      <Reveal as="h1" immediate className="mt-8 max-w-[14ch] font-display text-[clamp(3.6rem,10vw,10rem)] leading-[0.86] tracking-[-0.04em]">
        {title}
      </Reveal>
      <p className="mt-8 max-w-lg text-[18px] leading-snug text-muted">{intro}</p>
      {children}
      {media && <Banner media={media} />}
    </header>
  );
}
