// Free "website health check": a printable one-page report for a business, from its URL.
// Used at the East End Trades Guild evening and as a lead magnet. Run on your own machine (needs internet).
//   node scripts/healthcheck.js https://example.co.uk "Business Name"
//   node scripts/healthcheck.js --csv prospects/2026-10-01.csv     (a report for every row with a url)
// Writes reports/health-<slug>.html. Print at A4.
const fs = require('fs');
const path = require('path');
const { auditSite } = require('./find-prospects');
const cfg = require('./config');

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

// flag prefix → [plain-English problem, why it matters, free fix they can do themselves]
const EXPLAIN = [
  ['NO WEBSITE', 'You don\'t have a website of your own', 'People searching for you land on directories and review sites you don\'t control, often with wrong hours.', 'Claim and update your free Google Business Profile today (business.google.com). It\'s the single biggest free win.'],
  ['SITE DOWN', 'Your website didn\'t load', 'Visitors (and Google) see an error, and every day it\'s down costs you enquiries.', 'Check your hosting and domain renewal dates, since expired domains are the most common cause.'],
  ['no HTTPS', 'Your site isn\'t secure (no padlock)', 'Browsers show a "Not secure" warning, which scares customers away and lowers you in Google.', 'Most hosts offer free SSL certificates (Let\'s Encrypt). Ask your host to switch it on.'],
  ['free builder subdomain', 'Your site lives on someone else\'s web address', 'A free subdomain (like yourname.wixsite.com) looks temporary and is harder to find.', 'Buy your own domain (around £10–15 a year) and point it at your site.'],
  ['no mobile viewport', 'Your site isn\'t set up for phones', 'Most local searches happen on phones. Tiny text and sideways scrolling send people elsewhere.', 'If you use a website builder, switch to a mobile-friendly template.'],
  ['long title', 'Your page title is too long for Google', 'Google cuts titles at about 60 characters, so the important part may never show.', 'Rewrite it as: Business name, what you do, where. For example: "Rose Locksmith: Key Cutting, Bethnal Green".'],
  ['keyword-stuffed title', 'Your page title is stuffed with keywords', 'Lists like "Cheap | Best | London | …" look like spam to people and to Google.', 'Use one clear sentence: who you are, what you do, and where.'],
  ['spammy words in title', 'Your title uses words like "best" or "cheap"', 'Unprovable claims reduce trust, and in some trades (law, health) they can break advertising rules.', 'Replace them with something true and specific: "since 1957", "family-run", "4.9★ from 600 reviews".'],
  ['no meta description', 'No summary for Google', 'Google makes up the grey text under your link, and it\'s often a random fragment.', 'Add a 1–2 sentence description in your website builder\'s SEO settings.'],
  ['no tap-to-call', 'Phone number can\'t be tapped', 'On a phone, customers have to copy your number by hand, and many won\'t bother.', 'Make your number a "tel:" link. Most builders have a "phone link" option.'],
  ['no schema', 'Google can\'t read your opening hours or address', 'Without structured data, Google has to guess your details for maps and search.', 'Keep your Google Business Profile complete and up to date.'],
  ['©', 'Your site looks out of date', 'An old copyright year tells visitors nobody is looking after the site, or the business.', 'Update the footer year, and check your hours, prices and photos while you\'re there.'],
  ['dated .htm/.php pages', 'Your site is built on older technology', 'Older hand-built sites are usually slow, hard to update and weak on phones.', 'Consider moving to a modern, mobile-first site.'],
  ['slow', 'Your site is slow to load', 'Every extra second loses visitors, especially on mobile data.', 'Compress large photos (squoosh.app is free) and remove unused plugins.'],
  ['free email address', 'You use a free email address', 'A @hotmail or @gmail address looks less professional than you@yourbusiness.co.uk.', 'Most domain providers include a matching email address, often free.'],
  ['HTTP 4', 'Your site returned an error page', 'Visitors see an error instead of your business.', 'Ask your web host or builder to check the site.'],
];
const explain = flag => EXPLAIN.find(([k]) => flag.startsWith(k));

