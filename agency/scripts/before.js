// Captures "before" screenshots of each client's CURRENT website.
// Run on your own machine (the build sandbox can't reach client sites):
//   cd agency/scripts && npm install && npx playwright install chromium && npm run before
// Optional: npm run before -- <slug>   (just one client)
// Saves clients/<slug>/before/{desktop.png, mobile.png, desktop-card.jpg} and prints a quick audit.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const only = process.argv[2];
const slugs = fs.readdirSync(path.join(root, 'clients'))
  .filter(s => fs.existsSync(path.join(root, 'clients', s, 'meta.json')) && (!only || s === only));

(async () => {
  const browser = await chromium.launch();
  for (const slug of slugs) {
    const meta = JSON.parse(fs.readFileSync(path.join(root, 'clients', slug, 'meta.json'), 'utf8'));
    if (!meta.url) { console.log(`- ${slug}: no url, skipped`); continue; }
    const out = path.join(root, 'clients', slug, 'before');
    fs.mkdirSync(out, { recursive: true });
    try {
      // Desktop
      const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      const t0 = Date.now();
      const res = await d.goto(meta.url, { waitUntil: 'load', timeout: 45000 });
      const loadMs = Date.now() - t0;
      await d.waitForTimeout(1500);
      await d.screenshot({ path: path.join(out, 'desktop-card.jpg'), type: 'jpeg', quality: 78 });
      await d.screenshot({ path: path.join(out, 'desktop.png'), fullPage: true });
      const info = await d.evaluate(() => ({
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.content || '',
        viewportMeta: !!document.querySelector('meta[name="viewport"]'),
        hasTel: !!document.querySelector('a[href^="tel:"]'),
        schema: !!document.querySelector('script[type="application/ld+json"]'),
        copyright: (document.body.innerText.match(/©\s*(\d{4})/) || [])[1] || '',
        imgsNoAlt: [...document.images].filter(i => !i.alt).length,
        generator: document.querySelector('meta[name="generator"]')?.content || '',
      }));
      // Mobile
      const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
      await m.goto(meta.url, { waitUntil: 'load', timeout: 45000 });
      await m.waitForTimeout(1500);
      await m.screenshot({ path: path.join(out, 'mobile.png'), fullPage: true });
      const overflow = await m.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      const tinyText = await m.evaluate(() => [...document.querySelectorAll('p,li,a,span')].filter(e => e.offsetParent && parseFloat(getComputedStyle(e).fontSize) < 12).length);
      await d.close(); await m.close();

      const report = [
        `# Before capture: ${meta.name}`, '', `Captured ${new Date().toISOString().slice(0, 10)} from ${meta.url} (HTTP ${res?.status()})`, '',
        `- Load time (desktop, to load event): ${(loadMs / 1000).toFixed(1)}s`,
        `- Title: "${info.title}"`,
        `- Meta description: ${info.description ? 'yes' : '**missing**'}`,
        `- Mobile viewport tag: ${info.viewportMeta ? 'yes' : '**missing**'}`,
        `- Horizontal scroll on mobile: ${overflow ? '**yes**' : 'no'}`,
        `- Elements with text under 12px on mobile: ${tinyText}`,
        `- Tap-to-call link: ${info.hasTel ? 'yes' : '**no**'}`,
        `- Structured data (schema): ${info.schema ? 'yes' : '**no**'}`,
        `- Copyright year: ${info.copyright || 'not found'}`,
        `- Images without alt text: ${info.imgsNoAlt}`,
        `- Platform: ${info.generator || 'unknown'}`,
        '', 'Next: run PageSpeed Insights (mobile) and fill in the score table in audit.md.',
      ].join('\n');
      fs.writeFileSync(path.join(out, 'report.md'), report + '\n');
      console.log(`✓ ${slug}: ${(loadMs / 1000).toFixed(1)}s, overflow=${overflow}, tel=${info.hasTel}, ©${info.copyright || '?'}`);
    } catch (e) {
      console.log(`✗ ${slug}: ${e.message.split('\n')[0]}`);
    }
  }
  await browser.close();
  console.log('\nNow run: node portfolio.js  (turns on the before/after sliders)');
})();
