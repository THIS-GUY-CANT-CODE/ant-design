import type { PhotoSrc } from '@sc/ui';

/**
 * Every picture here has one job, named beside it. Stock (Pexels photos, Mixkit film) only stands in for
 * generic subjects: food, hands at work, keys. People and places a visitor will actually meet (staff, the
 * shopfront, the rooms) are never faked; those slots wait for the business's own photos.
 */
const P = {
  examine: { id: 4506107, alt: 'An osteopath examining a patient’s back' },
  table: { id: 5793909, alt: 'A practitioner treating a patient lying on the treatment table' },
  shoulders: { id: 5473182, alt: 'Hands working on a patient’s shoulders' },
  shoulder: { id: 275768, alt: 'A shoulder massage, close up' },
  acupunctureBack: { id: 6193366, alt: 'Acupuncture needles along a patient’s back' },
} satisfies Record<string, PhotoSrc>;

/** What each treatment looks like: shown when it opens in the list, and at the top of its own page. */
export const TREATMENT_PHOTO: Record<string, PhotoSrc> = {
  'structural-osteopathy': P.examine,
  'cranial-osteopathy': P.table,
  acupuncture: P.acupunctureBack,
  'sports-massage': P.shoulders,
  aromatherapy: P.shoulder,
};