function report(name, url, audit) {
  const items = audit.flags.map(f => ({ f, e: explain(f) })).filter(x => x.e);
  const grade = audit.score >= 40 ? ['Good', '#2E7D4F'] : audit.score >= 25 ? ['Needs work', '#B7791F'] : ['Urgent', '#C0392B'];
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Website health check: ${esc(name)}</title><meta name="robots" content="noindex">
<style>@page{size:A4;margin:14mm}*{box-sizing:border-box;margin:0;padding:0}body{font:10.5pt/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:#111;max-width:180mm;margin:10mm auto}
header{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #111;padding-bottom:4mm}
h1{font:400 22pt/1.1 Georgia,serif;margin:6mm 0 2mm}.url{color:#555;word-break:break-all}
.score{display:flex;gap:6mm;align-items:center;margin:6mm 0;padding:5mm;border-radius:3mm;background:#F5F3EE}
.score b{font:400 34pt Georgia,serif}.grade{font-weight:700;color:${grade[1]}}
.item{border-top:1px solid #ddd;padding:3.5mm 0;display:grid;grid-template-columns:1fr 1fr;gap:5mm}
.item h3{font-size:11pt;margin-bottom:1mm}.item p{color:#444}.fix{background:#F5F3EE;border-radius:2mm;padding:2.5mm 3mm}.fix b{display:block;font-size:8pt;letter-spacing:.1em;text-transform:uppercase;color:#FF5A36}
footer{margin-top:8mm;border-top:2px solid #111;padding-top:4mm;display:flex;justify-content:space-between;gap:6mm;font-size:9.5pt}
.good{color:#2E7D4F}</style></head><body>
<header><b>${esc(cfg.name)} · Free website health check</b><span>${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span></header>
<h1>${esc(name)}</h1><p class="url">${esc(url || 'No website found')}</p>
<div class="score"><b>${audit.score}<span style="font-size:14pt">/50</span></b><div><span class="grade">${grade[0]}</span><br>${items.length ? `We found ${items.length} thing${items.length > 1 ? 's' : ''} worth fixing. Most have a free fix below.` : '<span class="good">No major problems found. Nice work.</span>'}${audit.title ? `<br><span style="color:#555">Page title: "${esc(audit.title)}"</span>` : ''}</div></div>
${items.map(({ e }) => `<div class="item"><div><h3>${esc(e[1])}</h3><p>${esc(e[2])}</p></div><div class="fix"><b>Free fix</b>${esc(e[3])}</div></div>`).join('')}
<footer><div>Want it all fixed for you? We rebuild local business websites, and you see the new one before you pay anything. From ${cfg.fmt.refresh}.</div><div style="text-align:right;white-space:nowrap"><b>${esc(cfg.email)}</b>${cfg.phone ? '<br>' + esc(cfg.phone) : ''}<br>${esc(cfg.siteUrl.replace(/^https?:\/\//, ''))}</div></footer>
</body></html>`;
}

async function one(url, name) {
  const audit = await auditSite(url);
  const out = path.join(__dirname, '..', 'reports', `health-${slugify(name || url || 'business')}.html`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, report(name || url, url, audit));
  console.log(`${String(audit.score).padStart(2)}/50  ${name || url} → ${path.relative(process.cwd(), out)}`);
}

module.exports = { report, explain };
if (require.main === module) (async () => {
  const a = process.argv.slice(2);
  if (a[0] === '--csv') {
    const rows = fs.readFileSync(a[1], 'utf8').trim().split('\n');
    const head = rows.shift().split(',');
    const ui = head.indexOf('url'), ni = head.indexOf('name');
    for (const r of rows) { const cells = r.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map(c => c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"')); if (cells[ui]) await one(cells[ui], cells[ni]); }
  } else if (a[0]) await one(a[0], a[1]);
  else console.error('usage: node scripts/healthcheck.js <url> "Business name"   |   --csv prospects/<file>.csv');
})();
