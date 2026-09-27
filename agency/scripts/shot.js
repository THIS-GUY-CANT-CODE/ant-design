// Usage: node scripts/shot.js <slug>
// Saves after/desktop.png, after/mobile.png and after/brand-book.png, and reports any horizontal overflow or JS errors.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const slug = process.argv[2];
  if (!slug) { console.error('usage: node scripts/shot.js <slug>'); process.exit(1); }
  const dir = path.join(__dirname, '..', 'clients', slug);
  const b = await chromium.launch();
  const jobs = [['site/index.html', 'desktop.png', 1440], ['site/index.html', 'mobile.png', 390], ['brand-book/index.html', 'brand-book.png', 1440]];
  let bad = false;
  for (const [src, out, w] of jobs) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(dir, src), { waitUntil: 'load', timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(600);
    await p.screenshot({ path: path.join(dir, 'after', out), fullPage: true });
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w || errs.length) bad = true;
    console.log(`${out}: width ${sw}/${w}${errs.length ? ' errors: ' + errs.join('; ') : ''}`);
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
