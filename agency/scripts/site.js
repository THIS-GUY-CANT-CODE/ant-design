// Usage: node scripts/site.js <slug>
// Builds clients/<slug>/site/index.html from clients/<slug>/site.json, using colours, fonts and logo from brand.json.
// Section types: hero, stats, cards, menu, split, timeline, quote, steps, faq, visit, band.
// Any string may contain simple inline HTML (<em>, <b>, <br>).
const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
if (!slug) { console.error('usage: node scripts/site.js <slug>'); process.exit(1); }
const dir = path.join(__dirname, '..', 'clients', slug);
const b = JSON.parse(fs.readFileSync(path.join(dir, 'brand.json'), 'utf8'));
const s = JSON.parse(fs.readFileSync(path.join(dir, 'site.json'), 'utf8'));
const meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
const t = b.theme;
// Pick readable text for anything sitting on the accent colour
const lum = hex => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const cr = (a, c) => { const [x, y] = [lum(a), lum(c)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const onAccent = cr(t.accent, t.ink) >= cr(t.accent, '#FFFFFF') ? t.ink : '#FFFFFF';
const linkOnInk = lum(t.accent) > 0.2 ? t.accent : t.bg;
const accentOnLight = t.accentOnLight || (cr(t.accent, t.bg) >= 4.5 ? t.accent : t.primary); // accent used as text on light backgrounds
const txt = v => String(v ?? '').replace(/&(?![a-z#0-9]+;)/gi, '&amp;');
const attr = v => String(v ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const tel = s.phone ? '+44' + s.phone.replace(/\D/g, '').replace(/^0/, '') : '';
const mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${s.name} ${s.address.street} ${s.address.postcode}`);
const logo = (w, l1, l2, l3) => `<svg viewBox="${b.logo.viewBox}" width="${w}" style="--l1:${l1};--l2:${l2};--l3:${l3}" aria-hidden="true">${b.logo.svg}</svg>`;
const heading = sec => `${sec.eyebrow ? `<span class="eyebrow">${txt(sec.eyebrow)}</span>` : ''}${sec.title ? `<h2>${txt(sec.title)}</h2>` : ''}${sec.lede ? `<p class="lede">${txt(sec.lede)}</p>` : ''}`;
const cta = (c, cls = '') => c ? `<a class="btn ${cls}" href="${attr(c.href === 'tel' ? 'tel:' + tel : c.href === 'map' ? mapUrl : c.href)}">${txt(c.label)}</a>` : '';
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const render = {
  hero: sec => `
  <section class="hero ${sec.dark ? 'dark' : ''}"><div class="wrap hero-grid">
    <div>
      <span class="eyebrow">${txt(sec.eyebrow)}</span>
      <h1>${txt(sec.title)}</h1>
      <p class="hero-p">${txt(sec.text)}</p>
      <div class="ctas">${cta(sec.primary)}${cta(sec.secondary, 'line')}</div>
      ${s.openRanges ? '<span class="open" id="status"><i></i><span>See opening hours</span></span>' : ''}
    </div>
    <div class="emblem" aria-hidden="true">${logo('58%', t.onPrimary, t.accent, t.primary)}${sec.badge ? `<span class="badge">${txt(sec.badge)}</span>` : ''}</div>
  </div></section>`,
  stats: sec => `
  <div class="wrap"><div class="stats">${sec.items.map(i => `<div class="stat"><b>${txt(i.value)}</b><span>${txt(i.label)}</span></div>`).join('')}</div></div>`,
  cards: sec => `
  <section class="wrap" ${sec.id ? `id="${sec.id}"` : ''}>${heading(sec)}
    <div class="cards">${sec.items.map((i, n) => `<article class="card ${n === 0 && sec.featureFirst ? 'feature' : ''}"><span class="n">${String(n + 1).padStart(2, '0')}</span><h3>${txt(i.title)}</h3><p>${txt(i.text)}</p></article>`).join('')}</div>
  </section>`,
  menu: sec => `
  <section class="wrap" ${sec.id ? `id="${sec.id}"` : ''}>${heading(sec)}
    <div class="menu">${sec.groups.map(g => `<div class="mgroup"><h3>${txt(g.title)}</h3><ul>${g.items.map(i => `<li><span>${txt(i[0])}</span><span>${txt(i[1] ?? '£—')}</span></li>`).join('')}</ul></div>`).join('')}</div>
    ${sec.note ? `<p class="note">${txt(sec.note)}</p>` : ''}
  </section>`,
  split: sec => `
  <section class="split ${sec.tone || 'dark'}" ${sec.id ? `id="${sec.id}"` : ''}><div class="wrap split-grid">
    <div>${heading(sec)}${(sec.paragraphs || []).map(p => `<p class="para">${txt(p)}</p>`).join('')}${sec.quote ? `<blockquote>${txt(sec.quote.text)}<cite>${txt(sec.quote.cite)}</cite></blockquote>` : ''}<div class="ctas">${cta(sec.cta)}</div></div>
    <ul class="points">${(sec.points || []).map(p => `<li><b>${txt(p[0])}</b><span>${txt(p[1])}</span></li>`).join('')}</ul>
  </div></section>`,
  timeline: sec => `
  <section class="wrap" ${sec.id ? `id="${sec.id}"` : ''}>${heading(sec)}
    <div class="timeline">${sec.items.map(i => `<div class="tl"><b>${txt(i[0])}</b><h3>${txt(i[1])}</h3><p>${txt(i[2])}</p></div>`).join('')}</div>
  </section>`,
  steps: sec => `
  <section class="wrap" ${sec.id ? `id="${sec.id}"` : ''}>${heading(sec)}
    <div class="steps">${sec.items.map((i, n) => `<div class="step"><b>${n + 1}</b><h3>${txt(i[0])}</h3><p>${txt(i[1])}</p></div>`).join('')}</div>
  </section>`,
  quote: sec => `
  <section class="quote"><div class="wrap">${sec.eyebrow ? `<span class="eyebrow">${txt(sec.eyebrow)}</span>` : ''}<blockquote class="big">${txt(sec.text)}</blockquote><cite class="bigcite">${txt(sec.cite)}</cite></div></section>`,
  faq: sec => `
  <section class="wrap faq" ${sec.id ? `id="${sec.id}"` : ''}><div class="faq-grid"><div>${heading(sec)}</div><div>${sec.items.map((i, n) => `<details ${n === 0 ? 'open' : ''}><summary>${txt(i[0])}</summary><p>${txt(i[1])}</p></details>`).join('')}</div></div></section>`,
  band: sec => `
  <section class="wrap"><div class="band"><div>${heading(sec)}</div><div class="ctas">${cta(sec.primary)}${cta(sec.secondary, 'line')}</div></div></section>`,
  visit: sec => `
  <section class="visit" id="visit"><div class="wrap visit-grid">
    <div>${heading(sec)}
      <p class="addr">${txt(s.address.street)}<br>${txt(s.address.area)}, London ${txt(s.address.postcode)}</p>
      <div class="ctas">${s.phone ? `<a class="btn" href="tel:${tel}">${txt(s.phone)}</a>` : ''}<a class="btn line" href="${mapUrl}">Directions</a></div>
      ${sec.extra ? `<p class="para">${txt(sec.extra)}</p>` : ''}
    </div>
    <div><span class="eyebrow">${txt(s.hoursTitle || 'Opening hours')}</span>
      ${s.hours ? `<table id="hours">${[1, 2, 3, 4, 5, 6, 0].map(d => `<tr data-d="${d}"><td>${days[d]}</td><td>${txt(s.hours[d] || 'Closed')}</td></tr>`).join('')}</table>` : '<p class="para">[Add opening hours]</p>'}
    </div>
  </div></section>`,
};

const schemaHours = s.hoursSpec || [];
const schema = { '@context': 'https://schema.org', '@type': s.schemaType || 'LocalBusiness', name: s.name,
  address: { '@type': 'PostalAddress', streetAddress: s.address.street, addressLocality: 'London', postalCode: s.address.postcode, addressCountry: 'GB' },
  ...(s.phone ? { telephone: tel } : {}), ...(s.founded ? { foundingDate: String(s.founded) } : {}),
  ...(schemaHours.length ? { openingHoursSpecification: schemaHours.map(h => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h[0], opens: h[1], closes: h[2] })) } : {}) };

const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${attr(s.title)} (Concept)</title>
<meta name="description" content="Concept redesign. ${attr(s.description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${b.fonts.href}" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<style>
:root{--bg:${t.bg};--bg2:${t.bg2};--ink:${t.ink};--primary:${t.primary};--accent:${t.accent};--on:${t.onPrimary};--muted:${t.muted};--line:rgba(0,0,0,.12);
  --accent-text:${accentOnLight};--display:${b.fonts.display};--body:${b.fonts.body};--dw:${b.fonts.coverWeight || 800};--r:${s.radius ?? 18}px;--btnr:${s.buttonRadius ?? 999}px}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font:400 17px/1.65 var(--body)}
a{color:inherit}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px;border-radius:4px}
.wrap{max-width:1160px;margin-inline:auto;padding-inline:20px}
.concept{background:var(--ink);color:var(--bg);text-align:center;font-size:.8rem;padding:8px 16px}
.concept a{color:${linkOnInk}}
.eyebrow{display:inline-block;font:700 .76rem/1.3 var(--body);letter-spacing:.16em;text-transform:uppercase;color:var(--primary);margin-bottom:12px}
h1{font:var(--dw) clamp(2.9rem,7.4vw,6rem)/.98 var(--display);letter-spacing:-.02em;margin-bottom:22px}
h1 em{color:var(--accent);font-style:${b.fonts.italicAccent ? 'italic' : 'normal'}}
h2{font:var(--dw) clamp(2.1rem,4.8vw,3.6rem)/1.04 var(--display);letter-spacing:-.02em;max-width:20ch;color:var(--primary)}
h2 em{color:var(--accent-text);font-style:${b.fonts.italicAccent ? 'italic' : 'normal'}}
.lede{color:var(--muted);font-size:1.12rem;max-width:58ch;margin-top:14px}
.para{margin-top:16px;font-size:1.08rem;max-width:60ch}
section{padding-block:96px}
header{position:sticky;top:0;z-index:10;background:var(--primary);color:var(--on)}
.nav{display:flex;align-items:center;justify-content:space-between;height:72px;gap:16px}
.logo{display:flex;align-items:center;gap:12px;text-decoration:none}
.logo b{display:block;font:var(--dw) 1.3rem/1 var(--display)}
.logo small{display:block;font-size:.64rem;letter-spacing:.18em;text-transform:uppercase;opacity:.75;margin-top:3px}
.nav ul{display:flex;gap:24px;list-style:none}
.nav ul a{text-decoration:none;opacity:.8;font-weight:600}
.nav ul a:hover{opacity:1}
.btn{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;gap:8px;background:var(--accent);color:${onAccent};text-decoration:none;font-weight:700;padding:14px 22px;border-radius:var(--btnr);transition:transform .2s,filter .2s;font-size:.95rem}
.btn:hover{transform:translateY(-1px);filter:brightness(1.06)}
.btn.line{background:transparent;color:inherit;box-shadow:inset 0 0 0 2px currentColor}
.ctas{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px}
@media (max-width:900px){.nav ul{display:none}}
@media (max-width:520px){.nav>.btn{display:none}}
.hero{padding-block:72px 96px}
.hero.dark{background:var(--primary);color:var(--on)}
.hero.dark .eyebrow{color:var(--accent)}
.hero-grid{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:56px;align-items:center}
.hero-p{font-size:1.2rem;max-width:36ch;opacity:.9}
.open{display:inline-flex;align-items:center;gap:8px;margin-top:24px;font-weight:600;font-size:.92rem;border:1px solid currentColor;border-radius:999px;padding:7px 14px;opacity:.9}
.open i{width:9px;height:9px;border-radius:50%;background:#4FAF6A}
.open.closed i{background:#D0583F}
.emblem{aspect-ratio:1;border-radius:var(--r);background:${t.primary};display:grid;place-items:center;position:relative;box-shadow:inset 0 0 0 10px ${t.primary},inset 0 0 0 12px ${t.accent}}
.hero.dark .emblem{background:rgba(255,255,255,.06)}
.badge{position:absolute;inset-block-end:18px;inset-inline:18px;text-align:center;font:var(--dw) 1.1rem var(--display);color:${t.accent};letter-spacing:.06em}
@media (max-width:900px){.hero-grid{grid-template-columns:minmax(0,1fr)}.emblem{max-width:340px;width:100%;margin-inline:auto}}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));background:#fff;border:1px solid var(--line);border-radius:var(--r);margin-top:-44px;position:relative;box-shadow:0 20px 40px -32px rgba(0,0,0,.5)}
.stat{padding:24px;border-inline-start:1px solid var(--line)}
.stat:first-child{border:0}
.stat b{display:block;font:var(--dw) 2.3rem/1 var(--display);color:var(--primary)}
.stat span{color:var(--muted);font-size:.9rem}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;margin-top:44px}
.card{background:#fff;border:1px solid var(--line);border-radius:var(--r);padding:28px;display:flex;flex-direction:column;gap:8px}
.card .n{font:700 .78rem var(--body);color:var(--accent-text);letter-spacing:.1em}
.card h3{font:var(--dw) 1.45rem/1.1 var(--display);color:var(--primary)}
.card p{color:var(--muted);font-size:.96rem}
.card.feature{background:var(--primary);color:var(--on);border:0}
.card.feature h3{color:var(--on)}.card.feature .n{color:var(--accent)}.card.feature p{color:var(--on);opacity:.8}
.menu{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-top:40px}
.mgroup{background:#fff;border:1px solid var(--line);border-radius:var(--r);padding:26px}
.mgroup h3{font:var(--dw) 1.6rem var(--display);color:var(--primary);border-bottom:2px solid var(--primary);padding-bottom:8px}
.mgroup ul{list-style:none;margin-top:10px}
.mgroup li{display:flex;justify-content:space-between;gap:12px;padding-block:10px;border-bottom:1px dotted var(--line)}
.mgroup li span:last-child{color:var(--muted);font-weight:600;white-space:nowrap}
.note{margin-top:18px;color:var(--muted);font-size:.9rem}
.split.dark{background:var(--primary);color:var(--on)}
.split.dark h2{color:var(--on)}.split.dark .eyebrow{color:var(--accent)}.split.dark .lede{color:var(--on);opacity:.8}
.split.light{background:var(--bg2)}
.split-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:64px;align-items:center}
.points{list-style:none;display:grid;gap:12px}
.points li{border-radius:16px;padding:18px 20px;background:rgba(255,255,255,.08);border:1px solid rgba(127,127,127,.25)}
.split.light .points li{background:#fff}
.points b{display:block;font:var(--dw) 1.2rem var(--display)}
.points span{opacity:.8;font-size:.95rem}
blockquote{margin-top:24px;border-inline-start:3px solid var(--accent);padding-inline-start:18px;font-size:1.1rem;font-weight:600}
cite{display:block;margin-top:8px;font-size:.85rem;font-style:normal;opacity:.75;font-weight:400}
@media (max-width:860px){.split-grid{grid-template-columns:minmax(0,1fr)}}
.timeline{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin-top:48px;border-top:2px solid var(--primary)}
.tl{padding:22px 22px 0 0}
.tl b{font:var(--dw) 2.2rem/1 var(--display);color:var(--accent-text)}
.tl h3{font:700 1.05rem var(--body);margin-block:10px 6px}
.tl p{color:var(--muted);font-size:.95rem}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:44px}
.step{border-top:3px solid var(--accent);padding-top:18px}
.step b{font:var(--dw) 2.6rem/1 var(--display);color:var(--primary)}
.step h3{font:700 1.05rem var(--body);margin-block:10px 6px}
.step p{color:var(--muted);font-size:.95rem}
.quote{background:var(--bg2)}
blockquote.big{border:0;padding:0;margin-top:8px;font:var(--dw) clamp(1.7rem,3.8vw,2.8rem)/1.2 var(--display);color:var(--primary);max-width:26ch}
.bigcite{margin-top:16px;color:var(--muted)}
.faq-grid{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:64px}
details{border-top:1px solid var(--line);padding-block:18px}
summary{cursor:pointer;font:var(--dw) 1.25rem var(--display);color:var(--primary);list-style:none;display:flex;justify-content:space-between;gap:16px}
summary::after{content:"+";color:var(--accent-text)}
details[open] summary::after{content:"–"}
details p{margin-top:8px;color:var(--muted)}
@media (max-width:860px){.faq-grid{grid-template-columns:minmax(0,1fr)}}
.band{background:var(--accent);border-radius:var(--r);padding:48px;display:flex;justify-content:space-between;align-items:center;gap:32px;flex-wrap:wrap}
.band h2,.band .eyebrow{color:${onAccent}}
.band .btn{background:var(--primary);color:var(--on)}
.visit{background:var(--primary);color:var(--on)}
.visit h2{color:var(--on)}.visit .eyebrow{color:var(--accent)}
.visit-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:64px}
.addr{font:var(--dw) 1.7rem/1.25 var(--display);margin-top:18px;color:var(--accent)}
table{width:100%;border-collapse:collapse;margin-top:8px}
td{padding-block:11px;border-bottom:1px solid rgba(127,127,127,.3)}
td:last-child{text-align:end}
tr.today td{color:var(--accent);font-weight:700}
@media (max-width:860px){.visit-grid{grid-template-columns:minmax(0,1fr)}}
footer{background:var(--ink);color:var(--bg);opacity:.95;padding-block:26px;font-size:.85rem}
footer .wrap{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
.bar{display:none}
@media (max-width:640px){.bar{display:grid;grid-template-columns:1fr 1fr;gap:8px;position:fixed;inset-inline:0;inset-block-end:0;padding:10px 12px;background:var(--bg);border-top:1px solid var(--line);z-index:20}.bar .btn.line{color:var(--primary)}body{padding-bottom:72px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
</style>
</head>
<body>
<div class="concept" role="note">Concept ${meta.url ? 'redesign' : 'website'} by Second Coat. Not the official ${txt(s.name)} website.${meta.url ? ` <a href="${attr(meta.url)}">Visit their current site →</a>` : ''}</div>
<header><nav class="wrap nav" aria-label="Main">
  <a class="logo" href="#top" aria-label="${attr(s.name)} home">${logo(40, t.onPrimary, t.accent, t.primary)}<span><b>${txt(b.wordmark)}</b><small>${txt(b.wordmarkSub)}</small></span></a>
  <ul>${(s.nav || []).map(n => `<li><a href="#${n[1]}">${txt(n[0])}</a></li>`).join('')}</ul>
  ${cta(s.headerCta)}
</nav></header>
<main id="top">
${s.sections.map(sec => render[sec.type](sec)).join('\n')}
</main>
<footer><div class="wrap"><span>© <span id="y">2026</span> ${txt(s.name)} · ${txt(s.address.street)}, ${txt(s.address.postcode)}${s.footerExtra ? ' · ' + txt(s.footerExtra) : ''}</span><span>Concept by Second Coat</span></div></footer>
<div class="bar">${cta(s.mobileBar?.[0] || (s.phone ? { label: 'Call', href: 'tel' } : { label: 'Directions', href: 'map' }))}${cta(s.mobileBar?.[1] || { label: 'Visit', href: '#visit' }, 'line')}</div>
<script>
document.getElementById('y').textContent=new Date().getFullYear();
${s.hours ? `const H=${JSON.stringify(s.openRanges || {})},n=new Date(),d=n.getDay(),h=n.getHours()+n.getMinutes()/60,st=document.getElementById('status');
if(st&&Object.keys(H).length){const r=H[d],o=r&&r.some(x=>h>=x[0]&&h<x[1]);st.lastElementChild.textContent=o?'Open now':'Closed now';if(!o)st.classList.add('closed');}
const row=document.querySelector('#hours tr[data-d="'+d+'"]');if(row)row.classList.add('today');` : ''}
</script>
</body>
</html>
`;
fs.mkdirSync(path.join(dir, 'site'), { recursive: true });
fs.writeFileSync(path.join(dir, 'site', 'index.html'), html);
console.log('wrote', path.join('clients', slug, 'site', 'index.html'));
