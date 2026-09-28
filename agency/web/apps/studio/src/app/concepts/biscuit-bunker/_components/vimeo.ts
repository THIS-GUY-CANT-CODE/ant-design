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
