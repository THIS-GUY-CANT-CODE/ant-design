// The studio's own settings (previously agency.json). Update the email and domain before launch.
export const STUDIO = {
  name: 'Second Coat',
  email: 'hello@example.com',
  prices: { refresh: 500, rebrand: 1200, care: 49 },
};
export const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`;

// Scouted and audited; next in line for the new treatment.
export const PIPELINE: [name: string, industry: string, area: string][] = [
  ['The Thatched House Dental Practice', 'Private dentist', 'Leytonstone, E15'],
  ["The Queen's Head", 'Community pub', 'Limehouse, E14'],
  ["Kelly's Florist", 'Florist', 'Well Street, E9'],
  ['Well Heeled', 'Shoe repair', 'Bethnal Green, E2'],
  ['Newham Bookshop', 'Independent bookshop', 'Upton Park, E13'],
  ['Repton Boxing Club', 'Boxing club', 'Bethnal Green, E2'],
  ["Abbott's Interiors", 'Blinds, shutters & flooring', 'Roman Road, E3'],
  ['Driving Force', 'Garage', 'Walthamstow, E17'],
  ['Brick Lane Bookshop', 'Bookshop', 'Brick Lane, E1'],
  ['Bowling & Co', 'Solicitors', 'Stratford, E15'],
  ['Denningtons', 'Florist', 'Roman Road, E3'],
  ['F. Cooke', 'Pie & mash', 'Hoxton, N1'],
];
