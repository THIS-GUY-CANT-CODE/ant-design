import type { Metadata } from 'next';
import { ConceptNotice, Cursor, MotionKit } from '@sc/ui';
import { brandStyle } from '@/brands';
import { OsteoChrome } from './_components/chrome';
import { Nav } from './_components/nav';
import { Book, Footer } from './_components/sections';

export const metadata: Metadata = {
  title: { default: 'Walthamstow Osteopaths: No.72 St Mary Road (concept)', template: '%s · Walthamstow Osteopaths (concept)' },
  description: 'Concept redesign. Osteopathy, acupuncture and massage at No.72 St Mary Road, Walthamstow Village, since 2000.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brandStyle('walthamstow-osteopaths')} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor color="#2E4A3A" ink="#F8F6F1" />
      <MotionKit intro="Walthamstow Osteopaths" introClassName="bg-accent text-accent-ink" />
      <OsteoChrome />
      <Nav />
      {children}
      <Book />
      <Footer />
      <ConceptNotice name="Walthamstow Osteopaths" url="https://www.walthamstowosteopaths.co.uk/" />
    </div>
  );
}
