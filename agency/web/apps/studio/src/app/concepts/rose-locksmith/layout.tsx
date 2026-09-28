import type { Metadata } from 'next';
import { ConceptNotice, Cursor } from '@sc/ui';

export const metadata: Metadata = {
  title: { absolute: 'Rose Locksmith & DIY: key cutting in Bethnal Green since 1938 (concept)' },
  description: 'Concept redesign. Rose Locksmith & DIY, 149 Bethnal Green Road: key cutting, remote copying, uPVC door repair, Dulux paint mixing and an emergency locksmith. Family-run since 1938.',
  robots: { index: false, follow: false },
};

const brand = {
  '--bg': '#F2F1EC',
  '--fg': '#0F0F0F',
  '--muted': '#6E6D68',
  '--line': 'rgb(15 15 15 / 0.12)',
  '--card': '#FFFFFF',
  '--accent': '#FF3D7F',
  '--accent-ink': '#0F0F0F',
  '--alt': '#0F0F0F',
  '--steel': '#C9CDD2',
  '--f-display': 'var(--ff-host)',
  '--f-body': 'var(--ff-host)',
  '--f-mono': 'var(--ff-geist-mono)',
  '--f-serif': 'var(--ff-instrument-serif)',
} as React.CSSProperties;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brand} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor color="#FF3D7F" ink="#0F0F0F" />
      {children}
      <ConceptNotice name="Rose Locksmith" url="https://rosediy.co.uk/" className="bottom-20 md:bottom-4" />
    </div>
  );
}
