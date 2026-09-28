import type { PhotoSrc, VideoSrc } from '@sc/ui';

/** Stand-ins from Pexels and Mixkit until the parlour's own shoot. Swap an id to swap the shot. */
export const P = {
  cut: { id: 6599031, alt: 'A stylist cutting a client’s hair' },
  scissors: { id: 3356170, alt: 'Scissors and comb mid-cut' },
  shortCut: { id: 15659486, alt: 'A short cut on wet hair, close up' },
  colour: { id: 4981476, alt: 'Gloved hands brushing colour through hair' },
  curls: { id: 7388937, alt: 'A colourist working dye through curly hair' },
  manicure: { id: 19239100, alt: 'A manicure in progress with a nail file' },
  polish: { id: 18227812, alt: 'Nail polish being applied' },
  red: { id: 3997381, alt: 'Red nail polish, close up' },
  facial: { id: 4207234, alt: 'A client relaxing during a facial' },
  nails: { id: 14267567, alt: 'A manicurist shaping nails' },
} satisfies Record<string, PhotoSrc>;

export const FILM: VideoSrc = { id: 47643, slug: 'man-gets-haircut-from-stylist', alt: 'A stylist giving a client a haircut', poster: P.cut };
export const FILM_2: VideoSrc = { id: 40112, slug: 'portrait-of-a-man-during-a-haircut', alt: 'A client mid-haircut', poster: P.scissors };

export const HOME_PHOTOS = [P.colour, P.manicure, P.cut, P.facial, P.red, P.curls];
