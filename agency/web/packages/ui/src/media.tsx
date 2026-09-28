'use client';
/* eslint-disable @next/next/no-img-element -- Pexels serves its own resized, compressed renditions; no need to re-optimise them */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ClipReveal } from './motion';
import { useReducedMotion } from './use-reduced-motion';

/**
 * Photos come from Pexels, videos from Mixkit. Both are free for commercial use with no attribution.
 * Each site keeps its picks in one `media.ts`, so swapping a shot for the client's own is a one-line change.
 */
export type PhotoSrc = { id: number; alt: string; /** CSS object-position, e.g. 'center 30%' */ pos?: string };
export type VideoSrc = { id: number; slug: string; poster: PhotoSrc; alt: string };

export const pexelsUrl = (id: number, w = 1600) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const WIDTHS = [480, 800, 1200, 1600, 2200];

/** Mixkit has used two URL schemes; offer both so whichever the CDN serves wins. */
export const mixkitSources = (v: VideoSrc) => [
  `https://assets.mixkit.co/videos/${v.id}/${v.id}-720.mp4`,
  `https://assets.mixkit.co/videos/${v.id}/${v.id}-1080.mp4`,
  `https://assets.mixkit.co/videos/preview/mixkit-${v.slug}-${v.id}-large.mp4`,
];

/** A cover-cropped photo that fills its box. If it cannot load, the box keeps its tint and shows the description. */
export function Photo({ photo, className, sizes = '100vw', priority = false, zoom = false }: { photo: PhotoSrc; className?: string; sizes?: string; priority?: boolean; zoom?: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    // An image that failed before hydration never fires onError in React; catch it here.
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) queueMicrotask(() => setFailed(true));
  }, []);
  return (
    <span className={`relative block overflow-hidden bg-[color-mix(in_srgb,var(--fg)_9%,var(--bg))] ${className ?? ''}`}>
      {failed ? (
        <span role="img" aria-label={photo.alt} className="absolute inset-0 grid place-items-center p-4 text-center font-mono text-[11px] leading-snug text-fg/50">
          {photo.alt}
        </span>
      ) : (
        <img
          ref={ref}
          src={pexelsUrl(photo.id)}
          srcSet={WIDTHS.map((w) => `${pexelsUrl(photo.id, w)} ${w}w`).join(', ')}
          sizes={sizes}
          alt={photo.alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          onError={() => setFailed(true)}
          style={{ objectPosition: photo.pos }}
          className={`absolute inset-0 size-full object-cover ${zoom ? 'transition-transform duration-[1.2s] ease-expo group-hover/photo:scale-[1.06]' : ''}`}
        />
      )}
    </span>
  );
}

/**
 * A looping, muted film. It only downloads and plays while on screen, stays on its still for visitors who
 * prefer less motion, and has a pause button (WCAG 2.2.2). If every source fails, the still stays.
 */
export function Film({ video, className, children, priority = false }: { video: VideoSrc; className?: string; children?: ReactNode; priority?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const held = useRef(false);
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced || failed) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && !held.current) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced, failed]);

  const sources = mixkitSources(video);
  return (
    <div className={`relative isolate overflow-hidden ${className ?? ''}`}>
      <div className="absolute inset-0 -z-10">
        <Photo photo={video.poster} priority={priority} className="size-full" />
      </div>
      {!failed && !reduced && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="none"
          aria-label={video.alt}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className={`absolute inset-0 -z-10 size-full object-cover transition-opacity duration-700 ${playing ? 'opacity-100' : 'opacity-0'}`}
        >
          {sources.map((src, i) => (
            <source key={src} src={src} type="video/mp4" onError={i === sources.length - 1 ? () => setFailed(true) : undefined} />
          ))}
        </video>
      )}
      {children}
      {!failed && !reduced && (
        <button
          type="button"
          aria-label={playing ? 'Pause film' : 'Play film'}
          onClick={() => {
            const v = ref.current;
            if (!v) return;
            held.current = !v.paused;
            if (v.paused) v.play().catch(() => {});
            else v.pause();
          }}
          className="absolute right-3 bottom-3 z-10 grid size-10 place-items-center rounded-full bg-black/45 text-white backdrop-blur transition hover:scale-110 hover:bg-black/70"
        >
          <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
            {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor" /> : <path d="M4.5 2.8v10.4L13 8Z" fill="currentColor" />}
          </svg>
        </button>
      )}
    </div>
  );
}

