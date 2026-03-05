import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { useHistory, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { riskHistory } from '../../data/mock_risk_assessment';
import { Icons } from '../../lib/icons';
import { useTheme } from '../../hooks/useTheme';
import './AssessmentHistoryDetail.css';

const LEVEL_COLOR: Record<string, string> = {
  Low: '#27ae60', Borderline: '#e67e22', Intermediate: '#d35400', High: '#c0392b',
};

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

function DetailRing({ score, color }: { score: number; color: string }) {
  const r = 48; const circ = 2 * Math.PI * r;
  const pct = Math.min(score / 40, 1);
  return (
    <div className="ahd-ring-wrap">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" className="ahd-ring-track" strokeWidth="10" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          transform="rotate(-90 60 60)" />
      </svg>
      <div className="ahd-ring-center">
        <span className="ahd-ring-score" style={{ color }}>{score}</span>
        <span className="ahd-ring-label">/ 40</span>
      </div>
    </div>
  );
}

const AssessmentHistoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { theme } = useTheme();

  // hardcoded for now — Phase 2 will fetch by id from backend
  // id=1 maps to index 0 (most recent assessment)
  const idx = Math.max(0, parseInt(id) - 1);
  const row = riskHistory[idx] || riskHistory[0];

  const color = LEVEL_COLOR[row.level];
  const rd = RISK_DATA[row.level] || RISK_DATA['Low'];
  const tenYr = row.riskScore >= 22 ? '≥20%' : row.riskScore >= 15 ? '10–19%' : row.riskScore >= 8 ? '5–9%' : '<5%';
  const lifetimeRisk = row.riskScore >= 22 ? '≥39%' : row.riskScore >= 15 ? '25–39%' : row.riskScore >= 8 ? '15–24%' : '<15%';

  const planItemIcon = (item: string) =>
    /follow-ups?/i.test(item) ? Icons.calendar
    : /medication/i.test(item) ? Icons.medical
    : /monitoring|bp/i.test(item) ? Icons.pulse
    : /lifestyle|exercise|diet/i.test(item) ? Icons.fitness
    : /imaging/i.test(item) ? Icons.analytics
    : Icons.checkmark;

  const worksItemIcon = (item: string) =>
    /bp|pressure/i.test(item) ? Icons.pulse
    : /lipid|cholesterol|plaque/i.test(item) ? Icons.analytics
    : /clot|stroke|attack/i.test(item) ? Icons.shield
    : /cardiac|heart/i.test(item) ? Icons.heart
    : /risk|progression/i.test(item) ? Icons.trending
    : Icons.checkmark;

  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="ahd-page">
          <Navbar />
          <div className={`hero-bg-grid ${theme === 'dark' ? 'hero-bg-grid--dark' : ''}`} />

          <div className="ahd-main">
            <div className="container">
              <div className="ahd-page-header">
                <button className="ahd-back-btn" onClick={() => history.push('/risk-assessment/dashboard')}>
                  <IonIcon icon={Icons.arrowBack} className="ahd-back-icon" />
                  <span>Back to Dashboard</span>
                </button>
                <div>
                  <h1 className="ahd-page-title">Assessment Detail</h1>
                  <p className="ahd-page-sub">{row.date}</p>
                </div>
              </div>

              {/* top two-col: score | lifetime + treatment */}
              <div className="ahd-layout">
                {/* left — score card */}
                <div className="ahd-score-col">
                  <div className="ahd-risk-badge" style={{ background: `${color}22` }}>
                    <IonIcon icon={Icons.warning} style={{ color }} />
                    <span style={{ color }}>{row.level.toUpperCase()}</span>
                  </div>
                  <DetailRing score={row.riskScore} color={color} />
                  <p className="ahd-score-desc">
                    Your assessment indicates a {row.level.toLowerCase()} risk. {rd.planDesc}
                  </p>
                  <div className="ahd-factor-grid">
                    <div className="ahd-factor-card">
                      <span className="ahd-fc-label">BLOOD PRESSURE</span>
                      <span className="ahd-fc-value">{row.bp}</span>
                      <span className="ahd-fc-desc">Force on artery walls</span>
                    </div>
                    <div className="ahd-factor-card">
                      <span className="ahd-fc-label">HEART RATE</span>
                      <span className="ahd-fc-value">{row.hr} bpm</span>
                      <span className="ahd-fc-desc">Cardiac workload</span>
                    </div>
                    <div className="ahd-factor-card">
                      <span className="ahd-fc-label">GLUCOSE</span>
                      <span className="ahd-fc-value">{row.glucose} mg/dL</span>
                      <span className="ahd-fc-desc">Metabolic marker</span>
                    </div>
                    <div className="ahd-factor-card">
                      <span className="ahd-fc-label">WEIGHT</span>
                      <span className="ahd-fc-value">{row.weight} kg</span>
                      <span className="ahd-fc-desc">Body composition</span>
                    </div>
                  </div>
                </div>

                {/* right — lifetime risk + treatment plan */}
                <div className="ahd-info-col">
                  <div className="ahd-card">
                    <div className="ahd-card-head">
                      <div className="ahd-card-icon" style={{ background: 'rgba(39,174,96,0.1)' }}>
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M12 21C12 21 3 14 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14 14 21 12 21Z"
                            stroke="#27ae60" strokeWidth="1.5" fill="rgba(39,174,96,0.12)" />
                        </svg>
                      </div>
                      <p className="ahd-card-title">Your Lifetime Risk</p>
                    </div>
                    <p className="ahd-card-body">
                      A personalized estimate of how likely you are to develop significant heart disease during your lifetime — based on biology, imaging, genetics, and lifestyle data.
                    </p>
                    <div className="ahd-lifetime-stats">
                      <div className="ahd-ls-block">
                        <span className="ahd-ls-label">10-Year Risk</span>
                        <span className="ahd-ls-value">{tenYr}</span>
                      </div>
                      <div className="ahd-ls-divider" />
                      <div className="ahd-ls-block">
                        <span className="ahd-ls-label">Lifetime Risk</span>
                        <span className="ahd-ls-value">{lifetimeRisk}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ahd-card">
                    <div className="ahd-card-head">
                      <div className="ahd-card-icon" style={{ background: `${color}22` }}>
                        <IonIcon icon={Icons.medical} style={{ color, fontSize: 18 }} />
                      </div>
                      <p className="ahd-card-title">Treatment Plan</p>
                    </div>
                    <p className="ahd-plan-title" style={{ color }}>{rd.planTitle}</p>
                    <p className="ahd-card-body">{rd.planDesc}</p>
                    <div className="ahd-plan-items">
                      {rd.planItems.map((item, j) => (
                        <div key={j} className="ahd-plan-item">
                          <IonIcon icon={planItemIcon(item)} className="ahd-plan-icon" style={{ color }} />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* full-width — why this plan works */}
              <div className="ahd-card ahd-card--full">
                <div className="ahd-card-head">
                  <div className="ahd-card-icon" style={{ background: `${color}12` }}>
                    <IonIcon icon={Icons.shield} style={{ color, fontSize: 18 }} />
                  </div>
                  <p className="ahd-card-title">Why This Plan Works</p>
                </div>
                <p className="ahd-card-body">{rd.worksDesc}</p>
                <div className="ahd-plan-items">
                  {rd.worksItems.map((item, j) => (
                    <div key={j} className="ahd-plan-item">
                      <IonIcon icon={worksItemIcon(item)} className="ahd-plan-icon" style={{ color: '#636f85' }} />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="ahd-evidence-strip">
                  <div className="ahd-ev-stat">
                    <span className="ahd-ev-num">85%</span>
                    <span className="ahd-ev-label">of patients see improvement in 90 days</span>
                  </div>
                  <div className="ahd-ev-divider" />
                  <div className="ahd-ev-stat">
                    <span className="ahd-ev-num">3×</span>
                    <span className="ahd-ev-label">lower risk vs. no intervention</span>
                  </div>
                  <div className="ahd-ev-divider" />
                  <div className="ahd-ev-stat">
                    <span className="ahd-ev-num">40+</span>
                    <span className="ahd-ev-label">clinical trials support this protocol</span>
                  </div>
                </div>
                <p className="ahd-evidence-note">
                  Based on ACC/AHA 2023 guidelines and pooled cardiovascular outcomes data from global cohort studies.
                </p>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AssessmentHistoryDetailPage;
