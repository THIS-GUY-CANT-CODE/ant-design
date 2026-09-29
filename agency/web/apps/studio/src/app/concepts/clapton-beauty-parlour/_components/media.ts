import type { PhotoSrc, VideoSrc } from '@sc/ui';

/**
 * Every picture here has one job, named beside it. Stock (Pexels photos, Mixkit film) only stands in for
 * generic subjects: food, hands at work, keys. People and places a visitor will actually meet (staff, the
 * shopfront, the rooms) are never faked; those slots wait for the business's own photos.
 */
export const P = {
  /** Beauty card on the home page */
  manicure: { id: 19239100, alt: 'A manicure in progress with a nail file' },
  /** Poster for the hair film */
  cut: { id: 6599031, alt: 'A stylist cutting a client’s hair' },
} satisfies Record<string, PhotoSrc>;

/** Hair card on the home page */
export const FILM: VideoSrc = { id: 47643, slug: 'man-gets-haircut-from-stylist', alt: 'A stylist giving a client a haircut', poster: P.cut };
