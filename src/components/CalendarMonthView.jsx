import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getMonthGrid } from '../utils/calendarGrid';
import { dayDots } from '../utils/progress';
import { focusLabel } from '../utils/focusLevels';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarMonthView({ year, month, entriesByDate }) {
  const days = getMonthGrid(year, month);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div className="calendar-month">
      <div className="calendar-weekday-row">
        {WEEKDAY_LABELS.map((w) => (
          <div className="calendar-weekday" key={w}>{w}</div>
        ))}
      </div>
      {weeks.map((week) => (
        <div className="calendar-week-row" key={week[0].iso}>
          {week.map(({ date, iso, inMonth }) => {
            const entry = entriesByDate.get(iso);
            const dots = dayDots(entry);
            return (
              <Link
                to={`/journal/${iso}`}
                key={iso}
                className={`calendar-day ${inMonth ? '' : 'outside-month'}`}
              >
                <div className="calendar-day-number">{format(date, 'd')}</div>
                <div className="calendar-day-dots">
                  <span className={`dot ${dots.plan ? 'filled' : ''}`} title="Reading plan" />
                  <span className={`dot ${dots.proverbs ? 'filled' : ''}`} title="Proverbs" />
                  <span className={`dot ${dots.psalms ? 'filled' : ''}`} title="Psalms" />
                </div>
                {entry?.focusLevel ? (
                  <div className="calendar-day-focus">
                    <div className="focus-bar">
                      <div
                        className="focus-bar-fill"
                        style={{ width: `${(entry.focusLevel / 5) * 100}%` }}
                      />
                    </div>
                    <div className="focus-bar-label">{focusLabel(entry.focusLevel)}</div>
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
