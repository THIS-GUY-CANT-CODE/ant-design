export const BASE = '/concepts/clapton-beauty-parlour';
export const FRESHA = 'https://www.fresha.com/lvp/clapton-beauty-parlour-lower-clapton-road-london-8JvwMV';
export const ADDRESS = '21 Lower Clapton Road, London E5 0NS';
export const POSTCODE = 'E5 0NS';
/** Approximate; refined from the postcode at runtime. */
export const APPROX = { lat: 51.5512, lng: -0.0548 };
export const PHONE = ['020 8985 4329', '+442089854329'] as const;

export const PAGES = [
  { href: `${BASE}/services`, label: 'Services', sub: 'Price list & booking' },
  { href: `${BASE}/story`, label: 'Our story', sub: 'Since 1930' },
  { href: `${BASE}/visit`, label: 'Visit', sub: 'Hours, map, trains' },
] as const;

// Tuesday to Friday 10 to 6, Saturday 9 to 5 (minutes from midnight). 0 = Sunday.
export const HOURS: Record<number, [number, number][]> = { 2: [[600, 1080]], 3: [[600, 1080]], 4: [[600, 1080]], 5: [[600, 1080]], 6: [[540, 1020]] };
export const HOURS_TEXT: [number, string, string][] = [
  [1, 'Monday', 'Closed'], [2, 'Tuesday', '10am to 6pm'], [3, 'Wednesday', '10am to 6pm'], [4, 'Thursday', '10am to 6pm'],
  [5, 'Friday', '10am to 6pm'], [6, 'Saturday', '9am to 5pm'], [0, 'Sunday', 'Closed'],
];

export type Service = { name: string; cat: 'Hair' | 'Beauty' | 'Body'; desc: string; occasions: string[]; note?: string };
export const SERVICES: Service[] = [
  { name: 'Cut & finish', cat: 'Hair', desc: 'A cut and a blow-dry finish, for any length.', occasions: ['regular', 'event'] },
  { name: 'Colour', cat: 'Hair', desc: 'From a root touch-up to a full change of colour.', occasions: ['change', 'regular'] },
  { name: 'Hair extensions', cat: 'Hair', desc: 'Length and volume, fitted and blended in.', occasions: ['change', 'event', 'wedding'] },
  { name: "Men's grooming", cat: 'Hair', desc: 'Cuts and tidy-ups for men.', occasions: ['regular'] },
  { name: 'Wedding hair', cat: 'Hair', desc: 'For the day itself, with a trial beforehand.', occasions: ['wedding'] },
  { name: 'Facials', cat: 'Beauty', desc: 'A cleanse and treatment for your skin.', occasions: ['pamper', 'wedding', 'event'] },
  { name: 'Manicure', cat: 'Beauty', desc: 'Shape, cuticles and polish.', occasions: ['pamper', 'event', 'wedding'] },
  { name: 'Pedicure', cat: 'Beauty', desc: 'The same care, for feet.', occasions: ['pamper', 'wedding'] },
  { name: 'Beauty therapy', cat: 'Beauty', desc: 'Our wider range of beauty treatments. Ask us what’s on.', occasions: ['pamper'] },
  { name: 'Advanced electrolysis', cat: 'Body', desc: 'Hair removal using a fine probe and a small electric current.', occasions: ['removal'] },
  { name: 'Spray tanning', cat: 'Body', desc: 'An even, sunless tan.', occasions: ['event', 'wedding'] },
  { name: 'Sunbeds', cat: 'Body', desc: 'Available to over-18s only, by law.', occasions: [], note: '18+' },
];
export const OCCASIONS = [
  ['regular', 'My usual'],
  ['change', 'Something new'],
  ['event', 'A night out or event'],
  ['wedding', 'A wedding'],
  ['pamper', 'Some time for me'],
  ['removal', 'Hair removal'],
] as const;

export const MAP_THEME = { land: '#F6EFEA', water: '#D9DEE3', park: '#EADFD6', building: '#EFE5DE', road: '#FFFFFF', roadMajor: '#F2C4C0', label: '#7A6F6B', halo: '#F6EFEA', pin: '#E0122F', pinInk: '#FFFFFF' };
