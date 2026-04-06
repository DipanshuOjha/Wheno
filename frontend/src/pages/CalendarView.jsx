import React, { useContext, useMemo } from 'react';
import { PanchangaContext } from '../context/PanchangaContext';
import { PD } from '../data/panchanga';
import { HINDU_MONTHS, WEEKDAY_ABBR, RITU_MAP } from '../utils/constants';
import DayCell from '../components/DayCell';

const CalendarView = () => {
  const { curMonthIdx, setCurMonthIdx, panchaMode } = useContext(PanchangaContext);

  // Group dates by Hindu month (Simplification of your vanilla buildMonthDays)
  const monthDays = useMemo(() => {
    const groups = {};
    Object.keys(PD).sort().forEach(dk => {
      const v = PD[dk];
      const key = panchaMode === 'purnimanta' ? (v.pm || v.month) : v.month;
      if (key) {
        if (!groups[key]) groups[key] = [];
        groups[key].push(dk);
      }
    });
    return groups;
  }, [panchaMode]);

  const activeMonths = HINDU_MONTHS;
  const currentMonthKey = activeMonths[curMonthIdx]?.k || 'Chaitra';
  const days = monthDays[currentMonthKey] || [];
  
  const pd0 = days.length ? PD[days[0]] : null;
  const ritu = pd0 ? RITU_MAP[pd0.month] : null;

  // Build Grid Cells (Padding start of month to align with correct weekday)
  const d0date = days.length ? new Date(parseInt(days[0].slice(0, 4)), parseInt(days[0].slice(4, 6)) - 1, parseInt(days[0].slice(6, 8))) : new Date();
  const startDow = d0date.getDay(); 
  
  const cells = Array(startDow).fill(null).concat(days);
  while (cells.length % 7 !== 0) cells.push(null);

  // Group into weeks for rendering
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div id="tabCal">
      {/* Month Strip */}
      <div className="month-strip">
        {activeMonths.map((m, i) => {
          const mRitu = RITU_MAP[m.k];
          if (!monthDays[m.k] || monthDays[m.k].length === 0) return null;
          return (
            <button 
              key={m.k} 
              className={`ms-btn ${i === curMonthIdx ? 'cur' : ''} ${m.adhik ? 'adhik' : ''}`}
              onClick={() => setCurMonthIdx(i)}
            >
              {mRitu?.icon} {m.label}
            </button>
          );
        })}
      </div>

      {/* Calendar Header */}
      <div className="cal-nav">
        <button className="nav-btn" onClick={() => setCurMonthIdx(prev => Math.max(0, prev - 1))}>← Prev</button>
        <div>
          <div className="cal-title">{activeMonths[curMonthIdx]?.label} {panchaMode === 'purnimanta' && '✦'}</div>
          {pd0 && (
            <div className="cal-sub">
              {days.length} days · {pd0.samvat} {ritu ? `· ${ritu.name} (${ritu.eng})` : ''}
            </div>
          )}
        </div>
        <button className="nav-btn" style={{ marginLeft: 'auto' }} onClick={() => setCurMonthIdx(prev => Math.min(activeMonths.length - 1, prev + 1))}>Next →</button>
      </div>

      {/* The Grid */}
      <div className="cal-wrap">
        <div className="cal-hdr-row">
          {WEEKDAY_ABBR.map(d => <div key={d} className="cal-hdr-cell">{d}</div>)}
        </div>
        
        {/* Simplified Header for Pakshas based on your vanilla logic */}
        <div className="pak-divider">
          <span className="pak-label">☀ Shukla Paksha & ☾ Krishna Paksha</span>
          <span className="pak-info">Chronological Layout</span>
        </div>

        {weeks.map((week, rIdx) => (
          <div key={`row-${rIdx}`} className="cal-row">
            {week.map((dk, cIdx) => (
              <DayCell key={dk || `empty-${rIdx}-${cIdx}`} dk={dk} />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="legend" style={{ marginTop: '10px' }}>
        <span><span className="ldot" style={{ background: 'var(--green)' }}></span>Amrit kalam</span>
        <span><span className="ldot" style={{ background: 'var(--red)' }}></span>Inauspicious</span>
        <span><span className="ldot" style={{ background: '#c0c8d8' }}></span>Neutral</span>
        <span><span className="ldot" style={{ background: 'var(--gold-b)', borderRadius: '2px' }}></span>New Year · ★ Festival</span>
      </div>
    </div>
  );
};

export default CalendarView;
