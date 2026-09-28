import type { Metadata } from 'next';
import { ConceptNotice, Cursor } from '@sc/ui';

export const metadata: Metadata = {
  title: { absolute: "Green Papaya Xi'Viet: Vietnamese & Xi'an kitchen, Hackney (concept)" },
  description: "Concept redesign. Green Papaya, 191 Mare Street, Hackney: Northern Vietnamese and Xi'an cooking, family-run for over twenty years.",
  robots: { index: false, follow: false },
};

const brand = {
  '--bg': '#FFF4EA',
  '--fg': '#1A120D',
  '--muted': '#7A6A5E',
  '--line': 'rgb(26 18 13 / 0.12)',
  '--card': '#FFFFFF',
  '--accent': '#FF6A2B',
  '--accent-ink': '#1A120D',
  '--alt': '#1A120D',
  '--hanoi': '#BDF2D5',
  '--xian': '#E63022',
  '--f-display': 'var(--ff-bricolage)',
  '--f-body': 'var(--ff-inter)',
  '--f-mono': 'var(--ff-geist-mono)',
  '--f-serif': 'var(--ff-instrument-serif)',
} as React.CSSProperties;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={brand} className="min-h-screen bg-bg font-sans text-fg">
      <Cursor color="#1A120D" ink="#FFF4EA" />
      {children}
      <ConceptNotice name="Green Papaya" url="https://green-papaya.com/" className="bottom-20 md:bottom-4" />
    </div>
  );
}
