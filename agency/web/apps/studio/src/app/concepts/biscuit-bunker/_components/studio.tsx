import { Counter, FadeIn, Reveal } from '@sc/ui';

export function Studio() {
  return (
    <section id="studio" className="bg-alt text-bg">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-40 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-28">
            <p className="font-mono text-[12px] opacity-60">(Studio)</p>
            <p className="mt-6 font-display text-[clamp(6rem,16vw,15rem)] leading-[0.8] font-semibold tracking-[-0.08em]">
              <Counter from={1990} to={2014} />
            </p>
            <p className="mt-4 text-[15px] opacity-60">Rolling since.</p>
          </div>
        </div>
        <div className="md:col-span-7">
          <Reveal as="h2" className="font-display text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[0.95] font-semibold tracking-[-0.05em]">
            We used to make dog biscuits. Well, the building did.
          </Reveal>
          <FadeIn className="mt-10 max-w-xl space-y-5 text-[18px] leading-relaxed opacity-80">
            <p>Biscuit Bunker started in 2014 inside a converted dog biscuit factory in Shoreditch. The ovens are long gone, but the idea stuck: make good things, in batches, with care, and make people come back for more.</p>
            <p>Today we&apos;re a full-service production team working with global agencies and brands of every size, from first idea to final delivery.</p>
          </FadeIn>
          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 md:grid-cols-3">
            {[
              ['Shoreditch', 'London EC2A'],
              ['5 disciplines', 'One team'],
              ['Dog biscuits', 'Formerly'],
            ].map(([a, b]) => (
              <div key={a} className="bg-alt p-6">
                <dt className="font-display text-[22px] font-semibold tracking-[-0.03em]">{a}</dt>
                <dd className="mt-1 text-[14px] opacity-60">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
