import type { Metadata } from 'next';
import { ConceptNotice, Cursor } from '@sc/ui';
import { brandStyle } from '@/brands';

export const metadata: Metadata = {
  title: { absolute: 'Biscuit Bunker: video production, Shoreditch (concept)' },
  description: 'Concept redesign. Biscuit Bunker makes commercials, branded content, corporate film, animation and podcasts from a converted dog biscuit factory in Shoreditch.',
  robots: { index: false, follow: false },
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brandStyle('biscuit-bunker')} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg selection:bg-accent selection:text-accent-ink">
      <Cursor />
      {children}
      <ConceptNotice name="Biscuit Bunker" url="https://biscuitbunker.com/" />
    </div>
  );
}
