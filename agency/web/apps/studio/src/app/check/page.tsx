import type { Metadata } from 'next';
import { Cursor, MotionKit } from '@sc/ui';
import { StudioChrome } from '../_studio/chrome';
import { Contact, Footer, Nav } from '../_studio/sections';
import { SiteChecker } from './checker';

export const metadata: Metadata = {
  title: 'Free website check',
  description: 'Twelve checks on your business website in ten seconds: mobile, security, Google basics, tap-to-call and more. Free, no sign-up.',
};

export default function Check() {
  return (
    <>
      <Cursor />
      <MotionKit />
      <StudioChrome />
      <Nav />
      <main className="pt-36">
        <section className="mx-auto max-w-[1100px] px-5 pb-32 md:px-8">
          <p className="text-[14px] text-muted">Free tool · 12 checks · about 10 seconds</p>
          <h1 className="mt-6 max-w-[14ch] font-display text-[clamp(3.2rem,8vw,7.5rem)] leading-[0.88] font-semibold tracking-[-0.06em]">
            How&apos;s your website <span className="font-serif font-normal tracking-[-0.02em] italic">really</span> doing?
          </h1>
          <p className="mt-6 max-w-xl text-[18px] leading-snug text-muted">Put in your address. We check what customers and Google notice first, and tell you in plain English what to fix.</p>
          <div className="mt-12"><SiteChecker /></div>
        </section>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
