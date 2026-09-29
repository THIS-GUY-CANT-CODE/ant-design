'use client';
import useEmblaCarousel from 'embla-carousel-react';
import Fuse, { type IFuseOptions } from 'fuse.js';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { Toaster as Sonner, toast } from 'sonner';
import { Drawer } from 'vaul';
import { downloadIcs, googleCalendarUrl, type CalEvent } from './calendar';

export { toast };

/* ---------- Toasts ---------- */
export function Toaster() {
  return <Sonner position="bottom-center" toastOptions={{ style: { borderRadius: 16, fontFamily: 'var(--font-sans)' } }} />;
}

/* ---------- Share ---------- */
/** Shares with the native sheet where there is one, otherwise copies the link. */
export function ShareButton({ title, text, url, className, children = 'Share' }: { title: string; text?: string; url?: string; className?: string; children?: ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        const href = url ? new URL(url, location.href).href : location.href;
        try {
          if (navigator.share) await navigator.share({ title, text, url: href });
          else {
            await navigator.clipboard.writeText(text ? `${text}\n${href}` : href);
            toast.success('Link copied');
          }
        } catch (e) {
          if ((e as Error).name !== 'AbortError') toast.error('Couldn’t share. Copy the address bar instead.');
        }
      }}
    >
      {children}
    </button>
  );
}

/** Copies any text and confirms with a toast. */
export function CopyButton({ value, label = 'Copied', className, children }: { value: string; label?: string; className?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          toast.success(label);
        } catch {
          toast.error('Couldn’t copy');
        }
      }}
    >
      {children}
    </button>
  );
}

/* ---------- Add to calendar ---------- */
export function AddToCalendar({ event, filename, className, itemClassName }: { event: CalEvent; filename?: string; className?: string; itemClassName?: string }) {
  const item = itemClassName ?? 'rounded-full border border-current/20 px-4 py-2 text-[14px] transition-colors hover:bg-fg hover:text-bg';
  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
      <a className={item} href={googleCalendarUrl(event)} target="_blank" rel="noopener">
        Google Calendar ↗
      </a>
      <button type="button" className={item} onClick={() => (downloadIcs(event, filename), toast.success('Calendar file downloaded'))}>
        Apple / Outlook (.ics)
      </button>
    </div>
  );
}

/* ---------- Fuzzy search ---------- */
export function useSearch<T>(items: T[], keys: IFuseOptions<T>['keys'], query: string, threshold = 0.35) {
  const fuse = useMemo(() => new Fuse(items, { keys, threshold, ignoreLocation: true }), [items, keys, threshold]);
  return useMemo(() => (query.trim() ? fuse.search(query.trim()).map((r) => r.item) : items), [fuse, items, query]);
}

/* ---------- Command menu (⌘K) ---------- */
export type CommandItem = { group: string; label: string; href?: string; hint?: string; keywords?: string[]; perform?: () => void };

const listeners = new Set<(open: boolean) => void>();
/** Opens the command menu from anywhere (e.g. a search button in the nav). */
export const openCommandMenu = () => listeners.forEach((l) => l(true));

const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform);
const shortcutSnap = () => (isMac() ? '⌘K' : 'Ctrl K');
const noop = () => () => {};

/** The keyboard shortcut label, correct for the visitor's platform. */
export function useShortcutLabel() {
  return useSyncExternalStore(noop, shortcutSnap, () => '⌘K');
}

export function CommandMenu({ items, placeholder = 'Search pages, services, anything…', accent = 'var(--accent)' }: { items: CommandItem[]; placeholder?: string; accent?: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName));
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const l = (o: boolean) => setOpen(o);
    listeners.add(l);
    window.addEventListener('keydown', onKey);
    return () => {
      listeners.delete(l);
      window.removeEventListener('keydown', onKey);
    };
  }, []);
  const groups = useMemo(() => [...new Set(items.map((i) => i.group))], [items]);
  const run = useCallback(
    (i: CommandItem) => {
      setOpen(false);
      if (i.perform) i.perform();
      else if (i.href) {
        if (/^(https?:|tel:|mailto:)/.test(i.href)) window.open(i.href, i.href.startsWith('http') ? '_blank' : '_self');
        else router.push(i.href as never);
      }
    },
    [router],
  );
  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Search this site" className="sc-cmdk" style={{ ['--cmdk-accent' as string]: accent }}>
      <Command.Input placeholder={placeholder} />
      <Command.List>
        <Command.Empty>Nothing matches that. Try another word.</Command.Empty>
        {groups.map((g) => (
          <Command.Group key={g} heading={g}>
            {items
              .filter((i) => i.group === g)
              .map((i) => (
                <Command.Item key={`${g}-${i.label}`} value={`${i.label} ${i.hint ?? ''} ${(i.keywords ?? []).join(' ')}`} onSelect={() => run(i)}>
                  <span>{i.label}</span>
                  {i.hint && <span className="sc-cmdk-hint">{i.hint}</span>}
                </Command.Item>
              ))}
          </Command.Group>
        ))}
      </Command.List>
      <div className="sc-cmdk-foot">
        <span>↑↓ to move · ↵ to open · esc to close</span>
      </div>
    </Command.Dialog>
  );
}

