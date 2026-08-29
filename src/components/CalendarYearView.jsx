import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getMonthGrid } from '../utils/calendarGrid';
import { dayDots } from '../utils/progress';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarYearView({ year, entriesByDate }) {
  return (
    <div className="calendar-year">
      {MONTH_NAMES.map((name, month) => (
        <div className="calendar-year-month-tile" key={name}>
          <h3>{name}</h3>
          <div className="calendar-year-mini-grid">
            {getMonthGrid(year, month)
              .filter((d) => d.inMonth)
              .map(({ date, iso }) => {
                const dots = dayDots(entriesByDate.get(iso));
                return (
                  <Link to={`/journal/${iso}`} key={iso} className="calendar-year-day">
                    <span className="calendar-year-day-number">{format(date, 'd')}</span>
                    <span className="calendar-day-dots">
                      <span className={`dot small ${dots.plan ? 'filled' : ''}`} />
                      <span className={`dot small ${dots.proverbs ? 'filled' : ''}`} />
                      <span className={`dot small ${dots.psalms ? 'filled' : ''}`} />
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
