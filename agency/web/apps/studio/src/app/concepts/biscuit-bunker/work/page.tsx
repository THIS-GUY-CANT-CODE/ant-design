import type { Metadata } from 'next';
import { PageHead } from '../_components/page-head';
import { VIMEO } from '../_components/site';
import { getVideos } from '../_components/vimeo';
import { WorkGrid } from '../_components/work-grid';

export const metadata: Metadata = { title: 'Work', description: 'Commercials, branded content, corporate film, animation and podcasts, straight from the Biscuit Bunker Vimeo.' };
export const revalidate = 3600;

export default async function Work() {
  const videos = await getVideos();
  return (
    <main>
      <PageHead crumbs={[{ label: 'Work' }]} title="The work." intro="Straight from our Vimeo. Search it, filter it and press play." />
      <section className="mx-auto max-w-[1600px] px-5 pb-40 md:px-8">
        {videos?.length ? (
          <WorkGrid videos={videos} />
        ) : (
          <div className="rounded-3xl border border-line p-10">
            <p className="text-[20px]">Vimeo isn&apos;t answering right now, so the reel can&apos;t load here.</p>
            <a href={VIMEO} rel="noopener" className="mt-6 inline-block rounded-full bg-accent px-6 py-3.5 font-medium text-accent-ink">Watch everything on Vimeo ↗</a>
          </div>
        )}
      </section>
    </main>
  );
}
