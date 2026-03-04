import { useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { mockDevices, dashboardMetrics } from '../../data/mock_wearables';
import { Icons } from '../../lib/icons';
import { useReveal } from '../../hooks/useScrollReveal';
import './WearablesDashboard.css';

// ── Full-width sparkline — stretches to card width ─────────────────
function CardSparkline({ points, color }: { points: number[]; color: string }) {
  const w = 300; const h = 72;
  const max = Math.max(...points); const min = Math.min(...points);
  const pad = 8;
  const xs = points.map((_, i) => pad + (i / (points.length - 1)) * (w - pad * 2));
  const ys = points.map(p => h - pad - ((p - min) / (max - min || 1)) * (h - pad * 2));
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  const fill = `${d} L${(w - pad).toFixed(1)},${h} L${pad},${h} Z`;
  const gid = `csg-${color.replace('#', '')}`;
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

// ── Dashboard metrics grid ─────────────────────────────────────────
const TIME_RANGES = ['Day', 'Week', 'Month', 'All'];

function MetricsGrid() {
  const [timeRange, setTimeRange] = useState('Week');
  const { ref, visible } = useReveal();

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

      <div className="wbd-metrics-grid">
        {dashboardMetrics.map(m => (
          <div key={m.id} className="wbd-metric-card"
            style={{ '--accent': m.color } as React.CSSProperties}>
            <div className="wbd-metric-body">
              <div className="wbd-metric-header">
                <span className="wbd-metric-dot" style={{ background: m.color }} />
                <span className="wbd-metric-label">{m.label}</span>
              </div>
              <div className="wbd-metric-value-row">
                <span className="wbd-metric-value">{m.value}</span>
                {m.unit && <span className="wbd-metric-unit">{m.unit}</span>}
              </div>
              <p className="wbd-metric-range">{timeRange} avg</p>
            </div>
            <div className="wbd-metric-chart">
              <CardSparkline points={m.trend} color={m.color} />
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
          <div className="hero-bg-grid hero-bg-grid--dark" />


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

              {/* device panel */}
              <DevicePanel />

              {/* metrics grid */}
              <MetricsGrid />

            </div>
          </div>

          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WearablesDashboardPage;
