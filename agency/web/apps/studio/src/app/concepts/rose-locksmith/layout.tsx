import type { Metadata } from 'next';
import { ConceptNotice, Cursor, MotionKit } from '@sc/ui';
import { brandStyle } from '@/brands';
import { RoseChrome } from './_components/chrome';
import { Nav, QuickBar } from './_components/nav';
import { Footer } from './_components/rest';

export const metadata: Metadata = {
  title: { default: 'Rose Locksmith & DIY: key cutting in Bethnal Green since 1938 (concept)', template: '%s · Rose Locksmith & DIY (concept)' },
  description: 'Concept redesign. Rose Locksmith & DIY, 149 Bethnal Green Road: key cutting, remote copying, uPVC door repair, Dulux paint mixing and an emergency locksmith. Family-run since 1938.',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brandStyle('rose-locksmith')} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor color="#FF3D7F" ink="#0F0F0F" />
      <MotionKit intro="Rose Locksmith" introClassName="bg-accent text-accent-ink" />
      <RoseChrome />
      <Nav />
      {children}
      <Footer />
      <QuickBar />
      <ConceptNotice name="Rose Locksmith" url="https://rosediy.co.uk/" className="bottom-20 md:bottom-4" />
    </div>
  );
}
