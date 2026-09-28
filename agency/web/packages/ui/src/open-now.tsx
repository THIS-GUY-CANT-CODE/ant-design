'use client';
import { isOpenAt, useLondonTime } from './use-london-time';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const fmt = (m: number) => {
  const h = Math.floor(m / 60), mm = m % 60;
  return `${((h + 11) % 12) + 1}${mm ? `:${String(mm).padStart(2, '0')}` : ''}${h >= 12 ? 'pm' : 'am'}`;
};

/** "Open now, until 6pm" / "Closed now, opens tomorrow at 9am", computed in London time. */
export function openLine(hours: Record<number, [number, number][]>, day: number, mins: number) {
  const today = hours[day] ?? [];
  const cur = today.find(([a, b]) => mins >= a && mins < b);
  if (cur) return { open: true, line: `Open now, until ${fmt(cur[1])}` };
  const later = today.find(([a]) => a > mins);
  if (later) return { open: false, line: `Closed now, opens at ${fmt(later[0])}` };
  for (let k = 1; k <= 7; k++) {
    const d = (day + k) % 7;
    const first = hours[d]?.[0];
    if (first) return { open: false, line: `Closed now, opens ${k === 1 ? 'tomorrow' : DAYS[d]} at ${fmt(first[0])}` };
  }
  return { open: false, line: 'Closed' };
}

/** Live status plus the week's hours with today marked. */
export function OpenNow({ hours, hoursText, className, todayClassName = 'font-bold text-accent' }: { hours: Record<number, [number, number][]>; hoursText: [number, string, string][]; className?: string; todayClassName?: string }) {
  const now = useLondonTime();
  const s = now ? openLine(hours, now.day, now.mins) : null;
  void isOpenAt;
  return (
    <div className={className ?? 'max-w-md'}>
      <p className="flex items-center gap-2 text-[18px] font-bold" aria-live="polite">
        {s && <span className={`size-2.5 rounded-full ${s.open ? 'bg-[#16A34A]' : 'bg-current opacity-30'}`} />}
        {s?.line ?? 'Opening hours'}
      </p>
      <table className="mt-4 w-full text-[15px]" aria-label="Opening hours">
        <tbody>
          {hoursText.map(([d, name, h]) => (
            <tr key={d} className={`border-b border-current/15 ${now?.day === d ? todayClassName : ''}`}>
              <td className="py-2">{name}</td>
              <td className="py-2 text-right">{h}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
