import { useEffect, useRef, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
  baselineItems,
  progressMetrics,
  keyMetrics,
  populationStats,
} from '../../data/mock_metrics';
import { Icons } from '../../lib/icons';
import { useReveal } from '../../hooks/useScrollReveal';
import './MetricsPage.css';

// preview pills shown after "loading"
const MET_PILLS = [
  { label: 'ApoB',        value: '82 mg/dL',  color: '#a855f7' },
  { label: 'Systolic BP', value: '118 mmHg',  color: '#ef4444' },
  { label: 'VO₂ Max',    value: '48 ml/kg',   color: '#10b981' },
];

// ── Hero ─────────────────────────────────────────────────────────────
function MetricsHero() {
  const [cardState, setCardState] = useState<'idle' | 'loading' | 'ready'>('idle');

  function handleLoad() {
    setCardState('loading');
    setTimeout(() => setCardState('ready'), 2800);
  }

  return (
    <section className="met-hero">
      <div className="hero-bg-grid" />
      <div className="container">
        <div className="met-hero-grid">
          <div className="met-hero-left">
            <p className="section-eyebrow">Metrics</p>
            <h1 className="met-hero-title">Data That<br />Drives Results.</h1>
            <p className="met-hero-sub">
              Bypass tracks the biomarkers that actually predict cardiac events — not vanity numbers. Every metric is colour-coded, quantifiable, and tied to outcomes.
            </p>
            <IonButton className="btn-white" shape="round" href="/risk-assessment/form">
              Start Your Assessment
            </IonButton>
          </div>

          {/* right — interactive metrics preview card */}
          <div className="met-hero-right">
            <div className={`met-hero-card ${cardState === 'ready' ? 'met-hero-card--ready' : ''}`}>
              <p className="section-eyebrow">Your Biomarkers</p>

              {/* idle */}
              {cardState === 'idle' && (
                <>
                  <h2 className="met-hero-card-title">See Your Key<br />Metrics Live.</h2>
                  <p className="met-hero-card-sub">
                    Every biomarker that actually predicts cardiac events — tracked continuously, colour-coded, actionable.
                  </p>
                  <button className="met-hero-load-btn" onClick={handleLoad}>
                    <span className="met-hlb-bg" />
                    <IonIcon icon={Icons.barChart} className="met-hlb-icon" />
                    <span className="met-hlb-label">Preview My Metrics</span>
                  </button>
                </>
              )}

              {/* loading — animated bars */}
              {cardState === 'loading' && (
                <div className="met-hero-loading">
                  <div className="met-bar-anim">
                    {[0.4, 0.65, 0.5, 0.8, 0.55].map((h, i) => (
                      <div key={i} className="met-bar-col" style={{ '--bar-h': h, '--bar-delay': `${i * 0.12}s` } as React.CSSProperties} />
                    ))}
                  </div>
                  <p className="met-hero-loading-label">Loading Metrics…</p>
                  <div className="wb-scan-dots"><span /><span /><span /></div>
                </div>
              )}

              {/* ready */}
              {cardState === 'ready' && (
                <>
                  <div className="met-hero-ready-row">
                    <span className="met-hero-ready-dot" />
                    <span className="met-hero-ready-text">Live Data — 6 metrics tracked</span>
                  </div>
                  <div className="ra-hero-pills">
                    {MET_PILLS.map(p => (
                      <div key={p.label} className="wb-hero-pill" style={{ borderColor: `${p.color}33` }}>
                        <span className="wb-hero-pill-dot" style={{ background: p.color }} />
                        <span className="wb-hero-pill-label">{p.label}</span>
                        <span className="wb-hero-pill-value" style={{ color: p.color }}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                  <IonButton className="btn-green" shape="round" href="/metrics/dashboard">
                    <IonIcon slot="start" icon={Icons.arrowForward} />
                    View My Dashboard
                  </IonButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Baseline Section ──────────────────────────────────────────────────
function BaselineSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="met-baseline-section">
      <div className="container">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Where It Starts</p>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>Your Heart Health Starting Line</h2>
        <p className="met-section-sub">
          Your journey begins with a deep baseline evaluation. We don't guess — we measure everything that matters from day one.
        </p>

        <div ref={ref} className={`met-baseline-row ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          {baselineItems.map((item, i) => (
            <div key={i} className="met-baseline-pill">
              <span className="met-baseline-pill-dot" />
              {item}
            </div>
          ))}
        </div>

        <div className="met-baseline-footer">
          <span className="met-badge-pulse" />
          <span className="met-badge-text">This becomes your personalised <strong>"Heart Health Starting Line"</strong> — the benchmark everything else is measured against.</span>
        </div>
      </div>
    </section>
  );
}

// animated counter hook
function useCounter(target: number, active: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

// stat items — before/after + direction + detail panel
const progressStats = [
  {
    label: 'ApoB', before: 112, after: 71, unit: 'mg/dL', direction: 'down' as const, change: '−37%',
    detail: {
      what: 'ApoB is the protein carried by LDL particles — the primary driver of plaque formation in arterial walls.',
      why: 'Every LDL particle that penetrates an artery carries one ApoB molecule. Lowering ApoB directly reduces plaque burden.',
      target: '< 80 mg/dL',
      status: 'Optimal',
      protocol: ['Statin therapy titrated to target', 'Dietary saturated fat < 7% of calories', 'Monthly monitoring'],
    },
  },
  {
    label: 'hs-CRP', before: 4.8, after: 1.2, unit: 'mg/L', direction: 'down' as const, change: '−75%',
    detail: {
      what: 'High-sensitivity CRP measures systemic inflammation — a key accelerant of plaque rupture and cardiac events.',
      why: 'Elevated hs-CRP doubles heart attack risk independent of cholesterol levels.',
      target: '< 1.0 mg/L',
      status: 'Near optimal',
      protocol: ['Anti-inflammatory diet (Mediterranean)', 'Omega-3 supplementation 2–4g/day', 'Quarterly review'],
    },
  },
  {
    label: 'Systolic BP', before: 148, after: 118, unit: 'mmHg', direction: 'down' as const, change: '−20pt',
    detail: {
      what: 'Systolic blood pressure is the peak force your heart exerts on arterial walls with each beat.',
      why: 'Every 10 mmHg reduction in systolic BP cuts stroke risk by ~35% and heart attack risk by ~25%.',
      target: '< 120 mmHg',
      status: 'Normal',
      protocol: ['ACE inhibitor as prescribed', 'Sodium restriction < 2g/day', 'Weekly home monitoring'],
    },
  },
  {
    label: 'VO₂ Max', before: 34, after: 48, unit: 'ml/kg/min', direction: 'up' as const, change: '+41%',
    detail: {
      what: 'VO₂ max is the maximum oxygen your body can use during exercise — your cardiovascular engine capacity.',
      why: 'Low VO₂ max is a stronger predictor of death than smoking, hypertension, or diabetes.',
      target: '> 45 ml/kg/min',
      status: 'Good',
      protocol: ['Zone 2 cardio 4× per week (45 min)', 'VO₂ max intervals 1× per week', 'Annual CPET reassessment'],
    },
  },
  {
    label: 'Body Fat', before: 28, after: 19, unit: '%', direction: 'down' as const, change: '−9pt',
    detail: {
      what: 'Visceral body fat percentage — particularly abdominal fat — drives insulin resistance and systemic inflammation.',
      why: 'Each 5% reduction in body fat improves insulin sensitivity by ~30% and lowers CRP significantly.',
      target: '< 20% (men) / < 28% (women)',
      status: 'Healthy',
      protocol: ['Caloric deficit 300–500 kcal/day', 'Resistance training 3× per week', 'DEXA scan every 6 months'],
    },
  },
  {
    label: 'Resting HR', before: 82, after: 61, unit: 'bpm', direction: 'down' as const, change: '−26%',
    detail: {
      what: 'Resting heart rate reflects cardiac efficiency — how hard your heart works at rest.',
      why: 'A resting HR above 80 bpm is associated with 45% higher cardiovascular mortality vs. < 60 bpm.',
      target: '< 65 bpm',
      status: 'Optimal',
      protocol: ['Aerobic conditioning programme', 'Stress reduction (HRV biofeedback)', 'Daily wearable tracking'],
    },
  },
  {
    label: 'Sleep Quality', before: 58, after: 87, unit: '%', direction: 'up' as const, change: '+50%',
    detail: {
      what: 'Sleep quality score based on deep sleep %, sleep continuity, and HRV recovery overnight.',
      why: 'Poor sleep raises cortisol, increases blood pressure, and impairs glucose metabolism — all cardiac risk factors.',
      target: '> 80% quality score',
      status: 'Good',
      protocol: ['Consistent sleep/wake schedule', 'No screens 60 min before bed', 'Sleep study if apnea suspected'],
    },
  },
];

// ── Progress Section ──────────────────────────────────────────────────
// ticker that cycles through each stat, showing one big focused number at a time
function ProgressSection() {
  const { ref, visible } = useReveal();
  const [active, setActive] = useState(0);
  const val = useCounter(Math.round(progressStats[active].after), visible, 900);

  // auto-rotate every 2.8s
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setActive(a => (a + 1) % progressStats.length), 2800);
    return () => clearInterval(id);
  }, [visible]);

  const stat = progressStats[active];
  const isUp = stat.direction === 'up';

  return (
    <section className="met-progress-section">
      <div className="container">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Live Tracking</p>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>How You're Progressing</h2>
        <p className="met-section-sub">
          Real, measurable changes — not vague improvements. Quantifiable cardiac outcomes tracked continuously.
        </p>

        <div ref={ref} className={`met-prog-shell ${visible ? 'reveal-in' : 'reveal-hidden'}`}>

          {/* col 1 — metric list */}
          <div className="met-prog-list">
            {progressStats.map((s, i) => (
              <button
                key={i}
                className={`met-prog-item ${i === active ? 'met-prog-item--active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="met-prog-item-dot" />
                <span className="met-prog-item-name">{s.label}</span>
                <span className="met-prog-item-change">{s.change}</span>
              </button>
            ))}
          </div>

          {/* col 2 — big number spotlight */}
          <div className="met-prog-spotlight">
            <div className="met-prog-glow" />

            <div className="met-prog-before-row">
              <span className="met-prog-before-val">{stat.before}</span>
              <span className="met-prog-before-unit">{stat.unit}</span>
              <span className="met-prog-before-label">before</span>
            </div>

            <div className="met-prog-arrow-row">
              <span className={`met-prog-big-arrow ${isUp ? 'met-prog-big-arrow--up' : 'met-prog-big-arrow--down'}`}>
                {isUp ? '↑' : '↓'}
              </span>
            </div>

            <div className="met-prog-after-row">
              <span className="met-prog-big-val">{val}</span>
              <div className="met-prog-after-right">
                <span className="met-prog-big-unit">{stat.unit}</span>
                <span className="met-prog-big-label">{stat.label}</span>
              </div>
            </div>

            <div className={`met-prog-change-pill ${isUp ? 'met-prog-change-pill--up' : 'met-prog-change-pill--down'}`}>
              {stat.change} vs baseline
            </div>

            <div className="met-prog-dots">
              {progressStats.map((_, i) => (
                <span key={i} className={`met-prog-dot ${i === active ? 'met-prog-dot--on' : ''}`} onClick={() => setActive(i)} />
              ))}
            </div>
          </div>

          {/* col 3 — details panel */}
          <div className="met-prog-detail">
            <p className="met-prog-detail-eyebrow">Details</p>

            <p className="met-prog-detail-what">{stat.detail.what}</p>
            <p className="met-prog-detail-why">{stat.detail.why}</p>

            <div className="met-prog-detail-row">
              <div className="met-prog-detail-stat">
                <span className="met-prog-ds-label">Target</span>
                <span className="met-prog-ds-val">{stat.detail.target}</span>
              </div>
              <div className="met-prog-detail-stat">
                <span className="met-prog-ds-label">Status</span>
                <span className="met-prog-ds-val met-prog-ds-val--green">{stat.detail.status}</span>
              </div>
            </div>

            <div className="met-prog-detail-protocol">
              <p className="met-prog-dp-title">Protocol</p>
              {stat.detail.protocol.map((p, i) => (
                <div key={i} className="met-prog-dp-item">
                  <span className="met-prog-dp-dot" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// mock values shown on each phone card — swap to real data in Phase 2
const phoneCards = [
  { title: 'LDL & ApoB',       value: '82',   unit: 'mg/dL',  sub: 'ApoB',        trend: [38,52,45,30,22,18,12] },
  { title: 'Inflammation',      value: '1.2',  unit: 'mg/L',   sub: 'hs-CRP',      trend: [60,55,48,40,32,25,18] },
  { title: 'Blood Pressure',    value: '118',  unit: 'mmHg',   sub: 'Systolic',    trend: [70,65,58,52,46,40,35] },
  { title: 'VO₂ Max',          value: '48',   unit: 'ml/kg',  sub: 'Cardio fit',  trend: [20,28,34,40,44,46,48] },
  { title: 'Glucose & HbA1c',  value: '5.2',  unit: '%',      sub: 'HbA1c',       trend: [55,50,46,42,38,35,32] },
  { title: 'HRV',               value: '64',   unit: 'ms',     sub: 'Heart rate V',trend: [30,36,42,48,54,60,64] },
  { title: 'Sleep Quality',     value: '87',   unit: '%',      sub: 'Recovery',    trend: [40,48,55,62,68,74,80] },
  { title: 'Body Fat',          value: '18.4', unit: '%',      sub: 'Composition', trend: [65,60,54,48,42,36,30] },
  { title: 'Steps',             value: '9,240',unit: '/day',   sub: 'Activity',    trend: [30,40,50,58,65,72,78] },
  { title: 'Risk Level',        value: 'Low',  unit: '',       sub: 'RISK LEVEL',  trend: [80,70,60,48,36,25,15] },
];

// tiny SVG sparkline inside each phone card
function Sparkline({ points }: { points: number[] }) {
  const w = 160; const h = 60;
  const max = Math.max(...points); const min = Math.min(...points);
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(p => h - ((p - min) / (max - min || 1)) * h * 0.8 - h * 0.1);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="met-sparkline">
      <path d={d} fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3" fill="#fff" />
      ))}
      {/* dashed verticals */}
      {xs.map((x, i) => (
        <line key={i} x1={x} y1={ys[i]} x2={x} y2={h} stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3,3" />
      ))}
    </svg>
  );
}

// ── Key Metrics Section ───────────────────────────────────────────────
function KeyMetricsSection() {
  // duplicate cards for seamless loop
  const all = [...phoneCards, ...phoneCards];
  return (
    <section className="met-key-section">
      <div className="container">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>What We Track</p>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>Your Key Metrics</h2>
        <p className="met-section-sub">
          Bypass tracks the markers that genuinely move the needle. Every metric is colour-coded — clearly showing when you're improving, stable, or need attention.
        </p>
      </div>

      {/* full-width scroll strip — no container constraint */}
      <div className="met-carousel-outer">
        <div className="met-carousel-track">
          {all.map((card, i) => (
            <div key={i} className="met-phone-card">
              <div className="met-phone-inner">
                <p className="met-phone-title">{card.title}</p>
                <div className="met-phone-value-row">
                  <span className="met-phone-value">{card.value}</span>
                  {card.unit && <span className="met-phone-unit">{card.unit}</span>}
                </div>
                <p className="met-phone-sub">{card.sub}</p>
                <div className="met-phone-chart">
                  <Sparkline points={card.trend} />
                </div>
                <div className="met-phone-dates">
                  {['Jan 20','Jun 29','Oct 03','Jan 03'].map((d,j) => (
                    <span key={j}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Population Insights Section ───────────────────────────────────────
function PopulationSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="met-pop-section">
      <div className="container">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Population-Level Insights</p>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>See How You Compare</h2>
        <p className="met-section-sub">
          See how you compare with others in your age group — and how Bypass members progress over time. You're not alone. You're part of a measurable health movement.
        </p>

        <div ref={ref} className={`met-pop-grid ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          {populationStats.map((s, i) => (
            <div key={i} className="met-pop-card">
              <span className="met-pop-value">{s.value}</span>
              <span className="met-pop-label">{s.label}</span>
            </div>
          ))}
        </div>

        <p className="met-pop-footer">
          You're not alone. You're part of a measurable health movement.
        </p>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────
function CTASection() {
  const { ref, visible } = useReveal();
  return (
    <section className="met-cta-section">
      <div className="container">
        <div ref={ref} className={`met-cta-card ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          <p className="section-eyebrow">Take Action</p>
          <h2 className="met-cta-title">Start tracking what<br />actually matters.</h2>
          <p className="met-cta-sub">Complete your baseline assessment in under 5 minutes.</p>
          <IonButton className="btn-white" shape="round" href="/risk-assessment/form">
            Begin Assessment
          </IonButton>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────
const MetricsPage: React.FC = () => (
  <IonPage>
    <IonContent fullscreen scrollY>
      <div className="met-page">
        <Navbar />
        <MetricsHero />
        <BaselineSection />
        <ProgressSection />
        <KeyMetricsSection />
        <PopulationSection />
        <CTASection />
        <Footer />
      </div>
    </IonContent>
  </IonPage>
);

export default MetricsPage;
