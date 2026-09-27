// Usage: node scripts/landing.js   (run after portfolio.js, because it reuses index.html's styles)
// Builds SEO landing pages at for/<sector>/index.html, e.g. /for/restaurants-pubs/.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = indexHtml.match(/<style>([\s\S]*?)<\/style>/)[1];
const fonts = indexHtml.match(/<link href="(https:\/\/fonts[^"]+)"/)[1];

const clients = fs.readdirSync(path.join(root, 'clients'))
  .filter(d => fs.existsSync(path.join(root, 'clients', d, 'meta.json')))
  .map(d => JSON.parse(fs.readFileSync(path.join(root, 'clients', d, 'meta.json'), 'utf8')));

const sectors = {
  hospitality: { slug: 'restaurants-pubs', label: 'restaurants, cafés & pubs', h1: 'Websites for East London <em>restaurants, cafés &amp; pubs</em>.',
    pains: [['Menu as a PDF or photo', 'Hungry people on phones leave. We put your menu on the page as real text that Google can read too.'], ['No "open now"', 'Opening hours with today highlighted, so nobody turns up to a closed door.'], ['No website at all', 'Many great pubs only exist on Tripadvisor. We give you a home you control.'], ['Stale events', 'Our Care plan keeps your what\'s-on page fresh every week.']] },
  retail: { slug: 'shops-salons', label: 'shops, salons & bookshops', h1: 'Websites for East London <em>shops &amp; salons</em>.',
    pains: [['Stuck on a free template', 'A free subdomain says "temporary". We move you to your own name and brand.'], ['Your story is buried', 'Ninety years on the high street is your edge over the chains. We make it the headline.'], ['No way to book or order', 'Booking, click-to-call and online ordering links, one tap from every page.'], ['Seasonal peaks missed', 'Valentine\'s, Christmas, back-to-school pages swapped in on the Care plan.']] },
  trades: { slug: 'trades-garages', label: 'trades, garages & repair shops', h1: 'Websites for East London <em>trades &amp; garages</em>.',
    pains: [['Keyword-stuffed titles', '"Quality Affordable Cheap…" reads as spam to people and to Google. We fix it properly.'], ['Emergency number buried', 'Locked out or broken down? Your number should be one tap away on every page.'], ['Competing with lead-gen sites', 'Fake "local" sites steal your jobs. A strong site and Google profile win them back.'], ['No reviews on show', 'You have hundreds of five-star reviews. We put them where customers decide.']] },
  health: { slug: 'health-clinics', label: 'dentists, clinics & clubs', h1: 'Websites for East London <em>dentists, clinics &amp; clubs</em>.',
    pains: [['Nervous first-timers', 'A calm "what to expect" section is the difference between a booking and a bounce.'], ['Fees hidden', 'Clear fees build trust, and regulators like the GDC expect them.'], ['Compliance worries', 'We write copy that stays within ASA/CAP and GDC guidance. No cure claims, ever.'], ['Stale "since" dates', '"Over 19 years" on a 25-year-old practice tells people nobody\'s minding the site.']] },
  professional: { slug: 'agencies-estate-agents', label: 'estate agents & professional firms', h1: 'Websites for East London <em>estate agents &amp; firms</em>.',
    pains: [['Valuations buried', 'The valuation request is your revenue. It belongs in the hero, not on page four.'], ['Look like every chain', 'Seventy years of local history is something Foxtons can\'t buy. We lead with it.'], ['Old award badges', 'A 2018 badge tells people nothing\'s changed. We keep trust signals current.'], ['Multiple branches, one mess', 'One clear site with every office, plus a care plan across all of them.']] },
};

