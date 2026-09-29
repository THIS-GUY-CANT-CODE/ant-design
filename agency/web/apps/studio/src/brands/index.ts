import type { CSSProperties } from 'react';

export type Slug = 'biscuit-bunker' | 'green-papaya' | 'rose-locksmith' | 'walthamstow-osteopaths' | 'wj-meade' | 'clapton-beauty-parlour';

export type Brand = {
  slug: Slug;
  name: string;
  industry: string;
  area: string;
  url: string;
  /** CSS variables consumed by the Tailwind theme (see globals.css) */
  vars: Record<string, string>;
  swatches: [name: string, hex: string][];
  type: { display: string; body: string };
  /** how the display face should be set in headlines */
  display: { weight: number; style?: 'italic' | 'normal'; stretch?: string; tracking: string };
};

const fonts = (display: string, body: string, mono = '--ff-geist-mono', serif = '--ff-instrument-serif') => ({
  '--f-display': `var(${display})`,
  '--f-body': `var(${body})`,
  '--f-mono': `var(${mono})`,
  '--f-serif': `var(${serif})`,
});

export const BRANDS: Record<Slug, Brand> = {
  'biscuit-bunker': {
    slug: 'biscuit-bunker', name: 'Biscuit Bunker', industry: 'Video production', area: 'Shoreditch, EC2A', url: 'https://biscuitbunker.com/',
    vars: { '--bg': '#0A0A0A', '--fg': '#F2F1ED', '--muted': '#8C8B86', '--line': 'rgb(242 241 237 / 0.12)', '--card': '#141414', '--accent': '#D7FF3F', '--accent-ink': '#0A0A0A', '--alt': '#F2F1ED', ...fonts('--ff-geist', '--ff-geist') },
    swatches: [['Jet', '#0A0A0A'], ['Off-white', '#F2F1ED'], ['Ball', '#D7FF3F'], ['Grey', '#8C8B86']],
    type: { display: 'Geist + Instrument Serif italic', body: 'Geist, Geist Mono' },
    display: { weight: 600, tracking: '-0.06em' },
  },
  'green-papaya': {
    slug: 'green-papaya', name: 'Green Papaya', industry: 'Restaurant', area: 'Hackney, E8', url: 'https://green-papaya.com/',
    vars: { '--bg': '#FFF4EA', '--fg': '#1A120D', '--muted': '#7A6A5E', '--line': 'rgb(26 18 13 / 0.12)', '--card': '#FFFFFF', '--accent': '#FF6A2B', '--accent-ink': '#1A120D', '--alt': '#1A120D', '--hanoi': '#BDF2D5', '--xian': '#E63022', ...fonts('--ff-bricolage', '--ff-inter') },
    swatches: [['Papaya', '#FF6A2B'], ['Ink', '#1A120D'], ['Cream', '#FFF4EA'], ['Hanoi mint', '#BDF2D5'], ["Xi'an chilli", '#E63022']],
    type: { display: 'Bricolage Grotesque (condensed)', body: 'Inter' },
    display: { weight: 800, stretch: '75%', tracking: '-0.045em' },
  },
  'rose-locksmith': {
    slug: 'rose-locksmith', name: 'Rose Locksmith & DIY', industry: 'Locksmith & hardware', area: 'Bethnal Green, E2', url: 'https://rosediy.co.uk/',
    vars: { '--bg': '#F2F1EC', '--fg': '#0F0F0F', '--muted': '#6E6D68', '--line': 'rgb(15 15 15 / 0.12)', '--card': '#FFFFFF', '--accent': '#FF3D7F', '--accent-ink': '#0F0F0F', '--alt': '#0F0F0F', '--steel': '#C9CDD2', ...fonts('--ff-host', '--ff-host') },
    swatches: [['Rose', '#FF3D7F'], ['Ink', '#0F0F0F'], ['Paper', '#F2F1EC'], ['Steel', '#C9CDD2']],
    type: { display: 'Host Grotesk', body: 'Host Grotesk, Geist Mono' },
    display: { weight: 700, tracking: '-0.055em' },
  },
  'walthamstow-osteopaths': {
    slug: 'walthamstow-osteopaths', name: 'Walthamstow Osteopaths', industry: 'Health clinic', area: 'Walthamstow, E17', url: 'https://www.walthamstowosteopaths.co.uk/',
    vars: { '--bg': '#EEEAE3', '--fg': '#1F2A22', '--muted': '#62695F', '--line': 'rgb(31 42 34 / 0.14)', '--card': '#F8F6F1', '--accent': '#2E4A3A', '--accent-ink': '#F8F6F1', '--alt': '#C9D4BC', '--clay': '#E3B49A', ...fonts('--ff-instrument-serif', '--ff-instrument-sans') },
    swatches: [['Bone', '#EEEAE3'], ['Forest', '#2E4A3A'], ['Sage', '#C9D4BC'], ['Clay', '#E3B49A']],
    type: { display: 'Instrument Serif', body: 'Instrument Sans' },
    display: { weight: 400, tracking: '-0.035em' },
  },
  'wj-meade': {
    slug: 'wj-meade', name: 'W J Meade', industry: 'Estate agent', area: 'Bow, E3', url: 'https://www.wjmeade.co.uk/',
    vars: { '--bg': '#F8F8F5', '--fg': '#0E0E10', '--muted': '#6B6F7A', '--line': 'rgb(14 14 16 / 0.12)', '--card': '#FFFFFF', '--accent': '#2F49FF', '--accent-ink': '#FFFFFF', '--alt': '#0E0E10', '--mist': '#E8EBFF', ...fonts('--ff-schibsted', '--ff-schibsted') },
    swatches: [['Cobalt', '#2F49FF'], ['Ink', '#0E0E10'], ['White', '#F8F8F5'], ['Mist', '#E8EBFF']],
    type: { display: 'Schibsted Grotesk', body: 'Schibsted Grotesk' },
    display: { weight: 700, tracking: '-0.05em' },
  },
  'clapton-beauty-parlour': {
    slug: 'clapton-beauty-parlour', name: 'Clapton Beauty Parlour', industry: 'Hair & beauty salon', area: 'Lower Clapton, E5', url: 'https://www.claptonbeautyparlour.co.uk/',
    vars: { '--bg': '#F6EFEA', '--fg': '#141212', '--muted': '#7A6F6B', '--line': 'rgb(20 18 18 / 0.12)', '--card': '#FFFFFF', '--accent': '#E0122F', '--accent-ink': '#FFFFFF', '--alt': '#141212', '--blush': '#F2C4C0', ...fonts('--ff-gloock', '--ff-inter', '--ff-geist-mono', '--ff-gloock') },
    swatches: [['Cherry', '#E0122F'], ['Ink', '#141212'], ['Powder', '#F6EFEA'], ['Blush', '#F2C4C0']],
    type: { display: 'Gloock', body: 'Inter' },
    display: { weight: 400, tracking: '-0.04em' },
  },
};

export const ORDER: Slug[] = ['biscuit-bunker', 'green-papaya', 'rose-locksmith', 'walthamstow-osteopaths', 'wj-meade', 'clapton-beauty-parlour'];
export const brandStyle = (s: Slug) => BRANDS[s].vars as CSSProperties;
