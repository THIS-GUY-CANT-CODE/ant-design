import { Bricolage_Grotesque, Geist, Geist_Mono, Gloock, Host_Grotesk, Inter, Instrument_Sans, Instrument_Serif, Schibsted_Grotesk } from 'next/font/google';

// Loaded once here, self-hosted by next/font. Each brand wrapper maps these to --f-display / --f-body / --f-mono / --f-serif.
export const geist = Geist({ subsets: ['latin'], variable: '--ff-geist', display: 'swap' });
export const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--ff-geist-mono', display: 'swap' });
export const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--ff-instrument-serif', display: 'swap' });
export const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--ff-instrument-sans', display: 'swap' });
export const bricolage = Bricolage_Grotesque({ subsets: ['latin', 'vietnamese'], axes: ['wdth', 'opsz'], variable: '--ff-bricolage', display: 'swap' });
export const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--ff-inter', display: 'swap' });
export const hostGrotesk = Host_Grotesk({ subsets: ['latin'], variable: '--ff-host', display: 'swap' });
export const schibsted = Schibsted_Grotesk({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--ff-schibsted', display: 'swap' });
export const gloock = Gloock({ subsets: ['latin'], weight: '400', variable: '--ff-gloock', display: 'swap' });

export const allFontVars = [geist, geistMono, instrumentSerif, instrumentSans, bricolage, inter, hostGrotesk, schibsted, gloock]
  .map((f) => f.variable)
  .join(' ');
