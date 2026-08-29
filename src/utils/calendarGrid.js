import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  format,
} from 'date-fns';

// Returns a flat array of { date, iso, inMonth } covering full weeks
// (Sun-Sat) so the grid always renders complete rows, wall-calendar style.
export function getMonthGrid(year, month) {
  const first = startOfMonth(new Date(year, month, 1));
  const last = endOfMonth(first);
  const gridStart = startOfWeek(first);
  const gridEnd = endOfWeek(last);

  return eachDayOfInterval({ start: gridStart, end: gridEnd }).map((date) => ({
    date,
    iso: format(date, 'yyyy-MM-dd'),
    inMonth: isSameMonth(date, first),
  }));
}
