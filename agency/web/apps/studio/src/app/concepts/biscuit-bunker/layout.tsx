import type { Metadata } from 'next';
import { ConceptNotice, Cursor, MotionKit } from '@sc/ui';
import { brandStyle } from '@/brands';
import { BunkerChrome } from './_components/chrome';
import { Footer } from './_components/footer';
import { Nav } from './_components/nav';

export const metadata: Metadata = {
  title: { default: 'Biscuit Bunker: video production, Shoreditch (concept)', template: '%s · Biscuit Bunker (concept)' },
  description: 'Concept redesign. Biscuit Bunker makes commercials, branded content, corporate film, animation and podcasts from a converted dog biscuit factory in Shoreditch.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brandStyle('biscuit-bunker')} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg selection:bg-accent selection:text-accent-ink">
      <Cursor />
      <MotionKit intro="Biscuit Bunker" introClassName="bg-accent text-accent-ink" />
      <BunkerChrome />
      <Nav />
      {children}
      <Footer />
      <ConceptNotice name="Biscuit Bunker" url="https://biscuitbunker.com/" />
    </div>
  );
}
