import { expect, test } from '@playwright/test';
import { mockApis } from './mocks';

const C = '/concepts';
const ROUTES = [
  '/',
  '/check',
  '/marks',
  ...['biscuit-bunker', 'green-papaya', 'rose-locksmith', 'walthamstow-osteopaths', 'wj-meade', 'clapton-beauty-parlour'].flatMap((s) => [`${C}/${s}`, `/work/${s}`]),
  ...['work', 'services', 'services/commercials', 'services/podcasts', 'studio', 'brief'].map((p) => `${C}/biscuit-bunker/${p}`),
  ...['menu', 'visit', 'story'].map((p) => `${C}/green-papaya/${p}`),
  ...['keys', 'emergency', 'paint', 'visit'].map((p) => `${C}/rose-locksmith/${p}`),
  ...['treatments', 'treatments/structural-osteopathy', 'treatments/acupuncture', 'first-visit', 'about', 'visit', 'faq'].map((p) => `${C}/walthamstow-osteopaths/${p}`),
  ...['sell', 'buy', 'let', 'offices', 'about'].map((p) => `${C}/wj-meade/${p}`),
  ...['services', 'story', 'visit'].map((p) => `${C}/clapton-beauty-parlour/${p}`),
];

for (const route of ROUTES) {
  test(`${route} renders cleanly`, async ({ page }) => {
    await mockApis(page);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      // Vercel Analytics/Speed Insights scripts only exist on Vercel deployments; WebGL warnings come from headless GPUs
      if (m.type() === 'error' && !/404|WebGL|GL_|Failed to load resource/.test(m.text())) errors.push(m.text());
    });
    const res = await page.goto(route, { waitUntil: 'networkidle' });
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    // every concept must say it isn't the official site
    if (route.startsWith(C) || route.startsWith('/work/')) await expect(page.getByRole('note')).toContainText('Not the official');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'no horizontal scroll').toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('concepts are noindex', async ({ request }) => {
  const res = await request.get('/concepts/biscuit-bunker/services');
  expect(res.headers()['x-robots-tag']).toContain('noindex');
});
