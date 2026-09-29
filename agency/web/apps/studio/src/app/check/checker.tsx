'use client';
import { CopyButton, toast } from '@sc/ui';
import { animate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { Report } from '@/lib/site-check';

type Psi = { performance?: number; accessibility?: number; seo?: number; 'best-practices'?: number };

function Dial({ score }: { score: number }) {
  const ref = useRef<SVGCircleElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const c = animate(0, score, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (num.current) num.current.textContent = String(Math.round(v));
        ref.current?.setAttribute('stroke-dashoffset', String(302 - (302 * v) / 100));
      },
    });
    return () => c.stop();
  }, [score]);
  const tone = score >= 80 ? '#16A34A' : score >= 50 ? '#EAB308' : '#FF4F1F';
  return (
    <div className="relative size-44 shrink-0">
      <svg viewBox="0 0 110 110" className="size-full -rotate-90" aria-hidden>
        <circle cx="55" cy="55" r="48" fill="none" stroke="currentColor" strokeOpacity=".1" strokeWidth="9" />
        <circle ref={ref} cx="55" cy="55" r="48" fill="none" stroke={tone} strokeWidth="9" strokeLinecap="round" strokeDasharray="302" strokeDashoffset="302" />
      </svg>
      <p className="absolute inset-0 grid place-items-center text-center">
        <span>
          <span ref={num} className="block font-display text-[56px] leading-none font-semibold tracking-[-0.05em]">0</span>
          <span className="text-[13px] text-muted">out of 100</span>
        </span>
      </p>
    </div>
  );
}

export function SiteChecker() {
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  const [psi, setPsi] = useState<Psi | 'loading' | 'error' | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setReport(null);
    setPsi(null);
    try {
      const r = await fetch('/api/check', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url }) });
      const j = (await r.json()) as Report & { error?: string };
      if (!r.ok || j.error) throw new Error(j.error ?? 'Something went wrong.');
      setReport(j);
      requestAnimationFrame(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const runPsi = async () => {
    if (!report) return;
    setPsi('loading');
    try {
      const q = new URLSearchParams({ url: report.finalUrl, strategy: 'mobile' });
      for (const c of ['performance', 'accessibility', 'seo', 'best-practices']) q.append('category', c);
      const r = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`);
      if (!r.ok) throw new Error(String(r.status));
      const j = (await r.json()) as { lighthouseResult?: { categories?: Record<string, { score: number | null }> } };
      const cats = j.lighthouseResult?.categories ?? {};
      setPsi(Object.fromEntries(Object.entries(cats).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)])) as Psi);
    } catch {
      setPsi('error');
      toast.error('Google PageSpeed is busy. Try again in a minute.');
    }
  };

  const fails = report?.checks.filter((c) => !c.pass) ?? [];
  const summary = report ? `Website check for ${report.finalUrl}: ${report.score}/100.\n${fails.map((c) => `✗ ${c.label}: ${c.detail}`).join('\n')}` : '';

  return (
    <div>
      <form onSubmit={run} className="flex flex-col gap-2 rounded-[2rem] bg-card p-3 sm:flex-row">
        <label htmlFor="check-url" className="sr-only">Website address</label>
        <input id="check-url" value={url} onChange={(e) => setUrl(e.target.value)} required inputMode="url" autoComplete="url" placeholder="yourbusiness.co.uk" className="min-w-0 flex-1 rounded-[1.4rem] bg-bg px-6 py-5 text-[20px] outline-none focus:ring-2 focus:ring-accent" />
        <button disabled={busy} className="rounded-[1.4rem] bg-accent px-8 py-5 text-[17px] font-medium text-accent-ink disabled:opacity-60">{busy ? 'Checking…' : 'Check my site'}</button>
      </form>
      <p className="mt-3 px-3 text-[13px] text-muted">Free, no sign-up. We fetch the page once, like a visitor would, and don&apos;t store it.</p>
      {error && <p role="alert" className="mt-6 rounded-2xl bg-accent/10 p-5 text-[16px]">{error}</p>}

      {report && (
        <section id="results" className="mt-12 scroll-mt-28" aria-live="polite">
          <div className="grid gap-8 rounded-[2rem] bg-card p-7 md:grid-cols-[auto_1fr] md:items-center md:p-10">
            <Dial score={report.score} />
            <div>
              <p className="text-[14px] text-muted">{report.finalUrl}</p>
              <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.95] font-semibold tracking-[-0.05em]">
                {report.score >= 80 ? 'In good shape.' : report.score >= 50 ? 'Decent, with easy wins.' : 'Losing you customers.'}
              </h2>
              <p className="mt-3 max-w-lg text-[16px] text-muted">
                {fails.length === 0 ? 'Every check passed. Nice work.' : `${fails.length} of ${report.checks.length} checks need attention. Each one below says why it matters.`}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={`#contact`} className="rounded-full bg-fg px-5 py-3 text-[14px] font-medium text-bg">Get these fixed, free redesign</a>
                <CopyButton value={summary} label="Report copied" className="rounded-full border border-line px-5 py-3 text-[14px]">Copy report</CopyButton>
                {psi === null && <button onClick={runPsi} className="rounded-full border border-line px-5 py-3 text-[14px]">Also run Google PageSpeed</button>}
              </div>
            </div>
          </div>

          {psi && (
            <div className="mt-3 rounded-[2rem] bg-card p-7">
              <p className="text-[14px] text-muted">Google PageSpeed, mobile</p>
              {psi === 'loading' && <p className="mt-3 animate-pulse text-[16px]">Google is loading your page on a simulated phone. This takes 15 to 30 seconds…</p>}
              {psi === 'error' && <p className="mt-3 text-[16px]">PageSpeed didn&apos;t answer. <button onClick={runPsi} className="underline">Try again</button></p>}
              {typeof psi === 'object' && (
                <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {(['performance', 'accessibility', 'seo', 'best-practices'] as const).map((k) => (
                    <div key={k} className="rounded-2xl bg-bg p-5">
                      <dt className="text-[13px] text-muted capitalize">{k.replace('-', ' ')}</dt>
                      <dd className={`font-display text-[48px] leading-none font-semibold ${(psi[k] ?? 0) >= 90 ? 'text-[#16A34A]' : (psi[k] ?? 0) >= 50 ? 'text-[#CA8A04]' : 'text-accent'}`}>{psi[k] ?? '–'}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          )}

          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {[...report.checks].sort((a, b) => Number(a.pass) - Number(b.pass) || b.weight - a.weight).map((c) => (
              <li key={c.id} className="rounded-[1.5rem] bg-card p-6">
                <div className="flex items-start gap-3">
                  <span aria-hidden className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-[14px] ${c.pass ? 'bg-[#16A34A] text-white' : 'bg-accent text-accent-ink'}`}>{c.pass ? '✓' : '!'}</span>
                  <div className="min-w-0">
                    <p className="text-[18px] font-semibold tracking-[-0.02em]">
                      <span className="sr-only">{c.pass ? 'Passed: ' : 'Needs work: '}</span>
                      {c.label}
                    </p>
                    <p className="mt-1 text-[14px] break-words text-muted">{c.detail}</p>
                    {!c.pass && <p className="mt-3 text-[15px]">{c.why}</p>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
