import React from 'react';
import { ft } from '../utils/helpers';

const GRAHA_COLORS = {
  Sun:     { bg: '#fef3d0', stroke: '#b45309', text: '#7a4e00' },
  Moon:    { bg: '#dbeafe', stroke: '#3b82f6', text: '#1e3a8a' },
  Mars:    { bg: '#fee2e2', stroke: '#ef4444', text: '#7f1d1d' },
  Mercury: { bg: '#dcfce7', stroke: '#22c55e', text: '#14532d' },
  Jupiter: { bg: '#f3f4f6', stroke: '#6b7280', text: '#1f2937' },
  Venus:   { bg: '#fce7f3', stroke: '#ec4899', text: '#701a5a' },
  Saturn:  { bg: '#ede9fe', stroke: '#8b5cf6', text: '#3b0764' },
};

const HoraClock = ({ horas, srMins, ssMins, nowMins, isToday }) => {
  const TOTAL = 1440;
  const VB = 320, CX = 160, CY = 160, Ro = 130, Ri = 72;
  const RLabel = Ro + 13;
  const RTick1 = Ro + 1;
  const RTick2 = Ro + 6;

  const minToAngle = (m) => {
    let offset = ((m - srMins) % TOTAL + TOTAL) % TOTAL;
    return -90 + (offset / TOTAL) * 360;
  };

  const getCoordinates = (radius, angleDeg) => {
    const aRad = (angleDeg * Math.PI) / 180;
    return {
      x: CX + radius * Math.cos(aRad),
      y: CY + radius * Math.sin(aRad)
    };
  };

  const curH = horas.find(h => isToday && nowMins >= h.s && nowMins < h.e);
  const cName = curH ? curH.g : ft(srMins);
  const cSub = curH ? `${curH.s < ssMins ? '☀️' : '🌙'} ${ft(curH.s)}–${ft(curH.e)}` : 'sunrise';

  // Sunlines (Day/Night indicator arcs)
  const dayFrac = (ssMins - srMins) / TOTAL;
  const dayDeg = dayFrac * 360;
  const srR = Ri - 4;
  const { x: arcX1, y: arcY1 } = getCoordinates(srR, -90);
  const { x: arcX2, y: arcY2 } = getCoordinates(srR, -90 + dayDeg);
  const dayLaf = dayDeg > 180 ? 1 : 0;

  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width="100%" style={{ display: 'block', height: 'auto' }}>
      <circle cx={CX} cy={CY} r={Ro + 22} fill="#f8f9fc" stroke="var(--border)" strokeWidth="1" />
      
      {/* Sun/Night Arcs */}
      <path d={`M${arcX1},${arcY1} A${srR},${srR} 0 ${dayLaf},1 ${arcX2},${arcY2}`} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d={`M${arcX2},${arcY2} A${srR},${srR} 0 ${1 - dayLaf},1 ${arcX1},${arcY1}`} fill="none" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" opacity="0.3" />

      {horas.map((h, i) => {
        const isDay = i < 12;
        const isCur = isToday && nowMins >= h.s && nowMins < h.e;
        const gc = GRAHA_COLORS[h.g] || { bg: '#f3f4f6', stroke: '#9ca3af', text: '#374151' };
        
        const sa = minToAngle(h.s);
        const ea = minToAngle(h.e);
        
        const p1 = getCoordinates(Ro, sa);
        const p2 = getCoordinates(Ro, ea);
        const pi1 = getCoordinates(Ri, sa);
        const pi2 = getCoordinates(Ri, ea);
        
        const laf = ((ea - sa + 360) % 360) > 180 ? 1 : 0;
        
        // Labels & Ticks
        const midA = minToAngle(h.s + (h.e - h.s) / 2);
        const { x: lx, y: ly } = getCoordinates((Ro + Ri) / 2, midA);
        const { x: tx1, y: ty1 } = getCoordinates(RTick1, sa);
        const { x: tx2, y: ty2 } = getCoordinates(RTick2, sa);
        const { x: tlx, y: tly } = getCoordinates(RLabel, sa);
        
        const isSS = h.s === ssMins || Math.abs(h.s - ssMins) < 2;
        const isSR = i === 0;

        return (
          <g key={i}>
            <path 
              d={`M${pi1.x},${pi1.y} L${p1.x},${p1.y} A${Ro},${Ro} 0 ${laf},1 ${p2.x},${p2.y} L${pi2.x},${pi2.y} A${Ri},${Ri} 0 ${laf},0 ${pi1.x},${pi1.y} Z`}
              fill={isCur ? gc.stroke : gc.bg} stroke="white" strokeWidth="1.2" opacity={isDay ? (isCur ? 1 : 0.92) : (isCur ? 1 : 0.65)} 
            />
            <text x={lx} y={ly - 2} textAnchor="middle" dominantBaseline="middle" fill={isCur ? '#fff' : gc.text} fontSize="8" fontWeight={isCur ? 700 : 600} fontFamily="DM Sans,sans-serif" style={{ pointerEvents: 'none' }}>
              {h.g.slice(0, 3)}
            </text>
            <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke={isSS ? '#ef4444' : isSR ? '#b45309' : '#dde2ed'} strokeWidth={isSS || isSR ? 1.8 : 1} />
            <text x={tlx} y={tly} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${(sa + 90).toFixed(0)},${tlx},${tly})`} fill={(isSS || isSR) ? 'var(--ink3)' : 'var(--muted)'} fontSize="6.5" fontWeight={(isSS || isSR) ? 600 : 400} fontFamily="DM Sans,sans-serif">
              {ft(h.s)}
            </text>
          </g>
        );
      })}

      {/* Now Hand */}
      {isToday && nowMins >= 0 && (() => {
        const nA = minToAngle(nowMins);
        const { x: nxO, y: nyO } = getCoordinates(Ro - 6, nA);
        return (
          <g>
            <line x1={CX} y1={CY} x2={nxO} y2={nyO} stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
            <circle cx={nxO} cy={nyO} r="3" fill="#dc2626" opacity="0.9" />
            <circle cx={CX} cy={CY} r="3.5" fill="#dc2626" opacity="0.9" />
          </g>
        );
      })()}

      {/* Center Label */}
      <circle cx={CX} cy={CY} r={Ri - 8} fill="white" stroke="var(--border)" strokeWidth="1" />
      <text x={CX} y={CY - 6} textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="700" fontFamily="DM Serif Display,serif">{cName}</text>
      <text x={CX} y={CY + 11} textAnchor="middle" fill="var(--muted)" fontSize="8" fontFamily="DM Sans,sans-serif">{cSub}</text>
    </svg>
  );
};

export default HoraClock;
