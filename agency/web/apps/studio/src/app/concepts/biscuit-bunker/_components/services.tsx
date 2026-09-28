import { Reveal, Stagger } from '@sc/ui';

const SERVICES = [
  ['Commercials', 'TV, online and social spots, from treatment through shoot to grade.'],
  ['Branded content', 'Stories people choose to watch, made for the platforms they actually use.'],
  ['Corporate film', "Brand films, internal comms and events that don't feel corporate."],
  ['Animation & motion', '2D, 3D and motion graphics, from explainers to title sequences.'],
  ['Podcasts', 'Concept, recording, editing, distribution and promotion, all under one roof.'],
] as const;

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-[1600px] px-5 pb-40 md:px-8">
      <div className="mb-10 flex items-end justify-between gap-6">
        <Reveal as="h2" className="max-w-[12ch] font-display text-[clamp(2.6rem,6vw,6rem)] leading-[0.88] font-semibold tracking-[-0.06em]">
          Pitch deck to final cut.
        </Reveal>
        <span className="font-mono text-[12px] text-muted">(05)</span>
      </div>
      <Stagger as="ul" className="border-t border-line">
        {SERVICES.map(([name, desc], i) => (
          <li key={name} className="group relative overflow-hidden border-b border-line">
            {/* accent fill wipes in from the left on hover */}
            <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-expo group-hover:scale-x-100" />
            <div className="relative grid gap-3 py-8 transition-colors duration-500 group-hover:text-accent-ink md:grid-cols-12 md:items-center md:py-10">
              <span className="font-mono text-[12px] opacity-60 md:col-span-1">0{i + 1}</span>
              <h3 className="font-display text-[clamp(2rem,4vw,3.6rem)] leading-none font-medium tracking-[-0.05em] transition-transform duration-700 ease-expo group-hover:translate-x-4 md:col-span-6">{name}</h3>
              <p className="max-w-md text-[15px] leading-snug opacity-70 md:col-span-4">{desc}</p>
              <span aria-hidden className="hidden size-12 -translate-x-4 place-items-center justify-self-end rounded-full bg-accent-ink text-accent opacity-0 transition-[translate,opacity,rotate] duration-700 ease-expo group-hover:translate-x-0 group-hover:-rotate-45 group-hover:opacity-100 md:col-span-1 md:grid">→</span>
            </div>
          </li>
        ))}
      </Stagger>
    </section>
  );
}
