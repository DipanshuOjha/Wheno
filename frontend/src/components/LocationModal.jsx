import React, { useContext, useState } from 'react';
import { PanchangaContext } from '../context/PanchangaContext';

const PRESET_CITIES = [
  { n: 'Guwahati', lat: 26.1445, lon: 91.7362 },
  { n: 'Delhi', lat: 28.6139, lon: 77.2090 },
  { n: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { n: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { n: 'Chennai', lat: 13.0827, lon: 80.2707 },
  { n: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
];

const LocationModal = () => {
  const { userLoc, setUserLoc, locModalOpen, setLocModalOpen } = useContext(PanchangaContext);
  const [pendingCity, setPendingCity] = useState(null);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [label, setLabel] = useState('');
  const [detecting, setDetecting] = useState(false);

  if (!locModalOpen) return null;

  const selectCity = (c) => {
    setPendingCity(c);
    setLat(c.lat);
    setLon(c.lon);
    setLabel(c.n);
  };

  const handleDetect = () => {
    setDetecting(true);
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      setDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(4));
        setLon(pos.coords.longitude.toFixed(4));
        setLabel('My Location');
        setPendingCity(null);
        setDetecting(false);
      },
      () => {
        alert('Could not detect location');
        setDetecting(false);
      }
    );
  };

  const applyLocation = () => {
    const finalLat = parseFloat(lat);
    const finalLon = parseFloat(lon);
    const finalName = label.trim() || `${finalLat.toFixed(2)}°, ${finalLon.toFixed(2)}°`;

    if (isNaN(finalLat) || isNaN(finalLon)) {
      alert('Please select a city or enter valid coordinates.');
      return;
    }

    setUserLoc({
      n: finalName,
      lat: finalLat,
      lon: finalLon,
      isDefault: finalName === 'Guwahati',
    });
    setLocModalOpen(false);
  };

  return (
    <div
      className="loc-modal-bg"
      onClick={(e) => e.target === e.currentTarget && setLocModalOpen(false)}
    >
      <div className="loc-modal">
        <div className="loc-modal-title">Set Location</div>
        <div className="loc-modal-desc">
          Sunrise, sunset, Rahu kalam, Gulikai, horas and tithi at sunrise are recalculated for your location.
          Tithi end times remain in IST.
        </div>

        <button className="loc-detect" onClick={handleDetect} disabled={detecting}>
          {detecting ? '📡 Detecting...' : '📡 Use my current location'}
        </button>

        <div className="city-grid">
          {PRESET_CITIES.map((c) => (
            <button
              key={c.n}
              className={`city-btn ${pendingCity?.n === c.n ? 'selected' : ''}`}
              onClick={() => selectCity(c)}
            >
              {c.n}
            </button>
          ))}
        </div>

        <div className="loc-sep">or enter coordinates</div>

        <div className="coord-grid">
          <div>
            <label className="coord-label">Latitude</label>
            <input
              className="coord-input"
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="28.613"
            />
          </div>
          <div>
            <label className="coord-label">Longitude</label>
            <input
              className="coord-input"
              type="number"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="77.209"
            />
          </div>
          <div>
            <label className="coord-label">Label</label>
            <input
              className="coord-input"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="City name"
            />
          </div>
        </div>

        <div className="loc-note">All times in IST (UTC+5:30). Accuracy ±1 min via Meeus algorithm.</div>

        <div className="loc-actions">
          <button className="loc-apply" onClick={applyLocation}>
            Apply Location
          </button>
          <button className="loc-cancel" onClick={() => setLocModalOpen(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;

