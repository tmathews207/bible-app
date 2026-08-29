import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import CalendarMonthView from '../components/CalendarMonthView';
import CalendarYearView from '../components/CalendarYearView';
import { subscribeAllJournalEntries } from '../services/journal';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function Calendar() {
  const [entries, setEntries] = useState([]);
  const [view, setView] = useState('month'); // 'month' | 'year'
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  useEffect(() => subscribeAllJournalEntries(setEntries), []);

  const entriesByDate = new Map(entries.map((e) => [e.date, e]));

  const goPrev = () => {
    if (view === 'month') {
      if (month === 0) { setMonth(11); setYear((y) => y - 1); }
      else setMonth((m) => m - 1);
    } else {
      setYear((y) => y - 1);
    }
  };

  const goNext = () => {
    if (view === 'month') {
      if (month === 11) { setMonth(0); setYear((y) => y + 1); }
      else setMonth((m) => m + 1);
    } else {
      setYear((y) => y + 1);
    }
  };

  return (
    <>
      <NavBar />
      <main className="page">
        <div className="page-header-row">
          <h1>Calendar</h1>
          <div className="calendar-toggle">
            <button
              type="button"
              className={view === 'month' ? 'active' : ''}
              onClick={() => setView('month')}
            >
              Month
            </button>
            <button
              type="button"
              className={view === 'year' ? 'active' : ''}
              onClick={() => setView('year')}
            >
              Year
            </button>
          </div>
        </div>

        <div className="calendar-nav">
          <button type="button" onClick={goPrev}>&larr; Prev</button>
          <span className="calendar-nav-label">
            {view === 'month' ? `${MONTH_NAMES[month]} ${year}` : year}
          </span>
          <button type="button" onClick={goNext}>Next &rarr;</button>
        </div>

        {view === 'month' ? (
          <CalendarMonthView year={year} month={month} entriesByDate={entriesByDate} />
        ) : (
          <CalendarYearView year={year} entriesByDate={entriesByDate} />
        )}
      </main>
    </>
  );
}
