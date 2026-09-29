import type { Metadata } from 'next';
import { ConceptNotice, Cursor, MotionKit } from '@sc/ui';
import { brandStyle } from '@/brands';
import { MeadeChrome } from './_components/chrome';
import { Nav } from './_components/nav';
import { Footer } from './_components/sections';

export const metadata: Metadata = {
  title: { default: 'W J Meade: independent East London estate agents since 1953 (concept)', template: '%s · W J Meade (concept)' },
  description: 'Concept redesign. W J Meade, independent East London estate and letting agents since 1953, with offices in Bow, Stratford, Wood Green, Highams Park and Enfield.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brandStyle('wj-meade')} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor color="#2F49FF" ink="#FFFFFF" />
      <MotionKit intro="W J Meade" introClassName="bg-accent text-accent-ink" />
      <MeadeChrome />
      <Nav />
      {children}
      <Footer />
      <ConceptNotice name="W J Meade" url="https://www.wjmeade.co.uk/" />
    </div>
  );
}
