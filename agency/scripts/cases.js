// Usage: node scripts/cases.js
// Builds a shareable case-study page for every client that has clients/<slug>/case.json:
//   work/<slug>/index.html  ->  what it was, what it is now, the brand pitch and the marketing pitch,
// themed in the client's own colours and display font. Also exports cases() for portfolio.js.
const fs = require('fs');
const path = require('path');
const cfg = require('./config');

const root = path.join(__dirname, '..');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ORDER = ['biscuit-bunker', 'green-papaya', 'rose-locksmith', 'walthamstow-osteopaths', 'wj-meade', 'clapton-beauty-parlour'];
const read = (slug, f) => { const p = path.join(root, 'clients', slug, f); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null; };
const has = p => fs.existsSync(path.join(root, p));

function cases() {
  return ORDER.map(slug => ({ slug, meta: read(slug, 'meta.json'), c: read(slug, 'case.json'), brand: read(slug, 'brand.json') }))
    .filter(x => x.meta && x.c);
}

const swatchesOf = ({ c, brand }) => (brand?.colour?.swatches || c.swatches || []).slice(0, 5);
const beforeOf = slug => ['desktop-card.jpg', 'desktop-card.png'].map(f => `clients/${slug}/before/${f}`).find(has);
const priceOf = tier => [/Rebrand/.test(tier) && cfg.fmt.rebrand, /Refresh/.test(tier) && cfg.fmt.refresh, /Care/.test(tier) && `${cfg.fmt.care}/mo`].filter(Boolean).join(' + ');

function page(x, i, all) {
  const { slug, meta, c } = x, t = c.theme, up = '../../';
  const prev = all[(i - 1 + all.length) % all.length], next = all[(i + 1) % all.length];
  const before = beforeOf(slug);
  const sw = swatchesOf(x);
  const n = String(i + 1).padStart(2, '0');
  const dark = parseInt(t.bg.slice(1, 3), 16) < 90;
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><!-- names a real business that isn't a client -->
<title>${esc(meta.name)}: Case Study · ${esc(cfg.name)}</title>
<meta name="description" content="${esc(c.headline)} An unsolicited redesign concept by ${esc(cfg.name)}: what it was, what it is now, and the brand and marketing pitch.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${t.fontCss}&family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--bg:${t.bg};--fg:${t.fg};--accent:${t.accent};--accent-ink:${t.accentInk};--muted:${t.muted};--card:${t.card};--line:${t.line};
  --display:"${t.font}",Georgia,serif;--sans:"Geist",system-ui,sans-serif;--max:1200px}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--fg);font:400 17px/1.6 var(--sans);overflow-x:hidden}
