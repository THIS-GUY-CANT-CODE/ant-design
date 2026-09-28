import type { PhotoSrc, VideoSrc } from '@sc/ui';

/** Stand-ins from Pexels and Mixkit until the agency's own listings shoot. Swap an id to swap the shot. */
export const P = {
  terrace: { id: 20703515, alt: 'A row of London terraced houses' },
  whiteTerrace: { id: 20703514, alt: 'White-fronted terraced houses in London' },
  handover: { id: 8815915, alt: 'An agent holding out the keys to a new home' },
  buyer: { id: 7642008, alt: 'Keys handed over to a new owner indoors' },
  newHouse: { id: 7641904, alt: 'Handing over the keys of a new house' },
  holding: { id: 4971273, alt: 'Holding a bunch of house keys' },
  agentKeys: { id: 31015267, alt: 'An agent holding the keys to a new home' },
  purchased: { id: 8482872, alt: 'Keys handed over outside the purchased house' },
} satisfies Record<string, PhotoSrc>;

export const FILM: VideoSrc = { id: 4263, slug: 'ride-through-the-streets-of-london', alt: 'Driving through the streets of London', poster: P.terrace };

export const HOME_PHOTOS = [P.terrace, P.handover, P.holding, P.whiteTerrace, P.buyer, P.agentKeys];
