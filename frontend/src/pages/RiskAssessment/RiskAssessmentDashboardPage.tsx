import { useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  BarChart, Bar, Cell, Tooltip as ReTooltip
} from 'recharts';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { riskDashboardVitals, riskHistory } from '../../data/mock_risk_assessment';
import { Icons } from '../../lib/icons';
import { useReveal } from '../../hooks/useScrollReveal';
import './RiskAssessmentDashboard.css';

// ── Peer Comparison — unique chart per metric ───────────────────────

// 1. CV Risk Score → percentile fill bar
function ChartRiskScore({ value, peerMean }: { value: number; peerMean: number }) {
  const pct = Math.min((value / 40) * 100, 100);
  const peerPct = Math.min((peerMean / 40) * 100, 100);
  const color = value <= 8 ? '#27ae60' : value <= 14 ? '#e67e22' : value <= 21 ? '#d35400' : '#c0392b';
  return (
    <svg viewBox="0 0 220 44" style={{ display: 'block', width: '100%', height: 'auto' }}>
      {/* track */}
      <rect x="0" y="16" width="220" height="12" rx="6" fill="rgba(255,255,255,0.06)" />
      {/* color zones */}
      <rect x="0"   y="16" width="55"  height="12" rx="6" fill="rgba(39,174,96,0.18)" />
      <rect x="55"  y="16" width="55"  height="12" fill="rgba(230,126,34,0.18)" />
      <rect x="110" y="16" width="55"  height="12" fill="rgba(211,84,0,0.18)" />
      <rect x="165" y="16" width="55"  height="12" rx="6" fill="rgba(192,57,43,0.18)" />
      {/* filled bar */}
      <rect x="0" y="16" width={`${(pct / 100) * 220}`} height="12" rx="6" fill={color} opacity="0.7" />
      {/* peer avg tick */}
      <line x1={`${(peerPct / 100) * 220}`} y1="12" x2={`${(peerPct / 100) * 220}`} y2="32" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="3,2" />
      {/* user dot */}
      <circle cx={`${(pct / 100) * 220}`} cy="22" r="7" fill={color} stroke="#0a0f0d" strokeWidth="2" />
      {/* zone labels */}
      <text x="4"   y="40" fontSize="8" fill="rgba(255,255,255,0.3)">Low</text>
      <text x="66"  y="40" fontSize="8" fill="rgba(255,255,255,0.3)">Borderline</text>
      <text x="122" y="40" fontSize="8" fill="rgba(255,255,255,0.3)">Inter.</text>
      <text x="172" y="40" fontSize="8" fill="rgba(255,255,255,0.3)">High</text>
    </svg>
  );
}

