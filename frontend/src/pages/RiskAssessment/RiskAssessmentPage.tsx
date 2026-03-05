import { useEffect, useRef, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip as ReTooltip, AreaChart, Area } from 'recharts';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Icons } from '../../lib/icons';
import { useReveal } from '../../hooks/useScrollReveal';
import './RiskAssessmentPage.css';

const RISK_CONTRIBUTORS = [
  { name: 'LDL', score: 72, color: '#86efac' },
  { name: 'Blood Pressure', score: 55, color: '#93c5fd' },
  { name: 'Family History', score: 40, color: '#fcd34d' },
  { name: 'Smoking', score: 30, color: '#fda4af' },
  { name: 'Diabetes / HbA1c', score: 60, color: '#a5f3fc' },
  { name: 'Inflammation', score: 45, color: '#c4b5fd' },
];

const FACTOR_STORIES = [
  {
    marker: 'ApoB',
    desc: 'The particle that drives plaque formation in arterial walls.',
    insight: 'ApoB tracks the number of atherogenic particles, not just their cholesterol content.',
    action: 'Target ApoB below 80 mg/dL using nutrition, exercise, and lipid therapy when needed.',
    impact: 92,
    color: '#86efac',
    trend: [96, 91, 88, 84, 80, 76],
  },
  {
    marker: 'Blood Pressure',
    desc: 'The force that damages arteries silently over decades.',
    insight: 'Even mildly elevated pressure increases endothelial injury and plaque instability over time.',
    action: 'Sustain home BP around 120/80 with sodium control, sleep quality, and daily movement.',
    impact: 86,
    color: '#93c5fd',
    trend: [88, 84, 82, 79, 76, 73],
  },
  {
    marker: 'Glucose / HbA1c',
    desc: 'Early warning signal for insulin resistance and diabetes.',
    insight: 'Glucose dysregulation accelerates vascular inflammation long before diabetes diagnosis.',
    action: 'Push post-meal glucose spikes down with meal timing, fiber-first meals, and strength work.',
    impact: 79,
    color: '#a5f3fc',
    trend: [81, 79, 78, 75, 73, 70],
  },
  {
    marker: 'Inflammation (hs-CRP)',
    desc: 'Accelerates plaque rupture and acute cardiac events.',
    insight: 'Inflammation is often the trigger that turns stable plaque into unstable plaque.',
    action: 'Reduce inflammatory load by improving visceral fat, sleep consistency, and recovery habits.',
    impact: 74,
    color: '#fcd34d',
    trend: [78, 76, 74, 72, 69, 66],
  },
  {
    marker: 'VO2 Max',
    desc: 'Your resilience reserve, predicts survival under cardiac stress.',
    insight: 'Cardiorespiratory fitness is one of the strongest independent predictors of longevity.',
    action: 'Build aerobic base with Zone 2 sessions and add one weekly high-intensity interval block.',
    impact: 68,
    color: '#c4b5fd',
    trend: [52, 55, 57, 59, 62, 65],
  },
  {
    marker: 'Coronary Imaging (CAC)',
    desc: 'No shortcuts, no guesswork, direct plaque visibility.',
    insight: 'CAC reframes risk by showing actual plaque burden instead of estimated probability only.',
    action: 'Use imaging at the right age/risk threshold to personalize intensity of prevention.',
    impact: 90,
    color: '#fda4af',
    trend: [60, 64, 68, 74, 82, 90],
  },
];

function RiskFactorTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="ra-chart-tooltip">
      <span className="ra-chart-tooltip-label">{p.payload.name}</span>
      <span className="ra-chart-tooltip-value">{p.value}% contribution</span>
    </div>
  );
}

