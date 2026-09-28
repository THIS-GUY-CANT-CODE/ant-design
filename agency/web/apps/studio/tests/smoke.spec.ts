import { expect, test } from '@playwright/test';

const ROUTES = [
  '/',
  ...['biscuit-bunker', 'green-papaya', 'rose-locksmith', 'walthamstow-osteopaths', 'wj-meade', 'clapton-beauty-parlour'].flatMap((s) => [`/concepts/${s}`, `/work/${s}`]),
];

for (const route of ROUTES) {
  test(`${route} renders cleanly`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      // Vercel Analytics/Speed Insights scripts only exist on Vercel deployments
      if (m.type() === 'error' && !m.text().includes('404')) errors.push(m.text());
    });
    const res = await page.goto(route, { waitUntil: 'networkidle' });
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1').first()).toBeVisible();
    // every concept must say it isn't the official site
    if (route !== '/') await expect(page.getByRole('note')).toContainText('Not the official');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, 'no horizontal scroll').toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test('concepts are noindex', async ({ request }) => {
  const res = await request.get('/concepts/biscuit-bunker');
  expect(res.headers()['x-robots-tag']).toContain('noindex');
});
