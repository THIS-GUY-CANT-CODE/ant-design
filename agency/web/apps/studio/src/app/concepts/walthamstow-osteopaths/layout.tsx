import type { Metadata } from 'next';
import { ConceptNotice, Cursor } from '@sc/ui';
import { brandStyle } from '@/brands';

export const metadata: Metadata = {
  title: { absolute: 'Walthamstow Osteopaths: No.72 St Mary Road, E17 (concept)' },
  description: 'Concept redesign. Walthamstow Osteopaths at No.72 St Mary Road, E17: structural and cranial osteopathy, acupuncture, sports massage, aromatherapy and nutritional therapy since 2000.',
  robots: { index: false, follow: false },
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brandStyle('walthamstow-osteopaths')} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor color="#2E4A3A" ink="#F8F6F1" />
      {children}
      <ConceptNotice name="Walthamstow Osteopaths" url="https://www.walthamstowosteopaths.co.uk/" />
    </div>
  );
}