a{color:inherit}
:focus-visible{outline:3px solid var(--accent);outline-offset:3px;border-radius:4px}
.wrap{max-width:var(--max);margin-inline:auto;padding-inline:20px}
.d{font-family:var(--display);font-weight:${t.fontWeight};font-style:${t.fontStyle || 'normal'};letter-spacing:${t.headTracking}}
.top{position:sticky;top:0;z-index:20;background:var(--bg);background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.top .wrap{display:flex;justify-content:space-between;align-items:center;height:60px;gap:16px;font-size:.9rem}
.top a{text-decoration:none;font-weight:600}
.top .count{color:var(--muted)}
.mono{font-size:.74rem;letter-spacing:.18em;text-transform:uppercase;font-weight:600}
.btn{display:inline-flex;align-items:center;gap:8px;white-space:nowrap;background:var(--accent);color:${dark ? t.bg : '#fff'};text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px;transition:transform .2s}
.btn:hover{transform:translateY(-2px)}
.btn.line{background:transparent;color:var(--fg);box-shadow:inset 0 0 0 1.5px var(--line)}

.hero{padding-block:70px 40px}
.hero .tag{color:var(--accent-ink)}
.hero h1{font-size:clamp(3rem,9vw,8rem);line-height:.9;margin-block:18px 20px}
.hero .headline{font-size:clamp(1.3rem,2.4vw,1.8rem);line-height:1.3;max-width:30ch;color:var(--fg);opacity:.9}
.ctas{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}

/* devices with auto-scrolling full-page screenshots */
.devices{position:relative;margin-top:60px;display:grid;grid-template-columns:minmax(0,1fr) 240px;gap:28px;align-items:end}
.browser{border-radius:14px;overflow:hidden;background:#fff;box-shadow:0 40px 80px -30px rgba(0,0,0,.55);border:1px solid var(--line)}
.browser .bar{height:34px;background:#ECEAE6;display:flex;align-items:center;gap:6px;padding-inline:12px}
.browser .bar i{width:10px;height:10px;border-radius:50%;background:#D5D2CC}
.browser .bar span{margin-inline-start:12px;background:#fff;border-radius:6px;font:500 .72rem var(--sans);color:#777;padding:3px 10px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:60%}
.screen{--h:520px;height:var(--h);overflow:hidden;position:relative;background:#eee}
.screen img{display:block;width:100%;height:auto;animation:scrollshot 38s ease-in-out 1s infinite alternate}
.screen:hover img{animation-play-state:paused}
@keyframes scrollshot{to{transform:translateY(calc(-100% + var(--h)))}}
.phone{border-radius:34px;padding:10px;background:#111;box-shadow:0 40px 80px -30px rgba(0,0,0,.6)}
.phone .screen{--h:440px;border-radius:26px}
.phone .screen img{animation-duration:30s}
@media (max-width:860px){.devices{grid-template-columns:minmax(0,1fr)}.phone{display:none}.screen{--h:300px}}

section{padding-block:100px;border-top:1px solid var(--line)}
.sec-head{display:grid;grid-template-columns:120px minmax(0,1fr);gap:24px;align-items:baseline;margin-bottom:44px}
.sec-head .n{font-size:3.4rem;line-height:1;color:var(--accent-ink)}
.sec-head h2{font-size:clamp(2.2rem,5vw,4rem);line-height:1}
.sec-head p{color:var(--muted);margin-top:10px;max-width:52ch}
@media (max-width:640px){.sec-head{grid-template-columns:minmax(0,1fr);gap:6px}}

/* was */
.was{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:40px;align-items:start}
.probs{list-style:none;display:grid;gap:14px;counter-reset:p}
.probs li{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px 20px 20px 62px;position:relative;counter-increment:p}
.probs li::before{content:"✕";position:absolute;left:20px;top:18px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#C0392B;color:#fff;font-size:.8rem;font-weight:700}
.beforeshot{border-radius:14px;overflow:hidden;border:1px solid var(--line);position:relative;aspect-ratio:16/10;background:var(--card);display:grid;place-items:center;text-align:center;padding:24px}
.beforeshot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;filter:saturate(.7)}
.beforeshot .lab{position:absolute;top:12px;left:12px;background:#C0392B;color:#fff;padding:4px 10px;border-radius:6px}
.beforeshot p{color:var(--muted);max-width:30ch}
.src{color:var(--muted);font-size:.85rem;margin-top:14px}
@media (max-width:860px){.was{grid-template-columns:minmax(0,1fr)}}

/* now */
.feats{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:16px}
.feat{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:26px;position:relative;overflow:hidden;transition:transform .3s}
.feat:hover{transform:translateY(-4px)}
.feat b{display:block;font-size:.8rem;color:var(--accent-ink);margin-bottom:12px}
.feat h3{font-size:1.6rem;line-height:1.05;margin-bottom:8px}
.feat p{color:var(--muted);font-size:.97rem}
.feat::after{content:"";position:absolute;right:-30px;bottom:-30px;width:90px;height:90px;border-radius:50%;background:var(--accent);opacity:.12}

/* brand */
.idea{font-size:clamp(2.6rem,7vw,6rem);line-height:.95;color:var(--accent-ink);margin-bottom:34px;max-width:16ch}
.brand{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:50px}
.brand p.body{font-size:1.15rem;opacity:.92}
.points{list-style:none;margin-top:26px;display:grid;gap:10px}
.points li{padding-left:28px;position:relative}
.points li::before{content:"";position:absolute;left:0;top:.6em;width:14px;height:2px;background:var(--accent)}
.sw{display:grid;grid-template-columns:repeat(${Math.max(sw.length, 1)},minmax(0,1fr));border-radius:16px;overflow:hidden;border:1px solid var(--line);height:220px}
.sw div{display:flex;flex-direction:column;justify-content:flex-end;padding:12px;font-size:.72rem;transition:flex .4s}
.sw div b{display:block;font-size:.8rem}
.spec{margin-top:18px;border:1px solid var(--line);border-radius:16px;padding:24px;display:flex;align-items:center;gap:24px;background:var(--card)}
.spec .aa{font-size:5rem;line-height:1;color:var(--accent-ink)}
.spec small{color:var(--muted);display:block}
@media (max-width:860px){.brand{grid-template-columns:minmax(0,1fr)}}

/* marketing */
.plays{position:relative;display:grid;gap:14px;margin-top:10px}
.play{display:grid;grid-template-columns:140px minmax(0,1fr);gap:24px;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:24px}
.play .when{color:var(--accent-ink)}
.play h3{font-size:1.5rem;line-height:1.1;margin-bottom:6px}
.play p{color:var(--muted)}
@media (max-width:640px){.play{grid-template-columns:minmax(0,1fr);gap:8px}}

/* offer */
.offer{background:var(--accent);color:${dark ? t.bg : '#fff'};border-radius:28px;padding:clamp(28px,5vw,60px);display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:30px;align-items:center}
.offer h2{font-size:clamp(2rem,4.4vw,3.4rem);line-height:1}
.offer p{margin-top:12px;opacity:.9;max-width:48ch}
.offer .price{font-size:clamp(2.4rem,5vw,4rem);line-height:1}
.offer .btn{background:${dark ? t.bg : '#fff'};color:${dark ? t.fg : t.accentInk};margin-top:16px}
@media (max-width:760px){.offer{grid-template-columns:minmax(0,1fr)}}

.nextcase{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;padding-block:50px;border-top:1px solid var(--line)}
.nextcase a{text-decoration:none}
.nextcase a b{display:block;font-size:clamp(1.8rem,4vw,3rem);line-height:1}
.nextcase a span{color:var(--muted)}
footer{padding-block:30px;color:var(--muted);font-size:.82rem;border-top:1px solid var(--line)}
.rv{opacity:0;transform:translateY(24px);transition:opacity .8s,transform .8s cubic-bezier(.2,.8,.2,1)}
.rv.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}.rv{opacity:1;transform:none}.screen{overflow:auto}}
</style>
</head>
<body>
<nav class="top" aria-label="Case study"><div class="wrap">
  <a href="${up}#cases">← ${esc(cfg.name)}</a>
  <span class="count mono">Case study ${n} / ${String(all.length).padStart(2, '0')}</span>
  <a href="../${next.slug}/">Next: ${esc(next.meta.name)} →</a>
</div></nav>

<main>
<header class="wrap hero">
  <span class="tag mono">Unsolicited concept · ${esc(meta.industry)} · ${esc(meta.area)}</span>
  <h1 class="d">${esc(meta.name)}</h1>
  <p class="headline">${esc(c.headline)}</p>
  <div class="ctas">
    <a class="btn" href="${up}clients/${slug}/site/">Open the live concept →</a>
    <a class="btn line" href="${up}clients/${slug}/brand-book/">Brand book</a>
    ${meta.url ? `<a class="btn line" href="${esc(meta.url)}" rel="noopener">Original site ↗</a>` : ''}
  </div>
  <div class="devices" aria-label="Screenshots of the new site">
    <div class="browser"><div class="bar"><i></i><i></i><i></i><span>${esc((meta.url || '').replace(/^https?:\/\//, '').replace(/\/$/, '') || slug)}</span></div>
      <div class="screen"><img src="${up}clients/${slug}/after/desktop-full.jpg" alt="The full redesigned ${esc(meta.name)} homepage on desktop"></div></div>
    <div class="phone"><div class="screen"><img src="${up}clients/${slug}/after/mobile-full.jpg" alt="The redesigned ${esc(meta.name)} homepage on a phone"></div></div>
  </div>
</header>

<section class="wrap" id="was">
  <div class="sec-head rv"><span class="n d">01</span><div><h2 class="d">What it was</h2><p>The problems holding the old site back.</p></div></div>
  <div class="was">
    <ol class="probs">${c.was.map(w => `<li class="rv">${esc(w)}</li>`).join('')}</ol>
    <div>
      <div class="beforeshot rv">${before
        ? `<img src="${up}${before}" alt="The original ${esc(meta.name)} website"><span class="lab mono">Before</span>`
        : `<span class="lab mono">Before</span><p>${meta.url ? `Before screenshot to come. See the original at <a href="${esc(meta.url)}" rel="noopener">${esc(meta.url.replace(/^https?:\/\//, ''))}</a>` : 'They had no website of their own.'}</p>`}</div>
      <p class="src">From public search results and business listings. A full first-hand review of the live site is part of the handover.</p>
    </div>
  </div>
</section>

<section class="wrap" id="now">
  <div class="sec-head rv"><span class="n d">02</span><div><h2 class="d">What it is now</h2><p>A fast, single-file site with no framework, built for phones first, with a signature moment only this business could own.</p></div></div>
  <div class="feats">${c.now.map((f, k) => `<article class="feat rv"><b class="mono">${String(k + 1).padStart(2, '0')}</b><h3 class="d">${esc(f.t)}</h3><p>${esc(f.d)}</p></article>`).join('')}</div>
  <div class="ctas"><a class="btn" href="${up}clients/${slug}/site/">Try it yourself →</a></div>
</section>

<section class="wrap" id="brand">
  <div class="sec-head rv"><span class="n d">03</span><div><h2 class="d">The brand pitch</h2></div></div>
  <p class="idea d rv">${esc(c.brand.idea)}</p>
  <div class="brand">
    <div class="rv"><p class="body">${esc(c.brand.body)}</p><ul class="points">${c.brand.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
      <div class="ctas"><a class="btn line" href="${up}clients/${slug}/brand-book/">Read the full brand book →</a></div></div>
    <div class="rv">
      <div class="sw" aria-label="Brand palette">${sw.map(s => { const hex = s.hex; const l = parseInt(hex.slice(1, 3), 16) * .299 + parseInt(hex.slice(3, 5), 16) * .587 + parseInt(hex.slice(5, 7), 16) * .114; return `<div style="background:${hex};color:${l > 150 ? '#111' : '#fff'}"><b>${esc(s.name)}</b>${hex}</div>`; }).join('')}</div>
      <div class="spec"><span class="aa d">Aa</span><div><b>${esc(t.font)}</b><small>Display typeface</small></div></div>
    </div>
  </div>
</section>

<section class="wrap" id="marketing">
  <div class="sec-head rv"><span class="n d">04</span><div><h2 class="d">The marketing pitch</h2><p>${esc(c.marketing.idea)}</p></div></div>
  <div class="plays">${c.marketing.plays.map(p => `<article class="play rv"><span class="when mono">${esc(p.when)}</span><div><h3 class="d">${esc(p.t)}</h3><p>${esc(p.d)}</p></div></article>`).join('')}</div>
</section>

<section class="wrap" style="border-top:0;padding-top:20px">
  <div class="offer rv">
    <div><span class="mono">What we'd recommend</span><h2 class="d" style="margin-top:10px">${esc(c.tier)}</h2><p>${esc(c.tierWhy)}</p></div>
    <div><div class="price d">${esc(priceOf(c.tier))}</div><a class="btn" href="mailto:${esc(cfg.email)}?subject=${encodeURIComponent('Like the ' + meta.name + ' concept')}">Want this for your business?</a></div>
  </div>
</section>

<nav class="wrap nextcase" aria-label="More case studies">
  <a href="../${prev.slug}/"><span>← Previous</span><b class="d">${esc(prev.meta.name)}</b></a>
  <a href="../${next.slug}/" style="text-align:end"><span>Next →</span><b class="d">${esc(next.meta.name)}</b></a>
</nav>
</main>
<footer><div class="wrap">${esc(meta.name)} is not a client of ${esc(cfg.name)}. This is an unsolicited concept made to show our work, using public information. All names and trademarks belong to their owners. Owners can ask for removal at ${esc(cfg.email)}.</div></footer>
<script>
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>matchMedia('(prefers-reduced-motion: reduce)').matches?el.classList.add('in'):io.observe(el));
</script>
</body>
</html>
`;
}

module.exports = { cases, priceOf };
if (require.main === module) {
  const all = cases();
  all.forEach((x, i) => {
    const dir = path.join(root, 'work', x.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), page(x, i, all));
  });
  console.log('wrote', all.length, 'case studies to work/');
}
