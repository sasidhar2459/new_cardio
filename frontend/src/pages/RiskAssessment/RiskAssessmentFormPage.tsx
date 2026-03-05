import { useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { assessmentSteps } from '../../data/mock_risk_assessment';
import { useTheme } from '../../hooks/useTheme';
import { Icons } from '../../lib/icons';
import './RiskAssessmentFormPage.css';

// ── Form state ───────────────────────────────────────────────────────
interface FormData {
  // Step 0 — Basic Info
  age: string;
  sex: 'male' | 'female';
  southAsian: boolean;
  smoking: 'never' | 'former' | 'current';
  diabetes: boolean;

  // Step 1 — Clinical Parameters
  sbp: string;
  dbp: string;
  ldl: string;
  hdl: string;
  hba1c: string;
  familyHistory: boolean;
  otherChronic: boolean;

  // Step 2 — Risk-Enhancing Factors
  metabolicSyndrome: boolean;
  chronicInflammatory: boolean;
  chronicKidney: boolean;
  womenRisk: boolean;
  apoB: string;
  lpa: string;
  hsCRP: string;

  // Step 3 — Body Composition
  waist: string;
  waistHip: string;
  visceralFat: string;
  vo2max: string;

  // Step 4 — CAC Score
  cacScore: string;
}

const initial: FormData = {
  age: '', sex: 'male', southAsian: true, smoking: 'never', diabetes: false,
  sbp: '', dbp: '', ldl: '', hdl: '', hba1c: '', familyHistory: false, otherChronic: false,
  metabolicSyndrome: false, chronicInflammatory: false, chronicKidney: false, womenRisk: false,
  apoB: '', lpa: '', hsCRP: '',
  waist: '', waistHip: '', visceralFat: '', vo2max: '',
  cacScore: '',
};

// ── Step Progress Bar ────────────────────────────────────────────────
function StepBar({ current, total }: { current: number; total: number }) {
  const progress = total > 1 ? current / (total - 1) : 0;

  return (
    <div className="raf-stepbar">
      <div
        className="raf-steps-row"
        style={{
          ['--raf-steps' as any]: total,
          ['--raf-progress-ratio' as any]: progress,
        }}
      >
        {assessmentSteps.map((s, i) => (
          <div key={i} className={`raf-step-dot ${i < current ? 'done' : i === current ? 'active' : ''}`}>
            <div className="raf-dot-circle">{i < current ? '✓' : i + 1}</div>
            <span className="raf-dot-label">{s.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Field helpers ────────────────────────────────────────────────────
function Field({ label, unit, value, onChange, placeholder, type = 'number' }: {
  label: string; unit?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div className="raf-field">
      <label className="raf-label">{label}{unit && <span className="raf-unit"> ({unit})</span>}</label>
      <input
        className="raf-input"
        type={type}
        value={value}
        placeholder={placeholder ?? ''}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: {
  label: string; desc?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="raf-toggle-row" onClick={() => onChange(!value)}>
      <div className="raf-toggle-text">
        <p className="raf-toggle-label">{label}</p>
        {desc && <p className="raf-toggle-desc">{desc}</p>}
      </div>
      <div className={`raf-toggle ${value ? 'raf-toggle--on' : ''}`}>
        <div className="raf-toggle-thumb" />
      </div>
    </div>
  );
}

function RadioGroup({ label, options, value, onChange }: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="raf-field">
      <label className="raf-label">{label}</label>
      <div className="raf-radio-row">
        {options.map(opt => (
          <button
            key={opt.value}
            className={`raf-radio-btn ${value === opt.value ? 'active' : ''}`}
            onClick={() => onChange(opt.value)}
            type="button"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Steps ────────────────────────────────────────────────────────────
function Step0({ data, set }: { data: FormData; set: (d: Partial<FormData>) => void }) {
  return (
    <div className="raf-step-content">
      <h2 className="raf-step-title">Basic Information</h2>
      <p className="raf-step-sub">Demographics & lifestyle factors</p>
      <div className="raf-basic-layout">
        {/* Left half */}
        <div className="raf-basic-left">
          <Field label="Age" unit="years, 30-60" value={data.age} onChange={v => set({ age: v })} placeholder="e.g. 45" />
          <div className="raf-basic-radios">
            <RadioGroup
              label="Smoking Status"
              options={[
                { value: 'never', label: 'Never' },
                { value: 'former', label: 'Former' },
                { value: 'current', label: 'Current' },
              ]}
              value={data.smoking}
              onChange={v => set({ smoking: v as FormData['smoking'] })}
            />
            <RadioGroup
              label="Biological Sex"
              options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
              value={data.sex}
              onChange={v => set({ sex: v as 'male' | 'female' })}
            />
          </div>
        </div>
        {/* Right half */}
        <div className="raf-basic-right">
          <Toggle label="Diabetes Diagnosed" desc="Type 1 or Type 2 diabetes" value={data.diabetes} onChange={v => set({ diabetes: v })} />
          <Toggle label="South Asian Ethnicity" desc="Increases cardiovascular risk by ~1.5x" value={data.southAsian} onChange={v => set({ southAsian: v })} />
        </div>
      </div>
    </div>
  );
}

function Step1({ data, set }: { data: FormData; set: (d: Partial<FormData>) => void }) {
  return (
    <div className="raf-step-content">
      <h2 className="raf-step-title">Clinical Parameters</h2>
      <p className="raf-step-sub">Blood pressure, lipids & metabolic markers</p>
      <div className="raf-field-row raf-field-row--clinical-top">
        <Field label="Systolic BP" unit="mmHg" value={data.sbp} onChange={v => set({ sbp: v })} placeholder="e.g. 130" />
        <Field label="Diastolic BP" unit="mmHg" value={data.dbp} onChange={v => set({ dbp: v })} placeholder="e.g. 85" />
        <Field label="LDL Cholesterol" unit="mg/dL" value={data.ldl} onChange={v => set({ ldl: v })} placeholder="e.g. 130" />
        <Field label="HDL Cholesterol" unit="mg/dL" value={data.hdl} onChange={v => set({ hdl: v })} placeholder="e.g. 45" />
      </div>
      <div className="raf-field-row raf-field-row--clinical-bottom">
        <Field label="HbA1c" unit="%" value={data.hba1c} onChange={v => set({ hba1c: v })} placeholder="e.g. 5.8" />
        <Toggle label="Family History of ASCVD" desc="First-degree relative with early heart disease" value={data.familyHistory} onChange={v => set({ familyHistory: v })} />
        <Toggle label="Other Chronic Conditions" desc="e.g. CKD, autoimmune, HIV" value={data.otherChronic} onChange={v => set({ otherChronic: v })} />
      </div>
    </div>
  );
}

function Step2({ data, set }: { data: FormData; set: (d: Partial<FormData>) => void }) {
  return (
    <div className="raf-step-content">
      <h2 className="raf-step-title">Risk-Enhancing Factors</h2>
      <p className="raf-step-sub">Advanced biomarkers & systemic conditions</p>
      <div className="raf-toggle-grid raf-toggle-grid--4">
        <Toggle label="Metabolic Syndrome" desc="Central obesity + >=2 metabolic abnormalities" value={data.metabolicSyndrome} onChange={v => set({ metabolicSyndrome: v })} />
        <Toggle label="Chronic Inflammatory Condition" desc="Rheumatoid arthritis, psoriasis, lupus" value={data.chronicInflammatory} onChange={v => set({ chronicInflammatory: v })} />
        <Toggle label="Chronic Kidney Disease" desc="eGFR < 60 or persistent albuminuria" value={data.chronicKidney} onChange={v => set({ chronicKidney: v })} />
        <Toggle label="Women-Specific Risk Factors" desc="PCOS, premature menopause, pre-eclampsia" value={data.womenRisk} onChange={v => set({ womenRisk: v })} />
      </div>
      <div className="raf-field-row raf-field-row--compact">
        <Field label="ApoB" unit="mg/dL" value={data.apoB} onChange={v => set({ apoB: v })} placeholder="optional" />
        <Field label="Lp(a)" unit="mg/dL" value={data.lpa} onChange={v => set({ lpa: v })} placeholder="optional" />
        <Field label="hs-CRP" unit="mg/L" value={data.hsCRP} onChange={v => set({ hsCRP: v })} placeholder="optional" />
      </div>
    </div>
  );
}

function Step3({ data, set }: { data: FormData; set: (d: Partial<FormData>) => void }) {
  return (
    <div className="raf-step-content">
      <h2 className="raf-step-title">Body Composition</h2>
      <p className="raf-step-sub">Measurements & fitness metrics</p>
      <div className="raf-field-row raf-field-row--body">
        <div className="raf-body-col">
          <Field label="Waist Circumference" unit="cm" value={data.waist} onChange={v => set({ waist: v })} placeholder="optional" />
          <Field label="Visceral Fat Level" unit="rating 1–12" value={data.visceralFat} onChange={v => set({ visceralFat: v })} placeholder="optional" />
        </div>
        <div className="raf-body-col">
          <Field label="Waist-Hip Ratio" value={data.waistHip} onChange={v => set({ waistHip: v })} placeholder="e.g. 0.92" />
          <Field label="VO₂ Max" unit="mL/kg/min" value={data.vo2max} onChange={v => set({ vo2max: v })} placeholder="optional" />
        </div>
        <div className="raf-info-box raf-info-box--tall">
          <p>VO₂ Max is one of the strongest predictors of all-cause mortality. Even rough estimates from fitness trackers are helpful.</p>
        </div>
      </div>
    </div>
  );
}

function Step4({ data, set }: { data: FormData; set: (d: Partial<FormData>) => void }) {
  const score = parseInt(data.cacScore);
  const interpretation =
    isNaN(score) ? '' :
    score === 0 ? 'Low risk — no detectable plaque' :
    score <= 99 ? 'Moderate risk — mild plaque present' :
    score <= 299 ? 'High risk — significant plaque burden' :
    'Very high risk — extensive plaque, urgent intervention';

  const interpretColor =
    isNaN(score) ? '' :
    score === 0 ? 'rgba(160,230,160,0.9)' :
    score <= 99 ? '#facc15' :
    score <= 299 ? '#f97316' : '#f87171';

  return (
    <div className="raf-step-content">
      <h2 className="raf-step-title">Coronary Artery Calcium</h2>
      <p className="raf-step-sub">CAC Score — optional but highly valuable</p>
      <Field label="CAC Score" unit="Agatston units" value={data.cacScore} onChange={v => set({ cacScore: v })} placeholder="0 = no calcification" />
      {interpretation && (
        <div className="raf-cac-result" style={{ borderColor: interpretColor }}>
          <p style={{ color: interpretColor }}>{interpretation}</p>
        </div>
      )}
      <div className="raf-info-box">
        <p>The CAC score is a CT scan that directly visualises calcium deposits in your coronary arteries — the most precise predictor of near-term cardiac events.</p>
        <p style={{ marginTop: 8 }}>Don't have a CAC score yet? Leave blank and we'll estimate risk without it.</p>
      </div>
    </div>
  );
}

// ── Review Step ──────────────────────────────────────────────────────
function Step5({ data, onEdit }: { data: FormData; onEdit: (step: number) => void }) {
  const rows: { label: string; value: string; step: number }[] = [
    { label: 'Age', value: data.age || '—', step: 0 },
    { label: 'Sex', value: data.sex, step: 0 },
    { label: 'Smoking', value: data.smoking, step: 0 },
    { label: 'South Asian', value: data.southAsian ? 'Yes' : 'No', step: 0 },
    { label: 'Diabetes', value: data.diabetes ? 'Yes' : 'No', step: 0 },
    { label: 'Systolic BP', value: data.sbp ? `${data.sbp} mmHg` : '—', step: 1 },
    { label: 'Diastolic BP', value: data.dbp ? `${data.dbp} mmHg` : '—', step: 1 },
    { label: 'LDL', value: data.ldl ? `${data.ldl} mg/dL` : '—', step: 1 },
    { label: 'HDL', value: data.hdl ? `${data.hdl} mg/dL` : '—', step: 1 },
    { label: 'HbA1c', value: data.hba1c ? `${data.hba1c}%` : '—', step: 1 },
    { label: 'Family History', value: data.familyHistory ? 'Yes' : 'No', step: 1 },
    { label: 'ApoB', value: data.apoB ? `${data.apoB} mg/dL` : '—', step: 2 },
    { label: 'Lp(a)', value: data.lpa ? `${data.lpa} mg/dL` : '—', step: 2 },
    { label: 'hs-CRP', value: data.hsCRP ? `${data.hsCRP} mg/L` : '—', step: 2 },
    { label: 'Waist', value: data.waist ? `${data.waist} cm` : '—', step: 3 },
    { label: 'VO₂ Max', value: data.vo2max ? `${data.vo2max} mL/kg/min` : '—', step: 3 },
    { label: 'CAC Score', value: data.cacScore || '—', step: 4 },
  ];

  return (
    <div className="raf-step-content">
      <h2 className="raf-step-title">Review & Submit</h2>
      <p className="raf-step-sub">Verify your data before calculating your risk score</p>
      <div className="raf-review-table">
        {rows.map((r, i) => (
          <div key={i} className="raf-review-row">
            <span className="raf-review-label">{r.label}</span>
            <span className="raf-review-value">{r.value}</span>
            <button className="raf-edit-btn" onClick={() => onEdit(r.step)}>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────
const RiskAssessmentFormPage: React.FC = () => {
  const history = useHistory();
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [fromReview, setFromReview] = useState(false);
  const [data, setData] = useState<FormData>(initial);
  const [errors, setErrors] = useState<string[]>([]);

  const set = (d: Partial<FormData>) => setData(prev => ({ ...prev, ...d }));

  const validate = (): string[] => {
    const errs: string[] = [];
    if (step === 0) {
      const age = parseInt(data.age);
      if (!data.age || isNaN(age) || age < 30 || age > 60)
        errs.push('Age must be between 30 and 60 years.');
    }
    if (step === 1) {
      if (!data.sbp) errs.push('Systolic BP is required.');
      if (!data.dbp) errs.push('Diastolic BP is required.');
      if (!data.ldl) errs.push('LDL Cholesterol is required.');
      if (!data.hdl) errs.push('HDL Cholesterol is required.');
    }
    return errs;
  };

  const next = () => {
    const errs = validate();
    if (errs.length) { setErrors(errs); return; }
    setErrors([]);
    if (step < assessmentSteps.length - 1) setStep(s => s + 1);
  };

  const back = () => { setErrors([]); setStep(s => s - 1); };

  const submit = () => {
    // Phase 2 — will POST to backend, get back real id, redirect to /risk-assessment/dashboard/:id/history
    // hardcoded id=1 for now
    history.push('/risk-assessment/dashboard/1/history');
  };

  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="raf-page">
          <Navbar />
          <div className={`hero-bg-grid ${theme === 'dark' ? 'hero-bg-grid--dark' : ''}`} />
<br />

          <div className="raf-shell">
            <div className="container">

              <button className="raf-page-back-btn" onClick={() => history.push('/risk-assessment')}>
                <IonIcon icon={Icons.arrowBack} className="raf-page-back-icon" />
                <span>Back to Assessment</span>
              </button>

              {/* progress */}
              <StepBar current={step} total={assessmentSteps.length} />

              {/* step label */}
              <div className="raf-step-header">
                <span className="raf-step-count">Step {step + 1} of {assessmentSteps.length}</span>
                <p className="raf-step-section-label">{assessmentSteps[step].subtitle}</p>
              </div>

              {/* form card */}
              <div className="raf-card">
                {step === 0 && <Step0 data={data} set={set} />}
                {step === 1 && <Step1 data={data} set={set} />}
                {step === 2 && <Step2 data={data} set={set} />}
                {step === 3 && <Step3 data={data} set={set} />}
                {step === 4 && <Step4 data={data} set={set} />}
                {step === 5 && <Step5 data={data} onEdit={s => { setFromReview(true); setStep(s); }} />}

                {/* validation errors */}
                {errors.length > 0 && (
                  <div className="raf-errors">
                    {errors.map((e, i) => <p key={i}>{e}</p>)}
                  </div>
                )}

                {/* navigation */}
                <div className="raf-nav">
                  {step > 0 && !fromReview && (
                    <button className="raf-back-btn" onClick={back}>← Back</button>
                  )}
                  <div style={{ flex: 1 }} />
                  {fromReview && step !== 5 ? (
                    <IonButton className="btn-white" shape="round" onClick={() => {
                      const errs = validate();
                      if (errs.length) { setErrors(errs); return; }
                      setErrors([]);
                      setFromReview(false);
                      setStep(5);
                    }}>
                      Save & Back to Review
                    </IonButton>
                  ) : step < assessmentSteps.length - 1 ? (
                    <IonButton className="btn-white" shape="round" onClick={next}>
                      Next →
                    </IonButton>
                  ) : (
                    <IonButton className="btn-white" shape="round" onClick={submit}>
                      Submit Assessment
                    </IonButton>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RiskAssessmentFormPage;
