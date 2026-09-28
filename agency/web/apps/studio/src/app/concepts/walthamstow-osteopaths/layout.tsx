import type { Metadata } from 'next';
import { ConceptNotice, Cursor } from '@sc/ui';

export const metadata: Metadata = {
  title: { absolute: 'Walthamstow Osteopaths: No.72 St Mary Road, E17 (concept)' },
  description: 'Concept redesign. Walthamstow Osteopaths at No.72 St Mary Road, E17: structural and cranial osteopathy, acupuncture, sports massage, aromatherapy and nutritional therapy since 2000.',
  robots: { index: false, follow: false },
};

const brand = {
  '--bg': '#EEEAE3',
  '--fg': '#1F2A22',
  '--muted': '#62695F',
  '--line': 'rgb(31 42 34 / 0.14)',
  '--card': '#F8F6F1',
  '--accent': '#2E4A3A',
  '--accent-ink': '#F8F6F1',
  '--alt': '#C9D4BC',
  '--clay': '#E3B49A',
  '--f-display': 'var(--ff-instrument-serif)',
  '--f-body': 'var(--ff-instrument-sans)',
  '--f-mono': 'var(--ff-geist-mono)',
  '--f-serif': 'var(--ff-instrument-serif)',
} as React.CSSProperties;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brand} className="min-h-screen overflow-x-clip bg-bg font-sans text-fg">
      <Cursor color="#2E4A3A" ink="#F8F6F1" />
      {children}
      <ConceptNotice name="Walthamstow Osteopaths" url="https://www.walthamstowosteopaths.co.uk/" />
    </div>
  );
}
