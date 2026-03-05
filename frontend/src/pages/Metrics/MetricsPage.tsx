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

// ── Hero ─────────────────────────────────────────────────────────────
function MetricsHero() {
  const heroImage = '/ai-art/data-that-drives-health.png';
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAutoFlipping, setIsAutoFlipping] = useState(false);
  const flipRef = useRef<HTMLDivElement | null>(null);
  const hasAutoFlipPlayedRef = useRef(false);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    const node = flipRef.current;
    if (!node || hasAutoFlipPlayedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || hasAutoFlipPlayedRef.current) return;

          hasAutoFlipPlayedRef.current = true;
          setIsAutoFlipping(true);

          timersRef.current.push(setTimeout(() => setIsFlipped(true), 220));
          timersRef.current.push(setTimeout(() => setIsFlipped(false), 2100));
          timersRef.current.push(setTimeout(() => setIsAutoFlipping(false), 3300));

          observer.disconnect();
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    };
  }, []);

  function toggleFlip() {
    setIsFlipped((v) => !v);
  }

  return (
    <section className="met-hero">
      <div className="container">
        <div className="met-hero-grid">
          <div className="met-hero-left">
            <p className="section-eyebrow">Metrics</p>
            <h1 className="met-hero-title">Data That<br />Drives <span className="met-hero-accent">Results.</span></h1>
            <p className="met-hero-sub">
              Bypass tracks the biomarkers that actually predict cardiac events — not vanity numbers. Every metric is colour-coded, quantifiable, and tied to outcomes.
            </p>
            <IonButton className="btn-white" shape="round" href="/risk-assessment/form">
              Start Your Assessment
            </IonButton>
          </div>

          {/* right — flip card matching RA hero */}
          <div className="met-hero-right">
            <div
              ref={flipRef}
              className={`met-hero-flip ${isFlipped ? 'is-flipped' : ''} ${isAutoFlipping ? 'is-auto-flipping' : ''}`}
              tabIndex={0}
              aria-label="Metrics card flip"
              onMouseEnter={() => { if (!isAutoFlipping) setIsFlipped(true); }}
              onMouseLeave={() => { if (!isAutoFlipping) setIsFlipped(false); }}
              onClick={toggleFlip}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleFlip();
                }
              }}
            >
              <div className="met-hero-flip-inner">
                <div className="met-hero-face met-hero-face--front">
                  <img src={heroImage} alt="Metrics" className="met-hero-face-img" />
                  <div className="met-hero-flip-hint" aria-hidden="true">
                    <span>Hover or Tap to Flip</span>
                    <IonIcon icon={Icons.arrowForward} className="met-hero-flip-hint-icon" />
                  </div>
                </div>
   <div className="ra-hero-face ra-hero-face--back ra-hero-card">
                  <p className="section-eyebrow">Your Biomarkers</p>
                  <h2 className="ra-hero-card-title">See Your Key<br />Metrics Live.</h2>
                  <p className="ra-hero-card-sub">
                    Every biomarker that actually predicts cardiac events — tracked continuously, colour-coded, and actionable.
                  </p>
                  <div className="ra-hero-card-btns">
                    <button className="ra-hero-scan-btn" onClick={() => window.location.href = '/metrics/dashboard'}>
                      <span className="ra-hsb-bg" />
                      <IonIcon icon={Icons.analytics} className="ra-hsb-icon" />
                      <span className="ra-hsb-label">Metrics Dashboard</span>
                    </button>   <IonButton className="btn-white" shape="round" href="/risk-assessment/form">
                      Take Assessment
                    </IonButton>
                 
                  </div>
                </div>
                {/* <div className="met-hero-face met-hero-face--back met-hero-card">
                  <p className="section-eyebrow"></p>
                  <h2 className="met-hero-card-title"></h2>
                  <p className="met-hero-card-sub">
                  </p>
                  <div className="met-hero-card-btns">
                    <button className="met-hero-dash-btn" onClick={() => window.location.href = }>
                      <span className="met-hdb-bg" />
                      <IonIcon icon={Icons.barChart} className="met-hdb-icon" />
                      <span className="met-hdb-label">Metrics Dashboard</span>
                    </button>
                    <IonButton className="btn-white" shape="round" href="/risk-assessment/form">
                      Start Assessment
                    </IonButton>
                  </div>
                </div> */}
              </div>
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

// looping cards for metrics marquee — static for now, API can replace in Phase 2
const loopMetricCards = [
  {
    title: 'LDL & ApoB',
    value: '82',
    unit: 'mg/dL',
    sub: 'ApoB',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Lab lipid profile report used to track LDL and ApoB',
  },
  {
    title: 'Inflammation',
    value: '1.2',
    unit: 'mg/L',
    sub: 'HS-CRP',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Clinician reviewing inflammation marker trends on a dashboard',
  },
  {
    title: 'Blood Pressure',
    value: '118',
    unit: 'mmHg',
    sub: 'Systolic',
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Blood pressure cuff and monitoring setup',
  },
  {
    title: 'VO2 Max',
    value: '48',
    unit: 'ml/kg',
    sub: 'Cardio Fit',
    image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Cardio performance assessment and endurance training session',
  },
  {
    title: 'Glucose & HbA1c',
    value: '5.2',
    unit: '%',
    sub: 'HbA1c',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Blood glucose measurement for long-term metabolic tracking',
  },
  {
    title: 'HRV',
    value: '64',
    unit: 'ms',
    sub: 'Heart Rate V',
    image: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Wearable device displaying heart rhythm and variability data',
  },
  {
    title: 'Sleep Quality',
    value: '87',
    unit: '%',
    sub: 'Recovery',
    image: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Sleep tracking interface showing nightly recovery quality',
  },
  {
    title: 'Body Fat',
    value: '18.4',
    unit: '%',
    sub: 'Composition',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Body composition assessment in a fitness lab environment',
  },
  {
    title: 'Steps',
    value: '9,240',
    unit: '/day',
    sub: 'Activity',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Walking activity used for daily step and mobility tracking',
  },
  {
    title: 'Risk Level',
    value: 'Low',
    unit: '',
    sub: 'Risk Profile',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Clinical risk profile dashboard with decision markers',
  },
];

// ── Key Metrics Section ───────────────────────────────────────────────
function KeyMetricsSection() {
  // duplicate cards for seamless loop
  const all = [...loopMetricCards, ...loopMetricCards];
  return (
    <section className="met-key-section">
      <div className="container">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>What We Track</p>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>Your Key Metrics</h2>
        <p className="met-section-sub">
          Bypass tracks the markers that genuinely move the needle. Every metric is colour-coded — clearly showing when you're improving, stable, or need attention.
        </p>
      </div>

      {/* full-width scroll strip */}
      <div className="met-loop-wrap">
        <div className="met-loop-track met-loop-left">
          {all.map((card, i) => (
            <article key={i} className="met-loop-card">
              <div className="met-loop-card-media">
                <img src={card.image} alt={card.imageAlt} loading="lazy" />
              </div>
              <div className="met-loop-card-content">
                <p className="met-loop-title">{card.title}</p>
                <div className="met-loop-value-row">
                  <span className="met-loop-value">{card.value}</span>
                  {card.unit && <span className="met-loop-unit">{card.unit}</span>}
                </div>
                <p className="met-loop-sub">{card.sub}</p>
              </div>
            </article>
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
