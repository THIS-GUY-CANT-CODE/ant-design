import { expect, test } from '@playwright/test';
import { mockApis } from './mocks';

const C = '/concepts';
test.beforeEach(async ({ page }) => mockApis(page));

test('command menu opens with the keyboard and navigates', async ({ page }) => {
  await page.goto(`${C}/rose-locksmith`, { waitUntil: 'networkidle' });
  await page.keyboard.press('Control+k');
  await page.getByPlaceholder(/Search keys/).fill('paint calculator');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/rose-locksmith\/paint#calculator/);
});

test('Rose: postcode coverage check', async ({ page }) => {
  await page.goto(`${C}/rose-locksmith/emergency`, { waitUntil: 'networkidle' });
  await page.getByLabel('Your postcode').fill('E2 0AA');
  await page.getByRole('button', { name: 'Check' }).click();
  await expect(page.locator('#coverage')).toContainText('is in our call-out area');
  await page.getByLabel('Your postcode').fill('SW1A 1AA');
  await page.getByRole('button', { name: 'Check' }).click();
  await expect(page.locator('#coverage')).toContainText('outside the areas we list');
  await page.getByLabel('Your postcode').fill('not a postcode');
  await page.getByRole('button', { name: 'Check' }).click();
  await expect(page.locator('#coverage')).toContainText('doesn’t look like a UK postcode');
});

test('Rose: paint calculator, palette and forecast', async ({ page }) => {
  await page.goto(`${C}/rose-locksmith/paint`, { waitUntil: 'networkidle' });
  await expect(page.locator('#calculator')).toContainText('5.5L');
  await expect(page.locator('#calculator')).toContainText('1 × 5L + 1 × 1L');
  await page.getByRole('button', { name: 'Olive' }).click();
  await page.getByRole('button', { name: 'Save to palette' }).click();
  await expect(page.getByText('Your palette (1)')).toBeVisible();
  await expect(page.locator('#forecast li')).toHaveCount(7);
  await expect(page.locator('#forecast li').nth(1)).toContainText('Skip');
  await expect(page.locator('#forecast li').nth(3)).toContainText('Good');
});

test('Rose: live trains and stock search on the visit page', async ({ page }) => {
  await page.goto(`${C}/rose-locksmith/visit`, { waitUntil: 'networkidle' });
  await expect(page.locator('#trains')).toContainText('Bethnal Green');
  await expect(page.locator('#trains')).toContainText('Epping');
  await expect(page.locator('#trains')).toContainText('Central');
  await expect(page.locator('#trains')).toContainText('Due');
  await page.getByLabel('What are you looking for?').fill('garage remote');
  await expect(page.locator('#stock')).toContainText('Garage & parking remotes');
});

test('Green Papaya: table planner and dinner planner', async ({ page }) => {
  await page.goto(`${C}/green-papaya/menu`, { waitUntil: 'networkidle' });
  await page.getByLabel('Search the menu').fill('squid');
  await expect(page.locator('li[id]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Add Crispy squid to your table' }).click();
  await expect(page.locator('#planner')).toContainText('Crispy squid');
  await page.goto(`${C}/green-papaya/visit`, { waitUntil: 'networkidle' });
  await page.locator('#plan input[type=date]').fill('2026-10-05');
  await expect(page.locator('#plan')).toContainText('closed on Mondays');
  await page.locator('#plan input[type=date]').fill('2026-10-06');
  await page.getByRole('button', { name: '7:30pm' }).click();
  await expect(page.locator('#plan')).toContainText('Tuesday 6 October, 7:30pm');
  await expect(page.getByRole('link', { name: 'Google Calendar ↗' })).toHaveAttribute('href', /calendar\.google\.com/);
});

