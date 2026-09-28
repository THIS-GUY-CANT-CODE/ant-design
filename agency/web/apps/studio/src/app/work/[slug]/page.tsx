import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClipReveal, ConceptNotice, Cursor, FadeIn, MotionKit, Parallax, Reveal, RollText, Scramble, Stagger, Tilt } from '@sc/ui';
import { BRANDS, brandStyle, ORDER, type Slug } from '@/brands';
import { BrandMark } from '@/brands/marks';
import { CASES } from '@/content/cases';
import { gbp, STUDIO } from '@/content/studio';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return ORDER.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = BRANDS[slug as Slug];
  const c = CASES.find((x) => x.slug === slug);
  if (!b || !c) return {};
  return { title: `${b.name}: case study`, description: c.headline, robots: { index: false, follow: false } };
}

function H2({ n, children, style }: { n: string; children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <div className="mb-14 grid gap-4 border-t border-line pt-8 md:grid-cols-12">
      <span className="font-mono text-[13px] text-muted md:col-span-2">{n}</span>
      <h2 className="font-display text-[clamp(2.4rem,5vw,5rem)] leading-[0.9] md:col-span-10" style={style}>{children}</h2>
    </div>
  );
}

const priceOf = (tier: string) => {
  const p = STUDIO.prices;
  return [/Rebrand/.test(tier) && gbp(p.rebrand), /Refresh/.test(tier) && gbp(p.refresh), /Care/.test(tier) && `${gbp(p.care)}/mo`].filter(Boolean).join(' + ');
};

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const b = BRANDS[slug as Slug];
  const c = CASES.find((x) => x.slug === slug);
  if (!b || !c) notFound();
  const i = ORDER.indexOf(b.slug);
  const next = BRANDS[ORDER[(i + 1) % ORDER.length]!];
  const display = { fontWeight: b.display.weight, fontStretch: b.display.stretch, letterSpacing: b.display.tracking };
  return (
    <div style={brandStyle(b.slug)} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor />
      <MotionKit intro={b.name} introClassName="bg-accent text-accent-ink" />
      <nav className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md" aria-label="Case study">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-5 text-[14px] md:px-8">
          <Link href="/#work" className="font-medium"><RollText>← Second Coat</RollText></Link>
          <span className="font-mono text-[12px] text-muted">CASE STUDY {String(i + 1).padStart(2, '0')} / 06</span>
          <Link href={`/work/${next.slug}`} className="font-medium"><RollText>Next →</RollText></Link>
        </div>
      </nav>

      <header className="mx-auto max-w-[1600px] px-5 pt-20 md:px-8">
        <p className="text-[14px] text-muted"><Scramble>{`Unsolicited concept · ${b.industry} · ${b.area}`}</Scramble></p>
        <BrandMark slug={b.slug} className="mt-8 size-20" />
        <Reveal as="h1" immediate className="mt-6 font-display text-[clamp(3.4rem,10vw,10rem)] leading-[0.84]">
          <span style={display}>{b.name}</span>
        </Reveal>
        <p className="mt-8 max-w-2xl text-[clamp(1.2rem,2vw,1.6rem)] leading-snug">{c.headline}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={`/concepts/${b.slug}`} className="rounded-full bg-accent px-7 py-4 text-[16px] font-medium text-accent-ink"><RollText>Open the live concept ↗</RollText></Link>
          <a href={b.url} rel="noopener" className="rounded-full border border-fg/20 px-7 py-4 text-[16px] font-medium transition-colors hover:bg-fg hover:text-bg"><RollText>Their current site ↗</RollText></a>
        </div>
        <div className="relative mt-16 pb-10">
          <ClipReveal className="overflow-hidden rounded-[1.75rem] ring-1 ring-line">
            <Image src={`/work/${b.slug}-desktop.jpg`} alt={`The ${b.name} concept on desktop`} width={1440} height={900} priority className="h-auto w-full" sizes="100vw" />
          </ClipReveal>
          <Parallax speed={-12} className="absolute right-6 bottom-0 w-[24%] max-w-[260px] md:right-12">
            <div className="overflow-hidden rounded-[2rem] border-[6px] border-black bg-black shadow-2xl">
              <Image src={`/work/${b.slug}-mobile.jpg`} alt={`The ${b.name} concept on a phone`} width={780} height={1688} className="h-auto w-full" sizes="25vw" />
            </div>
          </Parallax>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] space-y-36 px-5 py-36 md:px-8">
        <section>
          <H2 n="01" style={display}>What it was</H2>
          <ol className="md:ml-[16.66%]">
            {c.was.map((w, k) => (
              <FadeIn key={k} className="group grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-6 text-[19px] leading-snug transition-colors hover:border-fg/40">
                <span className="font-mono text-[13px] text-muted">{String(k + 1).padStart(2, '0')}</span>
                <span className="transition-transform duration-500 ease-expo group-hover:translate-x-2">{w}</span>
              </FadeIn>
            ))}
          </ol>
          <p className="mt-6 text-[14px] text-muted md:ml-[16.66%]">From public search results and business listings. A full review of the live site is part of the handover.</p>
        </section>

        <section>
          <H2 n="02" style={display}>What it is now</H2>
          <Stagger className="grid gap-3 md:ml-[16.66%] md:grid-cols-2">
            {c.now.map((f, k) => (
              <Tilt key={f.t} max={5} className="h-full rounded-[1.5rem] bg-card p-7">
                <span className="font-mono text-[12px] text-muted">{String(k + 1).padStart(2, '0')}</span>
                <h3 className="mt-6 font-display text-[30px] leading-tight" style={display}>{f.t}</h3>
                <p className="mt-2 text-[16px] leading-snug text-muted">{f.d}</p>
              </Tilt>
            ))}
          </Stagger>
          <p className="mt-6 text-[14px] text-muted md:ml-[16.66%]">Built in Next.js and React with GSAP, Motion, Lenis and WebGL. Fast, accessible, and respectful of reduced-motion settings.</p>
        </section>

        <section>
          <H2 n="03" style={display}>The brand pitch</H2>
          <div className="md:ml-[16.66%]">
            <Reveal as="p" className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.86] text-accent">
              <span style={display}>{c.brand.idea}</span>
            </Reveal>
            <div className="mt-16 grid gap-12 md:grid-cols-2">
              <div>
                <p className="text-[19px] leading-relaxed">{c.brand.body}</p>
                <ul className="mt-8 space-y-3 text-[16px]">
                  {c.brand.points.map((p) => (
                    <li key={p} className="flex gap-3"><span className="mt-2.5 h-px w-4 shrink-0 bg-accent" />{p}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex h-56 overflow-hidden rounded-[1.5rem] ring-1 ring-line">
                  {b.swatches.map(([n, hex]) => (
                    <div key={n} className="flex flex-1 flex-col justify-end p-3 text-[11px] transition-[flex-grow] duration-700 ease-expo hover:grow-[2.4]" style={{ background: hex, color: parseInt(hex.slice(1, 3), 16) + parseInt(hex.slice(3, 5), 16) + parseInt(hex.slice(5, 7), 16) > 400 ? '#111' : '#fff' }}>
                      <b className="text-[12px]">{n}</b>{hex}
                    </div>
                  ))}
                </div>
                <div className="group flex items-center gap-6 rounded-[1.5rem] bg-card p-6">
                  <span className="font-display text-[88px] leading-none transition-[color,scale] duration-700 ease-expo group-hover:scale-110 group-hover:text-accent" style={display}>Aa</span>
                  <div className="text-[14px]">
                    <p className="font-medium">{b.type.display}</p>
                    <p className="text-muted">with {b.type.body}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <H2 n="04" style={display}>The marketing pitch</H2>
          <div className="md:ml-[16.66%]">
            <p className="max-w-3xl text-[clamp(1.4rem,2.4vw,2rem)] leading-snug">{c.marketing.idea}</p>
            <ol className="mt-12 border-t border-line">
              {c.marketing.plays.map((p) => (
                <FadeIn key={p.t} className="group grid gap-3 border-b border-line py-7 transition-colors hover:border-fg/40 md:grid-cols-12">
                  <span className="font-mono text-[12px] text-accent md:col-span-2">{p.when.toUpperCase()}</span>
                  <h3 className="font-display text-[26px] leading-tight md:col-span-4" style={display}>{p.t}</h3>
                  <p className="text-[16px] leading-snug text-muted md:col-span-6">{p.d}</p>
                </FadeIn>
              ))}
            </ol>
          </div>
        </section>

        <section className="grid gap-10 rounded-[2rem] bg-accent p-8 text-accent-ink md:grid-cols-12 md:p-14">
          <div className="md:col-span-7">
            <p className="text-[14px] opacity-75">What we&apos;d recommend</p>
            <h2 className="mt-3 font-display text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[0.95]" style={display}>{c.tier}</h2>
            <p className="mt-4 max-w-xl text-[17px] leading-snug opacity-85">{c.tierWhy}</p>
          </div>
          <div className="self-end md:col-span-5 md:text-right">
            <p className="font-display text-[clamp(2.6rem,5vw,4.6rem)] leading-none" style={display}>{priceOf(c.tier)}</p>
            <a href={`mailto:${STUDIO.email}?subject=${encodeURIComponent(`Like the ${b.name} concept`)}`} className="mt-6 inline-block rounded-full bg-fg px-7 py-4 text-[16px] font-medium text-bg"><RollText>Want this for your business?</RollText></a>
          </div>
        </section>

        <Link href={`/work/${next.slug}`} className="group block border-t border-line pt-10" style={brandStyle(next.slug)}>
          <span className="text-[14px] text-muted">Next case study</span>
          <span className="mt-3 block font-display text-[clamp(3rem,8vw,8rem)] leading-[0.86] text-fg transition-transform duration-700 ease-expo group-hover:translate-x-4" style={{ fontWeight: next.display.weight, fontStretch: next.display.stretch, letterSpacing: next.display.tracking }}>
            {next.name} →
          </span>
        </Link>
      </main>
      <footer className="border-t border-line px-5 py-8 text-[13px] text-muted md:px-8">
        {b.name} is not a client of {STUDIO.name}. This is an unsolicited concept made from public information. Names and trademarks belong to their owners. Owners can ask for removal at {STUDIO.email}.
      </footer>
      <ConceptNotice name={b.name} url={b.url} />
    </div>
  );
}
