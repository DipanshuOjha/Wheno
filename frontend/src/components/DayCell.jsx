import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanchangaContext } from '../context/PanchangaContext';
import { PD } from '../data/panchanga';
import { extractName, tithiNum, tithiNumLabel, moonIcon } from '../utils/helpers';
import { MN } from '../utils/constants';

const DayCell = ({ dk }) => {
  const { dvDate, setDvDate, filterMode } = useContext(PanchangaContext);
  const navigate = useNavigate();

  if (!dk) return <div className="cal-cell empty-cell"></div>;

  const pd = PD[dk];
  const gregD = parseInt(dk.slice(6, 8));
  
  if (!pd) {
    return (
      <div className="cal-cell dim-cell">
        <div className="cell-inner"><div className="cell-greg">{gregD}</div></div>
      </div>
    );
  }

  // Handle visual filtering
  let filt = false;
  if (filterMode === 'amrit' && (!pd.amrit || pd.amrit.length < 5)) filt = true;
  if (filterMode === 'no_rahu' && pd.rahu && pd.rahu.length > 5) filt = true;

  const q = pd.amrit && pd.amrit.length > 5 ? 'gc' : 'nc'; // Simplified logic for UI rendering
  const tname = extractName(pd.tithi);
  const tn = tithiNum(pd.tithi, pd.paksha);
  const tnLbl = tithiNumLabel(tn);
  const nname = extractName(pd.nakshatra);
  const gregM = parseInt(dk.slice(4, 6)) - 1;
  const hasFest = pd.festivals && pd.festivals.length > 0;
  
  const isK = pd.paksha === 'Krishna Paksha';
  const pakshaBg = isK ? { backgroundColor: '#F8F4FF' } : {};
  const tithiNumCol = isK ? { color: '#6040A0' } : { color: '#8B5E3C' };
  const dimStyle = filt ? { opacity: 0.28, pointerEvents: 'none' } : {};

  const isTodayStr = () => {
    const now = new Date();
    return dk === `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  };

  const handleDayClick = () => {
    setDvDate(dk);
    navigate('/day');
  };

  return (
    <div 
      className={`cal-cell ${dvDate === dk ? 'sel' : ''} ${isTodayStr() ? 'today' : ''} ${pd.isNewYear ? 'ny-cell' : ''}`} 
      style={{ ...dimStyle, ...pakshaBg }} 
      onClick={handleDayClick}
    >
      {isTodayStr() && <div className="today-dot"></div>}
      <div className={`cell-badge ${q}`}></div>
      {hasFest && <div className="c-star">★</div>}
      <div className="cell-inner">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '2px' }}>
          <span className="cell-moon">{moonIcon(pd.tithi, pd.paksha)}</span>
          <span className="c-tnum" style={tithiNumCol}>{tnLbl}</span>
        </div>
        <div className="c-tname">{tname}</div>
        <div className="c-greg">{gregD} {MN[gregM].slice(0, 3)}</div>
        <div className="c-nak">{nname}</div>
      </div>
    </div>
  );
};

export default DayCell;
