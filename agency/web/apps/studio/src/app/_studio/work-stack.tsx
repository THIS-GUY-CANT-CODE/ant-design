import Image from 'next/image';
import Link from 'next/link';
import { Reveal, RollText } from '@sc/ui';
import { BRANDS, brandStyle, ORDER } from '@/brands';
import { BrandMark } from '@/brands/marks';
import { CASES } from '@/content/cases';

/** Six case studies as full-bleed cards in each client's own brand, stacking as you scroll. */
export function WorkStack() {
  return (
    <section id="work" className="mx-auto max-w-[1600px] px-3 pb-32 md:px-4">
      <div className="flex flex-wrap items-end justify-between gap-6 px-2 pb-12 md:px-4">
        <Reveal as="h2" className="max-w-[14ch] font-display text-[clamp(2.8rem,6.5vw,6.6rem)] leading-[0.88] font-semibold tracking-[-0.055em]">
          Six businesses. Six <span className="font-serif font-normal italic">new brands.</span>
        </Reveal>
        <p className="max-w-sm text-[15px] text-muted">Unsolicited concepts for real businesses on our own doorstep in East London, rebuilt to show what&apos;s possible. None are clients yet. Yours could be next, wherever it is.</p>
      </div>
      <div className="space-y-4">
        {ORDER.map((slug, i) => {
          const b = BRANDS[slug];
          const c = CASES.find((x) => x.slug === slug)!;
          return (
            <article key={slug} style={{ ...brandStyle(slug), top: `${88 + i * 14}px` }} className="sticky overflow-hidden rounded-[2rem] bg-bg text-fg shadow-[0_-20px_60px_-30px_rgba(0,0,0,.35)]">
              <div className="grid min-h-[78vh] gap-8 p-6 md:grid-cols-12 md:p-10">
                <div className="flex flex-col justify-between md:col-span-5">
                  <div className="flex items-center justify-between text-[13px] text-muted">
                    <span className="font-mono">{String(i + 1).padStart(2, '0')} / 06</span>
                    <span>{b.industry} · {b.area}</span>
                  </div>
                  <div>
                    <BrandMark slug={slug} className="mb-6 size-16 transition-transform duration-700 ease-expo hover:rotate-[-10deg]" />
                    <h3 className="font-display text-[clamp(2.6rem,5.2vw,5.4rem)] leading-[0.88]" style={{ fontWeight: b.display.weight, fontStretch: b.display.stretch, letterSpacing: b.display.tracking }}>
                      {b.name}
                    </h3>
                    <p className="mt-5 max-w-md text-[18px] leading-snug opacity-80">{c.headline}</p>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {b.swatches.map(([n, hex]) => (
                        <span key={n} title={n} className="size-7 rounded-full ring-1 ring-fg/25 transition-transform duration-500 ease-expo hover:-translate-y-1.5 hover:scale-125" style={{ background: hex }} />
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Link href={`/work/${slug}`} className="rounded-full bg-accent px-6 py-3.5 text-[15px] font-medium text-accent-ink"><RollText>Case study →</RollText></Link>
                      <Link href={`/concepts/${slug}`} className="rounded-full border border-fg/20 px-6 py-3.5 text-[15px] font-medium transition-colors hover:bg-fg hover:text-bg"><RollText>Live concept ↗</RollText></Link>
                    </div>
                  </div>
                </div>
                <Link href={`/concepts/${slug}`} className="group relative block md:col-span-7" aria-label={`Open the ${b.name} concept`} data-cursor="View">
                  <div className="overflow-hidden rounded-2xl bg-black/5 ring-1 ring-black/10 transition-transform duration-700 ease-expo group-hover:-translate-y-1 group-hover:rotate-[-0.6deg]">
                    <Image src={`/work/${slug}-desktop.jpg`} alt={`${b.name} concept website`} width={1440} height={900} className="h-auto w-full" sizes="(min-width: 768px) 55vw, 100vw" priority={i < 2} />
                  </div>
                  <div className="absolute -bottom-4 right-4 hidden w-[22%] overflow-hidden rounded-[1.4rem] border-[5px] border-black bg-black shadow-2xl transition-transform duration-700 ease-expo group-hover:-translate-y-3 md:block">
                    <Image src={`/work/${slug}-mobile.jpg`} alt="" width={780} height={1688} className="h-auto w-full" sizes="15vw" />
                  </div>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
