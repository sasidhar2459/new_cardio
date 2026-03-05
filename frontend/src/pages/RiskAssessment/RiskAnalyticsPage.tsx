import { useEffect, useRef, useState } from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useReveal, useSlideReveal } from '../../hooks/useScrollReveal';
import './RiskAnalyticsPage.css';

// hardcoded for now — Phase 2 will get this from backend
interface AssessmentData {
  age?: number;
  sex?: string;
  smoking?: string;
  sbp?: number;
  ldl?: number;
  hdl?: number;
  familyHistory?: boolean;
  bmi?: number;
  hsCrp?: number;
  hbA1c?: number;
  cacScore?: number;
  hasCac?: boolean;
}

// mock risk calculation — Phase 2 replaces with backend
function computeRisk(d: AssessmentData) {
  let score = 0;
  if (d.age && d.age > 55) score += 8;
  else if (d.age && d.age > 45) score += 4;
  if (d.sex === 'male') score += 3;
  if (d.smoking === 'current') score += 6;
  else if (d.smoking === 'former') score += 2;
  if (d.sbp && d.sbp > 140) score += 5;
  else if (d.sbp && d.sbp > 120) score += 2;
  if (d.ldl && d.ldl > 160) score += 5;
  else if (d.ldl && d.ldl > 130) score += 2;
  if (d.familyHistory) score += 4;
  if (d.bmi && d.bmi > 30) score += 3;
  if (d.hsCrp && d.hsCrp > 3) score += 3;
  if (d.hbA1c && d.hbA1c > 6.5) score += 4;
  if (d.hasCac && d.cacScore && d.cacScore > 400) score += 6;
  else if (d.hasCac && d.cacScore && d.cacScore > 100) score += 3;

  let level: 'Low' | 'Borderline' | 'Intermediate' | 'High';
  let tenYear: string;
  let lifetime: string;
  if (score >= 22) { level = 'High'; tenYear = '≥20%'; lifetime = '≥50%'; }
  else if (score >= 15) { level = 'Intermediate'; tenYear = '10–19%'; lifetime = '39–50%'; }
  else if (score >= 8) { level = 'Borderline'; tenYear = '5–9%'; lifetime = '25–39%'; }
  else { level = 'Low'; tenYear = '<5%'; lifetime = '<25%'; }

  return { score, level, tenYear, lifetime };
}

function getRiskMeta(level: string) {
  if (level === 'High') return {
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.25)',
    planTitle: 'Intensive Intervention',
    planDesc: 'Aggressive management to reduce immediate risk and prevent events.',
    planItems: ['Immediate specialist consult', 'Strict medication adherence', 'Weekly BP monitoring', 'Advanced cardiac imaging'],
    whyItems: ['Stabilizes plaque formation', 'Rapidly lowers blood pressure', 'Prevents clot formation', 'Reduces cardiac strain'],
  };
  if (level === 'Intermediate') return {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    planTitle: 'Balanced Management',
    planDesc: 'Moderate intervention to manage risk factors and prevent progression.',
    planItems: ['Regular specialist follow-ups', 'Medication as prescribed', 'Monthly BP monitoring', 'Lifestyle modifications'],
    whyItems: ['Stabilizes existing risk factors', 'Lowers BP by 10–15 mmHg', 'Improves lipid profile', 'Reduces progression to high risk'],
  };
  if (level === 'Borderline') return {
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.08)',
    border: 'rgba(251,146,60,0.25)',
    planTitle: 'Foundation Plan',
    planDesc: 'Focused lifestyle optimisation with periodic monitoring.',
    planItems: ['Lifestyle optimisation', 'Medication if indicated', 'Quarterly follow-ups', 'Wearable + BP monitoring'],
    whyItems: ['Lower cholesterol by 15–30%', 'Reduce blood pressure 5–10 mmHg', 'Improve fitness metrics', 'Prevent progression to intermediate risk'],
  };
  return {
    color: 'rgba(160,230,160,0.9)',
    bg: 'rgba(160,230,160,0.06)',
    border: 'rgba(160,230,160,0.2)',
    planTitle: 'Prevention Plan',
    planDesc: 'Focus on maintaining optimal health through lifestyle choices.',
    planItems: ['Maintain heart-healthy diet', 'Regular exercise (150 min/week)', 'Annual health screening', 'Stress management'],
    whyItems: ['Keeps BP in optimal range', 'Maintains healthy weight', 'Reduces systemic inflammation', 'Supports long-term heart health'],
  };
}

