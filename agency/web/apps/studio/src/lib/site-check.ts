/**
 * The website health check behind /check. Pure functions over fetched HTML, so it can be tested
 * without the network. Every check explains itself in plain English for a business owner.
 */
export type Check = { id: string; label: string; pass: boolean; weight: number; detail: string; why: string };
export type Report = { url: string; finalUrl: string; status: number; ms: number; bytes: number; score: number; checks: Check[]; title: string };

const attr = (tag: string, name: string) => {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? (m[2] ?? m[3] ?? m[4] ?? '').trim() : null;
};
const tags = (html: string, name: string) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];
const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

function meta(html: string, key: string) {
  for (const t of tags(html, 'meta')) {
    const k = (attr(t, 'name') ?? attr(t, 'property') ?? '').toLowerCase();
    if (k === key) return attr(t, 'content');
  }
  return null;
}

export function analyse(html: string, info: { url: string; finalUrl: string; status: number; ms: number; bytes: number; year?: number }): Report {
  const year = info.year ?? new Date().getFullYear();
  const title = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const desc = decode(meta(html, 'description') ?? '');
  const viewport = meta(html, 'viewport') ?? '';
  const h1s = (html.match(/<h1\b/gi) ?? []).length;
  const imgs = tags(html, 'img');
  const noAlt = imgs.filter((t) => attr(t, 'alt') === null).length;
  const ld = [...html.matchAll(/<script[^>]+type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1] ?? '');
  const ldTypes = ld.flatMap((j) => [...j.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map((m) => m[1]!));
  const og = meta(html, 'og:title') && meta(html, 'og:image');
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ');
  const years = [...text.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi)].map((m) => +m[1]!);
  const latest = years.length ? Math.max(...years) : null;
  const tel = /href\s*=\s*["']tel:/i.test(html);
  const https = info.finalUrl.startsWith('https://');
  const lang = /<html[^>]*\blang\s*=/i.test(html);

  const checks: Check[] = [
    { id: 'https', label: 'Secure connection (HTTPS)', weight: 14, pass: https, detail: https ? 'Served over HTTPS.' : 'Served over plain HTTP.', why: 'Browsers mark HTTP sites “Not secure”, which puts people off before they read a word.' },
    { id: 'viewport', label: 'Works on phones', weight: 14, pass: /width\s*=\s*device-width/i.test(viewport), detail: viewport ? `Viewport: ${viewport}` : 'No mobile viewport tag.', why: 'Without it, phones show a shrunken desktop page. Most local searches happen on a phone.' },
    { id: 'speed', label: 'Responds quickly', weight: 10, pass: info.ms < 1500, detail: `First response in ${(info.ms / 1000).toFixed(1)}s.`, why: 'Slow first responses lose visitors and rank lower. Under 1.5 seconds is the aim.' },
    { id: 'weight', label: 'Light page', weight: 6, pass: info.bytes < 350_000, detail: `HTML is ${Math.round(info.bytes / 1024)}KB.`, why: 'Heavy pages take longer on mobile data. This counts the HTML only, before images.' },
    { id: 'title', label: 'Clear page title', weight: 10, pass: title.length >= 10 && title.length <= 65, detail: title ? `“${title}” (${title.length} characters)` : 'No title.', why: 'The title is the blue link in Google. Between 10 and 65 characters, saying what you do and where.' },
    { id: 'description', label: 'Search description', weight: 8, pass: desc.length >= 50 && desc.length <= 170, detail: desc ? `${desc.length} characters` : 'No meta description.', why: 'This is the snippet under your link in Google. Without one, Google guesses.' },
    { id: 'h1', label: 'One main heading', weight: 5, pass: h1s === 1, detail: `${h1s} main heading${h1s === 1 ? '' : 's'} (h1).`, why: 'One clear headline helps both visitors and search engines understand the page.' },
    { id: 'alt', label: 'Images described', weight: 8, pass: imgs.length === 0 || noAlt / imgs.length <= 0.1, detail: imgs.length ? `${imgs.length - noAlt} of ${imgs.length} images have alt text.` : 'No images found.', why: 'Alt text lets screen readers describe images, and helps images appear in search.' },
    { id: 'schema', label: 'Business details for Google', weight: 10, pass: ldTypes.length > 0, detail: ldTypes.length ? `Structured data: ${[...new Set(ldTypes)].slice(0, 4).join(', ')}` : 'No structured data.', why: 'Structured data tells Google your hours, address and phone, which feeds the map pack and rich results.' },
    { id: 'social', label: 'Looks good when shared', weight: 5, pass: !!og, detail: og ? 'Open Graph title and image set.' : 'No Open Graph title and image.', why: 'When someone shares your link on WhatsApp or social, this is the preview card they see.' },
    { id: 'fresh', label: 'Kept up to date', weight: 5, pass: latest === null ? false : latest >= year - 1, detail: latest ? `Copyright year: ${latest}` : 'No copyright year found.', why: 'An old year in the footer is the fastest signal to a visitor that nobody looks after the site.' },
    { id: 'tel', label: 'Tap to call', weight: 5, pass: tel, detail: tel ? 'Phone number is a tappable link.' : 'No tap-to-call link.', why: 'On a phone, a tappable number is the difference between a call and a closed tab.' },
  ];
  void lang;
  const total = checks.reduce((a, c) => a + c.weight, 0);
  const score = Math.round((checks.filter((c) => c.pass).reduce((a, c) => a + c.weight, 0) / total) * 100);
  return { url: info.url, finalUrl: info.finalUrl, status: info.status, ms: info.ms, bytes: info.bytes, score, checks, title };
}

/** Normalises what someone typed ("example.com", "http://…") into a URL, or throws. */
export function normaliseUrl(input: string) {
  const raw = input.trim();
  if (!raw) throw new Error('Enter a web address.');
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) && !/^https?:\/\//i.test(raw)) throw new Error('Only web addresses (http or https) can be checked.');
  const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  if (!/^https?:$/.test(u.protocol)) throw new Error('Only web addresses (http or https) can be checked.');
  if (u.username || u.password) throw new Error('Addresses with a username or password can’t be checked.');
  if (u.port && !['80', '443'].includes(u.port)) throw new Error('Only standard web ports can be checked.');
  if (!u.hostname.includes('.')) throw new Error('That doesn’t look like a public web address.');
  u.hash = '';
  return u;
}

/** True for loopback, private, link-local, carrier-grade NAT, multicast and reserved ranges (v4 and v6). */
export function isPrivateIp(ip: string) {
  const v4 = ip.startsWith('::ffff:') ? ip.slice(7) : ip;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(v4)) {
    const [a, b] = v4.split('.').map(Number) as [number, number];
    return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 198 && (b === 18 || b === 19));
  }
  const s = ip.toLowerCase();
  return s === '::' || s === '::1' || s.startsWith('fc') || s.startsWith('fd') || s.startsWith('fe8') || s.startsWith('fe9') || s.startsWith('fea') || s.startsWith('feb') || s.startsWith('ff');
}