/** Editorial mosaic: the first shot is big, the rest tile around it. Captions slide up on hover. */
export function PhotoMosaic({ photos, className, captions = true, frameClassName = 'rounded-2xl' }: { photos: PhotoSrc[]; className?: string; captions?: boolean; frameClassName?: string }) {
  const spans = ['col-span-2 md:row-span-2', '', '', 'md:col-span-2', 'md:col-span-2', 'col-span-2'];
  return (
    <div className={`grid auto-rows-[42vw] grid-cols-2 gap-2 md:auto-rows-[19vw] md:grid-cols-4 md:gap-3 ${className ?? ''}`}>
      {photos.slice(0, 6).map((p, i) => (
        <figure key={p.id} className={`group/photo relative overflow-hidden ${frameClassName} ${spans[i] ?? ''}`}>
          <Photo photo={p} zoom sizes={i === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'} className="size-full" />
          {captions && (
            <figcaption className="pointer-events-none absolute inset-x-2 bottom-2 translate-y-2 rounded-lg bg-black/55 px-3 py-2 text-[12px] leading-snug text-white opacity-0 backdrop-blur transition duration-500 ease-expo group-hover/photo:translate-y-0 group-hover/photo:opacity-100">
              {p.alt}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

/** A swipeable row of photos that snaps to each frame. Scrolls with trackpad, touch, or the arrow buttons. */
export function PhotoRail({ photos, label, className, frameClassName = 'aspect-[4/5] w-[72vw] md:w-[28vw]' }: { photos: PhotoSrc[]; label: string; className?: string; frameClassName?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const step = (dir: number) => {
    const el = ref.current;
    if (!el) return;
    const frame = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * ((frame?.offsetWidth ?? 300) + 12), behavior: 'smooth' });
  };
  return (
    <section aria-label={label} className={className}>
      <div ref={ref} tabIndex={0} className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] focus-visible:outline-2 [&::-webkit-scrollbar]:hidden">
        {photos.map((p) => (
          <figure key={p.id} className={`group/photo relative shrink-0 snap-start ${frameClassName}`}>
            <Photo photo={p} zoom sizes="(min-width: 768px) 28vw, 72vw" className="size-full rounded-[inherit]" />
            <figcaption className="sr-only">{p.alt}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        {[-1, 1].map((d) => (
          <button key={d} type="button" aria-label={d < 0 ? 'Previous photos' : 'Next photos'} onClick={() => step(d)} className="grid size-11 place-items-center rounded-full border border-line transition hover:bg-fg hover:text-bg">
            <svg viewBox="0 0 16 16" className={`size-4 ${d < 0 ? 'rotate-180' : ''}`} aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>
    </section>
  );
}

const isFilm = (m: PhotoSrc | VideoSrc): m is VideoSrc => 'slug' in m;

/** Wide photo or film that opens from an inset window as it enters. Used under page headers. */
export function Banner({ media, className = 'mt-12 aspect-[4/3] rounded-3xl md:aspect-[21/9]' }: { media: PhotoSrc | VideoSrc; className?: string }) {
  return (
    <ClipReveal className={`overflow-hidden ${className}`} radius={24}>
      {isFilm(media) ? <Film video={media} priority className="size-full" /> : <Photo photo={media} priority sizes="(min-width: 1600px) 1600px, 100vw" className="size-full" />}
    </ClipReveal>
  );
}

/** Home page "in pictures" block: a heading, a wide film, and a photo mosaic, in the site's own type and colours. */
export function InPictures({ title, intro, film, photos, titleClassName = '', frameClassName = 'rounded-2xl', className = '' }: { title: ReactNode; intro?: string; film?: VideoSrc; photos: PhotoSrc[]; titleClassName?: string; frameClassName?: string; className?: string }) {
  return (
    <section className={`mx-auto max-w-[1600px] px-4 py-24 md:px-8 md:py-32 ${className}`}>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <h2 className={`max-w-[18ch] font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.92] ${titleClassName}`}>{title}</h2>
        {intro && <p className="max-w-sm text-[17px] leading-snug text-muted">{intro}</p>}
      </div>
      {film && (
        <ClipReveal className={`mb-2 aspect-[4/5] overflow-hidden md:mb-3 md:aspect-[21/9] ${frameClassName}`} radius={24}>
          <Film video={film} className="size-full" />
        </ClipReveal>
      )}
      <PhotoMosaic photos={photos} frameClassName={frameClassName} />
    </section>
  );
}