for (const [key, s] of Object.entries(sectors)) {
  const list = clients.filter(c => c.sector === key);
  if (!list.length) continue;
  const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Websites for East London ${esc(s.label)} | Second Coat</title>
<meta name="description" content="Website makeovers for East London ${esc(s.label)}. See your new site before you pay a penny. From £500.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fonts}" rel="stylesheet">
<style>${css}
.pains{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:44px}
.pain{background:#fff;border:1px solid var(--line);border-radius:18px;padding:26px}
.pain h3{font:600 1.1rem var(--sans);margin-bottom:6px}
.pain p{color:var(--muted)}
.minis{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px;margin-top:44px}
.mini{text-decoration:none;display:block}
.mini img{width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top;border-radius:12px;border:1px solid var(--line);box-shadow:0 20px 40px -30px rgba(0,0,0,.5)}
.mini h3{font:400 1.8rem/1.1 var(--serif);margin-top:14px}
.mini p{color:var(--muted);font-size:.95rem}
@media (max-width:760px){.pains{grid-template-columns:minmax(0,1fr)}}
</style>
</head>
<body>
<header><nav class="wrap nav" aria-label="Main"><a class="logo" href="../../"><i aria-hidden="true"></i>Second Coat</a>
<ul><li><a href="../../#how">How it works</a></li><li><a href="../../#work">Work</a></li><li><a href="../../#pricing">Pricing</a></li></ul>
<a class="btn" href="../../#contact">Get a free redesign</a></nav></header>
<main>
  <section class="wrap hero">
    <span class="eyebrow">For ${esc(s.label)}</span>
    <h1 style="max-width:16ch">${s.h1}</h1>
    <p>We rebuild your website, brand and all, <b>before</b> you pay anything. See it, love it, then it's yours from £500.</p>
    <div class="ctas"><a class="btn" href="../../#contact">Get my free redesign</a><a class="btn line" href="#examples">See examples</a></div>
  </section>
  <section class="wrap" style="padding-top:0">
    <span class="eyebrow">What we fix</span>
    <h2>The problems we see every week.</h2>
    <div class="pains">${s.pains.map(p => `<div class="pain"><h3>${esc(p[0])}</h3><p>${esc(p[1])}</p></div>`).join('')}</div>
  </section>
  <section id="examples" class="wrap" style="padding-top:0">
    <span class="eyebrow">Examples</span>
    <h2>East London ${esc(s.label)} we've reimagined.</h2>
    <p class="lede">Unsolicited concepts made to show what's possible. They're not clients unless marked.</p>
    <div class="minis">${list.map(c => `<a class="mini" href="../../clients/${c.slug}/site/"><img src="../../clients/${c.slug}/after/desktop-card.jpg" alt="${esc(c.name)} concept redesign" loading="lazy"><h3>${esc(c.name)}</h3><p>${esc(c.area)} · ${c.status === 'client' ? 'Client' : 'Concept'}</p></a>`).join('')}</div>
  </section>
  <section class="wrap" style="padding-top:0"><div class="contact"><div><span class="eyebrow" style="color:var(--ink)">Free redesign</span><h2 style="margin-top:14px">Want to see yours?</h2></div><div><a class="btn" href="../../#contact">Request my free redesign</a></div></div></section>
</main>
<footer><div class="wrap"><span>© ${new Date().getFullYear()} Second Coat · East London</span><span>Businesses shown are unsolicited concepts unless marked "Client". All names and trademarks belong to their owners.</span></div></footer>
</body>
</html>
`;
  fs.mkdirSync(path.join(root, 'for', s.slug), { recursive: true });
  fs.writeFileSync(path.join(root, 'for', s.slug, 'index.html'), html);
  console.log(`wrote for/${s.slug}/ (${list.length} examples)`);
}

// sitemap.xml + robots.txt (client concepts are noindex and left out on purpose)
const base = process.env.SITE_URL || 'https://secondcoat.example';
const urls = ['/', ...Object.values(sectors).map(s => `/for/${s.slug}/`)];
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${base}${u}</loc></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(root, 'robots.txt'), `User-agent: *\nDisallow: /clients/\nSitemap: ${base}/sitemap.xml\n`);
console.log('wrote sitemap.xml and robots.txt for', base, '(set SITE_URL when you have the domain)');
