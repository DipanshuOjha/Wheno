// frontend/src/utils/helpers.js

export const pt = (s) => {
  if (!s || s === 'None' || s.startsWith('No ')) return null;
  const m = s.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return null;
  let h = parseInt(m[1]), mn = parseInt(m[2]);
  const ap = m[3].toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h * 60 + mn;
};

export const ft = (mins) => {
  if (mins === null || mins === undefined) return '';
  let h = Math.floor(mins / 60) % 24, mn = mins % 60;
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(mn).padStart(2, '0')} ${ap}`;
};

export const extractName = (s) => {
  if (!s) return '';
  let n = s.split(' upto')[0].split(',')[0].trim();
  if (n.startsWith('Pratipada (')) n = 'Pratipada';
  return n;
};

export const extractUpto = (s) => {
  if (!s) return null;
  const m = s.match(/upto\s+([\d:]+\s*[AP]M)/i);
  return m ? m[1].trim() : null;
};

export const isNextDay = (s) => {
  return s && /,\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(s);
};

export const getEnd = (s) => {
  if (!s) return 0;
  const p = s.split(' to ');
  return p.length > 1 ? pt(p[1]) || 0 : 0;
};

export const parseKaranas = (s) => {
  if (!s) return [];
  const names = ['Bava','Balava','Kaulava','Taitila','Garaja','Vanija','Vishti','Shakuni','Chatushpada','Nagava','Kinstughna','Kimstughna'];
  const parts = [];
  let rem = s;
  while (rem.length > 0) {
    let found = false;
    for (const n of names) {
      if (rem.startsWith(n)) {
        const nextK = names.map(nm => { 
          const i = rem.indexOf(', ' + nm, n.length); 
          return i > -1 ? i : Infinity; 
        }).filter(i => i < Infinity);
        
        const end = nextK.length ? Math.min(...nextK) : -1;
        if (end > -1) { 
          parts.push(rem.slice(0, end).trim()); 
          rem = rem.slice(end + 2).trim(); 
        } else { 
          parts.push(rem.trim()); 
          rem = ''; 
        }
        found = true; break;
      }
    }
    if (!found) break;
  }
  return parts.length ? parts : [s];
};

export const TITHI_NUM_MAP = {
  'Pratipada':1,'Dwitiya':2,'Tritiya':3,'Chaturthi':4,'Panchami':5,
  'Shashthi':6,'Saptami':7,'Ashtami':8,'Navami':9,'Dashami':10,
  'Ekadashi':11,'Dwadashi':12,'Trayodashi':13,'Chaturdashi':14,
  'Purnima':15,'Amavasya':15
};

export const tithiNum = (raw, paksha) => {
  const name = extractName(raw);
  if (!name) return null;
  const base = TITHI_NUM_MAP[name];
  if (base === undefined || base === null) return null;
  return { num: base, paksha: paksha };
};

export const tithiNumLabel = (t) => {
  if (!t) return '';
  const { num, paksha } = t;
  return paksha === 'Shukla Paksha' ? `S${num}` : `K${num}`;
};

export const moonIcon = (tithi, paksha) => {
  if (!tithi || !paksha) return '🌑';
  const name = extractName(tithi);
  if (name === 'Purnima') return '🌕';
  if (name === 'Amavasya') return '🌑';
  const n = TITHI_NUM_MAP[name] || 1;
  if (paksha === 'Shukla Paksha') {
    if (n <= 4) return '🌒';
    if (n <= 9) return '🌓';
    if (n <= 14) return '🌔';
    return '🌕';
  } else {
    if (n <= 4) return '🌖';
    if (n <= 9) return '🌗';
    if (n <= 14) return '🌘';
    return '🌑';
  }
};
