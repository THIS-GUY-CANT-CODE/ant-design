import type { Metadata } from 'next';
import { FullMenu } from '../_components/full-menu';
import { PageHead } from '../_components/page-head';
import { P } from '../_components/media';

export const metadata: Metadata = { title: 'Menu', description: "Northern Vietnamese and Xi'an dishes at Green Papaya, Mare Street. Search the menu and plan what your table orders." };

export default function MenuPage() {
  return (
    <main>
      <PageHead media={P.pho} crumb="Menu" title="The menu" intro="Two kitchens, one table. Search it, filter it, and build your order before you arrive so nobody argues at the table." />
      <section className="mx-auto max-w-[1600px] px-4 py-16 md:px-8">
        <FullMenu />
      </section>
    </main>
  );
}
