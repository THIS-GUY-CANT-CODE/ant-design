// One command for the whole pipeline.
//   node scripts/build.js <slug>          brand book → site (if site.json) → screenshots + checks → leave-behind
//   node scripts/build.js --all           every client, then case studies, portfolio, landing pages and dashboard
//   add --no-shots to skip Playwright (e.g. in CI without a browser)
// Screenshots need Playwright: `cd scripts && npm install && npx playwright install chromium`
// (or NODE_PATH pointing at a global install).
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const noShots = args.includes('--no-shots');
const all = args.includes('--all');
const slugs = all
  ? fs.readdirSync(path.join(root, 'clients')).filter(s => fs.existsSync(path.join(root, 'clients', s, 'meta.json')))
  : args.filter(a => !a.startsWith('--'));
if (!slugs.length) { console.error('usage: node scripts/build.js <slug> | --all [--no-shots]'); process.exit(1); }

const run = (script, ...a) => execFileSync(process.execPath, [path.join(__dirname, script), ...a], { cwd: root, stdio: 'pipe', encoding: 'utf8' });
let failed = 0;
for (const slug of slugs) {
  const dir = path.join(root, 'clients', slug);
  const steps = [];
  try {
    if (fs.existsSync(path.join(dir, 'brand.json'))) { run('brandbook.js', slug); steps.push('brand book'); }
    if (fs.existsSync(path.join(dir, 'site.json'))) { run('site.js', slug); steps.push('site'); }
    if (!noShots) { const out = run('shot.js', slug); steps.push('checks: ' + (out.match(/fails \d+/g) || []).join('/')); }
    run('leavebehind.js', slug); steps.push('leave-behind');
    console.log(`✓ ${slug}: ${steps.join(' · ')}`);
  } catch (e) {
    failed++;
    console.log(`✗ ${slug}: failed after [${steps.join(', ')}]\n${(e.stdout || '') + (e.stderr || e.message)}`.trimEnd());
  }
}
if (all) {
  for (const s of ['cases.js', 'portfolio.js', 'landing.js', 'dashboard.js']) console.log(run(s).trim().split('\n').map(l => '  ' + l).join('\n'));
}
process.exit(failed ? 1 : 0);
