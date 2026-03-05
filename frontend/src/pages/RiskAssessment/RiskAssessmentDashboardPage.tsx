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
            </div>
          </div>
          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RiskAssessmentDashboardPage;