// animated score ring using SVG
function ScoreRing({ score, color }: { score: number; color: string }) {
  const [animated, setAnimated] = useState(0);
  const max = 40;
  const r = 70;
  const circumference = 2 * Math.PI * r;
  const normalised = Math.min(score / max, 1);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1400;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimated(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const dashoffset = circumference * (1 - normalised * (animated / score || 0));

  return (
    <div className="rar-ring-wrap">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
        <circle
          cx="90" cy="90" r={r}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - normalised * (animated / score || 0))}
          transform="rotate(-90 90 90)"
          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
        />
      </svg>
      <div className="rar-ring-center">
        <span className="rar-ring-score" style={{ color }}>{animated}</span>
        <span className="rar-ring-label">Risk Score</span>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────
const RiskAnalyticsPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ assessment?: AssessmentData }>();
  const data: AssessmentData = location.state?.assessment ?? {};
  const { score, level, tenYear, lifetime } = computeRisk(data);
  const meta = getRiskMeta(level);
  const { ref: heroRef, visible: heroVis } = useReveal();
  const { ref: leftRef, visible: leftVis, from: leftFrom } = useSlideReveal('left');
  const { ref: rightRef, visible: rightVis, from: rightFrom } = useSlideReveal('right');

  const factorCards = [
    { label: 'Blood Pressure', value: data.sbp ? `${data.sbp} mmHg` : 'N/A', desc: 'Force damaging arteries' },
    { label: 'BMI', value: data.bmi ? data.bmi.toFixed(1) : 'N/A', desc: 'Metabolic health indicator' },
    { label: 'Family History', value: data.familyHistory ? 'Positive' : 'Negative', desc: 'Inherited genetic risks' },
    { label: 'Smoking', value: data.smoking === 'current' ? 'Current' : data.smoking === 'former' ? 'Former' : 'Never', desc: 'Vascular damage risk' },
  ];

  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="rar-page">
          <Navbar />


          {/* ── Hero banner ── */}
          <section className="rar-hero">
            <div className="hero-bg-grid hero-bg-grid--dark" />
            <div className="container">
              <div ref={heroRef} className={heroVis ? 'reveal-in' : 'reveal-hidden'}>
                <p className="section-eyebrow">Assessment Complete</p>
                <h1 className="rar-hero-title">Your Risk <span style={{ color: meta.color }}>Analysis</span></h1>
                <p className="rar-hero-sub">Based on your responses. Review your personalised risk profile and recommended care plan below.</p>
              </div>
            </div>
          </section>

          {/* ── Main grid ── */}
          <section className="rar-main">
            <div className="container">
              <div className="rar-grid">

                {/* Left — score + drivers */}
                <div ref={leftRef} className={`rar-left slide-${leftFrom} ${leftVis ? 'slide-in' : 'slide-hidden'}`}>
                  <div className="rar-score-card">
                    <div className="rar-level-badge" style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color }}>
                      {level} Risk
                    </div>
                    <ScoreRing score={score} color={meta.color} />
                    <p className="rar-score-desc" style={{ borderColor: meta.border }}>
                      Your assessment indicates a <strong style={{ color: meta.color }}>{level.toLowerCase()} risk</strong> level. {meta.planDesc}
                    </p>

                    <div className="rar-divider" />

                    <p className="rar-drivers-title">Key Risk Drivers</p>
                    <div className="rar-factor-grid">
                      {factorCards.map((f, i) => (
                        <div key={i} className="rar-factor-card">
                          <span className="rar-factor-label">{f.label}</span>
                          <span className="rar-factor-value" style={{ color: meta.color }}>{f.value}</span>
                          <span className="rar-factor-desc">{f.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right — lifetime, plan, why */}
                <div ref={rightRef} className={`rar-right slide-${rightFrom} ${rightVis ? 'slide-in' : 'slide-hidden'}`}>

                  {/* Lifetime risk */}
                  <div className="rar-lifetime-card" style={{ borderColor: meta.border }}>
                    <p className="rar-card-eyebrow">Your Lifetime Risk</p>
                    <div className="rar-lifetime-row">
                      <div className="rar-lifetime-stat">
                        <span className="rar-stat-label">10-Year Risk</span>
                        <span className="rar-stat-value" style={{ color: meta.color }}>{tenYear}</span>
                      </div>
                      <div className="rar-lifetime-divider" />
                      <div className="rar-lifetime-stat">
                        <span className="rar-stat-label">Lifetime Risk</span>
                        <span className="rar-stat-value" style={{ color: meta.color }}>{lifetime}</span>
                      </div>
                    </div>
                    <p className="rar-lifetime-body">
                      A personalised estimate of how likely you are to develop significant heart disease — based on your biology, lifestyle, and risk factor burden.
                    </p>
                  </div>

                  {/* Treatment plan */}
                  <div className="rar-plan-card">
                    <p className="rar-card-eyebrow">Treatment Plan</p>
                    <p className="rar-plan-title" style={{ color: meta.color }}>{meta.planTitle}</p>
                    <p className="rar-plan-desc">{meta.planDesc}</p>
                    <ul className="rar-checklist">
                      {meta.planItems.map((item, i) => (
                        <li key={i} style={{ '--dot-color': meta.color } as React.CSSProperties}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Why it works */}
                  <div className="rar-why-card">
                    <p className="rar-card-eyebrow">Why This Plan Works</p>
                    <ul className="rar-checklist rar-checklist--green">
                      {meta.whyItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>

              {/* ── CTA ── */}
              <div className="rar-cta">
                <IonButton className="btn-white" shape="round" href="/contact">Talk to a Profesionals</IonButton>
                <IonButton
                  className="btn-outline-white"
                  shape="round"
                  fill="outline"
                  onClick={() => history.push('/risk-assessment/form')}
                >
                  Retake Assessment
                </IonButton>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RiskAnalyticsPage;
