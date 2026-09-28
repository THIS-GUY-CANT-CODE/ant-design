import type { PhotoSrc, VideoSrc } from '@sc/ui';

/** Stand-ins from Pexels and Mixkit until the restaurant's own shoot. Swap an id to swap the shot. */
export const P = {
  pho: { id: 11783317, alt: 'A steaming bowl of pho, close up' },
  vietnamese: { id: 6646083, alt: 'A Vietnamese noodle dish in a bowl' },
  spread: { id: 2318966, alt: 'Noodles, fresh herbs and dipping sauce laid out on the table' },
  herbs: { id: 30506298, alt: 'A noodle bowl topped with fresh herbs' },
  wokFire: { id: 3054690, alt: 'Noodles tossed in a flaming wok' },
  noodles: { id: 2636717, alt: 'Hand-pulled noodles, close up' },
  friedNoodles: { id: 1815898, alt: 'Fried noodles with vegetables' },
  openKitchen: { id: 17785784, alt: 'A chef cooking over high flames in an open kitchen' },
  chefFlames: { id: 7205249, alt: 'A chef working the wok as the flames jump' },
  seafood: { id: 699953, alt: 'A plate of cooked seafood' },
  soup: { id: 1907227, alt: 'A bowl of broth and noodles' },
  chef: { id: 2544829, alt: 'A chef at the pass' },
} satisfies Record<string, PhotoSrc>;

export const FILM: VideoSrc = { id: 9286, slug: 'cooking-asian-food', alt: 'Noodles cooked in a wok over a high flame', poster: { id: 34615582, alt: 'A chef stirring a wok as flames rise' } };

export const HOME_PHOTOS = [P.spread, P.pho, P.wokFire, P.herbs, P.openKitchen, P.friedNoodles];
