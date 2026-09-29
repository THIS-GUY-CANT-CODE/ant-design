import { expect, test } from '@playwright/test';
import { mockApis } from './mocks';

const C = '/concepts';
test.beforeEach(async ({ page }) => mockApis(page));

test('mobile menu opens and lists every page', async ({ page }) => {
  await page.goto(`${C}/wj-meade`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Open menu' }).click();
  const nav = page.getByRole('navigation', { name: 'Mobile' });
  for (const l of ['Sell', 'Buy', 'Landlords', 'Offices', 'Since 1953']) await expect(nav.getByRole('link', { name: new RegExp(l) })).toBeVisible();
});

