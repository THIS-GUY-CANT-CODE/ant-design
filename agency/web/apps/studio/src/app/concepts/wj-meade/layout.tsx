import type { Metadata } from 'next';
import { ConceptNotice, Cursor } from '@sc/ui';

export const metadata: Metadata = {
  title: { absolute: 'W J Meade: independent East London estate agents since 1953 (concept)' },
  description: 'Concept redesign. W J Meade, independent East London estate and letting agents since 1953, with offices in Bow, Stratford, Wood Green, Highams Park and Enfield.',
  robots: { index: false, follow: false },
};

const brand = {
  '--bg': '#F8F8F5',
  '--fg': '#0E0E10',
  '--muted': '#6B6F7A',
  '--line': 'rgb(14 14 16 / 0.12)',
  '--card': '#FFFFFF',
  '--accent': '#2F49FF',
  '--accent-ink': '#FFFFFF',
  '--alt': '#0E0E10',
  '--mist': '#E8EBFF',
  '--f-display': 'var(--ff-schibsted)',
  '--f-body': 'var(--ff-schibsted)',
  '--f-mono': 'var(--ff-geist-mono)',
  '--f-serif': 'var(--ff-instrument-serif)',
} as React.CSSProperties;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brand} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor color="#2F49FF" ink="#FFFFFF" />
      {children}
      <ConceptNotice name="W J Meade" url="https://www.wjmeade.co.uk/" />
    </div>
  );
}
