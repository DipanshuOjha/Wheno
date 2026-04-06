import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PD } from '../data/panchanga';
import { PanchangaContext } from '../context/PanchangaContext';
import { HINDU_MONTHS, RITU_MAP } from '../utils/constants';
import {
  moonIcon,
  tithiNum,
  tithiNumLabel,
  extractName,
} from '../utils/helpers';

const Festivals = () => {
  const [search, setSearch] = useState('');
  const { setDvDate } = useContext(PanchangaContext);
  const navigate = useNavigate();

  const allFestivals = useMemo(() => {
    const list = [];
    Object.keys(PD)
      .sort()
      .forEach((dk) => {
        const pd = PD[dk];
        if (pd.festivals && pd.festivals.length) {
          pd.festivals.forEach((fest) => list.push({ dk, fest, pd }));
        }
      });
    return list;
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return q ? allFestivals.filter((e) => e.fest.toLowerCase().includes(q)) : allFestivals;
  }, [allFestivals, search]);

  const groupMap = useMemo(() => {
    const map = {};
    HINDU_MONTHS.forEach((hm) => {
      map[hm.label] = { hm, entries: [] };
    });

    filtered.forEach((e) => {
      const monthLabel = e.pd.month?.split(' ')[0];
      const key = Object.keys(map).find((k) => k.startsWith(monthLabel));
      if (key) map[key].entries.push(e);
    });
    return map;
  }, [filtered]);

  const handleFestClick = (dk) => {
    setDvDate(dk);
    navigate('/day');
  };

  return (
    <div className="fp-content">
      <div className="fp-search-wrap" style={{ marginTop: '20px' }}>
        <input
          className="fp-search"
          placeholder="🔍 Search festivals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '18px' }}>
        {filtered.length} festival{filtered.length !== 1 ? 's' : ''} found · tap any to open that day
      </div>

      {HINDU_MONTHS.filter((hm) => groupMap[hm.label].entries.length > 0).map((hm) => {
        const grp = groupMap[hm.label];
        const ritu = RITU_MAP[hm.k] || { icon: '🌀' };

        return (
          <div key={hm.k} className="fp-month-group">
            <div className="fp-month-label">
              {ritu.icon} {hm.label}
              <span className="fp-fest-count">{grp.entries.length}</span>
            </div>

            <div className="fp-list">
              {grp.entries.map((e, idx) => {
                const isK = e.pd.paksha === 'Krishna Paksha';
                const tn = tithiNum(e.pd.tithi, e.pd.paksha);
                const tnLbl = tithiNumLabel(tn);

                const dateObj = new Date(
                  parseInt(e.dk.slice(0, 4), 10),
                  parseInt(e.dk.slice(4, 6), 10) - 1,
                  parseInt(e.dk.slice(6, 8), 10)
                );
                const gregStr = dateObj.toLocaleDateString('en-IN', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div
                    key={`${e.dk}-${idx}`}
                    className="fp-entry"
                    onClick={() => handleFestClick(e.dk)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="fp-entry-left">
                      <div className="fp-moon-big">{moonIcon(e.pd.tithi, e.pd.paksha)}</div>
                      <div className="fp-tithi-lbl">{tnLbl}</div>
                    </div>

                    <div className="fp-divider" />

                    <div className="fp-entry-right">
                      <div className="fp-fest-name">{e.fest}</div>
                      <div className="fp-fest-meta">
                        <span
                          className={`fp-paksha-badge ${isK ? 'fp-krishna' : 'fp-shukla'}`}
                        >
                          {isK ? 'K' : 'S'} · {tnLbl}
                        </span>
                        <span className="fp-tithi-chip">{extractName(e.pd.tithi)}</span>
                      </div>
                      <div className="fp-greg-date">{gregStr}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Festivals;

