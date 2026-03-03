import { useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './AuthPage.css';

const LoginPage: React.FC = () => {
  const history = useHistory();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // hardcoded for now, Phase 2 will hit API
    history.push('/home');
  }

  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="auth-page">
          <div className="auth-bg-grid" />
          <div className="auth-card">

            <a className="auth-logo" href="/home">
              <span className="auth-logo-mark">bypass</span>
              <span className="auth-logo-suffix">Heart Health</span>
            </a>

            <div className="auth-header">
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-sub">Sign in to your Bypass account</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-form-group">
                <label className="auth-label">Phone Number</label>
                <div className="auth-phone-row">
                  <span className="auth-phone-prefix">🇮🇳 +91</span>
                  <input className="auth-input auth-phone-input" type="tel"
                    placeholder="98765 43210" required
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>

              <div className="auth-form-group">
                <label className="auth-label">Password</label>
                <div className="auth-pass-row">
                  <input className="auth-input" style={{ borderRadius: 12 }}
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password" required
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  <button type="button" className="auth-pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                <span className="auth-forgot">Forgot password?</span>
              </div>

              <button className="auth-submit-btn" type="submit">Sign In</button>
            </form>

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

            <p className="auth-switch">
              Don't have an account?{' '}
              <a onClick={() => history.push('/signup')}>Sign up free</a>
            </p>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
