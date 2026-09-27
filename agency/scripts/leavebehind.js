// Usage: node scripts/leavebehind.js <slug> [previewUrl]
// Builds clients/<slug>/leave-behind.html, a printable A5 page for walk-in pitches.
// It shows the new site, the top 3 fixes (from the "angle" list in audit.md), the price and a QR code to the preview.
// Open it in a browser and print at A5 (or A4 at 71%). The QR code needs internet access (loads qrcode from cdnjs).
const fs = require('fs');
const path = require('path');

const [slug, preview = ''] = process.argv.slice(2);
if (!slug) { console.error('usage: node scripts/leavebehind.js <slug> [previewUrl]'); process.exit(1); }
const dir = path.join(__dirname, '..', 'clients', slug);
const meta = JSON.parse(fs.readFileSync(path.join(dir, 'meta.json'), 'utf8'));
const audit = fs.readFileSync(path.join(dir, 'audit.md'), 'utf8');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Pull the numbered list under the "angle" heading, strip markdown, keep the first 3
const angle = (audit.split(/^## .*angle.*$/mi)[1] || '').split(/^## /m)[0];
const fixes = [...angle.matchAll(/^\d+\.\s+(.*)$/gm)].map(m => m[1].replace(/\*\*(.*?)\*\*/g, '$1').replace(/`/g, '')).slice(0, 3);
const url = preview || `https://<your-domain>/clients/${slug}/site/`;

const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<title>${esc(meta.name)}: your new website</title>
<meta name="robots" content="noindex">
<style>
@page{size:A5;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font:400 11pt/1.45 system-ui,-apple-system,"Segoe UI",sans-serif;color:#111;background:#ddd}
.sheet{width:148mm;height:210mm;margin:10mm auto;background:#F5F3EE;padding:10mm;display:flex;flex-direction:column;gap:5mm;overflow:hidden}
@media print{body{background:none}.sheet{margin:0}}
.top{display:flex;justify-content:space-between;align-items:center;font-weight:700}
.top i{display:inline-block;width:9mm;height:4.5mm;border-radius:1mm 3mm 3mm 1mm;background:#FF5A36;vertical-align:middle;margin-right:2mm}
.tag{font-size:7.5pt;letter-spacing:.14em;text-transform:uppercase;color:#FF5A36;font-weight:700}
h1{font:400 24pt/1.02 Georgia,serif;letter-spacing:-.01em}
h1 em{color:#FF5A36}
.shot{border-radius:2mm;overflow:hidden;border:.3mm solid rgba(0,0,0,.15);aspect-ratio:16/10}
.shot img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
ol{padding-left:5mm;display:grid;gap:1.5mm;font-size:9.5pt}
.bottom{margin-top:auto;display:grid;grid-template-columns:1fr 30mm;gap:5mm;align-items:end}
.price{font:400 20pt Georgia,serif}
.small{font-size:8pt;color:#555}
#qr{width:30mm;height:30mm;background:#fff;padding:1.5mm}
#qr img,#qr canvas{width:100%!important;height:100%!important}
</style>
</head>
<body>
<div class="sheet">
  <div class="top"><span><i></i>Second Coat</span><span class="small">East London web studio</span></div>
  <span class="tag">Made for ${esc(meta.name)}</span>
  <h1>We rebuilt your website. <em>Have a look.</em></h1>
  <div class="shot"><img src="after/desktop-card.jpg" alt="${esc(meta.name)} concept website"></div>
  <div>
    <b style="font-size:10pt">What we changed</b>
    <ol>${fixes.map(f => `<li>${esc(f)}</li>`).join('')}</ol>
  </div>
  <div class="bottom">
    <div>
      <div class="price">£500 <span class="small">to put it live, all in</span></div>
      <p class="small">Your domain, hosting set up, one round of changes. No obligation. The preview comes down in 14 days if it's not for you.</p>
      <p class="small" style="margin-top:2mm"><b>[Your name] · [phone] · [email]</b></p>
    </div>
    <div><div id="qr"></div><p class="small" style="text-align:center;margin-top:1mm">Scan to see it</p></div>
  </div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script>try{new QRCode(document.getElementById('qr'),{text:${JSON.stringify(url)},width:256,height:256,correctLevel:QRCode.CorrectLevel.M})}catch(e){const q=document.getElementById('qr');q.style.cssText+=';font-size:6pt;word-break:break-all;display:flex;align-items:center';q.textContent=${JSON.stringify(url)}}</script>
</body>
</html>
`;
fs.writeFileSync(path.join(dir, 'leave-behind.html'), html);
console.log(`wrote clients/${slug}/leave-behind.html (${fixes.length} fixes) → QR: ${url}`);
