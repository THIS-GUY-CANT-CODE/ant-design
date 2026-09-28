import type { Metadata } from 'next';
import { ConceptNotice, Cursor, MotionKit } from '@sc/ui';
import { brandStyle } from '@/brands';

export const metadata: Metadata = {
  title: { absolute: "Green Papaya Xi'Viet: Vietnamese & Xi'an kitchen, Hackney (concept)" },
  description: "Concept redesign. Green Papaya, 191 Mare Street, Hackney: Northern Vietnamese and Xi'an cooking, family-run for over twenty years.",
  robots: { index: false, follow: false },
};


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brandStyle('green-papaya')} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor color="#1A120D" ink="#FFF4EA" />
      <MotionKit intro="Green Papaya" introClassName="bg-accent text-accent-ink" />
      {children}
      <ConceptNotice name="Green Papaya" url="https://green-papaya.com/" className="bottom-20 md:bottom-4" />
    </div>
  );
}
