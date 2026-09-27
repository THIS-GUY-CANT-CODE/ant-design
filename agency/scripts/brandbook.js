// Usage: node scripts/brandbook.js <slug>
// Reads clients/<slug>/brand.json and writes clients/<slug>/brand-book/index.html.
// Schema: see clients/rose-locksmith/brand.json for a full example.
const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
if (!slug) { console.error('usage: node scripts/brandbook.js <slug>'); process.exit(1); }
const dir = path.join(__dirname, '..', 'clients', slug);
const b = JSON.parse(fs.readFileSync(path.join(dir, 'brand.json'), 'utf8'));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const t = b.theme; // { bg, bg2, ink, primary, accent, onPrimary, muted }

// The logo is inline SVG markup that uses var(--l1) (main), var(--l2) (secondary) and var(--l3) (detail) for colours.
const logo = (size, l1, l2, l3, extra = '') =>
  `<svg viewBox="${b.logo.viewBox}" width="${size}" style="--l1:${l1};--l2:${l2};--l3:${l3};${extra}" aria-hidden="true">${b.logo.svg}</svg>`;

const head = (n, label, title, lead) => `
  <div class="head"><span class="tag">${String(n).padStart(2, '0')} · ${label}</span><div>
    <h2>${esc(title)}</h2>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
  </div></div>`;

const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${esc(b.name)} Brand Book (Concept)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${b.fonts.href}" rel="stylesheet">
<style>
:root{--bg:${t.bg};--bg2:${t.bg2};--ink:${t.ink};--primary:${t.primary};--accent:${t.accent};--on:${t.onPrimary};--muted:${t.muted};--line:rgba(0,0,0,.12);
  --display:${b.fonts.display};--body:${b.fonts.body}}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font:400 16px/1.6 var(--body)}
