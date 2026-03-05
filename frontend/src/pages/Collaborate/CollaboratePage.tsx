import { useState } from 'react';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Icons } from '../../lib/icons';
import { useReveal } from '../../hooks/useScrollReveal';
import './CollaboratePage.css';

// ── Contact Modal ──────────────────────────────────────────────────
function ContactModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', org: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // hardcoded for now, Phase 2 will hit API
    setSubmitted(true);
  }

  return (
    <div className="col-modal-overlay" onClick={onClose}>
      <div className="col-modal" onClick={e => e.stopPropagation()}>
        <button className="col-modal-close" onClick={onClose}>
          <IonIcon icon={Icons.close} />
        </button>

        <div className="col-modal-head">
          <p className="col-modal-kicker">Partnership Team</p>
          <h2 className="col-modal-title">Request a Callback</h2>
          <p className="col-modal-sub">Fill in your details and we will get in touch shortly.</p>
        </div>

        {submitted ? (
          <div className="col-modal-success">
            <div className="col-success-icon">
              <IonIcon icon={Icons.checkmark} />
            </div>
            <h3 className="col-success-title">Request Received!</h3>
            <p className="col-success-sub">Our team will reach out within 24 hours.</p>
            <IonButton className="btn-white" shape="round" onClick={onClose}>Done</IonButton>
          </div>
        ) : (
          <div className="col-modal-body">
            <form className="col-modal-form" onSubmit={handleSubmit}>
              <div className="col-form-group">
                <label className="col-form-label">Full Name <span className="col-required">*</span></label>
                <input className="col-form-input" type="text" placeholder="Dr. / Mr. / Ms." required
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>

              <div className="col-form-group">
                <label className="col-form-label">Email <span className="col-required">*</span></label>
                <input className="col-form-input" type="email" placeholder="your@email.com" required
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>

              <div className="col-form-group">
                <label className="col-form-label">Phone <span className="col-required">*</span></label>
                <div className="col-phone-row">
                  <span className="col-phone-prefix">🇮🇳 +91</span>
                  <input className="col-form-input col-phone-input" type="tel" placeholder="98765 43210" required
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>

              <div className="col-form-group">
                <label className="col-form-label">Organisation / Hospital</label>
                <input className="col-form-input" type="text" placeholder="Clinic, hospital or company name"
                  value={form.org} onChange={e => setForm({ ...form, org: e.target.value })} />
              </div>

              <div className="col-form-group">
                <label className="col-form-label">Message</label>
                <textarea className="col-form-input col-form-textarea" placeholder="Tell us about your requirement"
                  value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>

              <button className="col-submit-btn" type="submit">Send Request</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────────────────
function ColHero({ onContact }: { onContact: () => void }) {
  return (
    <section className="col-hero">
      <div className="col-hero-bg-grid" />
      <div className="container">
        <div className="col-hero-inner">
          <p className="section-eyebrow" style={{ textAlign: 'center' }}>Collaborate</p>
          <h1 className="col-hero-title">Partner With<br /><span className="col-hero-accent">Bypass.</span></h1>
          <p className="col-hero-sub">
            Whether you're a cardiologist, a hospital, or a corporate — join hands with Bypass to bring India's most advanced preventive heart health program to your patients and employees.
          </p>
          <div className="col-hero-btns">
            <IonButton className="btn-white" shape="round" onClick={onContact}>
              <IonIcon slot="start" icon={Icons.mail} />
              Get in Touch
            </IonButton>
            <IonButton className="btn-outline-white" shape="round" fill="outline" href="/about">
              Meet the Team
            </IonButton>
          </div>
        </div>
        <div className="col-hero-stats">
          {[
            { num: '500+', label: 'Patients Enrolled' },
            { num: '30+', label: 'Partner Doctors' },
            { num: '15+', label: 'Corporate Clients' },
            { num: '95%', label: 'Patient Satisfaction' },
          ].map((s, i) => (
            <div key={i} className="col-hero-stat">
              <span className="col-hero-stat-num">{s.num}</span>
              <span className="col-hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Partnership tracks ─────────────────────────────────────────────
const TRACKS = [
  {
    icon: Icons.medical,
    title: 'Cardiologists & Doctors',
    desc: 'Partner with Bypass to refer your high-risk patients into a structured preventive care program — with detailed reports sent back to you.',
    items: ['Receive detailed risk reports for referred patients', 'Co-manage patients with our clinical team', 'CME-accredited educational sessions', 'Preferred specialist referral network'],
    color: '#ef4444',
  },
  {
    icon: Icons.people,
    title: 'Hospitals & Clinics',
    desc: 'Integrate Bypass\'s preventive cardiology program into your outpatient or wellness department.',
    items: ['Branded preventive cardiology OPD', 'Joint screening camps & health drives', 'Staff training on cardiac risk assessment', 'Revenue-sharing partnership model'],
    color: 'rgba(160,230,160,0.9)',
  },
  {
    icon: Icons.trending,
    title: 'Corporates & Employers',
    desc: 'Protect your workforce with India\'s most comprehensive cardiac risk screening and management program.',
    items: ['Group health screening packages', 'On-site cardiac risk assessment camps', 'Employee wellness dashboards', 'Reduced absenteeism & insurance costs'],
    color: '#3b82f6',
  },
  {
    icon: Icons.shield,
    title: 'Insurance Companies',
    desc: 'Use Bypass\'s validated risk scores to power preventive wellness benefits and underwriting decisions.',
    items: ['Cardiac risk stratification for policyholders', 'Preventive wellness add-on programs', 'Claims reduction through early intervention', 'Customised reporting for actuarial use'],
    color: '#f59e0b',
  },
];

function TracksSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="col-tracks-section">
      <div className="container">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Who We Work With</p>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>Partnership Programs</h2>
        <p className="section-sub" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 56px' }}>
          From individual cardiologists to large corporates — Bypass has a structured program for every kind of partner.
        </p>
        <div ref={ref} className={`col-tracks-grid ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          {TRACKS.map((t, i) => (
            <div key={i} className="col-track-card" style={{ '--track-color': t.color } as React.CSSProperties}>
              <div className="col-track-icon-wrap" style={{ background: `rgba(255,255,255,0.05)`, border: '1px solid rgba(255,255,255,0.1)' }}>
                <IonIcon icon={t.icon} style={{ color: t.color, fontSize: 22 }} />
              </div>
              <h3 className="col-track-title">{t.title}</h3>
              <p className="col-track-desc">{t.desc}</p>
              <ul className="col-track-items">
                {t.items.map((item, j) => (
                  <li key={j} className="col-track-item">
                    <span className="col-track-dot" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why partner ────────────────────────────────────────────────────
const WHY_POINTS = [
  { icon: Icons.pulse,    title: 'Clinically Validated',    desc: 'Our protocols are designed by senior cardiologists and follow ACC/AHA prevention guidelines.' },
  { icon: Icons.analytics, title: 'Detailed Reporting',    desc: 'Every patient gets a comprehensive cardiac risk report — shared with the referring doctor.' },
  { icon: Icons.trending, title: 'Measurable Outcomes',    desc: 'Partners see significant improvement in patient risk scores within 6 months of enrollment.' },
  { icon: Icons.watch,    title: 'Continuous Monitoring',  desc: 'Wearables + regular lab reviews give your patients ongoing cardiac oversight between visits.' },
  { icon: Icons.people,   title: 'Dedicated Support',      desc: 'A dedicated partnership manager handles onboarding, operations, and patient coordination.' },
  { icon: Icons.ribbon,   title: 'India-First Program',    desc: 'Built specifically for the Indian population — accounting for unique genetic and lifestyle risk factors.' },
];

function WhySection() {
  const { ref, visible } = useReveal();
  return (
    <section className="col-why-section">
      <div className="container">
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>Why Partner With Us</p>
        <h2 className="section-heading" style={{ textAlign: 'center' }}>What You Get</h2>
        <div ref={ref} className={`col-why-grid ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          {WHY_POINTS.map((w, i) => (
            <div key={i} className="col-why-card">
              <div className="col-why-icon-wrap">
                <IonIcon icon={w.icon} style={{ fontSize: 20, color: 'rgba(160,230,160,0.9)' }} />
              </div>
              <h4 className="col-why-title">{w.title}</h4>
              <p className="col-why-desc">{w.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ────────────────────────────────────────────────────────────
function ColCTA({ onContact }: { onContact: () => void }) {
  const { ref, visible } = useReveal();
  return (
    <section className="col-cta-section">
      <div className="container">
        <div ref={ref} className={`col-cta-card ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          <div className="col-cta-bg-dots" />
          <p className="section-eyebrow">Let's Talk</p>
          <h2 className="col-cta-title">Ready to protect more hearts<br />together?</h2>
          <p className="col-cta-sub">Reach out and our team will get back to you within 24 hours</p>
          <IonButton className="btn-white" shape="round" onClick={onContact}>
            Get in Touch
          </IonButton>
        </div>
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────
const CollaboratePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="col-page">
          <Navbar />

          <ColHero onContact={() => setShowModal(true)} />
          <ColCTA onContact={() => setShowModal(true)} />
          <Footer />
        </div>
        {showModal && <ContactModal onClose={() => setShowModal(false)} />}
      </IonContent>
    </IonPage>
  );
};

export default CollaboratePage;
