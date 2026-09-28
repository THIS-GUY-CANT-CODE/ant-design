'use client';

export function ContactForm({ email }: { email: string }) {
  const field = 'w-full border-b-2 border-accent-ink/25 bg-transparent py-4 text-[20px] outline-none placeholder:text-accent-ink/50 focus:border-accent-ink';
  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        location.href = `mailto:${email}?subject=${encodeURIComponent('Free redesign: ' + f.get('b'))}&body=${encodeURIComponent('Current website: ' + (f.get('u') || 'none'))}`;
      }}
    >
      <input name="b" className={field} placeholder="Business name" aria-label="Business name" required />
      <input name="u" className={field} placeholder="Your current website (if any)" aria-label="Current website" />
      <button type="submit" className="mt-8 w-full rounded-full bg-fg py-5 text-[17px] font-medium text-bg transition-transform hover:-translate-y-0.5">
        Request my free redesign →
      </button>
    </form>
  );
}