// ── Hero ────────────────────────────────────────────────────────────
function RiskHero() {
  const heroImage = '/ai-art/know-ur-risk.png';
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

          // slow reveal of the back side first, then return to front.
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
    <section className="ra-hero">
      <div className="hero-bg-grid" />
      <div className="container">
        <div className="ra-hero-grid">
          <div className="ra-hero-left">
            <p className="section-eyebrow">Treatment</p>
            <h1 className="ra-hero-title">Know Your<br />True <span className="ra-hero-accent">Risk.</span></h1>
            <p className="ra-hero-sub">
              Most heart attacks happen to people who were told they were fine. Bypass measures what actually matters — before it's too late.
            </p>
          </div>

          {/* right — interactive risk card */}
          <div className="ra-hero-right">
            <div
              ref={flipRef}
              className={`ra-hero-flip ${isFlipped ? 'is-flipped' : ''} ${isAutoFlipping ? 'is-auto-flipping' : ''}`}
              tabIndex={0}
              aria-label="Risk card flip"
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
              <div className="ra-hero-flip-inner">
                <div className="ra-hero-face ra-hero-face--front">
                  <img src={heroImage} alt="Know your risk" className="ra-hero-face-img" />
                  <div className="ra-hero-flip-hint" aria-hidden="true">
                    <span>Hover or Tap to Flip</span>
                    <IonIcon icon={Icons.arrowForward} className="ra-hero-flip-hint-icon" />
                  </div>
                </div>

                <div className="ra-hero-face ra-hero-face--back ra-hero-card">
                  <p className="section-eyebrow">Your Risk Profile</p>
                  <h2 className="ra-hero-card-title">See Your Risk Score.<br />In Seconds.</h2>
                  <p className="ra-hero-card-sub">
                    Enter your data and get a personalised cardiovascular risk profile — broken down by key drivers.
                  </p>
                  <div className="ra-hero-card-btns ra-hero-card-btns--single">
                    <IonButton className="btn-white" shape="round" href="/risk-assessment/form">
                      Take Assessment
                    </IonButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Risk Scores ─────────────────────────────────────────────────────
function RiskScoresSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="ra-scores-section">
      <div className="container">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Your Risk Profile</p>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>How We Measure Risk</h2>
        <div ref={ref} className={`ra-scores-grid ${visible ? 'reveal-in' : 'reveal-hidden'}`}>

          <div className="ra-score-card">
            <div className="ra-score-badge ra-score-badge--lifetime">Lifetime</div>
            <p className="ra-score-label">Lifetime Risk</p>
            <p className="ra-score-desc">
              Your probability of developing cardiovascular disease over your remaining lifespan, based on your current risk factor burden. This number motivates long-term behaviour change.
            </p>
            <div className="ra-score-bar-wrap">
              <div className="ra-score-bar-track">
                <div className="ra-score-bar-fill" style={{ width: '0%' }} data-target="68" />
              </div>
              <span className="ra-score-bar-label">Complete your assessment to see your score</span>
            </div>
          </div>

          <div className="ra-score-card">
            <div className="ra-score-badge ra-score-badge--10yr">10-Year</div>
            <p className="ra-score-label">10-Year Risk</p>
            <p className="ra-score-desc">
              Your probability of a major adverse cardiac event (heart attack or stroke) in the next 10 years. This drives immediate clinical decisions about treatment intensity.
            </p>
            <div className="ra-score-bar-wrap">
              <div className="ra-score-bar-track">
                <div className="ra-score-bar-fill" style={{ width: '0%' }} />
              </div>
              <span className="ra-score-bar-label">Complete your assessment to see your score</span>
            </div>
          </div>

          <div className="ra-score-card">
            <div className="ra-score-badge ra-score-badge--last">Last Evaluation</div>
            <p className="ra-score-label">Last Evaluation</p>
            <p className="ra-score-desc">
              Track how your risk score changes over time as you follow your prevention protocol. Reducing your 10-year risk by even 5% can add years to your life.
            </p>
            <div className="ra-score-bar-wrap">
              <div className="ra-score-bar-track">
                <div className="ra-score-bar-fill" style={{ width: '0%' }} />
              </div>
              <span className="ra-score-bar-label">No previous evaluation found</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Why Risk is High ────────────────────────────────────────────────
function WhyRiskSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="ra-why-section">
      <div className="container">
        <div ref={ref} className={`ra-why-grid ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          <div className="ra-why-left">
            <p className="section-eyebrow">Understanding Risk</p>
            <h2 className="section-heading">Why Is Risk High?</h2>
            <p className="ra-why-body">
              Risk is rarely driven by a single factor. It accumulates silently — a little extra LDL here, slightly elevated blood pressure there, a family history you didn't know about.
            </p>
            <p className="ra-why-body">
              Bypass identifies the exact combination of factors elevating your personal risk score, so your cardiologist can target the highest-impact interventions first.
            </p>
            <IonButton className="btn-white" shape="round" href="/risk-assessment/form">
              Start My Assessment
            </IonButton>
          </div>
          <div className="ra-why-right">
            <div className="ra-risk-factors-card">
              <p className="ra-factors-eyebrow">Key Risk Contributors</p>
              <div className="ra-factors-chart-shell">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={RISK_CONTRIBUTORS} layout="vertical" margin={{ top: 4, right: 10, bottom: 4, left: 6 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      width={120}
                    />
                    <ReTooltip content={<RiskFactorTooltip />} cursor={false} />
                    <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={8}>
                      {RISK_CONTRIBUTORS.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="ra-factors-chips">
                {RISK_CONTRIBUTORS.slice(0, 3).map((item) => (
                  <span key={item.name} className="ra-factor-chip">
                    <i style={{ background: item.color }} />{item.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Why These Factors Matter ────────────────────────────────────────
function WhyFactorsSection() {
  const { ref, visible } = useReveal();
  const [activeIdx, setActiveIdx] = useState(0);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const nodes = stepRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset.index ?? 0);
          setActiveIdx(idx);
        });
      },
      {
        threshold: 0.35,
        rootMargin: '-8% 0px -28% 0px',
      }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const activeStory = FACTOR_STORIES[activeIdx];

  return (
    <section className="ra-factors-section">
      <div className="container">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Science Behind the Score</p>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>Why These Factors Matter</h2>
        <p className="section-sub" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
          Heart disease is not caused by one number — it's a convergence of biology, lifestyle, and genetics. Bypass evaluates the markers that actually predict events.
        </p>

        <div ref={ref} className={`ra-story-shell ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          <div className="ra-story-steps" role="list" aria-label="Risk factors list">
            {FACTOR_STORIES.map((item, i) => (
              <div
                key={item.marker}
                role="listitem"
                ref={(el) => { stepRefs.current[i] = el; }}
                data-index={i}
                className={`ra-story-step ${activeIdx === i ? 'is-active' : ''}`}
              >
                <span className="ra-story-step-num">{String(i + 1).padStart(2, '0')}</span>
                <p className="ra-story-step-title">{item.marker}</p>
                <p className="ra-story-step-desc">{item.desc}</p>
              </div>
            ))}
          </div>

          <aside
            className="ra-story-panel"
            style={{ '--factor-color': activeStory.color, '--orb-shift': `${activeIdx * 8}px` } as any}
          >
            <div className="ra-story-orb" />
            <p className="ra-story-eyebrow">Factor {String(activeIdx + 1).padStart(2, '0')}</p>
            <h3 className="ra-story-title">{activeStory.marker}</h3>
            <p className="ra-story-main">{activeStory.insight}</p>

            <div className="ra-story-impact-row">
              <span>Clinical Impact</span>
              <strong>{activeStory.impact}%</strong>
            </div>

            <div className="ra-story-impact-track">
              <span style={{ width: `${activeStory.impact}%`, background: activeStory.color }} />
            </div>

            <div className="ra-story-trend">
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={activeStory.trend.map((value, idx) => ({ idx, value }))} margin={{ top: 8, right: 6, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="ra-story-trend-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={activeStory.color} stopOpacity={0.32} />
                      <stop offset="100%" stopColor={activeStory.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="idx" hide />
                  <YAxis hide domain={['dataMin - 4', 'dataMax + 4']} />
                  <Area type="monotone" dataKey="value" stroke={activeStory.color} strokeWidth={2.2} fill="url(#ra-story-trend-grad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="ra-story-action">{activeStory.action}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}

// ── CTA ─────────────────────────────────────────────────────────────
function CTASection() {
  const { ref, visible } = useReveal();
  return (
    <section className="ra-cta-section">
      <div className="container">
        <div ref={ref} className={`ra-cta-card ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          <p className="section-eyebrow">Take Action</p>
          <h2 className="ra-cta-title">Your heart doesn't wait.<br />Neither should you.</h2>
          <p className="ra-cta-sub">Complete your assessment in under 5 minutes. No labs needed to start.</p>
          <IonButton className="btn-white" shape="round" href="/risk-assessment/form">
            Take Assessment Now
          </IonButton>
        </div>
      </div>
    </section>
  );
}

// ── Page ────────────────────────────────────────────────────────────
const RiskAssessmentPage: React.FC = () => (
  <IonPage>
    <IonContent fullscreen scrollY>
      <div className="ra-page">
        <Navbar />

        <RiskHero />
        <RiskScoresSection />
        <WhyRiskSection />
        <WhyFactorsSection />
        <CTASection />
        <Footer />
      </div>
    </IonContent>
  </IonPage>
);

export default RiskAssessmentPage;
