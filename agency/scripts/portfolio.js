// Usage: node scripts/portfolio.js
// Builds the agency portfolio (index.html at the agency root) from clients/*/meta.json.
// A client shows a before/after slider once clients/<slug>/before/desktop-card.jpg (or .png) exists.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const order = ['biscuit-bunker', 'green-papaya', 'rose-locksmith', 'walthamstow-osteopaths', 'wj-meade', 'clapton-beauty-parlour', 'thatched-house-dental', 'queens-head-limehouse'];

const clients = fs.readdirSync(path.join(root, 'clients'))
  .filter(d => fs.existsSync(path.join(root, 'clients', d, 'meta.json')))
  .map(d => JSON.parse(fs.readFileSync(path.join(root, 'clients', d, 'meta.json'), 'utf8')))
  .sort((a, b) => (order.indexOf(a.slug) + 1 || 99) - (order.indexOf(b.slug) + 1 || 99));

const beforeImg = slug => ['desktop-card.jpg', 'desktop-card.png', 'desktop.png']
  .map(f => `clients/${slug}/before/${f}`).find(p => fs.existsSync(path.join(root, p)));

const card = (c, i) => {
  const before = beforeImg(c.slug);
  const after = `clients/${c.slug}/after/desktop-card.jpg`;
  const label = c.status === 'client' ? 'Client' : 'Unsolicited concept';
  const visual = before
    ? `<div class="compare" style="--pos:50%">
        <img src="${after}" alt="${esc(c.name)} redesign" loading="lazy">
        <img class="before" src="${before}" alt="${esc(c.name)} original website" loading="lazy">
        <span class="lbl l">Before</span><span class="lbl r">After</span>
        <input type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after for ${esc(c.name)}">
      </div>`
    : `<div class="compare"><img src="${after}" alt="${esc(c.name)} redesign" loading="lazy"><span class="lbl r">After</span></div>`;
  return `
  <article class="work">
    <a class="shot" href="clients/${c.slug}/site/">${visual}</a>
    <div class="info">
      <div class="top"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="badge ${c.status === 'client' ? 'client' : ''}">${label}</span></div>
      <h3>${esc(c.name)}</h3>
      <p class="where">${esc(c.industry)} · ${esc(c.area)}</p>
      <p>${esc(c.summary)}</p>
      <div class="links">
        <a href="clients/${c.slug}/site/">View new site →</a>
        <a href="clients/${c.slug}/brand-book/">Brand book →</a>
        ${c.url ? `<a href="${esc(c.url)}" rel="noopener">Original site ↗</a>` : '<span class="nosite">They had no website</span>'}
      </div>
    </div>
  </article>`;
};

const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Second Coat: Website Makeovers for East London Businesses</title>
<meta name="description" content="We rebuild your business website before you pay a penny. An East London studio doing brand and website makeovers from £500.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{--paper:#F5F3EE;--paper-2:#EAE6DC;--ink:#111110;--ink-2:#1d1d1b;--wet:#FF5A36;--wet-2:#FFB199;--muted:#6f6c66;--line:rgba(17,17,16,.12);
  --serif:"Instrument Serif",Georgia,serif;--sans:"Geist",system-ui,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--paper);color:var(--ink);font:400 17px/1.6 var(--sans)}
a{color:inherit}
:focus-visible{outline:3px solid var(--wet);outline-offset:3px;border-radius:4px}
.wrap{max-width:1240px;margin-inline:auto;padding-inline:20px}
.eyebrow{font:600 .76rem/1 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--wet)}
header{position:sticky;top:0;z-index:20;background:rgba(245,243,238,.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;height:68px;gap:16px}
.logo{display:flex;align-items:center;gap:10px;text-decoration:none;font:400 1.6rem/1 var(--serif)}
.logo i{display:inline-block;width:28px;height:14px;border-radius:3px 8px 8px 3px;background:var(--wet);box-shadow:6px 0 0 -2px var(--ink)}
.nav ul{display:flex;gap:28px;list-style:none}
.nav ul a{text-decoration:none;color:var(--muted);font-weight:500}
.nav ul a:hover{color:var(--ink)}
.btn{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;gap:8px;background:var(--ink);color:var(--paper);text-decoration:none;font-weight:600;padding:14px 22px;border-radius:999px;transition:transform .2s,background .2s;border:0;font:600 .95rem var(--sans);cursor:pointer}
.btn:hover{transform:translateY(-1px);background:var(--wet)}
.btn.line{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--ink)}
.btn.line:hover{background:var(--ink);color:var(--paper)}
@media (max-width:860px){.nav ul{display:none}}

