import type { PhotoSrc, VideoSrc } from '@sc/ui';

/**
 * Every picture here has one job, named beside it. Stock (Pexels photos, Mixkit film) only stands in for
 * generic subjects: food, hands at work, keys. People and places a visitor will actually meet (staff, the
 * shopfront, the rooms) are never faked; those slots wait for the business's own photos.
 */
export const P = {
  /** Hà Nội kitchen card */
  herbs: { id: 30506298, alt: 'A noodle bowl topped with fresh herbs' },
  /** Xi'an kitchen card */
  noodles: { id: 2636717, alt: 'Hand-pulled noodles, close up' },
} satisfies Record<string, PhotoSrc>;

/** "Still cooked fresh": the story section */
export const FILM: VideoSrc = { id: 9286, slug: 'cooking-asian-food', alt: 'Noodles cooked in a wok over a high flame', poster: { id: 34615582, alt: 'A chef stirring a wok as flames rise' } };
