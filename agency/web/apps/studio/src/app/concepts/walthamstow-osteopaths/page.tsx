import { Hero } from './_components/hero';
import { Book, Faq, FirstVisit, Nav, No72, Team, Treatments } from './_components/sections';

export default function WalthamstowOsteopaths() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Treatments />
        <FirstVisit />
        <No72 />
        <Team />
        <Faq />
        <Book />
      </main>
    </>
  );
}