.hero{padding-block:90px 70px}
h1{font:400 clamp(3.2rem,9vw,8.4rem)/.92 var(--serif);letter-spacing:-.03em;margin-block:22px 28px;max-width:13ch}
h1 em{color:var(--wet)}
.stroke{position:relative;white-space:nowrap}
.stroke::after{content:"";position:absolute;inset-inline:-.08em;inset-block-end:.08em;height:.22em;background:var(--wet-2);z-index:-1;border-radius:.1em .3em .2em .1em;transform:rotate(-1deg)}
.hero p{font-size:1.25rem;max-width:44ch;color:#3d3b37}
.ctas{display:flex;gap:12px;flex-wrap:wrap;margin-top:34px}
.facts{display:flex;gap:40px;flex-wrap:wrap;margin-top:56px;padding-top:28px;border-top:1px solid var(--line)}
.facts b{display:block;font:400 2.6rem/1 var(--serif)}
.facts span{color:var(--muted);font-size:.92rem}

section{padding-block:96px}
h2{font:400 clamp(2.4rem,5.4vw,4.6rem)/1 var(--serif);letter-spacing:-.02em;max-width:18ch}
.lede{color:var(--muted);font-size:1.15rem;max-width:56ch;margin-top:16px}

.steps{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:52px}
.step{background:#fff;border:1px solid var(--line);border-radius:18px;padding:28px}
.step b{font:400 3rem/1 var(--serif);color:var(--wet)}
.step h3{font:600 1.1rem var(--sans);margin-block:16px 6px}
.step p{color:var(--muted);font-size:.95rem}
@media (max-width:900px){.steps{grid-template-columns:1fr 1fr}}
@media (max-width:520px){.steps{grid-template-columns:1fr}}

.works{display:grid;gap:64px;margin-top:56px}
.work{display:grid;grid-template-columns:1.35fr 1fr;gap:44px;align-items:center}
.work:nth-child(even) .shot{order:2}
.shot{display:block;text-decoration:none}
.compare{position:relative;aspect-ratio:16/10;border-radius:14px;overflow:hidden;background:var(--paper-2);box-shadow:0 30px 60px -36px rgba(0,0,0,.55);border:1px solid var(--line)}
.compare img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top}
.compare .before{clip-path:inset(0 calc(100% - var(--pos)) 0 0)}
.compare input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}
.compare:has(.before)::after{content:"";position:absolute;inset-block:0;inset-inline-start:var(--pos);width:3px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.2);pointer-events:none}
.lbl{position:absolute;inset-block-start:12px;background:rgba(17,17,16,.8);color:#fff;font:600 .72rem var(--sans);letter-spacing:.1em;text-transform:uppercase;padding:5px 10px;border-radius:6px;pointer-events:none}
.lbl.l{inset-inline-start:12px}.lbl.r{inset-inline-end:12px;background:var(--wet)}
.info .top{display:flex;align-items:center;gap:12px}
.num{font:400 1.6rem var(--serif);color:var(--muted)}
.badge{font:600 .7rem var(--sans);letter-spacing:.1em;text-transform:uppercase;border:1px solid var(--line);border-radius:999px;padding:5px 10px;color:var(--muted)}
.badge.client{background:var(--ink);color:#fff;border-color:var(--ink)}
.info h3{font:400 clamp(2rem,3.4vw,2.8rem)/1.05 var(--serif);margin-block:14px 6px}
.where{color:var(--wet);font-weight:600;font-size:.92rem}
.info p:not(.where){color:#3d3b37;margin-top:12px}
.links{display:flex;gap:18px;flex-wrap:wrap;margin-top:20px}
.links a{font-weight:600;text-decoration:none;border-bottom:1.5px solid var(--ink);padding-bottom:2px}
.links a:hover{color:var(--wet);border-color:var(--wet)}
.nosite{color:var(--muted);font-weight:600}
@media (max-width:900px){.work{grid-template-columns:1fr;gap:24px}.work:nth-child(even) .shot{order:0}}

.pricing{background:var(--ink);color:var(--paper)}
.pricing h2{color:#fff}
.pricing .lede{color:#b5b1a9}
.tiers{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:52px}
.tier{border:1px solid rgba(245,243,238,.18);border-radius:20px;padding:32px;display:flex;flex-direction:column;gap:14px}
.tier.pop{background:var(--paper);color:var(--ink);border-color:transparent}
.tier h3{font:600 1rem var(--sans);letter-spacing:.1em;text-transform:uppercase}
.tier .price{font:400 3.6rem/1 var(--serif)}
.tier .price small{font:500 1rem var(--sans);color:var(--muted)}
.tier ul{list-style:none;display:grid;gap:8px}
.tier li::before{content:"✓ ";color:var(--wet);font-weight:700}
.tier .btn{margin-top:auto;align-self:flex-start}
.tier:not(.pop) .btn{background:var(--paper);color:var(--ink)}
@media (max-width:900px){.tiers{grid-template-columns:1fr}}

.faq .cols{display:grid;grid-template-columns:.8fr 1.2fr;gap:64px}
details{border-top:1px solid var(--line);padding-block:20px}
summary{cursor:pointer;font:400 1.6rem var(--serif);list-style:none;display:flex;justify-content:space-between;gap:16px}
summary::after{content:"+";color:var(--wet)}
details[open] summary::after{content:"–"}
details p{color:var(--muted);margin-top:10px;max-width:64ch}
@media (max-width:860px){.faq .cols{grid-template-columns:1fr}}

.contact{background:var(--wet);color:var(--ink);border-radius:28px;padding:64px;display:grid;grid-template-columns:1.1fr 1fr;gap:48px;align-items:center}
.contact h2{max-width:14ch}
.contact form{display:grid;gap:12px}
.contact input{font:inherit;padding:15px;border-radius:12px;border:0;background:rgba(255,255,255,.9)}
.contact .btn:hover{background:#fff;color:var(--ink)}
@media (max-width:860px){.contact{grid-template-columns:1fr;padding:32px}}

footer{padding-block:40px;color:var(--muted);font-size:.85rem}
footer .wrap{display:grid;gap:12px}
@media (prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
</style>
</head>
<body>
<header>
  <nav class="wrap nav" aria-label="Main">
    <a class="logo" href="#top"><i aria-hidden="true"></i>Second Coat</a>
    <ul><li><a href="#how">How it works</a></li><li><a href="#work">Work</a></li><li><a href="#pricing">Pricing</a></li><li><a href="#faq">FAQ</a></li></ul>
    <a class="btn" href="#contact">Get a free redesign</a>
  </nav>
</header>

<main id="top">
  <section class="wrap hero">
    <span class="eyebrow">East London web studio</span>
    <h1>Your website, <em>rebuilt</em> before you pay a <span class="stroke">penny.</span></h1>
    <p>We give tired local business websites a second coat: a new brand, a fast modern site and your real story told properly. You see the finished thing first. You only pay if you love it.</p>
    <div class="ctas"><a class="btn" href="#contact">Get my free redesign</a><a class="btn line" href="#work">See the makeovers</a></div>
    <div class="facts">
      <div><b>£500</b><span>for a new site, all in</span></div>
      <div><b>${clients.length}</b><span>East London makeovers so far</span></div>
      <div><b>£0</b><span>until you've seen it</span></div>
    </div>
  </section>

  <section id="how" class="wrap" style="padding-top:0">
    <span class="eyebrow">How it works</span>
    <h2>See it first. Pay after.</h2>
    <div class="steps">
      <div class="step"><b>1</b><h3>We find your story</h3><p>We dig into what makes you different: your history, your street, your reviews.</p></div>
      <div class="step"><b>2</b><h3>We build it</h3><p>A new brand look and a fast, mobile-first website using your real details.</p></div>
      <div class="step"><b>3</b><h3>You take a look</h3><p>We send you a private link. No pitch meeting, no obligation.</p></div>
      <div class="step"><b>4</b><h3>Love it? It's live</h3><p>Pay once, and we put it on your domain within a week.</p></div>
    </div>
  </section>

  <section id="work" class="wrap" style="padding-top:0">
    <span class="eyebrow">The makeovers</span>
    <h2>Six East London businesses, rebuilt.</h2>
    <p class="lede">Each one comes with a full brand book and a new website. These are unsolicited concepts: we chose businesses we love and showed what their sites could be. None of them are clients unless marked.</p>
    <div class="works">${clients.map(card).join('')}
    </div>
  </section>

  <section id="pricing" class="pricing">
    <div class="wrap">
      <span class="eyebrow">Pricing</span>
      <h2>Simple, fixed prices.</h2>
      <p class="lede">No hourly rates, no surprises. You see the work before you pay for any of it.</p>
      <div class="tiers">
        <div class="tier"><h3>Refresh</h3><div class="price">£500</div><ul><li>The new site we built for you</li><li>Set up on your domain</li><li>Contact form and click-to-call</li><li>Google-ready (schema and SEO basics)</li><li>One round of edits</li></ul><a class="btn" href="#contact">Start with a Refresh</a></div>
        <div class="tier pop"><h3>Rebrand</h3><div class="price">£1,200</div><ul><li>Everything in Refresh</li><li>Full brand book (logo, colour, type, voice)</li><li>Up to 5 pages</li><li>Social media templates</li><li>Two rounds of edits</li></ul><a class="btn" href="#contact">Go for the Rebrand</a></div>
        <div class="tier"><h3>Care plan</h3><div class="price">£49<small>/month</small></div><ul><li>Hosting and SSL included</li><li>Monthly content updates</li><li>Uptime monitoring</li><li>Quarterly Google report</li><li>Cancel anytime</li></ul><a class="btn" href="#contact">Add Care</a></div>
      </div>
    </div>
  </section>

  <section id="faq" class="faq wrap">
    <div class="cols">
      <div><span class="eyebrow">Questions</span><h2>Fair questions.</h2></div>
      <div>
        <details open><summary>Why build it before I've paid?</summary><p>Because showing beats telling. Most small businesses have been burned by agencies that took a deposit and delivered something generic. We'd rather do the work and let it speak.</p></details>
        <details><summary>What if I don't want it?</summary><p>Then you don't pay, and we take the preview down. No hard feelings, and no follow-up spam.</p></details>
        <details><summary>Do I own the website?</summary><p>Yes. Once it's paid for, the site, the code and the brand files are yours.</p></details>
        <details><summary>Do I need to do anything?</summary><p>Just tell us what's wrong with the draft. We handle the domain, the hosting and the tech.</p></details>
        <details><summary>Why East London?</summary><p>Because we're here. We can pop in, take photos and meet you at your shop. Being local is the whole point.</p></details>
      </div>
    </div>
  </section>

  <section id="contact" class="wrap" style="padding-top:0">
    <div class="contact">
      <div>
        <span class="eyebrow" style="color:var(--ink)">Free redesign</span>
        <h2 style="margin-top:14px">Want to see your business with a second coat?</h2>
      </div>
      <form onsubmit="event.preventDefault();location.href='mailto:hello@example.com?subject='+encodeURIComponent('Free redesign: '+this.b.value)+'&body='+encodeURIComponent('Website: '+this.u.value)">
        <input name="b" placeholder="Business name" aria-label="Business name" required>
        <input name="u" placeholder="Your current website" aria-label="Current website">
        <button class="btn" type="submit">Request my free redesign</button>
      </form>
    </div>
  </section>
</main>

<footer><div class="wrap">
  <span>© ${new Date().getFullYear()} Second Coat · East London</span>
  <span>Businesses shown are unsolicited redesign concepts made to show our work, unless marked "Client". They are not endorsements, and all names and trademarks belong to their owners. If you own one of these businesses and would like your concept removed, email us and we'll take it down.</span>
</div></footer>

<script>
document.querySelectorAll('.compare input').forEach(r=>{
  const c=r.closest('.compare');
  r.addEventListener('input',()=>c.style.setProperty('--pos',r.value+'%'));
  r.addEventListener('click',e=>e.preventDefault());
});
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log('wrote index.html with', clients.length, 'clients');
