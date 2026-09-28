import type { Metadata } from 'next';
import { ConceptNotice, Cursor } from '@sc/ui';
import { brandStyle } from '@/brands';

export const metadata: Metadata = {
  title: { absolute: 'W J Meade: independent East London estate agents since 1953 (concept)' },
  description: 'Concept redesign. W J Meade, independent East London estate and letting agents since 1953, with offices in Bow, Stratford, Wood Green, Highams Park and Enfield.',
  robots: { index: false, follow: false },
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brandStyle('wj-meade')} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor color="#2F49FF" ink="#FFFFFF" />
      {children}
      <ConceptNotice name="W J Meade" url="https://www.wjmeade.co.uk/" />
    </div>
  );
}
