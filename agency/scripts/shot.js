// Usage: node scripts/shot.js <slug>
// Saves after/desktop.png, after/mobile.png and after/brand-book.png (plus -card.jpg and -full.jpg for the site), and reports any horizontal overflow or JS errors.
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
    // reducedMotion: every site has a static fallback, so full-page captures show final states instead of scroll-pinned gaps
    const p = await b.newPage({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + path.join(dir, src), { waitUntil: 'load', timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(2200); await p.evaluate(() => document.querySelectorAll('.rv').forEach(e => e.classList.add('in'))); await p.waitForTimeout(1100);
    await p.screenshot({ path: path.join(dir, 'after', out), fullPage: true });
    // Full-page JPEGs (deployed; the PNGs are not) for the case-study pages
    if (src.startsWith('site/')) await p.screenshot({ path: path.join(dir, 'after', out.replace('.png', '-full.jpg')), fullPage: true, type: 'jpeg', quality: 70 });
    // Viewport-only JPEG previews for the portfolio cards
    if (src.startsWith('site/')) await p.screenshot({ path: path.join(dir, 'after', out.replace('.png', '-card.jpg')), type: 'jpeg', quality: 78 });
    const sw = await p.evaluate(() => document.documentElement.scrollWidth);
    // Contrast check: text vs nearest solid background (gradients/images are skipped).
    // Fails under 2.5:1 (unreadable), warns under 4.5:1 for small text / 3:1 for large text.
    const contrast = await p.evaluate(() => {
      const rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
      const L = ([r, g, b]) => [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
      const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
      const bgOf = el => { for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.backgroundImage !== 'none') return null; const c = rgb(cs.backgroundColor); if (c.length >= 3 && (c[3] ?? 1) > 0.9) return c; } return [255, 255, 255]; };
      const fails = [], warns = [];
      for (const el of document.querySelectorAll('body *')) {
        if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
        const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (!own) continue;
        const cs = getComputedStyle(el); const bg = bgOf(el); if (!bg) continue;
        const fg = rgb(cs.color); if ((fg[3] ?? 1) < 0.5 || parseFloat(cs.opacity) < 0.5) continue;
        const r = ratio(fg, bg); const size = parseFloat(cs.fontSize); const large = size >= 24 || (size >= 18.7 && +cs.fontWeight >= 700);
        const label = `${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 30)}" ${r.toFixed(2)}:1`;
        if (r < 2.5) fails.push(label); else if (r < (large ? 3 : 4.5)) warns.push(label);
      }
      return { fails, warns };
    });
    if (sw > w || errs.length || contrast.fails.length) bad = true;
    console.log(`${out}: width ${sw}/${w}${errs.length ? ' errors: ' + errs.join('; ') : ''} · contrast fails ${contrast.fails.length}, warns ${contrast.warns.length}`);
    contrast.fails.slice(0, 5).forEach(f => console.log('   ✗ ' + f));
    if (process.env.VERBOSE) contrast.warns.slice(0, 8).forEach(f => console.log('   ! ' + f));
  }
  await b.close();
  process.exit(bad ? 1 : 0);
})();
