import { Hero } from './_components/hero';
import { Footer, Help, Homes, Nav, Offices, Stats, Story } from './_components/sections';

export default function WJMeade() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Help />
        <Homes />
        <Story />
        <Offices />
      </main>
      <Footer />
    </>
  );
}
