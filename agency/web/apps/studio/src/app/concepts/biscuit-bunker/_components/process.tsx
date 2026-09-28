import { FadeIn, Reveal } from '@sc/ui';

const STEPS = [
  ['Brief', 'The goal, the audience, the budget, and a clear creative route.'],
  ['Pre-production', 'Scripts, storyboards, casting, locations and a schedule you can hold us to.'],
  ['Production', 'Shoot, record or animate, with a crew sized to the job.'],
  ['Post & delivery', 'Edit, grade, sound, and every cut-down for every platform.'],
] as const;

export function Process() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-40 md:px-8">
      <Reveal as="h2" className="mb-14 max-w-[14ch] font-display text-[clamp(2.6rem,6vw,6rem)] leading-[0.88] font-semibold tracking-[-0.06em]">
        Four steps. No surprises.
      </Reveal>
      <div className="grid gap-3 md:grid-cols-4">
        {STEPS.map(([t, d], i) => (
          <FadeIn key={t} delay={i * 0.08} className="group flex min-h-72 flex-col justify-between rounded-3xl border border-line bg-card p-7 transition-colors duration-500 hover:border-accent">
            <span className="font-mono text-[12px] text-muted">Step 0{i + 1}</span>
            <div>
              <h3 className="font-display text-[28px] font-semibold tracking-[-0.04em]">{t}</h3>
              <p className="mt-2 text-[15px] leading-snug text-muted">{d}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
