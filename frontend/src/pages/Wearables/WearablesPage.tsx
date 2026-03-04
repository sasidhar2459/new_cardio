import { useEffect, useRef, useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { whyPoints, trackedData } from '../../data/mock_wearables';
import { Icons } from '../../lib/icons';
import { useReveal } from '../../hooks/useScrollReveal';
import './WearablesPage.css';

const HERO_PILLS = [
  { label: 'Heart Rate', value: '72 bpm', color: '#ef4444' },
  { label: 'Steps',      value: '11,200', color: '#22c55e' },
  { label: 'Sleep',      value: '7h 45m', color: '#a855f7' },
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
            <h1 className="wb-hero-title">Why Continuous<br />Data Matters.</h1>
            <p className="wb-hero-sub">
              Heart disease doesn't develop in a clinic — it develops in your daily life.
              By integrating continuous wearable data, Bypass can see what lab snapshots miss.
            </p>
            <IonButton className="btn-white" shape="round" href="/risk-assessment/form">
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
                    <span className="wb-hero-connected-dot" />
                    <span className="wb-hero-connected-text">Apple Watch Series 9 — Connected</span>
                  </div>
                  <div className="wb-hero-pills">
                    {HERO_PILLS.map(m => (
                      <div key={m.label} className="wb-hero-pill" style={{ borderColor: `${m.color}33` }}>
                        <span className="wb-hero-pill-dot" style={{ background: m.color }} />
                        <span className="wb-hero-pill-label">{m.label}</span>
                        <span className="wb-hero-pill-value" style={{ color: m.color }}>{m.value}</span>
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
            {whyPoints.map((pt, i) => (
              <div key={i} className="wb-why-item">
                <span className="wb-why-num">0{i + 1}</span>
                <span className="wb-why-text">{pt}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Tracked Data Section ──────────────────────────────────────────────
function TrackedSection() {
  const { ref, visible } = useReveal();
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

        <div ref={ref} className={`wb-tracked-grid ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          {trackedData.map((item, i) => (
            <div key={i} className="wb-tracked-card">
              <span className="wb-tracked-num">0{i + 1}</span>
              <div className="wb-tracked-body">
                <p className="wb-tracked-label">{item.label}</p>
                <p className="wb-tracked-desc">{item.desc}</p>
              </div>
              <span className="wb-tracked-arrow">→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// sparkline for showcase cards — white lines on dark bg
function WbSparkline({ points }: { points: number[] }) {
  const w = 200; const h = 80;
  const max = Math.max(...points); const min = Math.min(...points);
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(p => h - ((p - min) / (max - min || 1)) * h * 0.75 - h * 0.1);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="wb-sparkline">
      {/* dashed verticals */}
      {xs.map((x, i) => (
        <line key={`v${i}`} x1={x} y1={ys[i]} x2={x} y2={h}
          stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3,4" />
      ))}
      <path d={d} fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle key={`c${i}`} cx={x} cy={ys[i]} r="3.5" fill="#fff" />
      ))}
    </svg>
  );
}

// bg colors cycling per card
const trackedBgs = ['#1a1a1a','#1e2a1e','#1a1820','#111418','#2a1f18','#151e18','#1a1624'];

// ── Showcase Section ──────────────────────────────────────────────────
function ShowcaseSection() {
  // duplicate for infinite scroll
  const all = [...trackedData, ...trackedData];
  return (
    <section className="wb-showcase-section">
      <div className="container">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Ongoing Data We Track</p>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>Your Daily Health Becomes<br />Part of Your Story</h2>
        <p className="wb-section-sub">
          Every data point builds a fuller picture of your cardiovascular health — not just a snapshot, but a continuous narrative.
        </p>
      </div>

      {/* full-bleed carousel */}
      <div className="wb-carousel-outer">
        <div className="wb-carousel-track">
          {all.map((item, i) => (
            <div
              key={i}
              className="wb-showcase-card"
              style={{ background: trackedBgs[i % trackedBgs.length] }}
            >
              {/* desc at top */}
              <p className="wb-card-category">{item.desc}</p>

              {/* big label as metric */}
              <div className="wb-card-metric-row">
                <span className="wb-card-metric" style={{ fontSize: '32px', letterSpacing: '-1px' }}>{item.label}</span>
              </div>

              {/* uppercase tag */}
              <p className="wb-card-label">CONTINUOUS</p>

              {/* sparkline */}
              <div className="wb-card-chart">
                <WbSparkline points={[60,55,50,44,38,32,25]} />
              </div>

              {/* dates */}
              <div className="wb-card-dates">
                {['Jan 20', 'Jun 29', 'Oct 03', 'Jan 03'].map((d, j) => (
                  <span key={j}>{d}</span>
                ))}
              </div>
            </div>
          ))}
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
        <ShowcaseSection />
        <CTASection />
        <Footer />
      </div>
    </IonContent>
  </IonPage>
);

export default WearablesPage;
