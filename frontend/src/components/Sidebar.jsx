import React, { useContext } from 'react';
import { PanchangaContext } from '../context/PanchangaContext';

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya',
  'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha',
  'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami',
  'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya'
];

const Sidebar = () => {
  const { filterMode, setFilterMode, tF, setTF, nF, setNF, pF, setPF } = useContext(PanchangaContext);

  const FilterRadio = ({ val, color, label }) => (
    <label className={`sf-radio ${filterMode === val ? 'active' : ''}`} onClick={() => setFilterMode(val)}>
      <span className="sf-dot" style={{ background: color }}></span>{label}
    </label>
  );

  return (
    <>
      <div className="sb-head">
        <div className="sb-title">Wheno</div>
        <div className="sb-sub">
          Pick the right time for better outcomes.<br/>
          <span style={{ fontSize: '10px', opacity: 0.65, fontWeight: 400, lineHeight: 1.6, display: 'block', marginTop: '5px' }}>
            Based on the Panchanga, an astronomical system that tracks time using lunar and solar cycles.
          </span>
        </div>
      </div>
      
      <div className="sb-inner">
        <div>
          <div className="sb-sect">Filter by muhurta</div>
          <div className="sb-filter-grp">
            <FilterRadio val="all" color="#8892a4" label="All days" />
            <FilterRadio val="amrit" color="#166534" label="Has Amrit kalam" />
            <FilterRadio val="abhijit" color="#1e40af" label="Has Abhijit" />
            <FilterRadio val="no_rahu" color="#991b1b" label="No Rahu kalam" />
          </div>
        </div>

        <div>
          <div className="sb-sect" style={{ marginBottom: '5px' }}>Tithi</div>
          <select className="sb-select" value={tF} onChange={(e) => setTF(e.target.value)}>
            <option value="">All tithis</option>
            {TITHIS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <div className="sb-sect" style={{ marginBottom: '5px' }}>Nakshatra</div>
          <select className="sb-select" value={nF} onChange={(e) => setNF(e.target.value)}>
            <option value="">All</option>
            {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div>
          <div className="sb-sect" style={{ marginBottom: '5px' }}>Paksha</div>
          <select className="sb-select" value={pF} onChange={(e) => setPF(e.target.value)}>
            <option value="">Both</option>
            <option value="Shukla Paksha">Shukla Paksha</option>
            <option value="Krishna Paksha">Krishna Paksha</option>
          </select>
        </div>

        {/* <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
          <div className="sb-sect" style={{ marginBottom: '6px' }}>Recent activities</div>
          <div id="sideBookings">
            <div className="sb-recent">No bookings yet</div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Sidebar;