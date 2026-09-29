import { Banner, Breadcrumbs, Reveal, type PhotoSrc, type VideoSrc } from '@sc/ui';
import { BASE } from './site';

export function PageHead({ crumb, title, intro, children, media }: { crumb: string; title: React.ReactNode; intro: string; children?: React.ReactNode; media?: PhotoSrc | VideoSrc }) {
  return (
    <header className="bg-accent px-4 pt-32 pb-16 md:px-8 md:pt-40">
      <div className="mx-auto max-w-[1600px]">
        <Breadcrumbs items={[{ href: BASE, label: 'Home' }, { label: crumb }]} className="[&_*]:!text-fg/70" />
        <Reveal as="h1" immediate className="mt-6 font-display text-[clamp(4rem,14vw,14rem)] leading-[0.8] font-extrabold tracking-[-0.05em] uppercase" >
          <span style={{ fontStretch: '75%' }}>{title}</span>
        </Reveal>
        <p className="mt-8 max-w-lg text-[18px] leading-snug font-medium">{intro}</p>
        {children}
        {media && <Banner media={media} />}
      </div>
    </header>
  );
}
