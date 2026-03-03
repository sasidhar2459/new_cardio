import { useEffect, useRef, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Icons } from '../../lib/icons';
import {
  riskLevels, treatmentPlans, outcomeStats, whyItWorks,
  weightChartData, homaChartData, biomarkers,
  type BiomarkerStatus,
} from '../../data/mock_treatment';
import { useReveal } from '../../hooks/useScrollReveal';
import './TreatmentPage.css';

// ── SVG Line Chart ──────────────────────────────────────────────────
function LineChart({
  points, color, gradId, label, unit, animate,
}: {
  points: { month: string; value: number }[];
  color: string;
  gradId: string;
  label: string;
  unit: string;
  animate: boolean;
}) {
  const W = 480, H = 120, PAD = 12;
  const vals = points.map(p => p.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = max - min || 1;

  const xs = points.map((_, i) => PAD + (i / (points.length - 1)) * (W - PAD * 2));
  const ys = vals.map(v => PAD + ((max - v) / range) * (H - PAD * 2 - 24));

  const lineStr = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const fillStr = `${xs[0]},${H - 24} ` + lineStr + ` ${xs[xs.length - 1]},${H - 24}`;

  const first = vals[0], last = vals[vals.length - 1];
  const pct = Math.abs(((last - first) / first) * 100).toFixed(1);
  const down = last < first;

  // approximate total polyline length for dash animation
  const lineLen = 600;

  return (
    <div className="lchart-wrap">
      <div className="lchart-header">
        <div>
          <p className="lchart-label">{label}</p>
          <p className="lchart-value">{last} <span className="lchart-unit">{unit}</span></p>
        </div>
        <div className={`lchart-badge ${down ? 'lchart-badge--good' : 'lchart-badge--bad'}`}>
          {down ? '↓' : '↑'} {pct}%
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none" className="lchart-svg">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* grid */}
        {[0.25, 0.5, 0.75].map((t, i) => (
          <line key={i} x1={PAD} y1={PAD + t * (H - PAD * 2 - 24)} x2={W - PAD} y2={PAD + t * (H - PAD * 2 - 24)}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}

        {/* filled area — fades in after line draws */}
        <polygon
          points={fillStr}
          fill={`url(#${gradId})`}
          className={animate ? 'chart-fill-in' : 'chart-fill-hidden'}
        />

        {/* line — draws itself left to right */}
        <polyline
          points={lineStr}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={lineLen}
          strokeDashoffset={animate ? 0 : lineLen}
          className="chart-line"
        />

        {/* dots — pop in after line */}
        {xs.map((x, i) => (
          <circle
            key={i} cx={x} cy={ys[i]} r="4"
            fill={color} stroke="#151a16" strokeWidth="2"
            className={animate ? 'chart-dot-in' : 'chart-dot-hidden'}
            style={{ animationDelay: `${2.3 + i * 0.1}s` }}
          />
        ))}

        {/* month labels */}
        {points.map((p, i) => (
          <text key={i} x={xs[i]} y={H - 4} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.35)" fontFamily="Inter,sans-serif">
            {p.month}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ── Sparkline (tiny inline chart for biomarker cards) ───────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const W = 80, H = 32;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const xs = data.map((_, i) => (i / (data.length - 1)) * W);
  const ys = data.map(v => H - 4 - ((v - min) / range) * (H - 8));
  const lineStr = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <polyline points={lineStr} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3" fill={color} />
    </svg>
  );
}

const statusColor: Record<BiomarkerStatus, string> = {
  optimal: 'rgba(160, 230, 160, 0.9)',
  borderline: 'rgba(160, 230, 160, 0.9)',
  elevated: 'rgba(160, 230, 160, 0.9)',
};

// ── Hero ────────────────────────────────────────────────────────────
function TreatmentHero() {
  return (
    <section className="tx-hero">
      <div className="hero-bg-grid" />
      <div className="container">
        <div className="tx-hero-grid">
          <div className="tx-hero-left">
            <p className="section-eyebrow">Treatment</p>
            <h1 className="tx-hero-title">Your Heart.<br />Our Protocol.</h1>
            <p className="tx-hero-sub">
              A precision-driven, cardiologist-led program that identifies your true risk and builds a plan around you — not a generic template.
            </p>
            <div className="tx-hero-actions">
              <IonButton className="btn-white" shape="round" href="/signup">Start Your Assessment</IonButton>
              <IonButton className="btn-outline-white" shape="round" fill="outline" href="/contact">Talk to a Cardiologist</IonButton>
            </div>
          </div>
          <div className="tx-hero-right">
            <div className="tx-hero-image-wrap">
              <div className="tx-hero-image-inner" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Risk Classification ─────────────────────────────────────────────
function RiskSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="risk-section">
      <div className="container">
        <p className="section-eyebrow">Risk Classification</p>
        <h2 className="section-heading">Know Where You Stand</h2>
        <p className="section-sub">
          Every member starts with a comprehensive assessment. Your risk category shapes your entire care protocol.
        </p>
        <div ref={ref} className={`risk-grid ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          {riskLevels.map(level => (
            <div key={level.id} className="risk-card">
              <div className="risk-icon-wrap">
                <IonIcon icon={(Icons as any)[level.icon]} className="risk-icon" />
              </div>
              <h3 className="risk-label">{level.label}</h3>
              <p className="risk-desc">{level.description}</p>
              <ul className="risk-bullets">
                {level.bullets.map((b, i) => (
                  <li key={i}><span className="risk-bullet-dot" />{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Treatment Plans ─────────────────────────────────────────────────
function PlansSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="plans-section">
      <div className="container">
        <p className="section-eyebrow">Membership Plans</p>
        <h2 className="section-heading">Choose Your Protocol</h2>
        <div ref={ref} className={`plans-grid ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          {treatmentPlans.map(plan => (
            <div key={plan.id} className={`plan-card ${plan.highlight ? 'plan-card--highlight' : ''}`}>
              {plan.highlight && <div className="plan-badge">Most Popular</div>}
              <p className="plan-name">{plan.name}</p>
              <p className="plan-subtitle">{plan.subtitle}</p>
              <div className="plan-price">
                <span className="plan-price-val">{plan.price}</span>
                <span className="plan-price-period">{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <IonIcon icon={Icons.checkmark} className="plan-check" />
                    {f}
                  </li>
                ))}
              </ul>
              <IonButton
                className={plan.highlight ? 'btn-white' : 'btn-outline-white'}
                shape="round"
                fill={plan.highlight ? 'solid' : 'outline'}
                href="/signup"
                expand="block"
              >
                Get Started
              </IonButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why It Works ────────────────────────────────────────────────────
function WhySection() {
  const { ref, visible } = useReveal();
  return (
    <section className="why-section">
      <div className="container">
        <div ref={ref} className={`why-stack ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          <div className="why-intro">
            <p className="section-eyebrow">Why It Works</p>
            <h2 className="section-heading">Science + Personalization.</h2>
          </div>

          <div className="why-reasons">
            <div className="reasons-list">
              {whyItWorks.map((r, i) => (
                <div key={i} className="reason-item">
                  <span className="reason-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="reason-title">{r.title}</p>
                    <p className="reason-body">{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="why-outcomes">
            <p className="section-eyebrow">Outcomes</p>
            <h2 className="section-heading">Numbers that matter.</h2>
            <div className="stat-grid">
              {outcomeStats.map((s, i) => (
                <div key={i} className="stat-item">
                  <p className="stat-value">{s.value}</p>
                  <p className="stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Monitor Dashboard ───────────────────────────────────────────────
function MonitorSection() {
  const { ref, visible } = useReveal(0, 0.03);
  return (
    <section className="monitor-section">
      <div className="container">
        <p className="section-eyebrow">Live Monitoring</p>
        <h2 className="section-heading">Your Progress, Tracked.</h2>
        <p className="section-sub">
          Real patient data. Every enrolled member gets a live dashboard showing their biomarker trends over time.
        </p>

        <div ref={ref} className={`monitor-panel ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          {/* charts row */}
          <div className="monitor-charts">
            <div className="monitor-chart-card">
              <LineChart points={weightChartData} color="rgba(160,230,160,0.9)" gradId="grad-weight" label="Body Weight" unit="kg" animate={visible} />
            </div>
            <div className="monitor-chart-card">
              <LineChart points={homaChartData} color="#60a5fa" gradId="grad-homa" label="HOMA-IR Index" unit="" animate={visible} />
            </div>
          </div>

          {/* biomarker cards */}
          <div className="monitor-biomarkers">
            {biomarkers.map((bm, i) => {
              const col = statusColor[bm.status];
              return (
                <div key={i} className="biomarker-card">
                  <div className="biomarker-top">
                    <p className="biomarker-label">{bm.label}</p>
                    <span className="biomarker-status-pill" style={{ color: col, borderColor: col }}>
                      {bm.status}
                    </span>
                  </div>
                  <div className="biomarker-mid">
                    <div>
                      <p className="biomarker-value">{bm.value}</p>
                      <p className="biomarker-unit">{bm.unit}</p>
                    </div>
                    <Sparkline data={bm.sparkline} color={col} />
                  </div>
                  {/* gradient progress bar */}
                  <div className="biomarker-bar-track">
                    <div className="biomarker-bar-fill" style={{ background: col, width: bm.status === 'optimal' ? '30%' : bm.status === 'borderline' ? '60%' : '85%' }} />
                  </div>
                  <p className="biomarker-change">
                    {bm.change < 0 ? '↓' : '↑'} {Math.abs(bm.change)} from baseline
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Page ────────────────────────────────────────────────────────────
const TreatmentPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="treatment-page">
          <Navbar />
          <TreatmentHero />
          <RiskSection />
          <PlansSection />
          <WhySection />
          <MonitorSection />
          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TreatmentPage;
