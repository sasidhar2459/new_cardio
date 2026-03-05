import { useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { mockDevices, dashboardMetrics } from '../../data/mock_wearables';
import { Icons } from '../../lib/icons';
import { useReveal } from '../../hooks/useScrollReveal';
import { useTheme } from '../../hooks/useTheme';
import './WearablesDashboard.css';

// ── Full-width sparkline — stretches to card width ─────────────────
function CardSparkline({ points, color, isLight }: { points: number[]; color: string; isLight: boolean }) {
  const w = 300; const h = 72;
  const max = Math.max(...points); const min = Math.min(...points);
  const pad = 8;
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (w - pad * 2));
  const ys = points.map(p => h - pad - ((p - min) / (max - min || 1)) * (h - pad * 2));
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const fill = `${d} L${(w - pad).toFixed(1)},${h} L${pad},${h} Z`;
  const gid = `csg-${color.replace('#', '')}-${isLight ? 'light' : 'dark'}`;
  const guideColor = isLight ? 'rgba(15,23,42,0.14)' : 'rgba(255,255,255,0.12)';
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '72px', display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={isLight ? '0.32' : '0.25'} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={pad} y1={h - 1} x2={w - pad} y2={h - 1} stroke={guideColor} strokeWidth="1" />
      <line x1={pad} y1={Math.round(h * 0.55)} x2={w - pad} y2={Math.round(h * 0.55)} stroke={guideColor} strokeWidth="1" strokeDasharray="3 4" />
      <path d={fill} fill={`url(#${gid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="5" fill={color} stroke={isLight ? '#ffffff' : '#0b0f0d'} strokeWidth="2" />
    </svg>
  );
}

// ── Device Panel ───────────────────────────────────────────────────
type DeviceState = 'idle' | 'scanning' | 'found' | 'connected';

function DevicePanel() {
  const [state, setState] = useState<DeviceState>('idle');
  const [connectedDevice, setConnectedDevice] = useState<typeof mockDevices[0] | null>(null);
  const [page, setPage] = useState(0);
  const perPage = 4;
  const totalPages = Math.ceil(mockDevices.length / perPage);
  const visible = mockDevices.slice(page * perPage, page * perPage + perPage);

  function startScan() {
    setState('scanning');
    setTimeout(() => setState('found'), 2500);
  }

  function connect(d: typeof mockDevices[0]) { setConnectedDevice(d); setState('connected'); }
  function disconnect() { setConnectedDevice(null); setState('idle'); }

  function batteryIcon(pct: number) {
    if (pct > 60) return Icons.batteryFull;
    if (pct > 25) return Icons.batteryHalf;
    return Icons.batteryDead;
  }

  const stateLabel =
    state === 'connected' ? 'Live Sync' :
    state === 'scanning' ? 'Scanning' :
    state === 'found' ? 'Devices Found' :
    'Not Connected';

  return (
    <div className="wbd-device-panel">
      <div className="wbd-panel-header">
        <IonIcon icon={Icons.bluetooth} className="wbd-panel-header-icon" />
        <div>
          <p className="wbd-panel-title">Connected Device</p>
          <p className="wbd-panel-sub">
            {state === 'connected' && connectedDevice
              ? `${connectedDevice.name} — ${connectedDevice.battery}% battery`
              : 'No device paired'}
          </p>
        </div>
        <span className={`wbd-state-pill wbd-state-${state}`}>{stateLabel}</span>
        {state !== 'connected' && (
          <IonButton className="btn-green-sm" shape="round" size="small" onClick={startScan}
            disabled={state === 'scanning'}>
            {state === 'scanning' ? 'Scanning…' : 'Connect'}
          </IonButton>
        )}
        {state === 'connected' && (
          <button className="wbd-disconnect-btn" onClick={disconnect}>
            <IonIcon icon={Icons.linkOff} /> Disconnect
          </button>
        )}
      </div>

      {/* scanning rings */}
      {state === 'scanning' && (
        <div className="wbd-scanning-row">
          <div className="wb-scan-rings">
            <div className="wb-scan-ring wb-scan-ring-outer" />
            <div className="wb-scan-ring wb-scan-ring-mid" />
            <div className="wb-scan-ring wb-scan-ring-inner">
              <IonIcon icon={Icons.bluetooth} className="wb-scan-bt-icon" />
            </div>
          </div>
          <div className="wb-scan-dots"><span /><span /><span /></div>
        </div>
      )}

      {/* device list */}
      {state === 'found' && (
        <div className="wbd-device-list-wrap">
          <p className="wbd-found-label">{mockDevices.length} devices found — tap to connect</p>
          <div className="wbd-device-list">
            {visible.map(d => (
              <button key={d.id} className="wbd-device-item" onClick={() => connect(d)}>
                <div className="wbd-device-item-icon"><IonIcon icon={Icons.watch} /></div>
                <div className="wbd-device-item-info">
                  <span className="wbd-device-item-name">{d.name}</span>
                  <span className="wbd-device-item-type">{d.type}</span>
                </div>
                <div className="wbd-device-item-battery">
                  <IonIcon icon={batteryIcon(d.battery)} />
                  <span>{d.battery}%</span>
                </div>
              </button>
            ))}
          </div>
          <div className="wb-pagination">
            <button className="wb-page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span className="wb-page-num">{page + 1} / {totalPages}</span>
            <button className="wb-page-btn" disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
          <button className="wb-rescan-btn" onClick={startScan}>
            <IonIcon icon={Icons.refresh} /> Search Again
          </button>
        </div>
      )}
    </div>
  );
}

function ReadinessCard() {
  return (
    <div className="wbd-readiness-card">
      <p className="wbd-readiness-label">Daily Readiness</p>
      <div className="wbd-readiness-row">
        <div className="wbd-readiness-ring">
          <span>82</span>
        </div>
        <div className="wbd-readiness-copy">
          <p className="wbd-readiness-title">Good Recovery Window</p>
          <p className="wbd-readiness-sub">Sleep, resting HR, and HRV suggest moderate training intensity today.</p>
        </div>
      </div>
      <div className="wbd-readiness-tags">
        <span>Sleep +7%</span>
        <span>HRV Stable</span>
        <span>Stress Low</span>
      </div>
    </div>
  );
}

// ── Dashboard metrics grid ─────────────────────────────────────────
const TIME_RANGES = ['Day', 'Week', 'Month', 'All'];

function MetricsGrid() {
  const [timeRange, setTimeRange] = useState('Week');
  const { ref, visible } = useReveal();
  const { theme } = useTheme();
  const featuredMetric = dashboardMetrics[0];
  const restMetrics = dashboardMetrics.slice(1);
  const metricIcon = (iconName: string) => Icons[iconName as keyof typeof Icons] || Icons.analytics;

  return (
    <div ref={ref} className={`wbd-metrics-section ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
      <div className="wbd-metrics-header">
        <h2 className="wbd-metrics-title">Your Health at a Glance</h2>
        <div className="wb-time-tabs">
          {TIME_RANGES.map(r => (
            <button key={r}
              className={`wb-time-tab ${timeRange === r ? 'wb-time-tab-active' : ''}`}
              onClick={() => setTimeRange(r)}>{r}</button>
          ))}
        </div>
      </div>

      <div className="wbd-featured-card" style={{ '--accent': featuredMetric.color } as React.CSSProperties}>
        <div className="wbd-featured-left">
          <p className="wbd-featured-label">Featured Metric</p>
          <h3 className="wbd-featured-title">{featuredMetric.label}</h3>
          <div className="wbd-featured-value-row">
            <span className="wbd-featured-value">{featuredMetric.value}</span>
            {featuredMetric.unit && <span className="wbd-featured-unit">{featuredMetric.unit}</span>}
          </div>
          <p className="wbd-featured-desc">{timeRange} trend shows stable rhythm with mild variance in late evenings.</p>
        </div>
        <div className="wbd-featured-right">
          <CardSparkline points={featuredMetric.trend} color={featuredMetric.color} isLight={theme === 'light'} />
        </div>
      </div>

      <div className="wbd-metrics-grid">
        {restMetrics.map(m => (
          <div key={m.id} className="wbd-metric-card" style={{ '--accent': m.color } as React.CSSProperties}>
            <div className="wbd-metric-body">
              <div className="wbd-metric-header">
                <IonIcon icon={metricIcon(m.icon)} className="wbd-metric-icon" />
                <span className="wbd-metric-label">{m.label}</span>
              </div>
              <div className="wbd-metric-value-row">
                <span className="wbd-metric-value">{m.value}</span>
                {m.unit && <span className="wbd-metric-unit">{m.unit}</span>}
              </div>
              <p className="wbd-metric-range">{timeRange} avg</p>
            </div>
            <div className="wbd-metric-chart">
              <CardSparkline points={m.trend} color={m.color} isLight={theme === 'light'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────
const WearablesDashboardPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="wbd-page">
          <Navbar />
          <div className="hero-bg-grid" />


          <div className="wbd-main">
            <div className="container">

              {/* page header */}
              <div className="wbd-page-header">
                <button className="wbd-back-btn" onClick={() => history.push('/wearables')}>
                  <IonIcon icon={Icons.arrowBack} /> Wearables
                </button>
                <div>
                  <p className="section-eyebrow">My Dashboard</p>
                  <h1 className="wbd-page-title">Your Wearable Data</h1>
                </div>
              </div>

              <section className="wbd-command-deck">
                <div className="wbd-command-copy">
                  <p className="wbd-command-kicker">Watch Intelligence Layer</p>
                  <h2 className="wbd-command-title">A live command center for your wearable signals.</h2>
                  <p className="wbd-command-sub">Track rhythm, movement, recovery and adherence in one continuous flow.</p>
                </div>
                <div className="wbd-command-gauges">
                  <div className="wbd-gauge-pill"><span>Sync Quality</span><strong>98%</strong></div>
                  <div className="wbd-gauge-pill"><span>Wear Time</span><strong>21h</strong></div>
                  <div className="wbd-gauge-pill"><span>Alerts</span><strong>2</strong></div>
                </div>
              </section>

              <div className="wbd-layout-grid">
                <aside className="wbd-left-rail">
                  {/* device panel */}
                  <DevicePanel />
                  <ReadinessCard />
                </aside>

                <section className="wbd-right-board">
                  {/* metrics grid */}
                  <MetricsGrid />
                </section>
              </div>

            </div>
          </div>

          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WearablesDashboardPage;
