import { useEffect, useRef, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { whyPoints, trackedData } from '../../data/mock_wearables';
import { Icons } from '../../lib/icons';
import { useReveal } from '../../hooks/useScrollReveal';
import './WearablesPage.css';

const HERO_PILLS = [
  { label: 'Heart Rate', value: '72 bpm', color: '#d46a6a', icon: Icons.heart },
  { label: 'Steps',      value: '11,200', color: '#3d9b76', icon: Icons.walk },
  { label: 'Sleep',      value: '7h 45m', color: '#7f6ab8', icon: Icons.moon },
];

// ── Hero ──────────────────────────────────────────────────────────────
function WearablesHero() {
  const [cardState, setCardState] = useState<'idle' | 'connecting' | 'connected'>('idle');

  function handleConnect() {
    setCardState('connecting');
    setTimeout(() => setCardState('connected'), 2800);
  }

  return (
    <section className="wb-hero">
      <div className="hero-bg-grid" />
      <div className="container">
        <div className="wb-hero-grid">
          <div className="wb-hero-left">
            <p className="section-eyebrow">Wearables</p>
            <h1 className="wb-hero-title">Why Continuous<br />Data <span className="wb-hero-accent">Matters.</span></h1>
            <p className="wb-hero-sub">
              Heart disease doesn't develop in a clinic — it develops in your daily life.
              By integrating continuous wearable data, Bypass can see what lab snapshots miss.
            </p>
            <IonButton className="btn-white start-assessment-btn" shape="round" href="/risk-assessment/form">
              Start Your Assessment
            </IonButton>
          </div>

          {/* right — interactive connect card */}
          <div className="wb-hero-right">
            <div className={`wb-hero-connect-card ${cardState === 'connected' ? 'wb-hcc-connected' : ''}`}>
              <p className="section-eyebrow">Your Personal Dashboard</p>

              {/* ── idle: show connect button with animated bg ── */}
              {cardState === 'idle' && (
                <>
                  <h2 className="wb-hero-connect-title">Connect Your Device.<br />See Your Data.</h2>
                  <p className="wb-hero-connect-sub">
                    Pair your wearable in seconds — heart rate, sleep, steps, weight and more in one place.
                  </p>
                  <button className="wb-hero-connect-btn" onClick={handleConnect}>
                    <span className="wb-hcb-bg" />
                    <IonIcon icon={Icons.bluetooth} className="wb-hcb-icon" />
                    <span className="wb-hcb-label">Connect Device</span>
                  </button>
                </>
              )}

              {/* ── connecting: bluetooth symbol + radiating rings ── */}
              {cardState === 'connecting' && (
                <div className="wb-hero-scanning">
                  <div className="wb-bt-anim">
                    <span className="wb-bt-ring wb-bt-ring-1" />
                    <span className="wb-bt-ring wb-bt-ring-2" />
                    <span className="wb-bt-ring wb-bt-ring-3" />
                    {/* center circle with SVG bluetooth symbol */}
                    <div className="wb-bt-center">
                      <svg className="wb-bt-symbol" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Classic Bluetooth: vertical stem + upper-right + lower-right chevrons */}
                        <line x1="12" y1="3" x2="12" y2="21" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" />
                        <polyline points="7,8 17,15 12,18" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        <polyline points="7,16 17,9 12,6" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </div>
                  </div>
                  <p className="wb-hero-scanning-label">Connecting…</p>
                  <div className="wb-scan-dots"><span /><span /><span /></div>
                </div>
              )}

              {/* ── connected: show dashboard preview ── */}
              {cardState === 'connected' && (
                <>
                  <div className="wb-hero-connected-row">
                    <span className="wb-hero-connected-device">
                      <IonIcon icon={Icons.watch} className="wb-hero-connected-icon" />
                      <span>Apple Watch Series 9</span>
                    </span>
                    <span className="wb-hero-connected-state">
                      <span className="wb-hero-connected-dot" />
                      <span>Connected</span>
                    </span>
                  </div>
                  <div className="wb-hero-pills">
                    {HERO_PILLS.map(m => (
                      <div key={m.label} className="wb-hero-pill" style={{ '--wb-pill-accent': m.color } as React.CSSProperties}>
                        <IonIcon icon={m.icon} className="wb-hero-pill-icon" />
                        <span className="wb-hero-pill-label">{m.label}</span>
                        <span className="wb-hero-pill-value">{m.value}</span>
                      </div>
                    ))}
                  </div>
                  <IonButton className="btn-green" shape="round" href="/wearables/dashboard">
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

// ── Why Section ───────────────────────────────────────────────────────
function WhySection() {
  const { ref, visible } = useReveal();
  return (
    <section className="wb-why-section">
      <div className="container">
        <div className="wb-why-grid">

          {/* left — heading */}
          <div className="wb-why-left">
            <p className="section-eyebrow">The Case for Wearables</p>
            <h2 className="wb-why-title">By integrating<br />continuous data,<br />Bypass can:</h2>
            <p className="wb-why-quote">
              "This is prevention at its highest level."
            </p>
          </div>

          {/* right — bullet list */}
          <div ref={ref} className={`wb-why-right ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
            <div className="wb-why-loop-viewport">
              <div className="wb-why-loop-track">
                {whyPoints.map((pt, i) => (
                  <div key={`why-a-${i}`} className="wb-why-item">
                    <span className="wb-why-text">{pt}</span>
                  </div>
                ))}
                {whyPoints.map((pt, i) => (
                  <div key={`why-b-${i}`} className="wb-why-item" aria-hidden="true">
                    <span className="wb-why-text">{pt}</span>
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

// ── Tracked Data Section ──────────────────────────────────────────────
function TrackedSection() {
  return (
    <section className="wb-tracked-section">
      <div className="container">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Ongoing Data We Track</p>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>
          Your Daily Health Becomes<br />Part of Your Story
        </h2>
        <p className="wb-section-sub">
          Every data point builds a fuller picture of your cardiovascular health — not just a snapshot, but a continuous narrative.
        </p>

        <div className="wb-tracked-stack">
          {trackedData.map((item, i) => (
            <div
              key={i}
              className="wb-tracked-stack-item"
              style={{ zIndex: i + 1 }}
            >
              <div
                className="wb-tracked-card"
                style={{
                  '--wb-tracked-bg': (item as any).bg || '#d7edf1',
                  '--wb-tracked-top': (item as any).topLayer || '#d9d2f2',
                  '--wb-tracked-accent': (item as any).accent || '#5b7cfa',
                } as React.CSSProperties}
              >
                <div className="wb-tracked-media">
                  <img src={(item as any).image} alt={item.label} loading="lazy" className="wb-tracked-image" />
                </div>
                <div className="wb-tracked-content">
                  <span className="wb-tracked-tag">{(item as any).tag}</span>
                  <span className="wb-tracked-num">0{i + 1}</span>
                  <p className="wb-tracked-label">{item.label}</p>
                  <p className="wb-tracked-headline">{(item as any).headline}</p>
                  <p className="wb-tracked-desc">{item.desc}</p>
                  <div className="wb-tracked-stats">
                    <div className="wb-tracked-stat">
                      <span className="wb-tracked-stat-value">{(item as any).statA}</span>
                      <span className="wb-tracked-stat-label">{(item as any).statALabel}</span>
                    </div>
                    <div className="wb-tracked-stat">
                      <span className="wb-tracked-stat-value">{(item as any).statB}</span>
                      <span className="wb-tracked-stat-label">{(item as any).statBLabel}</span>
                    </div>
                  </div>
                </div>
                <span className="wb-tracked-arrow">→</span>
              </div>
            </div>
          ))}
          <div className="wb-tracked-stack-tail" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────
function CTASection() {
  const { ref, visible } = useReveal();
  return (
    <section className="wb-cta-section">
      <div className="container">
        <div ref={ref} className={`wb-cta-card ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          <p className="section-eyebrow">Get Connected</p>
          <h2 className="wb-cta-title">Connect your wearable.<br />Start your story.</h2>
          <p className="wb-cta-sub">Pair your device in minutes. Your data, your outcomes.</p>
          <IonButton className="btn-white" shape="round" href="/risk-assessment/form">
            Begin Assessment
          </IonButton>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────
const WearablesPage: React.FC = () => (
  <IonPage>
    <IonContent fullscreen scrollY>
      <div className="wb-page">
        <Navbar />

        <WearablesHero />
        <WhySection />
        <TrackedSection />
        <CTASection />
        <Footer />
      </div>
    </IonContent>
  </IonPage>
);

export default WearablesPage;
