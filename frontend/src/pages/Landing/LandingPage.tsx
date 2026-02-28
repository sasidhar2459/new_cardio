import { IonButton, IonPage, IonContent } from '@ionic/react';
import Navbar from '../../components/layout/Navbar';
import './LandingPage.css';

// ── Hero ──────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="hero">
      <video className="hero-video" autoPlay muted loop playsInline>
        <source src="/bgvideo.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>
      <div className="hero-content-wrapper">
        <h1 className="hero-title">BYPASS HEART HEALTH</h1>
        <h2 className="hero-subtitle">Stronger Heart. Longer Life. Powered by Science.</h2>
        <p className="hero-desc">
          A clinical-grade preventive heart health program designed to help you know your true cardiac risk—and reduce it with precision.
        </p>
        <div className="hero-actions">
          <IonButton className="btn-hero-primary" shape="round" href="/signup">
            Get Started
          </IonButton>
          <IonButton className="btn-hero-secondary" shape="round" fill="outline" href="/treatment">
            Our Approach
          </IonButton>
        </div>
      </div>
    </section>
  );
}

// ── Who We Are ────────────────────────────────────────
function WhoWeAreSection() {
  return (
    <section className="who-section">
      <div className="container">
        <div className="who-grid">
          <div className="who-text">
            <h2 className="who-heading">Who we are.</h2>
            <p className="who-lead">
              Bypass is India's first comprehensive, cardiologist-designed preventive heart program.
            </p>
            <p className="who-body">
              We combine advanced diagnostics, continuous monitoring, and personalized medical care to help you stay ahead of heart disease—long before symptoms appear.
            </p>
            <div className="who-actions">
              <IonButton className="btn-white" shape="round" href="/contact">Get in Touch</IonButton>
              <IonButton className="btn-outline-white" shape="round" fill="outline" href="/treatment">Our Approach</IonButton>
            </div>
          </div>
          {/* image right side — drop a real clinic/team photo here */}
          <div className="who-image-wrap">
            <div className="who-image-placeholder">
              <div className="who-image-inner" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Principles ────────────────────────────────────────
const principles = [
  { title: 'Prevention First', desc: 'Prioritize early detection, risk assessment, and lifestyle intervention to prevent heart disease before it becomes critical.' },
  { title: 'Patient-Centered Care', desc: "Every decision is made around the patient's needs, comfort, safety, and long-term health outcomes." },
  { title: 'Evidence-Based Medicine', desc: 'All diagnostics, treatments, and protocols are guided by the latest scientific research and global cardiology standards.' },
  { title: 'Precision & Personalization', desc: 'Recognize that every heart is different — tailor treatment plans based on genetics, lifestyle, risk factors, and individual health data.' },
  { title: 'Clinical Excellence', desc: 'Maintain the highest standards in cardiology expertise, surgical skill, and medical technology.' },
  { title: 'Continuous Monitoring & Innovation', desc: 'Leverage advanced diagnostics, AI, wearables, and remote monitoring to improve outcomes and enable proactive care.' },
  { title: 'Multidisciplinary Collaboration', desc: 'Cardiologists, surgeons, nutritionists, physiotherapists, psychologists, and primary care teams work together for holistic care.' },
  { title: 'Transparency & Trust', desc: 'Provide clear communication about diagnosis, risks, costs, and treatment options to build patient confidence.' },
  { title: 'Accessibility & Affordability', desc: 'Make quality cardiovascular care reachable to diverse populations regardless of socioeconomic status.' },
  { title: 'Long-Term Partnership', desc: 'Support patients beyond treatment — rehabilitation, lifestyle coaching, and lifelong heart health management.' },
  { title: 'Safety & Quality Assurance', desc: 'Commit to zero-harm culture, strict infection control, and continuous quality improvement.' },
  { title: 'Compassion & Humanity', desc: 'Treat patients with empathy, dignity, and emotional support — not just clinical expertise.' },
];

// split into two rows for the marquee — 6 each
const row1 = principles.slice(0, 6);
const row2 = principles.slice(6);

function PrinciplesSection() {
  return (
    <section className="principles-section">
      <div className="container">
        <p className="section-eyebrow">Principles</p>
        <h2 className="section-heading text-center">
          How we combine medical excellence, technology,<br />and personalization to transform heart care.
        </h2>
      </div>

      {/* row 1 — scrolls left */}
      <div className="marquee-wrap">
        <div className="marquee-track marquee-left">
          {[...row1, ...row1].map((p, i) => (
            <div className="principle-card" key={i}>
              <div className="principle-card-content">
                <span className="principle-num">{String((i % row1.length) + 1).padStart(2, '0')}</span>
                <h3 className="principle-title">{p.title}</h3>
                <p className="principle-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* row 2 — scrolls right */}
      <div className="marquee-wrap">
        <div className="marquee-track marquee-right">
          {[...row2, ...row2].map((p, i) => (
            <div className="principle-card" key={i}>
              <div className="principle-card-content">
                <span className="principle-num">{String((i % row2.length) + 7).padStart(2, '0')}</span>
                <h3 className="principle-title">{p.title}</h3>
                <p className="principle-desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Mission ───────────────────────────────────────────
function MissionSection() {
  return (
    <section className="mission-section">
      <div className="container">
        <div className="mission-inner">
          <p className="section-eyebrow">Our Mission</p>
          <h2 className="mission-text">
            To reduce preventable heart attacks in India by making world-class prevention accessible, evidence-based, and measurable.
          </h2>
          <IonButton className="btn-white" shape="round" href="/contact">Get in Touch</IonButton>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────
const faqs = [
  'What if I already got the tests done recently?',
  'How long is the membership valid and what happens after that?',
  'Why are so many screenings needed?',
  'Will you consider my old test results also?',
];

function FAQSection() {
  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="section-heading text-center">Common Questions</h2>
        <p className="section-sub text-center">Everything you need to know about Bypass</p>
        <div className="faq-list">
          {faqs.map((q, i) => (
            <div className="faq-item" key={i}>
              <span>{q}</span>
              <span className="faq-icon">⊕</span>
            </div>
          ))}
        </div>
        <div className="faq-cta-card">
          <h3>Still have questions?</h3>
          <p>Can't find the answer you're looking for? Please talk to our team.</p>
          <IonButton className="btn-white" shape="round" href="/contact">Get in touch</IonButton>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <a href="/" className="navbar-logo">
            <span className="logo-mark">bypass</span>
            <span className="logo-suffix">HEART HEALTH</span>
          </a>
          <div className="footer-links">
            <a href="/home">Home</a>
            <a href="/about">About Us</a>
            <a href="/treatment">Treatment</a>
            <a href="/wearables">Wearables</a>
            <a href="/collaborate">Collaborate</a>
          </div>
          <div className="footer-auth">
            <a href="/login">Login</a>
            <a href="/signup" className="btn-join-footer">Join Now</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Bypass Heart Health. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────
export default function LandingPage() {
  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="landing">
          <Navbar />
          <HeroSection />
          <WhoWeAreSection />
          <PrinciplesSection />
          <MissionSection />
          <FAQSection />
          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
}
