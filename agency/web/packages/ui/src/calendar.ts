/** Calendar events as an .ics download (Apple, Outlook, everything) or a Google Calendar link. */
export type CalEvent = { title: string; start: Date; end: Date; location?: string; details?: string; url?: string };

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const fold = (s: string) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');

export function toIcs(e: CalEvent, uid = `${stamp(e.start)}-${Math.abs(hash(e.title))}@secondcoat`) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Second Coat//Concept//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(e.start)}`,
    `DTEND:${stamp(e.end)}`,
    `SUMMARY:${fold(e.title)}`,
    e.location ? `LOCATION:${fold(e.location)}` : '',
    e.details ? `DESCRIPTION:${fold(e.details)}` : '',
    e.url ? `URL:${e.url}` : '',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${fold(e.title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}

export function downloadIcs(e: CalEvent, filename = 'event.ics') {
  const blob = new Blob([toIcs(e)], { type: 'text/calendar;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function googleCalendarUrl(e: CalEvent) {
  const q = new URLSearchParams({ action: 'TEMPLATE', text: e.title, dates: `${stamp(e.start)}/${stamp(e.end)}`, details: e.details ?? '', location: e.location ?? '' });
  return `https://calendar.google.com/calendar/render?${q}`;
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** A Date for a wall-clock time in London, whatever the visitor's timezone. */
export function londonDate(y: number, m: number, d: number, hh: number, mm = 0) {
  const guess = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const inLondon = new Date(guess.toLocaleString('en-US', { timeZone: 'Europe/London' }));
  const inUtc = new Date(guess.toLocaleString('en-US', { timeZone: 'UTC' }));
  return new Date(guess.getTime() - (inLondon.getTime() - inUtc.getTime()));
}
