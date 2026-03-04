import { useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { riskDashboardVitals, riskHistory } from '../../data/mock_risk_assessment';
import { Icons } from '../../lib/icons';
import { useReveal } from '../../hooks/useScrollReveal';
import './RiskAssessmentDashboard.css';

// ── Sparkline ──────────────────────────────────────────────────────
function CardSparkline({ points, color }: { points: number[]; color: string }) {
  const w = 300; const h = 72;
  const max = Math.max(...points); const min = Math.min(...points);
  const pad = 8;
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (w - pad * 2));
  const ys = points.map(p => h - pad - ((p - min) / (max - min || 1)) * (h - pad * 2));
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const fill = `${d} L${(w - pad).toFixed(1)},${h} L${pad},${h} Z`;
  const gid = `rsg-${color.replace('#', '')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '72px', display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="5" fill={color} />
    </svg>
  );
}

// ── SVG score ring ─────────────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 56; const circ = 2 * Math.PI * r;
  const pct = Math.min(score / 40, 1);
  return (
    <div className="rad-ring-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
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
  const score = 14; const level = 'Borderline'; const color = '#f97316';
  const tenYear = '5–9%'; const lifetime = '25–39%';

  return (
    <div ref={ref} className={`rad-summary-panel ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
      <div className="rad-summary-left">
        <div className="rad-level-badge" style={{ color, borderColor: `${color}44` }}>
          {level} Risk
        </div>
        <ScoreRing score={score} color={color} />
        <div className="rad-risk-stats">
          <div className="rad-risk-stat">
            <span className="rad-rs-label">10-Year Risk</span>
            <span className="rad-rs-value" style={{ color }}>{tenYear}</span>
          </div>
          <div className="rad-risk-stat-divider" />
          <div className="rad-risk-stat">
            <span className="rad-rs-label">Lifetime Risk</span>
            <span className="rad-rs-value" style={{ color }}>{lifetime}</span>
          </div>
        </div>
      </div>
      <div className="rad-summary-right">
        <p className="rad-summary-eyebrow">Key Risk Drivers</p>
        {[
          { name: 'LDL Cholesterol',  pct: 72 },
          { name: 'Blood Pressure',   pct: 55 },
          { name: 'Family History',   pct: 40 },
          { name: 'Smoking',          pct: 20 },
          { name: 'Diabetes / HbA1c', pct: 35 },
          { name: 'Inflammation',     pct: 48 },
        ].map((f, i) => (
          <div key={i} className="rad-driver-row">
            <span className="rad-driver-name">{f.name}</span>
            <div className="rad-driver-track">
              <div className="rad-driver-fill" style={{ width: `${f.pct}%`, background: color }} />
            </div>
            <span className="rad-driver-pct">{f.pct}%</span>
          </div>
        ))}
        <IonButton className="btn-green" shape="round" href="/risk-assessment/form" style={{ marginTop: '12px' }}>
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
        {riskDashboardVitals.map(v => (
          <div key={v.label} className="rad-vital-card" style={{ '--accent': v.color } as React.CSSProperties}>
            <div className="rad-vital-body">
              <div className="rad-vital-header">
                <span className="rad-vital-dot" style={{ background: v.color }} />
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
              <CardSparkline points={v.trend} color={v.color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── History cards ──────────────────────────────────────────────────
const LEVEL_COLOR: Record<string, string> = {
  Low: '#22c55e', Borderline: '#f97316', Intermediate: '#f59e0b', High: '#ef4444',
};

const FILTERS = ['All', 'Low', 'Borderline', 'Intermediate', 'High'];

const RISK_DATA: Record<string, { planTitle: string; planDesc: string; planItems: string[]; worksDesc: string; worksItems: string[] }> = {
  High: {
    planTitle: 'Intensive Intervention',
    planDesc: 'Aggressive management to reduce immediate risk and prevent events.',
    planItems: ['Immediate specialist consult', 'Strict medication adherence', 'Weekly BP monitoring', 'Advanced cardiac imaging'],
    worksDesc: 'Aggressive early intervention significantly reduces the risk of heart attack and stroke.',
    worksItems: ['Stabilizes plaque', 'Rapidly lowers BP', 'Prevents clot formation', 'Reduces cardiac strain'],
  },
  Intermediate: {
    planTitle: 'Balanced Management',
    planDesc: 'Moderate intervention to manage risk factors and prevent progression.',
    planItems: ['Regular specialist follow-ups', 'Medication as prescribed', 'Monthly BP monitoring', 'Lifestyle modifications'],
    worksDesc: 'Proven interventions to reduce cardiovascular events in intermediate-risk individuals.',
    worksItems: ['Stabilizes existing risk factors', 'Lowers BP by 10–15 mmHg', 'Improves lipid profile', 'Reduces progression to high risk'],
  },
  Borderline: {
    planTitle: 'Foundation Plan',
    planDesc: 'Focused lifestyle optimization with periodic monitoring.',
    planItems: ['Lifestyle optimization', 'Medication if indicated', 'Quarterly follow-ups', 'Wearable + BP monitoring'],
    worksDesc: 'Early interventions validated in global cardiovascular outcome studies.',
    worksItems: ['Lower cholesterol by 15–30%', 'Reduce blood pressure by 5–10 mmHg', 'Improve fitness metrics', 'Prevent progression to intermediate risk'],
  },
  Low: {
    planTitle: 'Prevention Plan',
    planDesc: 'Focus on maintaining optimal health through lifestyle choices.',
    planItems: ['Maintain healthy diet', 'Regular exercise (150min/week)', 'Annual health screening', 'Stress management'],
    worksDesc: 'Preventive measures are the most effective way to avoid future cardiovascular issues.',
    worksItems: ['Keeps BP in optimal range', 'Maintains healthy weight', 'Reduces inflammation', 'Supports long-term heart health'],
  },
};

// mini SVG score ring for each history card
function MiniRing({ score, color }: { score: number; color: string }) {
  const r = 28; const circ = 2 * Math.PI * r;
  const pct = Math.min(score / 40, 1);
  return (
    <div className="rad-mini-ring-wrap">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
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

// detail ring (larger, for expanded panel)
function DetailRing({ score, color }: { score: number; color: string }) {
  const r = 48; const circ = 2 * Math.PI * r;
  const pct = Math.min(score / 40, 1);
  return (
    <div className="rad-ring-wrap" style={{ width: 120, height: 120 }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          transform="rotate(-90 60 60)" />
      </svg>
      <div className="rad-ring-center">
        <span className="rad-ring-score" style={{ color, fontSize: 30 }}>{score}</span>
        <span className="rad-ring-label">/ 40</span>
      </div>
    </div>
  );
}

const PAGE_SIZE = 5;

function HistorySection() {
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const filtered = filter === 'All'
    ? riskHistory
    : riskHistory.filter(r => r.level === filter);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilter(f: string) {
    setFilter(f);
    setPage(1);
    setExpanded(null);
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
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
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
          {/* mini bar chart from history scores */}
          <div className="rad-ov-bars">
            {riskHistory.slice().reverse().map((r, i) => {
              const days = ['Oct','Nov','Dec','Jan','Feb'];
              const h = (r.riskScore / 40) * 100;
              return (
                <div key={i} className="rad-ov-bar-col">
                  <div className="rad-ov-bar" style={{ height: `${h}%`, background: i === riskHistory.length - 1 ? '#a3e635' : 'rgba(255,255,255,0.12)' }} />
                  <span className="rad-ov-bar-label">{days[i]}</span>
                </div>
              );
            })}
          </div>
          <span className="rad-ov-trend-tag">↓ Improving</span>
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
          const isOpen = expanded === globalIdx;
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

                {/* right — expand toggle */}
                <button className="rad-hc-toggle" onClick={() => setExpanded(isOpen ? null : globalIdx)}>
                  {isOpen ? '▲' : '▼'} Details
                </button>
              </div>

              {/* expanded detail panel — modelled on old cardio AssessmentDetailView */}
              {isOpen && (() => {
                const rd = RISK_DATA[row.level] || RISK_DATA['Low'];
                const tenYr = row.riskScore >= 22 ? '≥20%' : row.riskScore >= 15 ? '10–19%' : row.riskScore >= 8 ? '5–9%' : '<5%';
                const lifetimeRisk = row.riskScore >= 22 ? '≥39%' : row.riskScore >= 15 ? '25–39%' : row.riskScore >= 8 ? '15–24%' : '<15%';
                return (
                  <div className="rad-hc-detail">
                    <div className="rad-hcd-layout">
                      {/* left col — score ring + factor cards */}
                      <div className="rad-hcd-score-col">
                        <div className="rad-hcd-risk-badge" style={{ background: `${color}22` }}>
                          <IonIcon icon={Icons.warning} style={{ color }} />
                          <span style={{ color }}>{row.level.toUpperCase()}</span>
                        </div>
                        <DetailRing score={row.riskScore} color={color} />
                        <p className="rad-hcd-score-desc">
                          Your assessment indicates a {row.level.toLowerCase()} risk. {rd.planDesc}
                        </p>
                        <div className="rad-hcd-factor-grid">
                          <div className="rad-hcd-factor-card">
                            <span className="rad-hcd-fc-label">Blood Pressure</span>
                            <span className="rad-hcd-fc-value">{row.bp}</span>
                            <span className="rad-hcd-fc-desc">Force on artery walls</span>
                          </div>
                          <div className="rad-hcd-factor-card">
                            <span className="rad-hcd-fc-label">Heart Rate</span>
                            <span className="rad-hcd-fc-value">{row.hr} bpm</span>
                            <span className="rad-hcd-fc-desc">Cardiac workload</span>
                          </div>
                          <div className="rad-hcd-factor-card">
                            <span className="rad-hcd-fc-label">Glucose</span>
                            <span className="rad-hcd-fc-value">{row.glucose} mg/dL</span>
                            <span className="rad-hcd-fc-desc">Metabolic marker</span>
                          </div>
                          <div className="rad-hcd-factor-card">
                            <span className="rad-hcd-fc-label">Weight</span>
                            <span className="rad-hcd-fc-value">{row.weight} kg</span>
                            <span className="rad-hcd-fc-desc">Body composition</span>
                          </div>
                        </div>
                      </div>

                      {/* right col — lifetime, treatment plan, why it works */}
                      <div className="rad-hcd-info-col">
                        {/* lifetime risk card — indigo gradient */}
                        <div className="rad-hcd-lifetime-card">
                          <div className="rad-hcd-card-head">
                            <div className="rad-hcd-card-icon" style={{ background: 'rgba(163,230,53,0.1)' }}>
                              <svg viewBox="0 0 24 24" fill="none">
                                <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z"
                                  stroke="#a3e635" strokeWidth="1.5" fill="rgba(163,230,53,0.15)" />
                              </svg>
                            </div>
                            <p className="rad-hcd-card-title">Your Lifetime Risk</p>
                          </div>
                          <p className="rad-hcd-lifetime-body">
                            A personalized estimate of how likely you are to develop significant heart disease during your lifetime — based on biology, imaging, genetics, and lifestyle data.
                          </p>
                          <div className="rad-hcd-lifetime-stats">
                            <div className="rad-hcd-ls-block">
                              <span className="rad-hcd-ls-label">10-Year Risk</span>
                              <span className="rad-hcd-ls-value">{tenYr}</span>
                            </div>
                            <div className="rad-hcd-ls-block">
                              <span className="rad-hcd-ls-label">Lifetime Risk</span>
                              <span className="rad-hcd-ls-value">{lifetimeRisk}</span>
                            </div>
                          </div>
                        </div>

                        {/* treatment plan */}
                        <div className="rad-hcd-plan-card">
                          <div className="rad-hcd-card-head">
                            <div className="rad-hcd-card-icon" style={{ background: `${color}22` }}>
                              <IonIcon icon={Icons.medical} style={{ color, fontSize: 18 }} />
                            </div>
                            <p className="rad-hcd-card-title">Treatment Plan</p>
                          </div>
                          <p className="rad-hcd-plan-title" style={{ color }}>{rd.planTitle}</p>
                          <p className="rad-hcd-plan-desc">{rd.planDesc}</p>
                          <div className="rad-hcd-plan-items">
                            {rd.planItems.map((item, j) => (
                              <div key={j} className="rad-hcd-plan-item">
                                <IonIcon icon={Icons.checkmark} className="rad-hcd-plan-check" style={{ color }} />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* why it works */}
                        <div className="rad-hcd-why-card">
                          <div className="rad-hcd-card-head">
                            <div className="rad-hcd-card-icon" style={{ background: 'rgba(163,230,53,0.1)' }}>
                              <IonIcon icon={Icons.shield} style={{ color: '#a3e635', fontSize: 18 }} />
                            </div>
                            <p className="rad-hcd-card-title">Why This Plan Works</p>
                          </div>
                          <p className="rad-hcd-why-desc">{rd.worksDesc}</p>
                          <div className="rad-hcd-plan-items">
                            {rd.worksItems.map((item, j) => (
                              <div key={j} className="rad-hcd-plan-item">
                                <IonIcon icon={Icons.checkmark} className="rad-hcd-plan-check" style={{ color: '#a3e635' }} />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
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
                onClick={() => { setPage(p); setExpanded(null); }}>{p}</button>
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
                  <IonIcon icon={Icons.arrowBack} /> Risk Assessment
                </button>
                <div>
                  <p className="section-eyebrow">My Dashboard</p>
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
