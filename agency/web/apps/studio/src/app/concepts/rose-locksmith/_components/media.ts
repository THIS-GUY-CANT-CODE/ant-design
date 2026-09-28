import type { PhotoSrc, VideoSrc } from '@sc/ui';

/** Stand-ins from Pexels and Mixkit until the shop's own photos. Swap an id to swap the shot. */
export const P = {
  keys: { id: 114741, alt: 'A bunch of assorted metal keys on a dark surface' },
  keysClose: { id: 1011848, alt: 'Keys, close up' },
  brass: { id: 333838, alt: 'A pile of brass keys on red' },
  keysLaid: { id: 7630510, alt: 'Assorted keys laid out on a workbench' },
  keyInLock: { id: 101808, alt: 'A key turned in a front door lock' },
  lockMono: { id: 792031, alt: 'A door lock with its key, in black and white' },
  deadlock: { id: 279810, alt: 'A deadlock and handle with the key in it' },
  rollers: { id: 5799083, alt: 'A paint brush and rollers, covered in paint' },
  brushes: { id: 5798971, alt: 'Brushes and a roller on a freshly painted surface' },
  bucket: { id: 2293819, alt: 'A paint tray and rollers ready to go' },
  brushesClose: { id: 7885377, alt: 'Paint brushes, close up' },
} satisfies Record<string, PhotoSrc>;

export const FILM: VideoSrc = { id: 15109, slug: 'choosing-paint-colors', alt: 'Choosing paint colours from a swatch fan', poster: P.bucket };

export const HOME_PHOTOS = [P.keys, P.keyInLock, P.brass, P.rollers, P.deadlock, P.brushes];
