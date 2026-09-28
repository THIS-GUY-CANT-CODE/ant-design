'use client';
import { RollText } from '@sc/ui';

export function ContactForm({ email }: { email: string }) {
  const field = 'w-full border-b-2 border-accent-ink/25 bg-transparent py-4 text-[20px] outline-none placeholder:text-accent-ink/50 focus:border-accent-ink';
  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const body = `Current website: ${f.get('u') || 'none'}\nWhere we are: ${f.get('w') || 'not said'}`;
        location.href = `mailto:${email}?subject=${encodeURIComponent('Free redesign: ' + f.get('b'))}&body=${encodeURIComponent(body)}`;
      }}
    >
      <input name="b" className={field} placeholder="Business name" aria-label="Business name" required />
      <input name="u" className={field} placeholder="Your current website (if any)" aria-label="Current website" />
      <input name="w" className={field} placeholder="Town or city (anywhere is fine)" aria-label="Town or city" autoComplete="address-level2" />
      <button type="submit" className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-fg py-5 text-[17px] font-medium text-bg transition-transform hover:-translate-y-0.5">
        <RollText>Request my free redesign</RollText>
        <span aria-hidden className="transition-transform duration-500 ease-expo group-hover:translate-x-1.5">→</span>
      </button>
    </form>
  );
}
