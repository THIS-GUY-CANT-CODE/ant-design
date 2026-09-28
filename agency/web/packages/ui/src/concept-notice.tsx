/** Required on every concept: makes clear this is not the business's official site. */
export function ConceptNotice({ name, url, className }: { name: string; url?: string; className?: string }) {
  return (
    <div
      role="note"
      style={{ fontFamily: 'var(--ff-geist), system-ui, sans-serif' }}
      className={`fixed bottom-4 left-4 z-[150] flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-black/10 bg-white/85 px-3.5 py-2 text-[12px] leading-tight text-black shadow-[0_8px_30px_rgba(0,0,0,.12)] backdrop-blur-md ${className ?? ''}`}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-[#FF4F1F]" />
      <span>
        Concept by <a href="/" className="font-medium underline-offset-2 hover:underline">Second Coat</a>. Not the official {name} site.
        {url && (
          <>
            {' '}
            <a href={url} className="font-medium underline underline-offset-2" rel="noopener">
              Real site ↗
            </a>
          </>
        )}
      </span>
    </div>
  );
}
