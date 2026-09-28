import type { PhotoSrc, VideoSrc } from '@sc/ui';

/**
 * Every picture here has one job, named beside it. Stock (Pexels photos, Mixkit film) only stands in for
 * generic subjects: food, hands at work, keys. People and places a visitor will actually meet (staff, the
 * shopfront, the rooms) are never faked; those slots wait for the business's own photos.
 */
export const P = {
  /** Keys page header: the awkward keys other shops send away */
  keysLaid: { id: 7630510, alt: 'Assorted keys laid out on a workbench' },
  /** Poster for the paint film */
  bucket: { id: 2293819, alt: 'A paint tray and rollers ready to go' },
} satisfies Record<string, PhotoSrc>;

/** Paint page header: "bring a chip and we'll mix it" */
export const FILM: VideoSrc = { id: 15109, slug: 'choosing-paint-colors', alt: 'Choosing paint colours from a swatch fan', poster: P.bucket };
