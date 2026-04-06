import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanchangaContext } from '../context/PanchangaContext';
import { PD } from '../data/panchanga';
import { getLocMuhurtas, computeHoras } from '../utils/astronomy';
import { extractName, extractUpto, isNextDay, tithiNum, tithiNumLabel, pt } from '../utils/helpers';
import { RITU_MAP } from '../utils/constants';
import HoraClock from '../components/HoraClock';

const DayView = () => {
  const { dvDate, setDvDate, userLoc } = useContext(PanchangaContext);
  const navigate = useNavigate();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const pd = PD[dvDate];
  if (!pd) {
    return (
      <div id="tabDay">
        <div className="card"><div className="card-body"><p className="empty">No data for this date.</p></div></div>
      </div>
    );
  }

  // Computations
  const lm = getLocMuhurtas(dvDate, userLoc.lat, userLoc.lon);
  const horas = computeHoras(dvDate, pd, userLoc.lat, userLoc.lon);
  
  const isViewingToday = (() => {
    const now = new Date();
    return dvDate === `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  })();
  const nowMins = isViewingToday ? new Date().getHours() * 60 + new Date().getMinutes() : -1;

  const tname = extractName(pd.tithi);
  const tupto = extractUpto(pd.tithi);
  const tn = tithiNum(pd.tithi, pd.paksha);
  const tnLbl = tithiNumLabel(tn);
  const ritu = RITU_MAP[pd.month] || { icon: '', name: '', eng: '' };

  const formatGregDate = (dk) => {
    const date = new Date(parseInt(dk.slice(0, 4)), parseInt(dk.slice(4, 6)) - 1, parseInt(dk.slice(6, 8)));
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const navDay = (dir) => {
    const all = Object.keys(PD).sort();
    const ni = all.indexOf(dvDate) + dir;
    if (ni >= 0 && ni < all.length) setDvDate(all[ni]);
  };

  const MuhurtaRow = ({ label, val, cls, icon }) => {
    if (!val || val === 'None' || val.length < 5) {
      return <div className="muh-row"><span className="muh-label">{icon} {label}</span><span className="none-c" style={{fontSize:'11px'}}>—</span></div>;
    }
    return (
      <div className="muh-row">
        <span className="muh-label">
          {icon} {label}
          {!userLoc.isDefault && ['Rahu', 'Gulikai', 'Yama', 'Abhijit'].some(k => label.includes(k)) && <span className="loc-badge">{userLoc.n}</span>}
        </span>
        <span className={`muh-val ${cls}`}>{val}</span>
      </div>
    );
  };

  return (
    <div id="tabDay">
      {/* Header */}
      <div className="dv-header">
        <button className="dv-back" onClick={() => navigate('/')}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 2L4 6l4 4" /></svg> Calendar
        </button>
        <button className="nav-btn" onClick={() => navDay(-1)}>‹ Prev</button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="dv-title">{formatGregDate(dvDate)}</div>
          <div className="dv-sub">{pd.month} · {pd.isNewYear ? 'Pratipada 1 — New Year' : tname}{tupto ? ` until ${tupto}` : ''} · {pd.paksha}</div>
        </div>
        <button className="nav-btn" onClick={() => navDay(1)}>Next ›</button>
      </div>

      <div className="dv-grid">
        {/* LEFT COLUMN */}
        <div>
          <div className="card" style={{ marginBottom: '12px' }}>
            <div className="card-head">
              <span className="card-title">Pancha Anga — Five Limbs</span>
              <button className="card-toggle" onClick={() => setDetailsOpen(!detailsOpen)}>
                {detailsOpen ? '— Hide' : '+ Details'}
              </button>
            </div>
            <div className="card-body">
              <div className="limb-grid">
                <div className="limb-row">
                  <div className="limb-label">Tithi</div>
                  <div className="limb-val">
                    <span className="limb-tag">{tnLbl}</span>{tname} {tupto && <span className="until">until {tupto}{isNextDay(pd.tithi) && ' →'}</span>}
                  </div>
                </div>
                <div className="limb-row"><div className="limb-label">Paksha</div><div className="limb-val">{pd.paksha}</div></div>
                <div className="limb-row"><div className="limb-label">Nakshatra</div><div className="limb-val">{extractName(pd.nakshatra)}</div></div>
                <div className="limb-row"><div className="limb-label">Yoga</div><div className="limb-val">{extractName(pd.yoga)}</div></div>
                <div className="limb-row"><div className="limb-label">Vara</div><div className="limb-val">{pd.weekday}</div></div>
              </div>
            </div>
            
            {detailsOpen && (
              <div className="detail-section">
                <table className="detail-table">
                  <tbody>
                    <tr><td>Hindu month</td><td>{pd.month}</td></tr>
                    <tr><td>Ritu</td><td>{ritu.icon} {ritu.name} <span style={{ color: 'var(--muted)', fontSize: '10px' }}>({ritu.eng})</span></td></tr>
                    <tr><td>Sunrise</td><td style={{ color: 'var(--amber)', fontWeight: 600 }}>{lm.sr}</td></tr>
                    <tr><td>Sunset</td><td style={{ color: 'var(--violet)', fontWeight: 600 }}>{lm.ss}</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-head"><span className="card-title">Muhurtas</span></div>
            <div className="card-body">
              <MuhurtaRow label="Amrit kalam" val={pd.amrit} cls="good-c" icon="✦" />
              <MuhurtaRow label="Abhijit" val={lm.abhijit} cls="good-c" icon="✦" />
              <div style={{ height: '6px' }}></div>
              <MuhurtaRow label="Rahu kalam" val={lm.rahu} cls="bad-c" icon="✗" />
              <MuhurtaRow label="Gulikai" val={lm.gulikai} cls="warn-c" icon="✗" />
              <MuhurtaRow label="Yamaganda" val={lm.yamaganda} cls="warn-c" icon="✗" />
              <MuhurtaRow label="Varjyam" val={pd.varjyam} cls="bad-c" icon="✗" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Hora Chart */}
        <div>
          <div className="card">
            <div className="card-head">
              <span className="card-title">Hora Chart</span>
              <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Sunrise {lm.sr}</span>
            </div>
            <div className="card-body" style={{ padding: '8px 6px' }}>
              <HoraClock 
                horas={horas} 
                srMins={pt(lm.sr) || 360} 
                ssMins={pt(lm.ss) || 1080} 
                nowMins={nowMins} 
                isToday={isViewingToday} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayView;
