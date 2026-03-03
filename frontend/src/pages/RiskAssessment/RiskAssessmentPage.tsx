import { useEffect, useRef, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { whyFactorsMatters } from '../../data/mock_risk_assessment';
import { Icons } from '../../lib/icons';
import { useReveal } from '../../hooks/useScrollReveal';
import './RiskAssessmentPage.css';

// quick preview pills shown after "scanning"
const RISK_PILLS = [
  { label: '10-Year Risk', value: '14%',      color: '#f97316' },
  { label: 'Risk Level',   value: 'Borderline',color: '#f59e0b' },
  { label: 'Risk Score',   value: '14 / 40',   color: '#ef4444' },
];

// ── Hero ────────────────────────────────────────────────────────────
function RiskHero() {
  const [cardState, setCardState] = useState<'idle' | 'scanning' | 'ready'>('idle');

  function handleScan() {
    setCardState('scanning');
    setTimeout(() => setCardState('ready'), 2800);
  }

  return (
    <section className="ra-hero">
      <div className="hero-bg-grid" />
      <div className="container">
        <div className="ra-hero-grid">
          <div className="ra-hero-left">
            <h1 className="ra-hero-title">Know Your<br />True Risk.</h1>
            <p className="ra-hero-sub">
              Most heart attacks happen to people who were told they were fine. Bypass measures what actually matters — before it's too late.
            </p>
          </div>

          {/* right — interactive risk card */}
          <div className="ra-hero-right">
            <div className={`ra-hero-card ${cardState === 'ready' ? 'ra-hero-card--ready' : ''}`}>
              <p className="section-eyebrow">Your Risk Profile</p>

              {/* idle */}
              {cardState === 'idle' && (
                <>
                  <h2 className="ra-hero-card-title">See Your Risk Score.<br />In Seconds.</h2>
                  <p className="ra-hero-card-sub">
                    Enter your data and get a personalised cardiovascular risk profile — broken down by key drivers.
                  </p>
                  <div className="ra-hero-card-btns">
                    <button className="ra-hero-scan-btn" onClick={() => window.location.href = '/risk-assessment/dashboard'}>
                      <span className="ra-hsb-bg" />
                      <IonIcon icon={Icons.analytics} className="ra-hsb-icon" />
                      <span className="ra-hsb-label">Risk Dashboard</span>
                    </button>
                    <IonButton className="btn-white" shape="round" href="/risk-assessment/form">
                      Take Assessment
                    </IonButton>
                  </div>
                </>
              )}

              {/* scanning — animated heart pulse + dots */}
              {cardState === 'scanning' && (
                <div className="ra-hero-scanning">
                  <div className="ra-pulse-anim">
                    <span className="ra-pulse-ring ra-pulse-ring-1" />
                    <span className="ra-pulse-ring ra-pulse-ring-2" />
                    <span className="ra-pulse-ring ra-pulse-ring-3" />
                    <div className="ra-pulse-center">
                      <svg className="ra-pulse-heart" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z"
                          stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(239,68,68,0.15)" />
                      </svg>
                    </div>
                  </div>
                  <p className="ra-hero-scanning-label">Calculating Risk…</p>
                  <div className="wb-scan-dots"><span /><span /><span /></div>
                </div>
              )}

              {/* ready — show preview score + pills */}
              {cardState === 'ready' && (
                <>
                  <div className="ra-hero-ready-row">
                    <span className="ra-hero-ready-dot" />
                    <span className="ra-hero-ready-text">Sample Result — Borderline Risk</span>
                  </div>
                  <div className="ra-hero-pills">
                    {RISK_PILLS.map(p => (
                      <div key={p.label} className="wb-hero-pill" style={{ borderColor: `${p.color}33` }}>
                        <span className="wb-hero-pill-dot" style={{ background: p.color }} />
                        <span className="wb-hero-pill-label">{p.label}</span>
                        <span className="wb-hero-pill-value" style={{ color: p.color }}>{p.value}</span>
                      </div>
                    ))}
                  </div>
                  <IonButton className="btn-green" shape="round" href="/risk-assessment/dashboard">
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
              <div className="ra-factors-list">
                {['LDL Cholesterol', 'Blood Pressure', 'Family History', 'Smoking', 'Diabetes / HbA1c', 'Inflammation'].map((f, i) => (
                  <div key={i} className="ra-factor-row">
                    <span className="ra-factor-name">{f}</span>
                    <div className="ra-factor-bar-track">
                      <div className="ra-factor-bar" style={{ width: `${[72, 55, 40, 30, 60, 45][i]}%` }} />
                    </div>
                  </div>
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
  return (
    <section className="ra-factors-section">
      <div className="container">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Science Behind the Score</p>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>Why These Factors Matter</h2>
        <p className="section-sub" style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
          Heart disease is not caused by one number — it's a convergence of biology, lifestyle, and genetics. Bypass evaluates the markers that actually predict events.
        </p>
        <div ref={ref} className={`ra-markers-grid ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          {whyFactorsMatters.map((item, i) => (
            <div key={i} className="ra-marker-card">
              <span className="ra-marker-num">{String(i + 1).padStart(2, '0')}</span>
              <p className="ra-marker-title">{item.marker}</p>
              <p className="ra-marker-desc">{item.desc}</p>
            </div>
          ))}
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
