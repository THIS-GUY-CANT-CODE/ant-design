import type { PhotoSrc, VideoSrc } from '@sc/ui';

/** Stand-ins from Pexels and Mixkit until the studio drops in its own stills. Swap an id to swap the shot. */
export const P = {
  crew: { id: 19224452, alt: 'A crew shooting on location with camera and boom' },
  set: { id: 30773261, alt: 'A lit film set with crew and camera' },
  mic: { id: 27616685, alt: 'A studio microphone ready to record' },
  podcast: { id: 33923596, alt: 'Recording a podcast in the studio' },
  podcastSet: { id: 34519002, alt: 'Camera and microphone set up for a podcast' },
  edit: { id: 31718971, alt: 'An edit timeline on a monitor' },
  desk: { id: 6953871, alt: 'A microphone and laptop set up for recording' },
} satisfies Record<string, PhotoSrc>;

export const FILM: VideoSrc = { id: 46353, slug: 'using-a-clapperboard-to-start-filming-a-shot', alt: 'A clapperboard marks the start of a take', poster: P.set };

export const HOME_PHOTOS = [P.crew, P.podcast, P.edit, P.set, P.mic, P.podcastSet];

/** One picture per service slug. */
export const SERVICE_PHOTO: Record<string, PhotoSrc> = {
  commercials: P.set,
  'branded-content': P.crew,
  'corporate-film': P.podcastSet,
  'animation-motion': P.edit,
  podcasts: P.podcast,
};
