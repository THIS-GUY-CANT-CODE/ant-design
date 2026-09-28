import type { Metadata } from 'next';
import { ConceptNotice, Cursor, MotionKit } from '@sc/ui';
import { brandStyle } from '@/brands';

export const metadata: Metadata = {
  title: { absolute: 'Clapton Beauty Parlour: hair & beauty on Lower Clapton Road since 1930 (concept)' },
  description: 'Concept redesign. Clapton Beauty Parlour, 21 Lower Clapton Road, E5: hair, colour, extensions, beauty and electrolysis at a family salon open since 1930.',
  robots: { index: false, follow: false },
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brandStyle('clapton-beauty-parlour')} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor color="#E0122F" ink="#FFFFFF" />
      <MotionKit intro="Clapton Beauty Parlour" introClassName="bg-accent text-accent-ink" />
      {children}
      <ConceptNotice name="Clapton Beauty Parlour" url="https://www.claptonbeautyparlour.co.uk/" className="bottom-20 md:bottom-4" />
    </div>
  );
}
