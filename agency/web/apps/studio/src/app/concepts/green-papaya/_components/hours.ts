// Opening hours (minutes from midnight), Europe/London. 0 = Sunday.
export const HOURS: Record<number, [number, number][]> = {
  0: [[780, 1320]],
  1: [],
  2: [[720, 900], [1020, 1350]],
  3: [[720, 900], [1020, 1350]],
  4: [[720, 900], [1020, 1350]],
  5: [[720, 900], [1020, 1350]],
  6: [[780, 1350]],
};
export const HOURS_TEXT: [number, string, string][] = [
  [1, 'Monday', 'Closed'],
  [2, 'Tuesday', '12–3pm · 5–10:30pm'],
  [3, 'Wednesday', '12–3pm · 5–10:30pm'],
  [4, 'Thursday', '12–3pm · 5–10:30pm'],
  [5, 'Friday', '12–3pm · 5–10:30pm'],
  [6, 'Saturday', '1–10:30pm'],
  [0, 'Sunday', '1–10pm'],
];
