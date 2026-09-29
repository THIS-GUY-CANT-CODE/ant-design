export const BASE = '/concepts/green-papaya';
export const ADDRESS = '191 Mare Street, London E8 3QE';
export const POSTCODE = 'E8 3QE';
/** Approximate; refined from the postcode at runtime. */
export const APPROX = { lat: 51.5419, lng: -0.0556 };
export const PHONE = ['020 8985 5486', '+442089855486'] as const;

export const PAGES = [
  { href: `${BASE}/menu`, label: 'Menu', sub: 'Search, filter, plan your table' },
  { href: `${BASE}/visit`, label: 'Visit', sub: 'Hours, map, plan a dinner' },
  { href: `${BASE}/story`, label: 'Our story', sub: 'Twenty years on Mare Street' },
] as const;

export type City = 'hanoi' | 'xian';
export type Dish = { name: string; city: City; desc: string; fav?: boolean; tags: string[] };
export const DISHES: Dish[] = [
  { name: 'Banana leaf tilapia', city: 'hanoi', desc: 'Whole tilapia, marinated and grilled in banana leaf.', fav: true, tags: ['fish', 'grilled'] },
  { name: 'Concubine noodles', city: 'xian', desc: 'Dry-fried flat noodles with chicken, potato and house chilli sauce.', fav: true, tags: ['noodles', 'chicken', 'spicy'] },
  { name: 'Bún thịt nem nướng', city: 'hanoi', desc: 'Rice vermicelli, grilled pork, spring rolls, herbs and nước chấm.', tags: ['noodles', 'pork', 'grilled', 'bun'] },
  { name: 'Zha jiang noodles', city: 'xian', desc: 'Noodles in a rich fermented bean and pork sauce.', tags: ['noodles', 'pork'] },
  { name: 'Rou jia mo', city: 'xian', desc: 'The Xi\'an "burger": slow-braised pork in a crisp flatbread bun.', tags: ['pork', 'bread', 'burger', 'street food'] },
  { name: 'Green papaya salad', city: 'hanoi', desc: 'Shredded green papaya, herbs, peanuts, lime and chilli.', tags: ['salad', 'fresh', 'peanut'] },
  { name: 'Summer rolls', city: 'hanoi', desc: 'Rice paper rolls with fresh herbs and a dipping sauce.', tags: ['fresh', 'starter', 'rolls'] },
  { name: 'Sweet potato & prawn', city: 'hanoi', desc: 'Crisp sweet potato and prawn fritters, wrapped in lettuce and herbs.', tags: ['prawn', 'seafood', 'starter', 'fried'] },
  { name: 'Crispy squid', city: 'xian', desc: 'Salt and pepper squid with chilli and spring onion.', tags: ['squid', 'seafood', 'fried', 'starter'] },
];
export const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const MAP_THEME = { land: '#FFF4EA', water: '#CFE6EC', park: '#D6F2E2', building: '#F7E7DA', road: '#FFFFFF', roadMajor: '#FFD3BF', label: '#7A6A5E', halo: '#FFF4EA', pin: '#FF6A2B', pinInk: '#1A120D' };
