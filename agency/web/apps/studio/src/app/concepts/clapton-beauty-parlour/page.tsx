import { Hero, FRESHA } from './_components/hero';
import { Decades, Nav, Services, Story, Visit } from './_components/sections';

export default function ClaptonBeautyParlour() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Story />
        <Decades />
        <Visit />
      </main>
      <nav aria-label="Quick actions" className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-2 gap-2 md:hidden">
        <a href={FRESHA} rel="noopener" className="rounded-2xl bg-accent py-4 text-center font-medium text-accent-ink">Book</a>
        <a href="tel:+442089854329" className="rounded-2xl bg-fg py-4 text-center font-medium text-bg">Call</a>
      </nav>
    </>
  );
}
