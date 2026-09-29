import type { Metadata } from 'next';
import { ConceptNotice, Cursor, MotionKit } from '@sc/ui';
import { brandStyle } from '@/brands';
import { ClaptonChrome } from './_components/chrome';
import { Nav } from './_components/nav';
import { Footer } from './_components/sections';
import { FRESHA, PHONE } from './_components/site';

export const metadata: Metadata = {
  title: { default: 'Clapton Beauty Parlour: hair & beauty on Lower Clapton Road since 1930 (concept)', template: '%s · Clapton Beauty Parlour (concept)' },
  description: 'Concept redesign. Clapton Beauty Parlour, 21 Lower Clapton Road, E5: hair, colour, extensions, beauty and electrolysis at a family salon open since 1930.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brandStyle('clapton-beauty-parlour')} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor color="#E0122F" ink="#FFFFFF" />
      <MotionKit intro="Clapton Beauty Parlour" introClassName="bg-accent text-accent-ink" />
      <ClaptonChrome />
      <Nav />
      {children}
      <Footer />
      <nav aria-label="Quick actions" className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-2 gap-2 md:hidden">
        <a href={FRESHA} rel="noopener" className="rounded-2xl bg-accent py-4 text-center font-medium text-accent-ink">Book</a>
        <a href={`tel:${PHONE[1]}`} className="rounded-2xl bg-fg py-4 text-center font-medium text-bg">Call</a>
      </nav>
      <ConceptNotice name="Clapton Beauty Parlour" url="https://www.claptonbeautyparlour.co.uk/" className="bottom-20 md:bottom-4" />
    </div>
  );
}
