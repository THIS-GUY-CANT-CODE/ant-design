'use client';
import { Photo, Reveal, Scramble } from '@sc/ui';
import { useState } from 'react';
import { P } from './media';

const K = [
  { key: 'hanoi', label: 'Hà Nội', sub: 'Northern Vietnamese', photo: P.herbs, bg: 'var(--hanoi)', ink: '#1A120D', text: "Fresh herbs, fish sauce, grilled meats and banana leaf. It's the north's cooking, with plenty you won't find at other Viet places in town." },
  { key: 'xian', label: '西安', sub: "Xi'an street food", photo: P.noodles, bg: 'var(--xian)', ink: '#FFF4EA', text: 'Hand-pulled and flat noodles, chilli oil, cumin and slow-braised pork in a crisp bun. The food of the old Silk Road city.' },
];

export function Kitchens() {
  const [hot, setHot] = useState<string | null>(null);
  return (
    <section id="kitchens" className="mx-auto max-w-[1600px] px-4 py-32 md:px-8 md:py-44">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <Reveal as="h2" className="max-w-[12ch] font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.85] font-extrabold tracking-[-0.045em]" by="words">
          Two kitchens. One table.
        </Reveal>
        <p className="max-w-xs text-[15px] text-muted"><Scramble>Order from both. Everybody does.</Scramble></p>
      </div>
      <div className="flex flex-col gap-3 md:h-[70vh] md:flex-row">
        {K.map((k) => (
          <article
            key={k.key}
            tabIndex={0}
            onPointerEnter={() => setHot(k.key)}
            onPointerLeave={() => setHot(null)}
            onFocus={() => setHot(k.key)}
            onBlur={() => setHot(null)}
            className="relative flex min-h-[420px] flex-col justify-between overflow-hidden rounded-[2rem] p-7 transition-[flex-grow] duration-700 ease-expo md:min-h-0 md:p-10"
            style={{ background: k.bg, color: k.ink, flexGrow: hot === k.key ? 1.7 : hot ? 0.8 : 1, flexBasis: 0 }}
          >
            <span className="flex items-center justify-between text-[13px] font-semibold tracking-wide uppercase opacity-80">{k.sub}<span aria-hidden className={`grid size-12 place-items-center rounded-full border border-current text-[18px] transition-[rotate,scale] duration-700 ease-expo ${hot === k.key ? 'scale-110 -rotate-45' : ''}`}>→</span></span>
            {/* each kitchen shows what it cooks; the photo opens up as the card widens */}
            <div className="relative my-6 min-h-44 flex-1 overflow-hidden rounded-[1.25rem] md:my-8">
              <Photo photo={k.photo} sizes="(min-width: 768px) 50vw, 100vw" className={`absolute inset-0 transition-[scale,filter] duration-[1.2s] ease-expo ${hot === k.key ? 'scale-105 saturate-100' : hot ? 'saturate-50' : ''}`} />
            </div>
            <div>
              <p className={`font-display text-[clamp(4.5rem,11vw,11rem)] leading-[0.82] font-extrabold tracking-[-0.05em] transition-transform duration-700 ease-expo ${hot === k.key ? '-translate-y-2 scale-105' : ''}`} style={{ fontStretch: '75%', transformOrigin: 'left bottom' }}>
                {k.label}
              </p>
              <p className="mt-6 max-w-md text-[17px] leading-snug">{k.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
