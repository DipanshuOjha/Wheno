// frontend/src/utils/astronomy.js
import { PD } from '../data/panchanga';
import { pt, ft, extractName, extractUpto, isNextDay } from './helpers';

const srssCache = {};

// NOAA sunrise/sunset formula (Meeus Algorithm)
export const calcSrSs = (lat, lon, y, mo, d) => {
  let yr = y, mr = mo;
  if (mr <= 2) { yr -= 1; mr += 12; }
  const A = Math.floor(yr / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (yr + 4716)) + Math.floor(30.6001 * (mr + 1)) + d + B - 1524.5;
  const T = (JD - 2451545.0) / 36525.0;

  const L0 = (280.46646 + 36000.76983 * T) % 360;
  const M = ((357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360 + 360) % 360;
  const Mr = M * Math.PI / 180;

  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
    + 0.000289 * Math.sin(3 * Mr);
  const sunLon = (L0 + C) % 360;

  const omega = 125.04452 - 1934.136261 * T;
  const lam = sunLon - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180);
  const eps0 = 23.0 + (26.0 + (21.448 - T * (46.8150 + T * (0.00059 - T * 0.001813))) / 60.0) / 60.0;
  const eps = eps0 + 0.00256 * Math.cos(omega * Math.PI / 180);
  const epsR = eps * Math.PI / 180;
  const decR = Math.asin(Math.sin(epsR) * Math.sin(lam * Math.PI / 180));

  const ecc = 0.016708634 - 0.000042037 * T;
  const yVal = Math.tan(epsR / 2) * Math.tan(epsR / 2);
  const L0r = L0 * Math.PI / 180;
  const EqT = 4 * (180 / Math.PI) * (
    yVal * Math.sin(2 * L0r) - 2 * ecc * Math.sin(Mr)
    + 4 * ecc * yVal * Math.sin(Mr) * Math.cos(2 * L0r)
    - 0.5 * yVal * yVal * Math.sin(4 * L0r)
    - 1.25 * ecc * ecc * Math.sin(2 * Mr)
  );

  const latR = lat * Math.PI / 180;
  const cosHA = (Math.cos((90.0 + 50.0 / 60.0) * Math.PI / 180) - Math.sin(latR) * Math.sin(decR))
    / (Math.cos(latR) * Math.cos(decR));
  const HA_min = Math.acos(Math.max(-1, Math.min(1, cosHA))) * (180 / Math.PI) * 4;

  const noon_UTC = 720.0 - 4.0 * lon - EqT;
  return {
    sr: Math.round(noon_UTC - HA_min + 330), // IST Offset (+5:30)
    ss: Math.round(noon_UTC + HA_min + 330)
  };
};

export const getSrSs = (dk, lat, lon) => {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)},${dk}`;
  if (!srssCache[key]) {
    const y = parseInt(dk.slice(0, 4)), mo = parseInt(dk.slice(4, 6)), d = parseInt(dk.slice(6, 8));
    srssCache[key] = calcSrSs(lat, lon, y, mo, d);
  }
  return srssCache[key];
};

const KALAM = {
  rahu: { 0: 8, 1: 2, 2: 7, 3: 5, 4: 6, 5: 4, 6: 3 },
  gulikai: { 0: 7, 1: 6, 2: 5, 3: 4, 4: 3, 5: 2, 6: 8 },
  yamaganda: { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1, 5: 7, 6: 6 },
};

export const getLocMuhurtas = (dk, lat, lon) => {
  const { sr, ss } = getSrSs(dk, lat, lon);
  const date = new Date(parseInt(dk.slice(0, 4)), parseInt(dk.slice(4, 6)) - 1, parseInt(dk.slice(6, 8)));
  const dow = date.getDay();
  const dur = ss - sr;
  const part = dur / 8;
  const noon = (sr + ss) / 2;

  const period = (partNum) => {
    const s = sr + (partNum - 1) * part;
    const e = sr + partNum * part;
    return `${ft(Math.round(s))} to ${ft(Math.round(e))}`;
  };

  return {
    sr: ft(sr),
    ss: ft(ss),
    rahu: period(KALAM.rahu[dow]),
    gulikai: period(KALAM.gulikai[dow]),
    yamaganda: period(KALAM.yamaganda[dow]),
    abhijit: dow === 3 ? 'None' : `${ft(Math.round(noon - 24))} to ${ft(Math.round(noon + 24))}`,
    srMins: sr,
    ssMins: ss,
  };
};

export const computeHoras = (dk, pd, lat, lon) => {
  if (!pd) return [];
  const { sr, ss } = getSrSs(dk, lat, lon);
  const date = new Date(parseInt(dk.slice(0, 4)), parseInt(dk.slice(4, 6)) - 1, parseInt(dk.slice(6, 8)));
  const dD = ss - sr, nD = 1440 - dD;
  const dH = Math.round(dD / 12), nH = Math.round(nD / 12);
  const dow = date.getDay();
  const HORA_START = { 0: 0, 1: 2, 2: 4, 3: 1, 4: 3, 5: 5, 6: 6 };
  const GRAHAS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const sg = HORA_START[dow] || 0;
  
  const h = [];
  for (let i = 0; i < 12; i++) h.push({ s: sr + i * dH, e: sr + (i + 1) * dH, g: GRAHAS[(sg + i * 5) % 7], p: 'day' });
  for (let i = 0; i < 12; i++) h.push({ s: ss + i * nH, e: ss + (i + 1) * nH, g: GRAHAS[(sg + 60 + i * 5) % 7], p: 'night' });
  return h;
};
