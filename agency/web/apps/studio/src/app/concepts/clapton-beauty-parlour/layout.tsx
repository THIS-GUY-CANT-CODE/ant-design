import type { Metadata } from 'next';
import { ConceptNotice, Cursor } from '@sc/ui';

export const metadata: Metadata = {
  title: { absolute: 'Clapton Beauty Parlour: hair & beauty on Lower Clapton Road since 1930 (concept)' },
  description: 'Concept redesign. Clapton Beauty Parlour, 21 Lower Clapton Road, E5: hair, colour, extensions, beauty and electrolysis at a family salon open since 1930.',
  robots: { index: false, follow: false },
};

const brand = {
  '--bg': '#F6EFEA',
  '--fg': '#141212',
  '--muted': '#7A6F6B',
  '--line': 'rgb(20 18 18 / 0.12)',
  '--card': '#FFFFFF',
  '--accent': '#E0122F',
  '--accent-ink': '#FFFFFF',
  '--alt': '#141212',
  '--blush': '#F2C4C0',
  '--f-display': 'var(--ff-gloock)',
  '--f-body': 'var(--ff-inter)',
  '--f-mono': 'var(--ff-geist-mono)',
  '--f-serif': 'var(--ff-gloock)',
} as React.CSSProperties;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brand} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor color="#E0122F" ink="#FFFFFF" />
      {children}
      <ConceptNotice name="Clapton Beauty Parlour" url="https://www.claptonbeautyparlour.co.uk/" className="bottom-20 md:bottom-4" />
    </div>
  );
}
