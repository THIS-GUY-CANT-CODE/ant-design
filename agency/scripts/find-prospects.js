// Finds and scores East London businesses with weak websites. Run on your own machine.
//
//   export GOOGLE_PLACES_API_KEY=...        # Google Cloud → enable "Places API (New)"
//   node scripts/find-prospects.js "florist" "barber" "garage" --areas "Hackney,Leyton,Bow"
//
// Output: prospects/<date>.csv sorted best-first (lowest site score = weakest site = best prospect),
// plus a summary in the terminal. Nothing is added to pipeline.csv automatically. Review, then copy good rows across.
// Cost: each text search is a billable Places request (check current Google pricing). Website checks are free.
const fs = require('fs');
const path = require('path');

const KEY = process.env.GOOGLE_PLACES_API_KEY;
const args = process.argv.slice(2);
const areaIdx = args.indexOf('--areas');
const areaArg = areaIdx >= 0 ? args.splice(areaIdx, 2)[1] : undefined;
if (areaIdx >= 0 && !areaArg) console.warn('--areas given without a value, so using the default areas');
const areas = (areaArg || 'Hackney,Shoreditch,Bethnal Green,Whitechapel,Bow,Stratford,Leyton,Leytonstone,Walthamstow,Dalston,Clapton,Forest Gate,Poplar')
  .split(',').map(s => s.trim()).filter(Boolean);
const trades = args.length ? args : ['florist', 'barber', 'garage MOT', 'locksmith', 'dentist', 'physiotherapist', 'cafe', 'estate agent', 'solicitor', 'dry cleaner'];
const MIN_REVIEWS = +(process.env.MIN_REVIEWS || 20);
const YEAR = new Date().getFullYear();
const FREE_HOSTS = /(wixsite\.com|ueniweb\.com|business\.site|weebly\.com|godaddysites\.com|square\.site|webnode|jimdo|site123|yolasite|wordpress\.com|blogspot\.)/i;
const SPAM_WORDS = /\b(best|cheap|cheapest|no\.?\s?1|number one|affordable|top rated|leading)\b/gi;



async function searchPlaces(query) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.websiteUri,places.userRatingCount,places.rating,places.nationalPhoneNumber,places.businessStatus,places.primaryTypeDisplayName' },
    body: JSON.stringify({ textQuery: query, regionCode: 'GB', maxResultCount: 20 }),
  });
  if (!res.ok) throw new Error(`Places ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).places || [];
}

// Quick, browser-free website audit. Returns { score /50, flags[] }. Lower score = weaker site.
async function auditSite(url) {
  const flags = [];
  if (!url) return { score: 0, flags: ['NO WEBSITE'], title: '' };
  let html = '', finalUrl = url, ms = 0;
  try {
    const t0 = Date.now();
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'Mozilla/5.0 (SecondCoat prospect check)' } });
    ms = Date.now() - t0; finalUrl = res.url; html = await res.text();
    if (!res.ok) flags.push(`HTTP ${res.status}`);
  } catch (e) { return { score: 2, flags: ['SITE DOWN / UNREACHABLE'], title: '' }; }

  let score = 50;
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s+/g, ' ').trim();
  const hit = (cond, pts, flag) => { if (cond) { score -= pts; flags.push(flag); } };
  hit(!finalUrl.startsWith('https://'), 8, 'no HTTPS');
  hit(FREE_HOSTS.test(finalUrl), 10, 'free builder subdomain');
  hit(!/<meta[^>]+name=["']viewport/i.test(html), 8, 'no mobile viewport');
  hit(!title, 5, 'no title');
  hit(title.length > 70, 4, `long title (${title.length} chars)`);
  hit((title.match(/[|:]/g) || []).length >= 3, 4, 'keyword-stuffed title');
  hit((title.match(SPAM_WORDS) || []).length >= 1, 3, 'spammy words in title');
  hit(!/<meta[^>]+name=["']description/i.test(html), 3, 'no meta description');
  hit(!/href=["']tel:/i.test(html), 3, 'no tap-to-call');
  hit(!/application\/ld\+json/i.test(html), 2, 'no schema');
  const years = [...html.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi)].map(m => +m[1]);
  const cy = years.length ? Math.max(...years) : null;
  hit(cy && cy < YEAR - 2, 4, `© ${cy}`);
  hit(/href=["'][^"']+\.(htm|php)["']/i.test(html) && !/wp-content/i.test(html), 2, 'dated .htm/.php pages');
  hit(ms > 4000, 3, `slow (${(ms / 1000).toFixed(1)}s)`);
  hit(/@(hotmail|gmail|yahoo|outlook|btinternet)\./i.test(html), 2, 'free email address');
  const gen = html.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)/i)?.[1] || '';
  if (gen) flags.push(`platform: ${gen.slice(0, 30)}`);
  return { score: Math.max(0, score), flags, title };
}

const csvCell = v => `"${String(v ?? '').replace(/"/g, '""')}"`;

module.exports = { auditSite };
if (require.main === module) (async () => {
  if (!KEY) { console.error('Set GOOGLE_PLACES_API_KEY first (see the header of this file).'); process.exit(1); }
  const seen = new Set(); const rows = [];
  for (const trade of trades) for (const area of areas) {
    const q = `${trade} in ${area}, London`;
    let places = [];
    try { places = await searchPlaces(q); } catch (e) { console.error('✗', q, e.message); continue; }
    for (const p of places) {
      if (seen.has(p.id) || p.businessStatus === 'CLOSED_PERMANENTLY') continue; seen.add(p.id);
      if ((p.userRatingCount || 0) < MIN_REVIEWS) continue;
      const a = await auditSite(p.websiteUri);
      rows.push({ name: p.displayName?.text, trade, area, address: p.formattedAddress, phone: p.nationalPhoneNumber, url: p.websiteUri || '', reviews: p.userRatingCount, rating: p.rating, score: a.score, title: a.title, flags: a.flags.join('; ') });
      process.stdout.write('.');
    }
  }
  rows.sort((x, y) => x.score - y.score || y.reviews - x.reviews);
  const dir = path.join(__dirname, '..', 'prospects'); fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${new Date().toISOString().slice(0, 10)}.csv`);
  const cols = ['score', 'name', 'trade', 'area', 'reviews', 'rating', 'phone', 'url', 'address', 'title', 'flags'];
  fs.writeFileSync(file, [cols.join(','), ...rows.map(r => cols.map(c => csvCell(r[c])).join(','))].join('\n') + '\n');
  console.log(`\n\n${rows.length} businesses with ${MIN_REVIEWS}+ reviews checked → ${path.relative(process.cwd(), file)}\n`);
  console.log('Top 15 prospects (weakest sites, most reviews):');
  rows.slice(0, 15).forEach(r => console.log(`${String(r.score).padStart(2)}/50  ${r.name} (${r.area}, ${r.reviews} reviews)  ${r.flags}`));
})();
