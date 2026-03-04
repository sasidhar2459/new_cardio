import { useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { metricsDashboardCards, metricsHistory } from '../../data/mock_metrics';
import { Icons } from '../../lib/icons';
import { useReveal } from '../../hooks/useScrollReveal';
import './MetricsDashboard.css';

// ── Sparkline ──────────────────────────────────────────────────────
function CardSparkline({ points, color }: { points: number[]; color: string }) {
  const w = 300; const h = 72;
  const max = Math.max(...points); const min = Math.min(...points);
  const pad = 8;
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (w - pad * 2));
  const ys = points.map(p => h - pad - ((p - min) / (max - min || 1)) * (h - pad * 2));
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const fill = `${d} L${(w - pad).toFixed(1)},${h} L${pad},${h} Z`;
  const gid = `mdg-${color.replace('#', '')}`;
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

// ── Metrics grid ───────────────────────────────────────────────────
const TIME_RANGES = ['Day', 'Week', 'Month', 'All'];

function MetricsGrid() {
  const [timeRange, setTimeRange] = useState('Week');
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`mdd-metrics-section ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
      <div className="mdd-metrics-header">
        <h2 className="mdd-metrics-title">Your Health Metrics</h2>
        <div className="wb-time-tabs">
          {TIME_RANGES.map(r => (
            <button key={r}
              className={`wb-time-tab ${timeRange === r ? 'wb-time-tab-active' : ''}`}
              onClick={() => setTimeRange(r)}>{r}</button>
          ))}
        </div>
      </div>

      <div className="mdd-metrics-grid">
        {metricsDashboardCards.map(m => (
          <div key={m.id} className="mdd-metric-card" style={{ '--accent': m.color } as React.CSSProperties}>
            <div className="mdd-metric-body">
              <div className="mdd-metric-header">
                <span className="mdd-metric-dot" style={{ background: m.color }} />
                <span className="mdd-metric-label">{m.label}</span>
              </div>
              <div className="mdd-metric-value-row">
                <span className="mdd-metric-value">{m.value}</span>
                {m.unit && <span className="mdd-metric-unit">{m.unit}</span>}
              </div>
              <div className="mdd-metric-meta-row">
                <span className="mdd-metric-range">{timeRange} avg</span>
                <span className="mdd-metric-target">Target: {m.target}</span>
                <span className="mdd-metric-status" style={{ color: m.color }}>{m.status}</span>
              </div>
            </div>
            <div className="mdd-metric-chart">
              <CardSparkline points={m.trend} color={m.color} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── History table ──────────────────────────────────────────────────
function HistoryTable() {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`mdd-history-section ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
      <h2 className="mdd-history-title">Biomarker History</h2>
      <div className="mdd-history-table">
        <div className="mdd-history-head">
          <span>Period</span>
          <span>ApoB (mg/dL)</span>
          <span>hs-CRP (mg/L)</span>
          <span>Systolic BP</span>
          <span>VO₂ Max</span>
          <span>Body Fat %</span>
          <span>Resting HR</span>
        </div>
        {metricsHistory.map((row, i) => (
          <div key={i} className="mdd-history-row">
            <span>{row.date}</span>
            <span>{row.apob}</span>
            <span>{row.crp}</span>
            <span>{row.sbp} mmHg</span>
            <span>{row.vo2} ml/kg</span>
            <span>{row.bodyFat}%</span>
            <span>{row.rhr} bpm</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
const MetricsDashboardPage: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="mdd-page">
          <Navbar />
          <div className="hero-bg-grid hero-bg-grid--dark" />

          <div className="mdd-main">
            <div className="container">
              <div className="mdd-page-header">
                <button className="mdd-back-btn" onClick={() => history.push('/metrics')}>
                  <IonIcon icon={Icons.arrowBack} /> Metrics
                </button>
                <div>
                  <p className="section-eyebrow">My Dashboard</p>
                  <h1 className="mdd-page-title">Your Biomarker Data</h1>
                </div>
              </div>

              <MetricsGrid />
              <HistoryTable />
            </div>
          </div>
          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MetricsDashboardPage;