/** A nav button that opens the command menu and shows the shortcut. */
export function SearchButton({ className, label = 'Search' }: { className?: string; label?: string }) {
  const k = useShortcutLabel();
  return (
    <button type="button" onClick={openCommandMenu} className={className} aria-label={`${label} (${k})`}>
      <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
        <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="m11 11 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="hidden lg:inline">{label}</span>
      <kbd className="hidden rounded border border-current/20 px-1.5 font-mono text-[11px] opacity-60 lg:inline">{k}</kbd>
    </button>
  );
}

/* ---------- Mobile menu ---------- */
export type NavLink = { href: string; label: string; sub?: string };

/** Bottom-sheet menu for phones (vaul): big tap targets, current page marked, actions pinned at the bottom. */
export function MobileMenu({ links, current, actions, className, title }: { links: NavLink[]; current?: string; actions?: ReactNode; className?: string; title: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger className={className} aria-label="Open menu">
        <svg viewBox="0 0 20 20" className="size-5" aria-hidden>
          <path d="M3 7h14M3 13h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[400] bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-[401] flex max-h-[88svh] flex-col rounded-t-[28px] bg-bg px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-fg outline-none">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-fg/15" />
          <Drawer.Title className="mb-2 text-[13px] text-muted">{title}</Drawer.Title>
          <Drawer.Description className="sr-only">Site navigation</Drawer.Description>
          <nav className="overflow-y-auto" aria-label="Mobile">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={current === l.href ? 'page' : undefined} className="flex items-baseline justify-between border-b border-line py-4 text-[26px] font-semibold tracking-[-0.03em] aria-[current=page]:text-accent">
                {l.label}
                {l.sub && <span className="text-[13px] font-normal tracking-normal text-muted">{l.sub}</span>}
              </a>
            ))}
          </nav>
          {actions && <div className="mt-5 grid grid-cols-2 gap-2">{actions}</div>}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

/* ---------- Carousel ---------- */
export function Carousel({ children, className, slideClassName, label }: { children: ReactNode[]; className?: string; slideClassName?: string; label: string }) {
  const [ref, api] = useEmblaCarousel({ align: 'start', loop: false, dragFree: false });
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!api) return;
    const sync = () => {
      setIdx(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
    };
    api.on('select', sync).on('reInit', sync);
    queueMicrotask(sync);
    return () => {
      api.off('select', sync).off('reInit', sync);
    };
  }, [api]);
  return (
    <div className={className} role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={ref} className="overflow-hidden">
        <div className="flex gap-3">
          {children.map((c, i) => (
            <div key={i} className={`min-w-0 shrink-0 ${slideClassName ?? 'basis-[85%] md:basis-[45%]'}`} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${children.length}`}>
              {c}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex gap-1.5">
          {Array.from({ length: count }, (_, i) => (
            <button key={i} type="button" onClick={() => api?.scrollTo(i)} aria-label={`Go to slide ${i + 1}`} className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-fg' : 'w-1.5 bg-fg/25'}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => api?.scrollPrev()} disabled={idx === 0} aria-label="Previous" className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:bg-fg hover:text-bg disabled:opacity-30">
            ←
          </button>
          <button type="button" onClick={() => api?.scrollNext()} disabled={idx >= count - 1} aria-label="Next" className="grid size-11 place-items-center rounded-full border border-line transition-colors hover:bg-fg hover:text-bg disabled:opacity-30">
            →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Breadcrumbs ---------- */
export function Breadcrumbs({ items, className }: { items: { href?: string; label: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {c.href ? (
              <a href={c.href} className="u-draw">
                {c.label}
              </a>
            ) : (
              <span aria-current="page" className="text-fg">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
