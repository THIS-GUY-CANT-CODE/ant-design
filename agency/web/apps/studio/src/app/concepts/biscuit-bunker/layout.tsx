import type { Metadata } from 'next';
import { ConceptNotice, Cursor } from '@sc/ui';

export const metadata: Metadata = {
  title: { absolute: 'Biscuit Bunker: video production, Shoreditch (concept)' },
  description: 'Concept redesign. Biscuit Bunker makes commercials, branded content, corporate film, animation and podcasts from a converted dog biscuit factory in Shoreditch.',
  robots: { index: false, follow: false },
};

const brand = {
  '--bg': '#0A0A0A',
  '--fg': '#F2F1ED',
  '--muted': '#8C8B86',
  '--line': 'rgb(242 241 237 / 0.12)',
  '--card': '#141414',
  '--accent': '#D7FF3F',
  '--accent-ink': '#0A0A0A',
  '--alt': '#F2F1ED',
  '--f-display': 'var(--ff-geist)',
  '--f-body': 'var(--ff-geist)',
  '--f-mono': 'var(--ff-geist-mono)',
  '--f-serif': 'var(--ff-instrument-serif)',
} as React.CSSProperties;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brand} className="min-h-screen bg-bg font-sans text-fg selection:bg-accent selection:text-accent-ink">
      <Cursor />
      {children}
      <ConceptNotice name="Biscuit Bunker" url="https://biscuitbunker.com/" />
    </div>
  );
}
