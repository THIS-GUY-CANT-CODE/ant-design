// Usage: pnpm capture   (with `pnpm start -p 3100` running)
// Photographs each concept's hero at desktop and mobile sizes into public/work/, for the portfolio and case studies.
import { chromium } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'http://localhost:3100';
const SLUGS = ['biscuit-bunker', 'green-papaya', 'rose-locksmith', 'walthamstow-osteopaths', 'wj-meade', 'clapton-beauty-parlour'];
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const slug of SLUGS) {
  for (const [kind, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: kind === 'mobile' ? 2 : 1 });
    await page.goto(`${BASE}/concepts/${slug}`, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: '[role=note]{display:none!important}' }); // hide the concept notice in portfolio shots
    await page.waitForTimeout(3500);
    await page.screenshot({ path: `public/work/${slug}-${kind}.jpg`, type: 'jpeg', quality: 82 });
    await page.close();
    console.log('captured', slug, kind);
  }
}
await browser.close();