// 2. Systolic BP → two-zone pressure gauge (horizontal)
function ChartSystolicBp({ value }: { value: number }) {
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const pct = clamp(((value - 80) / (180 - 80)) * 100, 0, 100);
  const color = value < 120 ? '#27ae60' : value < 130 ? '#a3e635' : value < 140 ? '#e67e22' : '#c0392b';
  const label = value < 120 ? 'Normal' : value < 130 ? 'Elevated' : value < 140 ? 'High Stage 1' : 'High Stage 2';
  return (
    <svg viewBox="0 0 220 54" style={{ display: 'block', width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="bp-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%"   stopColor="#27ae60" stopOpacity="0.5" />
          <stop offset="40%"  stopColor="#a3e635" stopOpacity="0.5" />
          <stop offset="65%"  stopColor="#e67e22" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c0392b" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* gradient track */}
      <rect x="0" y="18" width="220" height="10" rx="5" fill="url(#bp-grad)" />
      {/* zone dividers */}
      <line x1="44" y1="16" x2="44" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="88" y1="16" x2="88" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="132" y1="16" x2="132" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* user marker line + diamond */}
      <line x1={`${(pct / 100) * 220}`} y1="10" x2={`${(pct / 100) * 220}`} y2="30" stroke={color} strokeWidth="2" />
      <polygon points={`${(pct / 100) * 220},6 ${(pct / 100) * 220 - 5},14 ${(pct / 100) * 220 + 5},14`} fill={color} />
      {/* zone labels */}
      <text x="2"   y="44" fontSize="8" fill="rgba(255,255,255,0.3)">Normal</text>
      <text x="48"  y="44" fontSize="8" fill="rgba(255,255,255,0.3)">Elevated</text>
      <text x="92"  y="44" fontSize="8" fill="rgba(255,255,255,0.3)">High 1</text>
      <text x="136" y="44" fontSize="8" fill="rgba(255,255,255,0.3)">High 2</text>
      {/* user label */}
      <text x={`${(pct / 100) * 220}`} y="54" fontSize="9" fill={color} textAnchor="middle" fontWeight="700">{label}</text>
    </svg>
  );
}

// 3. Heart Rate → dot on zone track with colored bands
function ChartHeartRate({ value }: { value: number }) {
  const zones = [
    { label: 'Athletic', range: [40, 60], color: '#3b82f6' },
    { label: 'Normal',   range: [60, 80], color: '#27ae60' },
    { label: 'Elevated', range: [80, 100], color: '#e67e22' },
    { label: 'High',     range: [100, 120], color: '#c0392b' },
  ];
  const min = 40, max = 120, W = 220;
  const xOf = (v: number) => Math.max(0, Math.min(W, ((v - min) / (max - min)) * W));
  const userColor = value < 60 ? '#3b82f6' : value < 80 ? '#27ae60' : value < 100 ? '#e67e22' : '#c0392b';
  return (
    <svg viewBox="0 0 220 48" style={{ display: 'block', width: '100%', height: 'auto' }}>
      {zones.map((z, i) => {
        const x1 = xOf(z.range[0]), x2 = xOf(z.range[1]);
        return (
          <g key={i}>
            <rect x={x1} y="16" width={x2 - x1} height="10" fill={z.color} opacity="0.22"
              rx={i === 0 ? 5 : 0} style={{ borderRadius: i === zones.length - 1 ? '0 5px 5px 0' : '0' }} />
            <text x={(x1 + x2) / 2} y="38" fontSize="8" fill="rgba(255,255,255,0.3)" textAnchor="middle">{z.label}</text>
          </g>
        );
      })}
      {/* track border */}
      <rect x="0" y="16" width="220" height="10" rx="5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      {/* user dot */}
      <circle cx={xOf(value)} cy="21" r="8" fill={userColor} stroke="#0a0f0d" strokeWidth="2" />
      <text x={xOf(value)} y="24.5" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="700">{value}</text>
      {/* bpm label */}
      <text x={xOf(value)} y="48" fontSize="8" fill={userColor} textAnchor="middle">bpm</text>
    </svg>
  );
}

// 4. Glucose → segmented 3-zone bar
function ChartGlucose({ value }: { value: number }) {
  const segments = [
    { label: 'Normal',      range: [70, 100],  color: '#27ae60' },
    { label: 'Pre-diabetic', range: [100, 126], color: '#e67e22' },
    { label: 'Diabetic',    range: [126, 200],  color: '#c0392b' },
  ];
  const min = 70, max = 200, W = 220;
  const xOf = (v: number) => Math.max(0, Math.min(W, ((v - min) / (max - min)) * W));
  const userColor = value < 100 ? '#27ae60' : value < 126 ? '#e67e22' : '#c0392b';
  const userX = xOf(value);
  return (
    <svg viewBox="0 0 220 50" style={{ display: 'block', width: '100%', height: 'auto' }}>
      {segments.map((s, i) => {
        const x1 = xOf(s.range[0]), x2 = xOf(s.range[1]);
        return (
          <g key={i}>
            <rect x={x1} y="14" width={x2 - x1 - 2} height="14"
              rx={i === 0 ? 5 : i === segments.length - 1 ? 5 : 0}
              fill={s.color} opacity="0.25" />
            <text x={(x1 + x2) / 2} y="40" fontSize="8" fill="rgba(255,255,255,0.3)" textAnchor="middle">{s.label}</text>
          </g>
        );
      })}
      {/* divider lines */}
      <line x1={xOf(100)} y1="12" x2={xOf(100)} y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <line x1={xOf(126)} y1="12" x2={xOf(126)} y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      {/* user marker */}
      <rect x={userX - 2} y="10" width="4" height="18" rx="2" fill={userColor} />
      <circle cx={userX} cy="10" r="5" fill={userColor} stroke="#0a0f0d" strokeWidth="1.5" />
      {/* value label */}
      <text x={userX} y="50" fontSize="9" fill={userColor} textAnchor="middle" fontWeight="700">{value} mg/dL</text>
    </svg>
  );
}

// 5. BMI → category ladder (stacked pills)
function ChartBmi({ value }: { value: number }) {
  const cats = [
    { label: 'Underweight', max: 18.5, color: '#3b82f6' },
    { label: 'Normal',      max: 25,   color: '#27ae60' },
    { label: 'Overweight',  max: 30,   color: '#e67e22' },
    { label: 'Obese',       max: 40,   color: '#c0392b' },
  ];
  const active = cats.findIndex(c => value < c.max);
  const activeIdx = active === -1 ? cats.length - 1 : active;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '2px 0' }}>
      {cats.map((c, i) => {
        const isActive = i === activeIdx;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: isActive ? `${c.color}22` : 'rgba(255,255,255,0.03)',
            border: `1px solid ${isActive ? c.color + '55' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 6, padding: '5px 10px',
            transition: 'all 0.2s',
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isActive ? c.color : 'rgba(255,255,255,0.15)',
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 11, color: isActive ? c.color : 'rgba(255,255,255,0.3)', flex: 1 }}>{c.label}</span>
            {isActive && (
              <span style={{ fontSize: 10, fontWeight: 700, color: c.color }}>{value} ←</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// 6. 10-Year CVD Risk → half-donut arc gauge
function ChartTenYearRisk({ value }: { value: number }) {
  const W = 220, cx = 110, cy = 90, r = 70;
  const pct = Math.min(value / 25, 1); // max meaningful = 25%
  // half-circle arc: left=-180deg, right=0deg
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcX = (pct: number) => cx + r * Math.cos(toRad(180 - pct * 180));
  const arcY = (pct: number) => cy - r * Math.sin(toRad(pct * 180));

  const color = value < 5 ? '#27ae60' : value < 10 ? '#a3e635' : value < 15 ? '#e67e22' : '#c0392b';
  const label = value < 5 ? 'Low' : value < 10 ? 'Borderline' : value < 15 ? 'Intermediate' : 'High';

  // build arc path from 0% to pct
  const startX = cx - r, startY = cy; // 180deg = left
  const endX = arcX(pct), endY = arcY(pct);
  const largeArc = pct > 0.5 ? 1 : 0;

  return (
    <svg viewBox="0 0 220 100" style={{ display: 'block', width: '100%', height: 'auto' }}>
      {/* track */}
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" strokeLinecap="round" />
      {/* color zone fills */}
      {[
        { from: 0, to: 0.2, color: '#27ae60' },
        { from: 0.2, to: 0.4, color: '#a3e635' },
        { from: 0.4, to: 0.6, color: '#e67e22' },
        { from: 0.6, to: 1.0, color: '#c0392b' },
      ].map((seg, i) => {
        const sx = arcX(seg.from), sy = arcY(seg.from);
        const ex = arcX(seg.to),   ey = arcY(seg.to);
        const lg = (seg.to - seg.from) > 0.5 ? 1 : 0;
        return (
          <path key={i}
            d={`M ${sx} ${sy} A ${r} ${r} 0 ${lg} 1 ${ex} ${ey}`}
            fill="none" stroke={seg.color} strokeWidth="14" strokeLinecap="butt" opacity="0.22" />
        );
      })}
      {/* user fill arc */}
      {pct > 0 && (
        <path d={`M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`}
          fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" opacity="0.9" />
      )}
      {/* needle dot at user position */}
      <circle cx={endX} cy={endY} r="7" fill={color} stroke="#0a0f0d" strokeWidth="2" />
      {/* center labels */}
      <text x={cx} y={cy - 12} fontSize="22" fontWeight="800" fill={color} textAnchor="middle">{value}%</text>
      <text x={cx} y={cy + 6}  fontSize="10" fill="rgba(255,255,255,0.45)" textAnchor="middle">10-yr risk</text>
      {/* zone labels */}
      <text x="8"   y={cy + 20} fontSize="8" fill="rgba(255,255,255,0.3)">Low</text>
      <text x={W - 8} y={cy + 20} fontSize="8" fill="rgba(255,255,255,0.3)" textAnchor="end">High</text>
      {/* risk label */}
      <text x={cx} y={cy + 20} fontSize="10" fontWeight="700" fill={color} textAnchor="middle">{label}</text>
    </svg>
  );
}

function PeerComparisonDashboard() {
  const row = riskHistory[0];
  const bmi = parseFloat((row.weight / (1.70 * 1.70)).toFixed(1));
  const systolic = parseInt(row.bp);
  const tenYrVal = row.riskScore >= 22 ? 20 : row.riskScore >= 15 ? 14 : row.riskScore >= 8 ? 7 : 3;

  const isBetter = (key: string, val: number, mean: number) => {
    if (key === 'heartRate' || key === 'tenYearRisk') return val <= mean;
    return val <= mean;
  };

  const cards = [
    {
      key: 'riskScore', label: 'Cardiovascular Risk Score',
      display: String(row.riskScore), unit: '/ 40',
      value: row.riskScore, mean: 18.5, pct: 62,
      chart: <ChartRiskScore value={row.riskScore} peerMean={18.5} />,
      note: 'Peer avg: 18.5 / 40 · males 45–54',
    },
    {
      key: 'systolicBp', label: 'Systolic Blood Pressure',
      display: String(systolic), unit: 'mmHg',
      value: systolic, mean: 127, pct: 48,
      chart: <ChartSystolicBp value={systolic} />,
      note: 'Peer avg: 127 mmHg · males 45–54',
    },
    {
      key: 'heartRate', label: 'Resting Heart Rate',
      display: String(row.hr), unit: 'bpm',
      value: row.hr, mean: 72, pct: 27,
      chart: <ChartHeartRate value={row.hr} />,
      note: 'Peer avg: 72 bpm · males 45–54',
    },
    {
      key: 'glucose', label: 'Fasting Glucose',
      display: String(row.glucose), unit: 'mg/dL',
      value: row.glucose, mean: 100, pct: 64,
      chart: <ChartGlucose value={row.glucose} />,
      note: 'Peer avg: 100 mg/dL · males 45–54',
    },
    {
      key: 'bmi', label: 'Body Mass Index',
      display: String(bmi), unit: 'kg/m²',
      value: bmi, mean: 29.1, pct: 78,
      chart: <ChartBmi value={bmi} />,
      note: 'Peer avg: 29.1 kg/m² · males 45–54',
    },
    {
      key: 'tenYearRisk', label: '10-Year CVD Risk',
      display: `${tenYrVal}%`, unit: '',
      value: tenYrVal, mean: 9.5, pct: 60,
      chart: <ChartTenYearRisk value={tenYrVal} />,
      note: 'Peer avg: 9.5% · males 45–54',
    },
  ];

  return (
    <div className="rad-peer-section">
      <div className="rad-peer-head">
        <div className="rad-peer-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#a3e635" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="7" r="4" stroke="#a3e635" strokeWidth="1.5" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#a3e635" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#a3e635" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="rad-peer-title">How You Compare to Others Like You</p>
          <p className="rad-peer-subtitle">Males · Age 45–54 · NHANES 2021–2023 population norms</p>
        </div>
      </div>
      <div className="rad-peer-grid">
        {cards.map(c => {
          const better = isBetter(c.key, c.value, c.mean);
          return (
            <div key={c.key} className="rad-peer-card">
              <div className="rad-peer-card-top">
                <span className="rad-peer-metric-label">{c.label}</span>
                <span className="rad-peer-user-val" style={{ color: better ? '#a3e635' : '#f97316' }}>
                  {c.display}
                  {c.unit && <span className="rad-peer-unit"> {c.unit}</span>}
                </span>
              </div>
              <div style={{ margin: '4px 0' }}>{c.chart}</div>
              <div className="rad-peer-card-foot">
                <span className={`rad-peer-badge ${better ? 'rad-peer-badge--good' : 'rad-peer-badge--warn'}`}>
                  {better ? `Better than ${c.pct}% of peers` : `Above avg — room to improve`}
                </span>
                <span className="rad-peer-avg-note">{c.note}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="rad-peer-legend">
        Source: NHANES 2021–2023, ACC/AHA Pooled Cohort equations. Each chart uses a distinct visual suited to that metric's clinical meaning.
      </p>
    </div>
  );
}

// ── Charts ─────────────────────────────────────────────────────────

function VitalsAreaChart({ points, color }: { points: number[]; color: string }) {
  const data = points.map((p, i) => ({ i, v: p }));
  const gradId = `vitals-grad-${color.replace('#', '')}`;

  return (
    <div style={{ width: '100%', height: 72 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradId})`}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function RiskDriversChart({ data, colorScale }: { data: { name: string; pct: number }[]; colorScale: (pct: number) => string }) {
  // Add color property to data objects directly
  const enrichedData = data.map(d => ({ ...d, fill: colorScale(d.pct) }));

  return (
    <div style={{ width: '100%', height: 220, marginTop: 12 }}>
      <ResponsiveContainer>
        <BarChart layout="vertical" data={enrichedData} margin={{ top: 0, right: 30, bottom: 0, left: 0 }} barSize={6}>
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
          />
          <ReTooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            itemStyle={{ color: '#e2e8f0' }}
            formatter={(value: number) => [`${value}%`, 'Contribution']}
          />
          <Bar dataKey="pct" radius={[0, 4, 4, 0]} background={{ fill: 'rgba(255,255,255,0.04)', radius: [0, 4, 4, 0] }}>
            {enrichedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function HistoryTrendChart({ history }: { history: any[] }) {
  // Take last 8 entries and reverse for chart (oldest -> newest)
  const data = history.slice(0, 8).reverse().map((r: any) => ({
    date: r.date.split(' ')[0], // simple date
    score: r.riskScore,
    fill: r.riskScore >= 22 ? '#c0392b' : r.riskScore >= 15 ? '#e67e22' : r.riskScore >= 8 ? '#d35400' : '#27ae60'
  }));

  return (
    <div style={{ width: '100%', height: 70 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 0, bottom: 0, left: 0 }} barCategoryGap="20%">
          <ReTooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 6, fontSize: 12, padding: '4px 8px' }}
            itemStyle={{ color: '#94a3b8' }}
            formatter={(val: number) => [val, 'Score']}
            labelStyle={{ display: 'none' }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.fill} opacity={index === data.length - 1 ? 1 : 0.6} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── SVG score ring ─────────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 56; const circ = 2 * Math.PI * r;
  const pct = Math.min(score / 40, 1);
  return (
    <div className="rad-ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" className="rad-ring-track" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          transform="rotate(-90 70 70)" />
      </svg>
      <div className="rad-ring-center">
        <span className="rad-ring-score" style={{ color }}>{score}</span>
        <span className="rad-ring-label">/ 40</span>
      </div>
    </div>
  );
}

// ── Risk summary panel ─────────────────────────────────────────────
function RiskSummary() {
  const { ref, visible } = useReveal();
  // hardcoded sample — Phase 2 will load from backend
  const score = 14; const level = 'Borderline';
  const scoreColor = score >= 22 ? '#c0392b' : score >= 15 ? '#e67e22' : score >= 8 ? '#d35400' : '#27ae60';
  const riskColorByPct = (pct: number) => {
    if (pct >= 65) return '#c0392b';
    if (pct >= 50) return '#d35400';
    if (pct >= 35) return '#e67e22';
    return '#27ae60';
  };
  const tenYear = '5–9%'; const lifetime = '25–39%';

  return (
    <div ref={ref} className={`rad-summary-panel ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
      <div className="rad-summary-left">
        <div className="rad-level-badge">
          {level} Risk
        </div>
        <ScoreRing score={score} color={scoreColor} />
        <div className="rad-risk-stats">
          <div className="rad-risk-stat">
            <span className="rad-rs-label">10-Year Risk</span>
            <span className="rad-rs-value">{tenYear}</span>
          </div>
          <div className="rad-risk-stat-divider" />
          <div className="rad-risk-stat">
            <span className="rad-rs-label">Lifetime Risk</span>
            <span className="rad-rs-value">{lifetime}</span>
          </div>
        </div>
      </div>
      <div className="rad-summary-right">
        <p className="rad-summary-eyebrow">Key Risk Drivers</p>
        <RiskDriversChart
          data={[
            { name: 'LDL Cholesterol',  pct: 72 },
            { name: 'Blood Pressure',   pct: 55 },
            { name: 'Family History',   pct: 40 },
            { name: 'Smoking',          pct: 20 },
            { name: 'Diabetes / HbA1c', pct: 35 },
            { name: 'Inflammation',     pct: 48 },
          ]}
          colorScale={riskColorByPct}
        />
        <IonButton className="rad-retake-btn" shape="round" href="/risk-assessment/form" style={{ marginTop: '12px' }}>
          Retake Assessment
        </IonButton>
      </div>
    </div>
  );
}

// ── Vitals grid ────────────────────────────────────────────────────
const TIME_RANGES = ['Day', 'Week', 'Month', 'All'];

function VitalsGrid() {
  const [timeRange, setTimeRange] = useState('Week');
  const { ref, visible } = useReveal();
  const vitalColor: Record<string, string> = {
    'Blood Pressure': '#3a7ebf',
    'Heart Rate': '#2d9b7e',
    'LDL': '#7b5ea7',
    'Blood Glucose': '#3d9a5c',
    'SpO2': '#2e6da4',
    'HbA1c': '#2d8c97',
  };
  return (
    <div ref={ref} className={`rad-vitals-section ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
      <div className="rad-vitals-header">
        <h2 className="rad-vitals-title">Today's Vitals</h2>
        <div className="wb-time-tabs">
          {TIME_RANGES.map(r => (
            <button key={r}
              className={`wb-time-tab ${timeRange === r ? 'wb-time-tab-active' : ''}`}
              onClick={() => setTimeRange(r)}>{r}</button>
          ))}
        </div>
      </div>
      <div className="rad-vitals-grid">
        {riskDashboardVitals.map(v => {
          const color = vitalColor[v.label] || '#2563eb';
          return (
          <div key={v.label} className="rad-vital-card" style={{ '--accent': color } as React.CSSProperties}>
            <div className="rad-vital-body">
              <div className="rad-vital-header">
                <span className="rad-vital-dot" style={{ background: color }} />
                <span className="rad-vital-label">{v.label}</span>
                <span className="rad-vital-normal">Normal: {v.normal}</span>
              </div>
              <div className="rad-vital-value-row">
                <span className="rad-vital-value">{v.value}</span>
                <span className="rad-vital-unit">{v.unit}</span>
              </div>
              <p className="rad-vital-range">{timeRange} avg</p>
            </div>
            <div className="rad-vital-chart">
              <VitalsAreaChart points={v.trend} color={color} />
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

// ── History cards ──────────────────────────────────────────────────
const LEVEL_COLOR: Record<string, string> = {
  Low: '#27ae60', Borderline: '#e67e22', Intermediate: '#d35400', High: '#c0392b',
};

const FILTERS = ['All', 'Low', 'Borderline', 'Intermediate', 'High'];

// mini SVG score ring for each history card
function MiniRing({ score, color }: { score: number; color: string }) {
  const r = 28; const circ = 2 * Math.PI * r;
  const pct = Math.min(score / 40, 1);
  return (
    <div className="rad-mini-ring-wrap">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" className="rad-ring-track" strokeWidth="7" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          transform="rotate(-90 36 36)" />
      </svg>
      <div className="rad-mini-ring-center">
        <span className="rad-mini-ring-score" style={{ color }}>{score}</span>
        <span className="rad-mini-ring-max">/40</span>
      </div>
    </div>
  );
}

const PAGE_SIZE = 5;

function HistorySection() {
  const historyNav = useHistory();
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = filter === 'All'
    ? riskHistory
    : riskHistory.filter(r => r.level === filter);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilter(f: string) {
    setFilter(f);
    setPage(1);
  }

  // avg score overview
  const avgScore = Math.round(riskHistory.reduce((s, r) => s + r.riskScore, 0) / riskHistory.length);
  const avgColor = LEVEL_COLOR['Borderline'];

  return (
    <div className="rad-history-section">

      {/* overview row */}
      <div className="rad-overview-row">
        <div className="rad-overview-card">
          <div className="rad-ov-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" className="rad-ov-icon">
              <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z"
                stroke="#f97316" strokeWidth="1.5" fill="rgba(249,115,22,0.12)" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="rad-ov-label">Avg Risk Score</span>
          {/* circular progress */}
          <div className="rad-ov-ring-wrap">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" className="rad-ring-track" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke={avgColor} strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - avgScore / 40)}`}
                transform="rotate(-90 50 50)" />
            </svg>
            <div className="rad-ov-ring-center">
              <span className="rad-ov-score" style={{ color: avgColor }}>{avgScore}</span>
              <span className="rad-ov-score-label">Score</span>
            </div>
          </div>
        </div>

        <div className="rad-overview-card rad-overview-card--trend">
          <div className="rad-ov-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" className="rad-ov-icon">
              <polyline points="3,17 9,11 13,15 21,7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="17,7 21,7 21,11" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="rad-ov-label">Risk Trend</span>
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
             <HistoryTrendChart history={riskHistory} />
          </div>
          <span className="rad-ov-trend-tag" style={{ marginTop: 4 }}>↓ Improving</span>
        </div>

        <div className="rad-overview-card rad-overview-card--stats">
          <span className="rad-ov-label">Assessments</span>
          <span className="rad-ov-big-num">{riskHistory.length}</span>
          <div className="rad-ov-stat-rows">
            {(['High','Intermediate','Borderline','Low'] as const).map(lvl => {
              const count = riskHistory.filter(r => r.level === lvl).length;
              return (
                <div key={lvl} className="rad-ov-stat-row">
                  <span className="rad-ov-stat-dot" style={{ background: LEVEL_COLOR[lvl] }} />
                  <span className="rad-ov-stat-name">{lvl}</span>
                  <span className="rad-ov-stat-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* filter chips + title */}
      <div className="rad-history-header">
        <h2 className="rad-history-title">Assessment History</h2>
        <div className="rad-filter-chips">
          {FILTERS.map(f => (
            <button key={f}
              className={`rad-filter-chip ${filter === f ? 'rad-filter-chip--active' : ''}`}
              onClick={() => handleFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {/* assessment cards */}
      <div className="rad-history-cards">
        {paginated.map((row, i) => {
          const globalIdx = (page - 1) * PAGE_SIZE + i;
          const color = LEVEL_COLOR[row.level];
          // id is 1-based index into riskHistory
          const recordId = globalIdx + 1;
          return (
            <div key={i} className="rad-history-card" style={{ '--level-color': color } as React.CSSProperties}>
              {/* top accent bar */}
              <div className="rad-hc-accent" style={{ background: color }} />

              <div className="rad-hc-main">
                {/* left — ring + date */}
                <div className="rad-hc-left">
                  <MiniRing score={row.riskScore} color={color} />
                  <div className="rad-hc-date-block">
                    <span className="rad-hc-date">{row.date}</span>
                    <span className="rad-hc-level-pill" style={{ color, borderColor: `${color}33` }}>
                      {row.level}
                    </span>
                  </div>
                </div>

                {/* center — key stats */}
                <div className="rad-hc-stats">
                  <div className="rad-hc-stat">
                    <span className="rad-hc-stat-label">Blood Pressure</span>
                    <span className="rad-hc-stat-value">{row.bp}</span>
                  </div>
                  <div className="rad-hc-stat">
                    <span className="rad-hc-stat-label">Heart Rate</span>
                    <span className="rad-hc-stat-value">{row.hr} bpm</span>
                  </div>
                  <div className="rad-hc-stat">
                    <span className="rad-hc-stat-label">Glucose</span>
                    <span className="rad-hc-stat-value">{row.glucose} mg/dL</span>
                  </div>
                  <div className="rad-hc-stat">
                    <span className="rad-hc-stat-label">Weight</span>
                    <span className="rad-hc-stat-value">{row.weight} kg</span>
                  </div>
                </div>

                {/* right — navigate to detail page */}
                <button className="rad-hc-toggle" onClick={() => historyNav.push(`/risk-assessment/dashboard/${recordId}/history`)}>
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="rad-pagination">
          <span className="rad-pg-info" style={{ marginLeft: 0, marginRight: 'auto' }}>{filtered.length} total · showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span>
          <button className="rad-pg-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <div className="rad-pg-pages">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p}
                className={`rad-pg-num ${page === p ? 'rad-pg-num--active' : ''}`}
                onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
          <button className="rad-pg-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
const RiskAssessmentDashboardPage: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="rad-page">
          <Navbar />
          <div className="hero-bg-grid hero-bg-grid--dark" />

          <div className="rad-main">
            <div className="container">
              <div className="rad-page-header">
                <button className="rad-back-btn" onClick={() => history.push('/risk-assessment')}>
                  <IonIcon icon={Icons.arrowBack} className="rad-back-btn-icon" aria-hidden="true" />
                  <span>Back to Assessment</span>
                </button>
                <div>
                  <h1 className="rad-page-title">Your Risk Profile</h1>
                </div>
              </div>

              <RiskSummary />
              <VitalsGrid />
              <HistorySection />
              <PeerComparisonDashboard />
            </div>
          </div>
          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RiskAssessmentDashboardPage;
