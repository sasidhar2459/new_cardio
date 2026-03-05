import { useState } from 'react';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { Icons } from '../../lib/icons';
import './AuthPage.css';

// Step 1 — phone entry
function StepPhone({ phone, onChange, onSendOTP, loading }: {
  phone: string;
  onChange: (v: string) => void;
  onSendOTP: () => void;
  loading: boolean;
}) {
  return (
    <>
      <div className="auth-form-group">
        <label className="auth-label">Phone Number</label>
        <div className="auth-phone-row">
          <span className="auth-phone-prefix">IN +91</span>
          <input className="auth-input auth-phone-input" type="tel"
            placeholder="98765 43210" required
            value={phone} onChange={e => onChange(e.target.value)} />
        </div>
        <span className="auth-hint">We'll send a 6-digit OTP to verify your number</span>
      </div>
      <button className="auth-submit-btn" type="button" onClick={onSendOTP} disabled={loading}>
        {loading ? 'Sending OTP…' : 'Send OTP'}
      </button>
    </>
  );
}

// Step 2 — OTP + name + password
function StepVerify({ phone, form, onChange, onShowPass, showPass, onShowConfirm, showConfirm, onBack }: {
  phone: string;
  form: { otp: string; name: string; password: string; confirm: string };
  onChange: (k: string, v: string) => void;
  onShowPass: () => void; showPass: boolean;
  onShowConfirm: () => void; showConfirm: boolean;
  onBack: () => void;
}) {
  return (
    <>
      <p className="auth-otp-hint">OTP sent to +91 {phone}</p>

      <div className="auth-form-group">
        <label className="auth-label">Enter OTP</label>
        <input className="auth-input auth-otp-input" type="tel" maxLength={6}
          placeholder="• • • • • •" required
          value={form.otp} onChange={e => onChange('otp', e.target.value)} />
      </div>

      <div className="auth-form-group">
        <label className="auth-label">Your Name <span className="auth-label-optional">(optional)</span></label>
        <input className="auth-input" type="text" placeholder="e.g. Arjun Sharma"
          value={form.name} onChange={e => onChange('name', e.target.value)} />
      </div>

      <div className="auth-form-group">
        <label className="auth-label">Password</label>
        <div className="auth-pass-row">
          <input className="auth-input" style={{ borderRadius: 12 }}
            type={showPass ? 'text' : 'password'} placeholder="Create a strong password" required
            value={form.password} onChange={e => onChange('password', e.target.value)} />
          <button type="button" className="auth-pass-toggle" aria-label={showPass ? 'Hide password' : 'Show password'} onClick={onShowPass}>
            <IonIcon icon={showPass ? Icons.eyeOff : Icons.eye} />
          </button>
        </div>
      </div>

      <div className="auth-form-group">
        <label className="auth-label">Confirm Password</label>
        <div className="auth-pass-row">
          <input className="auth-input" style={{ borderRadius: 12 }}
            type={showConfirm ? 'text' : 'password'} placeholder="Repeat your password" required
            value={form.confirm} onChange={e => onChange('confirm', e.target.value)} />
          <button type="button" className="auth-pass-toggle" aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'} onClick={onShowConfirm}>
            <IonIcon icon={showConfirm ? Icons.eyeOff : Icons.eye} />
          </button>
        </div>
      </div>

      <button className="auth-submit-btn" type="submit">Create Account</button>

      <button type="button" className="auth-back-btn" onClick={onBack}>
        ← Change Phone Number
      </button>
    </>
  );
}

const SignupPage: React.FC = () => {
  const history = useHistory();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [verifyForm, setVerifyForm] = useState({ otp: '', name: '', password: '', confirm: '' });

  function handleSendOTP() {
    if (!phone) return;
    setLoading(true);
    // hardcoded for now, Phase 2 will hit API
    setTimeout(() => { setLoading(false); setStep(2); }, 800);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // hardcoded for now, Phase 2 will hit API
    history.push('/home');
  }

  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="auth-page">
          <Navbar />
          <div className="auth-bg-grid" />
          <div className="auth-card">

   
            {/* step indicator */}
            <div className="auth-steps">
              <div className={`auth-step ${step >= 1 ? 'active' : ''}`}>
                <span className="auth-step-dot">{step > 1 ? '✓' : '1'}</span>
                <span className="auth-step-label">Phone</span>
              </div>
              <div className="auth-step-line" />
              <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>
                <span className="auth-step-dot">2</span>
                <span className="auth-step-label">Verify</span>
              </div>
            </div>

            <div className="auth-header">
              <h1 className="auth-title">
                {step === 1 ? 'Create your account' : 'Verify & set password'}
              </h1>
              <p className="auth-sub">
                {step === 1 ? 'Start your preventive heart health journey' : 'Almost there — just a few more details'}
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {step === 1
                ? <StepPhone phone={phone} onChange={setPhone} onSendOTP={handleSendOTP} loading={loading} />
                : <StepVerify
                    phone={phone}
                    form={verifyForm}
                    onChange={(k, v) => setVerifyForm({ ...verifyForm, [k]: v })}
                    onShowPass={() => setShowPass(!showPass)} showPass={showPass}
                    onShowConfirm={() => setShowConfirm(!showConfirm)} showConfirm={showConfirm}
                    onBack={() => setStep(1)}
                  />
              }
            </form>

            {step === 1 && (
              <>
                <div className="auth-divider">or</div>
                <button className="auth-google-btn" type="button">
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

            <p className="auth-switch">
              Already have an account?{' '}
              <button type="button" className="auth-switch-btn" onClick={() => history.push('/login')}>Sign in</button>
            </p>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SignupPage;
