import 'server-only';

export type Video = { id: number; title: string; description: string; url: string; thumbnail: string; duration: number; date: string; tags: string[] };
type Raw = { id: number; title: string; description?: string; url: string; thumbnail_large?: string; thumbnail_medium?: string; duration: number; upload_date: string; tags?: string };

/**
 * Public videos from the studio's Vimeo account (Vimeo's simple API, no key). Fetched on the server
 * and cached for an hour. Returns null if Vimeo can't be reached, and the page says so.
 */
export async function getVideos(user = 'biscuitbunker'): Promise<Video[] | null> {
  try {
    const r = await fetch(`https://vimeo.com/api/v2/${user}/videos.json`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(6000) });
    if (!r.ok) return null;
    const raw = (await r.json()) as Raw[];
    if (!Array.isArray(raw)) return null;
    return raw.map((v) => ({
      id: v.id,
      title: v.title,
      description: (v.description ?? '').replace(/<[^>]+>/g, '').slice(0, 280),
      url: v.url,
      thumbnail: v.thumbnail_large ?? v.thumbnail_medium ?? '',
      duration: v.duration,
      date: v.upload_date,
      tags: (v.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
    }));
  } catch {
    return null;
  }
}

/** Words that mark a film as an example of each service, matched against title, tags and description. */
const SERVICE_WORDS: Record<string, string[]> = {
  commercials: ['commercial', 'advert', 'ad', 'campaign', 'tvc', 'spot'],
  'branded-content': ['branded', 'brand', 'social', 'content', 'launch'],
  'corporate-film': ['corporate', 'company', 'event', 'conference', 'testimonial', 'documentary', 'interview'],
  'animation-motion': ['animation', 'animated', 'motion', 'graphics', 'explainer', '2d', '3d'],
  podcasts: ['podcast', 'episode', 'audio'],
};

/** The studio's own films that show a given service, best matches first. */
export function filmsFor(videos: Video[], service: string, limit = 3) {
  const words = SERVICE_WORDS[service] ?? [];
  const re = new RegExp(`\\b(${words.join('|')})s?\\b`, 'gi');
  return videos
    .map((v) => ({ v, score: `${v.title} ${v.tags.join(' ')} ${v.description}`.match(re)?.length ?? 0 }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.v);
}
