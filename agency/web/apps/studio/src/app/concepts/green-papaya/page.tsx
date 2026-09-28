import { Footer } from './_components/footer';
import { Hero } from './_components/hero';
import { Kitchens } from './_components/kitchens';
import { Menu } from './_components/menu';
import { Nav } from './_components/nav';
import { Story, Visit } from './_components/visit';

export default function GreenPapaya() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Kitchens />
        <Menu />
        <Story />
        <Visit />
      </main>
      <Footer />
      {/* thumb-reach actions on phones */}
      <nav aria-label="Quick actions" className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-2 gap-2 md:hidden">
        <a href="tel:+442089855486" className="rounded-2xl bg-fg py-4 text-center font-medium text-bg">Call</a>
        <a href="#menu" className="rounded-2xl bg-accent py-4 text-center font-medium text-accent-ink">Menu</a>
      </nav>
    </>
  );
}
