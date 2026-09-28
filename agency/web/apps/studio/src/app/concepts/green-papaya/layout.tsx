import type { Metadata } from 'next';
import { ConceptNotice, Cursor, MotionKit } from '@sc/ui';
import Link from 'next/link';
import { brandStyle } from '@/brands';
import { PapayaChrome } from './_components/chrome';
import { Footer } from './_components/footer';
import { Nav } from './_components/nav';
import { BASE, PHONE } from './_components/site';

export const metadata: Metadata = {
  title: { default: "Green Papaya Xi'Viet: Vietnamese & Xi'an kitchen, Hackney (concept)", template: '%s · Green Papaya (concept)' },
  description: "Concept redesign. Green Papaya, 191 Mare Street, Hackney: Northern Vietnamese and Xi'an cooking, family-run for over twenty years.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brandStyle('green-papaya')} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor color="#1A120D" ink="#FFF4EA" />
      <MotionKit intro="Green Papaya" introClassName="bg-accent text-accent-ink" />
      <PapayaChrome />
      <Nav />
      {children}
      <Footer />
      <nav aria-label="Quick actions" className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-2 gap-2 md:hidden">
        <a href={`tel:${PHONE[1]}`} className="rounded-2xl bg-fg py-4 text-center font-medium text-bg">Call</a>
        <Link href={`${BASE}/menu`} className="rounded-2xl bg-accent py-4 text-center font-medium text-accent-ink">Menu</Link>
      </nav>
      <ConceptNotice name="Green Papaya" url="https://green-papaya.com/" className="bottom-20 md:bottom-4" />
    </div>
  );
}
