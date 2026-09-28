import type { PhotoSrc, VideoSrc } from '@sc/ui';

/** Stand-ins from Pexels and Mixkit until the clinic's own shoot. Swap an id to swap the shot. */
export const P = {
  examine: { id: 4506107, alt: 'An osteopath examining a patient’s back' },
  table: { id: 5793909, alt: 'A practitioner treating a patient lying on the treatment table' },
  shoulders: { id: 5473182, alt: 'Hands working on a patient’s shoulders' },
  shoulder: { id: 275768, alt: 'A shoulder massage, close up' },
  acupunctureBack: { id: 6193366, alt: 'Acupuncture needles along a patient’s back' },
  acupuncture: { id: 8313427, alt: 'Acupuncture treatment, close up' },
  acupunctureMan: { id: 8312859, alt: 'A man having acupuncture' },
} satisfies Record<string, PhotoSrc>;

export const FILM: VideoSrc = { id: 24753, slug: 'older-man-having-a-back-massage', alt: 'An older man having his back treated', poster: P.table };

export const HOME_PHOTOS = [P.examine, P.shoulders, P.acupunctureBack, P.table, P.shoulder, P.acupuncture];

/** One picture per treatment slug; anything not listed falls back to the examination shot. */
export const TREATMENT_PHOTO: Record<string, PhotoSrc> = {
  'structural-osteopathy': P.examine,
  'cranial-osteopathy': P.table,
  acupuncture: P.acupunctureBack,
  'sports-massage': P.shoulders,
  aromatherapy: P.shoulder,
};
