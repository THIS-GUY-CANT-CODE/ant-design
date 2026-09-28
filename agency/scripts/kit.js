// Usage: node scripts/kit.js [slug ...]
// Inlines kit/motion.css and kit/motion.js into every hand-built site that has the kit markers,
// so the sites stay single-file but share one motion system:
//   <style id="kit"></style>        in <head>
//   <script id="kit"></script>      just before </body>
// With no slugs, it updates every clients/*/site/index.html containing the markers.
// Put site CSS/JS in the site's own <style>/<script>, never inside the kit blocks: they are replaced wholesale on every run.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'kit', 'motion.css'), 'utf8').trim();
const js = fs.readFileSync(path.join(root, 'kit', 'motion.js'), 'utf8').trim();
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(path.join(root, 'clients'));
let n = 0;
for (const slug of slugs) {
  const f = path.join(root, 'clients', slug, 'site', 'index.html');
  if (!fs.existsSync(f)) continue;
  let s = fs.readFileSync(f, 'utf8');
  if (!s.includes('<style id="kit">')) continue;
  s = s.replace(/<style id="kit">[\s\S]*?<\/style>/, () => `<style id="kit">\n${css}\n</style>`)
       .replace(/<script id="kit">[\s\S]*?<\/script>/, () => `<script id="kit">\n${js}\n</script>`);
  fs.writeFileSync(f, s); n++;
}
console.log(`kit inlined into ${n} site(s)`);
