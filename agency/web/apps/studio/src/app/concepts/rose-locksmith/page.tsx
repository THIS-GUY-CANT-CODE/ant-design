import { Hero } from './_components/hero';
import { Lock } from './_components/lock';
import { Nav } from './_components/nav';
import { Paint } from './_components/paint';
import { Footer, Reviews, Story, Visit } from './_components/rest';
import { Services } from './_components/services';
import { PHONE } from './_components/data';

export default function RoseLocksmith() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <Lock />
        <Story />
        <Paint />
        <div className="pt-32">
          <Reviews />
        </div>
        <Visit />
      </main>
      <Footer />
      <nav aria-label="Quick actions" className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-2 gap-2 md:hidden">
        <a href={`tel:${PHONE.emergency[1]}`} className="rounded-2xl bg-accent py-4 text-center font-medium text-accent-ink">Emergency</a>
        <a href={`tel:${PHONE.shop[1]}`} className="rounded-2xl bg-fg py-4 text-center font-medium text-bg">Call shop</a>
      </nav>
    </>
  );
}
