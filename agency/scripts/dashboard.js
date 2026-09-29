// Usage: node scripts/dashboard.js
// Builds internal/dashboard.html from pipeline.csv and clients/*/meta.json.
// internal/ is excluded from the Vercel deploy by .vercelignore, so open the file locally.
const fs = require('fs');
const path = require('path');
const cfg = require('./config');

const root = path.join(__dirname, '..');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Minimal CSV parser (handles quoted fields)
const parseCSV = text => {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cur); cur = ''; }
    else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (ch !== '\r') cur += ch;
  }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  const [head, ...body] = rows.filter(r => r.some(Boolean));
  return body.map(r => Object.fromEntries(head.map((h, i) => [h, r[i] || ''])));
};

const leads = parseCSV(fs.readFileSync(path.join(root, 'pipeline.csv'), 'utf8'));
const stages = ['prospect', 'demo_built', 'demo_sent', 'replied', 'paid', 'live', 'care'];
const labels = { prospect: 'Prospect', demo_built: 'Demo built', demo_sent: 'Demo sent', replied: 'Replied', paid: 'Paid', live: 'Live', care: 'On care plan' };
const next = {
  prospect: 'Score it with the prospect skill',
  demo_built: 'Deploy preview, then send pitch email',
  demo_sent: 'Day 3: screen recording. Day 7: visit. Day 14: last call',
  replied: 'Send proposal (sales/proposal-template.md)',
  paid: 'Run sales/handover-checklist.md',
  live: 'Ask for testimonial, offer care plan',
  care: 'Monthly update and quarterly report',
};
// "Reached" counts: a lead at a later stage has passed every earlier stage
const idx = s => Math.max(0, stages.indexOf(s));
const reached = stages.map((s, i) => leads.filter(l => idx(l.status) >= i).length);
const count = s => leads.filter(l => l.status === s).length;
const paidCount = leads.filter(l => idx(l.status) >= idx('paid')).length;
const careCount = count('care');
const pipelineValue = leads.filter(l => ['demo_built', 'demo_sent', 'replied'].includes(l.status)).length * 500;
const maxReached = Math.max(...reached, 1);

// Concepts rebuilt in the Next.js app (web/apps/studio/src/app/concepts)
const FLAGSHIP = fs.existsSync(path.join(root, 'web/apps/studio/src/app/concepts')) ? fs.readdirSync(path.join(root, 'web/apps/studio/src/app/concepts')) : [];
const hasMeta = slug => fs.existsSync(path.join(root, 'clients', slug, 'meta.json'));

const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Second Coat Pipeline</title>
<style>
:root{--bg:#F5F3EE;--surface:#fff;--ink:#111110;--ink-2:#4a4843;--muted:#77736b;--line:rgba(17,17,16,.12);--bar:#D9472B;--track:#ECE8DF}
@media (prefers-color-scheme:dark){:root{--bg:#141412;--surface:#1d1c1a;--ink:#F2F0EA;--ink-2:#c9c5bc;--muted:#9a958b;--line:rgba(242,240,234,.14);--bar:#FF7A5C;--track:#2a2926}}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font:400 15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;padding:32px 16px}
.wrap{max-width:1180px;margin-inline:auto}
h1{font-size:1.6rem;font-weight:700;letter-spacing:-.01em}
.sub{color:var(--muted);margin-top:4px}
h2{font-size:1rem;font-weight:650;margin-bottom:14px}
.tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:24px}
.tile{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:18px}
.tile .v{font-size:2.2rem;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.1}
.tile .l{color:var(--muted);font-size:.85rem;margin-top:4px}
@media (max-width:760px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))}}
.card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:20px;margin-top:16px}
.funnel{display:grid;gap:8px}
.row{display:grid;grid-template-columns:120px minmax(0,1fr) 40px;gap:12px;align-items:center;padding-block:2px}
.row .name{color:var(--ink-2);font-size:.9rem}
.row .val{font-variant-numeric:tabular-nums;color:var(--ink-2);text-align:end}
.track{height:14px;background:var(--track);border-radius:4px;overflow:hidden}
.fill{height:100%;background:var(--bar);border-radius:0 4px 4px 0}
.row:hover .name,.row:hover .val{color:var(--ink)}
.row:hover .fill{filter:brightness(1.08)}
.scroll{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:.9rem;min-width:760px}
th{text-align:start;color:var(--muted);font-weight:600;font-size:.78rem;letter-spacing:.04em;text-transform:uppercase;padding:8px 10px;border-bottom:1px solid var(--line)}
td{padding:10px;border-bottom:1px solid var(--line);vertical-align:top}
tr:hover td{background:color-mix(in srgb,var(--track) 60%,transparent)}
.pill{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:2px 9px;font-size:.78rem;white-space:nowrap;color:var(--ink-2)}
td a{color:var(--ink)}
.muted{color:var(--muted)}
</style>
</head>
<body>
<div class="wrap">
  <h1>Pipeline</h1>
  <p class="sub">Generated ${new Date().toISOString().slice(0, 10)} from pipeline.csv · ${leads.length} leads</p>

  <div class="tiles">
    <div class="tile"><div class="v">${count('demo_built') + count('demo_sent') + count('replied')}</div><div class="l">Demos in play</div></div>
    <div class="tile"><div class="v">£${pipelineValue.toLocaleString('en-GB')}</div><div class="l">Pipeline at £500 each (Refresh tier)</div></div>
    <div class="tile"><div class="v">${paidCount}</div><div class="l">Paid clients</div></div>
    <div class="tile"><div class="v">£${(careCount * 49).toLocaleString('en-GB')}</div><div class="l">Monthly recurring (care plans)</div></div>
  </div>

  <div class="card">
    <h2>Leads that have reached each stage</h2>
    <div class="funnel">
      ${stages.map((s, i) => `<div class="row" title="${labels[s]}: ${reached[i]} of ${leads.length} leads"><span class="name">${labels[s]}</span><div class="track"><div class="fill" style="width:${(reached[i] / maxReached) * 100}%"></div></div><span class="val">${reached[i]}</span></div>`).join('')}
    </div>
  </div>

  <div class="card">
    <h2>All leads</h2>
    <div class="scroll"><table>
      <thead><tr><th>Business</th><th>Area</th><th>Industry</th><th>Status</th><th>Next action</th><th>Links</th></tr></thead>
      <tbody>
      ${leads.map(l => `<tr>
        <td><b>${esc(l.name)}</b>${l.reviews ? `<div class="muted">${esc(l.reviews)} reviews</div>` : ''}</td>
        <td>${esc(l.area)}</td>
        <td>${esc(l.industry)}</td>
        <td><span class="pill">${esc(labels[l.status] || l.status)}</span></td>
        <td>${esc(next[l.status] || '')}</td>
        <td>${hasMeta(l.slug) ? `${FLAGSHIP.includes(l.slug) ? `<a href="${esc(cfg.siteUrl)}/concepts/${esc(l.slug)}/">Concept</a> · <a href="${esc(cfg.siteUrl)}/work/${esc(l.slug)}/">Case study</a> · ` : ''}<a href="../clients/${esc(l.slug)}/audit.md">Audit</a>` : ''}${l.url ? `${hasMeta(l.slug) ? ' · ' : ''}<a href="${esc(l.url)}">Current site</a>` : ''}</td>
      </tr>`).join('')}
      </tbody>
    </table></div>
  </div>
</div>
</body>
</html>
`;
fs.mkdirSync(path.join(root, 'internal'), { recursive: true });
fs.writeFileSync(path.join(root, 'internal', 'dashboard.html'), html);
console.log('wrote internal/dashboard.html with', leads.length, 'leads');
