import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SmoothScroll } from '@sc/ui';
import { allFontVars } from '@/brands/fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'Second Coat: new brands and websites for East London businesses', template: '%s · Second Coat' },
  description: 'We rebuild local businesses as modern brands, with the website to match, before they pay a penny.',
};

export const viewport: Viewport = { themeColor: '#0c0c0c' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={allFontVars}>
      <body>
        <SmoothScroll />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