test('Walthamstow: finder, checklist and validated enquiry', async ({ page }) => {
  await page.goto(`${C}/walthamstow-osteopaths/treatments`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Neck & shoulders' }).click();
  await expect(page.locator('#finder li').first()).toContainText('Structural osteopathy');
  await page.goto(`${C}/walthamstow-osteopaths/first-visit`, { waitUntil: 'networkidle' });
  await page.locator('#checklist label').first().click();
  await expect(page.locator('#checklist')).toContainText('1/5');
  await page.getByRole('button', { name: 'Write the email' }).click();
  await expect(page.locator('#ask')).toContainText('Tell us your name');
  await page.getByLabel('Your name').fill('Sam');
  await page.getByLabel('Email').fill('nope');
  await page.getByRole('button', { name: 'Write the email' }).click();
  await expect(page.locator('#ask')).toContainText('That email doesn’t look right');
});

test('W J Meade: stamp duty, deposits and nearest office', async ({ page }) => {
  await page.goto(`${C}/wj-meade/buy`, { waitUntil: 'networkidle' });
  await expect(page.locator('#stamp-duty')).toContainText('£12,500');
  await page.getByRole('button', { name: 'First-time buyer' }).click();
  await expect(page.locator('#stamp-duty')).toContainText('£7,500');
  await expect(page.locator('#mortgage')).toContainText('£2,251.12');
  await page.goto(`${C}/wj-meade/let`, { waitUntil: 'networkidle' });
  await expect(page.locator('#deposit')).toContainText('£2,307.69');
  await page.goto(`${C}/wj-meade/offices`, { waitUntil: 'networkidle' });
  await page.getByPlaceholder('Your postcode').fill('E15 3AB');
  await page.getByRole('button', { name: 'Find' }).click();
  await expect(page.getByText(/Stratford is closest/)).toBeVisible();
});

test('W J Meade: valuation form summarises for a call', async ({ page }) => {
  await page.goto(`${C}/wj-meade/sell`, { waitUntil: 'networkidle' });
  const form = page.locator('form').filter({ hasText: /your home worth/ }).first();
  await form.getByRole('button', { name: 'Book my free valuation' }).click();
  await expect(form).toContainText('Enter a full UK postcode');
  await form.getByLabel('Property postcode').fill('E3 4QS');
  await form.getByLabel('Your name').fill('Alex');
  await form.getByLabel('Email or phone').fill('07700 900123');
  await form.getByRole('button', { name: 'Book my free valuation' }).click();
  await expect(page.getByText('Ready to send.')).toBeVisible();
  await expect(page.locator('pre')).toContainText('2-bed flat, E3 4QS');
});

test('Clapton: price list search and wedding planner', async ({ page }) => {
  await page.goto(`${C}/clapton-beauty-parlour/services`, { waitUntil: 'networkidle' });
  await page.getByLabel('Search services').fill('nails');
  await page.getByRole('button', { name: 'Beauty' }).click();
  await page.getByLabel('Search services').fill('');
  await expect(page.getByText('Manicure')).toBeVisible();
  await page.locator('#wedding input[type=date]').fill('2027-06-12');
  await expect(page.locator('#wedding ol li')).toHaveCount(5);
  await expect(page.locator('#wedding')).toContainText('Sat 12 June');
});

test('Biscuit Bunker: brief builder works out formats', async ({ page }) => {
  await page.goto(`${C}/biscuit-bunker/brief`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Commercial', exact: true }).click();
  await page.getByRole('button', { name: 'Next →' }).click();
  await page.getByRole('button', { name: 'Build awareness' }).click();
  await page.getByRole('button', { name: 'Next →' }).click();
  await page.getByRole('button', { name: 'TikTok' }).click();
  await page.getByRole('button', { name: 'TV' }).click();
  await expect(page.getByText('16:9 broadcast master (Clearcast)')).toBeVisible();
  await page.getByRole('button', { name: 'Next →' }).click();
  await page.getByRole('button', { name: '£10k to £25k' }).click();
  await page.getByRole('button', { name: 'Next →' }).click();
  await page.getByLabel('Name').fill('Jo');
  await page.getByLabel('Email').fill('jo@example.com');
  await page.getByRole('button', { name: 'Build my brief' }).click();
  await expect(page.locator('pre')).toContainText('What: Commercial');
  await expect(page.locator('pre')).toContainText('9:16 vertical');
});

test('Studio: website check shows a scored report', async ({ page }) => {
  await page.route('**/api/check', (r) => r.fulfill({ json: { url: 'https://a.co/', finalUrl: 'https://a.co/', status: 200, ms: 300, bytes: 1000, score: 72, title: 'A', checks: [{ id: 'tel', label: 'Tap to call', weight: 5, pass: false, detail: 'No tap-to-call link.', why: 'Calls matter.' }] } }));
  await page.goto('/check', { waitUntil: 'networkidle' });
  await page.getByLabel('Website address').fill('a.co');
  await page.getByRole('button', { name: 'Check my site' }).click();
  await expect(page.getByText('Decent, with easy wins.')).toBeVisible();
  await expect(page.getByText('Calls matter.')).toBeVisible();
});

test('Studio: website check API refuses private addresses', async ({ request }) => {
  for (const url of ['http://127.0.0.1', 'http://169.254.169.254/', 'localhost', 'ftp://a.com']) {
    const r = await request.post('/api/check', { data: { url } });
    expect(r.status()).toBeGreaterThanOrEqual(400);
  }
});

test('pictures sit inside the sections they illustrate', async ({ page }) => {
  const pexels = 'img[src*="images.pexels.com"]';
  // Green Papaya: each kitchen shows its own dish
  await page.goto(`${C}/green-papaya`);
  const kitchens = page.locator('#kitchens article');
  await kitchens.first().scrollIntoViewIfNeeded();
  for (const k of [0, 1]) await expect.poll(() => kitchens.nth(k).locator(pexels).evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
  // Walthamstow: opening a treatment shows what it looks like
  await page.goto(`${C}/walthamstow-osteopaths`);
  await page.getByRole('button', { name: /Acupuncture/ }).click();
  await expect(page.locator(`#treatments ${pexels}`).first()).toBeVisible();
  // Clapton: the hair card's film falls back to its still when the video can't load (Mixkit is mocked as 404)
  await page.goto(`${C}/clapton-beauty-parlour`);
  const services = page.locator('#services');
  await services.scrollIntoViewIfNeeded();
  await expect(services.locator('video')).toHaveCount(0);
  await expect(services.locator(pexels)).toHaveCount(2);
});

test('only pages where a picture earns its place open with one', async ({ page }) => {
  for (const path of ['/concepts/rose-locksmith/keys', '/concepts/rose-locksmith/paint', '/concepts/wj-meade/buy', '/concepts/wj-meade/let', '/concepts/walthamstow-osteopaths/treatments/acupuncture']) {
    await page.goto(path);
    await expect(page.locator('header img[src*="images.pexels.com"]').first(), path).toBeVisible();
  }
  for (const path of ['/concepts/green-papaya/menu', '/concepts/wj-meade/sell', '/concepts/biscuit-bunker/studio']) {
    await page.goto(path);
    await expect(page.locator('header img[src*="images.pexels.com"]'), path).toHaveCount(0);
  }
});
