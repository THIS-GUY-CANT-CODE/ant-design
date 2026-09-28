import type { PhotoSrc } from '@sc/ui';

/**
 * Every picture here has one job, named beside it. Stock (Pexels photos, Mixkit film) only stands in for
 * generic subjects: food, hands at work, keys. People and places a visitor will actually meet (staff, the
 * shopfront, the rooms) are never faked; those slots wait for the business's own photos.
 */
export const P = {
  /** Buy page header: the point of all the sums */
  holding: { id: 4971273, alt: 'Holding a bunch of house keys' },
  /** Landlords page header: the kind of homes they let */
  whiteTerrace: { id: 20703514, alt: 'White-fronted terraced houses in London' },
} satisfies Record<string, PhotoSrc>;