.wrap{max-width:1100px;margin-inline:auto;padding-inline:20px}
.tag{font:700 .74rem/1.3 var(--body);letter-spacing:.14em;text-transform:uppercase;color:var(--primary)}
.concept{background:var(--ink);color:var(--bg);text-align:center;padding:8px 16px;font-size:.8rem}
.cover{background:var(--primary);color:var(--on);min-height:88vh;display:grid;align-content:space-between;padding-block:40px}
.cover h1{font:${b.fonts.coverWeight || 900} clamp(3rem,10vw,8rem)/.92 var(--display);letter-spacing:-.035em}
.cover h1 em{font-style:${b.fonts.italicAccent ? 'italic' : 'normal'};color:var(--accent)}
.cover .row{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;opacity:.85}
section{padding-block:88px;border-bottom:1px solid var(--line)}
.head{display:grid;grid-template-columns:180px 1fr;gap:32px;margin-bottom:44px}
.head .tag{padding-top:12px}
h2{font:900 clamp(2rem,5vw,3.3rem)/1.02 var(--display);letter-spacing:-.03em}
.lead{font-size:1.15rem;max-width:62ch;margin-top:16px;opacity:.85}
@media (max-width:700px){.head{grid-template-columns:1fr;gap:8px}}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.card{border-radius:16px;padding:28px;min-height:210px;display:flex;flex-direction:column;justify-content:space-between;gap:14px}
.big{font:800 1.3rem/1.3 var(--display)}
.pal{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.sw{border-radius:14px;overflow:hidden;border:1px solid var(--line);background:#fff}
.sw div{height:120px}.sw p{padding:12px 14px;font-size:.86rem}.sw b{display:block}
.row2{display:grid;grid-template-columns:140px 1fr;gap:24px;align-items:baseline;padding-block:18px;border-top:1px solid var(--line)}
.dd{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.do,.dont{border-radius:14px;padding:22px;background:#fff}
.do{border-top:4px solid #3C8A5A}.dont{border-top:4px solid #C8364B}
.do .tag{color:#3C8A5A}.dont .tag{color:#C8364B}
@media (max-width:700px){.dd{grid-template-columns:1fr}}
.apps{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:20px}
.app{border-radius:12px;box-shadow:0 20px 40px -22px rgba(0,0,0,.4);aspect-ratio:1;padding:28px;display:flex;flex-direction:column;justify-content:space-between}
footer{padding-block:40px;opacity:.6;font-size:.85rem}
</style>
</head>
<body>
<div class="concept">Concept brand book by Second Coat, not an official ${esc(b.name)} document</div>

<header class="cover">
  <div class="wrap row"><span>Brand guidelines v1.0</span><span>${new Date().getFullYear()}</span></div>
  <div class="wrap">
    <div style="margin-bottom:26px">${logo(120, t.onPrimary, t.accent, t.primary)}</div>
    <h1>${b.coverTitle}</h1>
  </div>
  <div class="wrap row"><span>${esc(b.descriptor)}</span><span>${esc(b.since || '')}</span></div>
</header>

<main>
<section><div class="wrap">
  ${head(1, 'Story', b.story.title, b.story.lead)}
  <div class="cards">
    <div class="card" style="background:var(--primary);color:var(--on)"><span class="tag" style="color:var(--accent)">Positioning</span><p class="big">${esc(b.story.positioning)}</p></div>
    <div class="card" style="background:var(--accent);color:var(--ink)"><span class="tag" style="color:var(--ink)">Promise</span><p class="big" style="font-size:1.5rem">${esc(b.story.promise)}</p></div>
    <div class="card" style="background:#fff"><span class="tag">Values</span><p style="font-size:1.08rem">${b.story.values.map(esc).join('<br>')}</p></div>
  </div>
</div></section>

<section><div class="wrap">
  ${head(2, 'Logo', b.logo.title, b.logo.lead)}
  <div class="cards">
    <div class="card" style="background:var(--bg2);flex-direction:row;align-items:center;justify-content:center;gap:14px">
      ${logo(64, t.primary, t.accent, t.bg2)}
      <span style="font:900 1.6rem/1 var(--display)">${esc(b.wordmark)}<small style="display:block;font:700 .68rem var(--body);letter-spacing:.2em;text-transform:uppercase;opacity:.6;margin-top:6px">${esc(b.wordmarkSub || '')}</small></span>
    </div>
    <div class="card" style="background:var(--primary);align-items:center;justify-content:center">${logo(130, t.onPrimary, t.accent, t.primary)}</div>
    <div class="card" style="background:#fff;align-items:center;justify-content:center">${logo(130, '#111', '#111', '#fff')}<span class="tag" style="color:var(--muted)">Mono · single colour</span></div>
  </div>
</div></section>

<section><div class="wrap">
  ${head(3, 'Colour', b.colour.title, b.colour.lead)}
  <div class="pal">${b.colour.swatches.map(s => `<div class="sw"><div style="background:${s.hex}"></div><p><b>${esc(s.name)}</b>${s.hex} · ${esc(s.use)}</p></div>`).join('')}</div>
</div></section>

<section><div class="wrap">
  ${head(4, 'Type', b.type.title, b.type.lead)}
  ${b.type.samples.map(s => `<div class="row2"><span class="tag">${esc(s.label)}</span><span style="${s.style}">${s.text}</span></div>`).join('')}
</div></section>

<section><div class="wrap">
  ${head(5, 'Voice', b.voice.title, b.voice.lead)}
  <div class="dd">${b.voice.pairs.map(([d, n]) => `<div class="do"><p class="tag">Do</p><p>${esc(d)}</p></div><div class="dont"><p class="tag">Don't</p><p>${esc(n)}</p></div>`).join('')}</div>
</div></section>

<section><div class="wrap">
  ${head(6, 'Imagery', b.imagery.title, b.imagery.lead)}
</div></section>

<section><div class="wrap">
  ${head(7, 'Applications', b.apps.title || 'In the wild.', '')}
  <div class="apps">
    <div class="app" style="background:var(--primary);color:var(--on)">
      <span class="tag" style="color:var(--accent)">${esc(b.apps.social.label)}</span>
      <b style="font:900 2.4rem/1 var(--display)">${b.apps.social.headline}</b>
      <span style="font-size:.85rem;opacity:.8">${esc(b.apps.social.footer)}</span>
    </div>
    <div class="app" style="background:#fff;align-items:center;justify-content:center;text-align:center;gap:14px">
      ${logo(90, t.primary, t.accent, '#fff')}
      <b style="font:900 1.3rem var(--display)">${esc(b.wordmark)}</b>
      <span class="tag" style="color:var(--muted)">${esc(b.apps.print)}</span>
    </div>
    <div class="app" style="background:var(--bg2)">
      <span class="tag">${esc(b.apps.card.label)}</span>
      <p style="font:800 1.5rem/1.2 var(--display)">${b.apps.card.headline}</p>
      <span style="font-size:.85rem;color:var(--muted)">${esc(b.apps.card.footer)}</span>
    </div>
  </div>
</div></section>
</main>
<footer class="wrap">Concept brand book prepared by Second Coat · East London</footer>
</body>
</html>
`;
fs.mkdirSync(path.join(dir, 'brand-book'), { recursive: true });
fs.writeFileSync(path.join(dir, 'brand-book', 'index.html'), html);
console.log('wrote', path.join('clients', slug, 'brand-book', 'index.html'));
