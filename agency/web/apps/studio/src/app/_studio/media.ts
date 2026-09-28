import type { PhotoSrc, VideoSrc } from '@sc/ui';
import type { Slug } from '@/brands';
import * as bunker from '../concepts/biscuit-bunker/_components/media';
import * as clapton from '../concepts/clapton-beauty-parlour/_components/media';
import * as papaya from '../concepts/green-papaya/_components/media';
import * as rose from '../concepts/rose-locksmith/_components/media';
import * as no72 from '../concepts/walthamstow-osteopaths/_components/media';
import * as meade from '../concepts/wj-meade/_components/media';

/** Each concept's picture set, for its case study. */
export const CONCEPT_MEDIA: Record<Slug, { film: VideoSrc; photos: PhotoSrc[] }> = {
  'biscuit-bunker': { film: bunker.FILM, photos: Object.values(bunker.P) },
  'green-papaya': { film: papaya.FILM, photos: Object.values(papaya.P) },
  'rose-locksmith': { film: rose.FILM, photos: Object.values(rose.P) },
  'walthamstow-osteopaths': { film: no72.FILM, photos: Object.values(no72.P) },
  'wj-meade': { film: meade.FILM, photos: Object.values(meade.P) },
  'clapton-beauty-parlour': { film: clapton.FILM, photos: Object.values(clapton.P) },
};

/** Second Coat's own reel: a wall getting its fresh coat. */
export const STUDIO_FILM: VideoSrc = { id: 2298, slug: 'a-couple-in-love-painting-a-wall', alt: 'Two people rolling fresh paint onto a wall', poster: rose.P.bucket };

/** One shot from each kind of place we rebrand. */
export const STUDIO_PHOTOS: PhotoSrc[] = [papaya.P.wokFire, rose.P.keys, clapton.P.colour, meade.P.terrace, no72.P.shoulders, bunker.P.crew];
