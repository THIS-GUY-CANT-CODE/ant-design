import { lookup } from 'node:dns/promises';
import { analyse, isPrivateIp, normaliseUrl } from '@/lib/site-check';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 2_500_000;
const UA = 'SecondCoatSiteCheck/1.0 (+https://second-coat.vercel.app/check)';

// Best-effort limit per instance: enough to stop casual abuse of a free tool.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 8;
}

async function assertPublic(u: URL) {
  const addrs = await lookup(u.hostname, { all: true }).catch(() => []);
  if (!addrs.length) throw new Error('We couldn’t find that website. Check the address.');
  if (addrs.some((a) => isPrivateIp(a.address))) throw new Error('That address isn’t a public website.');
}

/** Fetches with redirects followed by hand, so every hop is checked against private networks. */
async function fetchPublic(start: URL, signal: AbortSignal) {
  let url = start;
  for (let hop = 0; hop < 5; hop++) {
    await assertPublic(url);
    const t0 = performance.now();
    const res = await fetch(url, { redirect: 'manual', signal, headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' } });
    const ms = performance.now() - t0;
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      url = normaliseUrl(new URL(res.headers.get('location')!, url).href);
      continue;
    }
    return { res, url, ms };
  }
  throw new Error('That address redirects too many times.');
}

async function readCapped(res: Response) {
  const reader = res.body?.getReader();
  if (!reader) return { text: '', bytes: 0 };
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    chunks.push(value);
    if (bytes > MAX_BYTES) {
      await reader.cancel();
      break;
    }
  }
  const buf = new Uint8Array(Math.min(bytes, MAX_BYTES));
  let o = 0;
  for (const c of chunks) {
    buf.set(c.subarray(0, Math.max(0, buf.length - o)), o);
    o += c.byteLength;
  }
  return { text: new TextDecoder().decode(buf), bytes };
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (limited(ip)) return Response.json({ error: 'Too many checks in a minute. Try again shortly.' }, { status: 429 });
  let input = '';
  try {
    input = String(((await req.json()) as { url?: unknown }).url ?? '');
  } catch {
    return Response.json({ error: 'Send a JSON body with a url.' }, { status: 400 });
  }
  try {
    const start = normaliseUrl(input);
    const { res, url, ms } = await fetchPublic(start, AbortSignal.timeout(12_000));
    const type = res.headers.get('content-type') ?? '';
    if (!/html/i.test(type)) return Response.json({ error: 'That address didn’t return a web page.' }, { status: 422 });
    const { text, bytes } = await readCapped(res);
    return Response.json(analyse(text, { url: start.href, finalUrl: url.href, status: res.status, ms: Math.round(ms), bytes }), { headers: { 'cache-control': 'no-store' } });
  } catch (e) {
    const err = e as Error;
    const msg = err.name === 'TimeoutError' || err.name === 'AbortError' ? 'That site took too long to answer.' : err instanceof TypeError && /fetch failed/i.test(err.message) ? 'We couldn’t reach that website.' : err.message;
    return Response.json({ error: msg }, { status: 422 });
  }
}
