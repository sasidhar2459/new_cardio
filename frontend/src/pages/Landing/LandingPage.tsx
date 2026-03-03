import React from 'react';
import { IonButton, IonPage, IonContent } from '@ionic/react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useReveal, useSlideReveal } from '../../hooks/useScrollReveal';
import './LandingPage.css';

// ── Hero ──────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="hero">
      <video className="hero-video" autoPlay muted loop playsInline>
        <source src="/bgvideo.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>
      <div className="hero-bg-grid" />
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
  const { ref: textRef, visible: textVis, from: textFrom } = useSlideReveal('left');
  const { ref: imgRef, visible: imgVis, from: imgFrom } = useSlideReveal('right');
  return (
    <section className="who-section">
      <div className="container">
        <div className="who-grid">
          <div
            ref={textRef}
            className={`who-text slide-${textFrom} ${textVis ? 'slide-in' : 'slide-hidden'}`}
          >
            <h2 className="who-heading">Who we are.</h2>
            <p className="who-lead">
              Bypass is India's first comprehensive, cardiologist-designed preventive heart program.
            </p>
            <p className="who-body">
              We combine advanced diagnostics, continuous monitoring, and personalized medical care to help you stay ahead of heart disease—long before symptoms appear.
            </p>
            <div className="who-actions">
              <IonButton className="btn-white" shape="round" href="/contact">Get in Touch</IonButton>
            </div>
          </div>
          {/* image right side — drop a real clinic/team photo here */}
          <div
            ref={imgRef}
            className={`who-image-wrap slide-${imgFrom} ${imgVis ? 'slide-in' : 'slide-hidden'}`}
          >
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
  const { ref, visible } = useReveal();
  return (
    <section className="principles-section">
      <div className="container">
        <div ref={ref} className={visible ? 'reveal-in' : 'reveal-hidden'}>
          <p className="section-eyebrow">Principles</p>
          <h2 className="section-heading text-center">
            How we combine medical excellence, technology,<br />and personalization to transform heart care.
          </h2>
        </div>
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
  const { ref, visible } = useReveal();
  return (
    <section className="mission-section">
      <div className="container">
        <div ref={ref} className={`mission-inner ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
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
  {
    q: 'What if I already got the tests done recently?',
    a: 'If you have recent test results (within the last 3–6 months), our team will review them and let you know which, if any, tests need to be repeated. We never ask for unnecessary testing.',
  },
  {
    q: 'How long is the membership valid and what happens after that?',
    a: 'Your membership is valid for 12 months from activation. After that, you can renew at the same or updated rate. Your health data and history remain accessible throughout and after your membership.',
  },
  {
    q: 'Why are so many screenings needed?',
    a: 'Heart disease develops silently over years. A comprehensive baseline — covering biomarkers, imaging, and lifestyle factors — lets us catch risk early and personalise your plan rather than relying on generic advice.',
  },
  {
    q: 'Will you consider my old test results also?',
    a: 'Yes. Upload any previous reports and our physicians will incorporate them into your assessment. Historical data actually strengthens our ability to spot trends over time.',
  },
];

// ── Individual FAQ item with staggered reveal ────────
function FAQItem({ item, index, isOpen, onToggle }: { item: typeof faqs[0]; index: number; isOpen: boolean; onToggle: () => void }) {
  const { ref, visible } = useReveal(index * 100); // stagger each by 100ms
  return (
    <div
      ref={ref}
      className={`faq-item${isOpen ? ' faq-item--open' : ''} ${visible ? 'reveal-in' : 'reveal-hidden'}`}
      onClick={onToggle}
    >
      <div className="faq-row">
        <span className="faq-question">{item.q}</span>
        <span className="faq-icon">{isOpen ? '⊖' : '⊕'}</span>
      </div>
      <div className="faq-answer">
        <p>{item.a}</p>
      </div>
    </div>
  );
}

function FAQSection() {
  const [open, setOpen] = React.useState<number | null>(null);
  const { ref: headRef, visible: headVis } = useReveal();
  const { ref: ctaRef, visible: ctaVis } = useReveal();

  const toggle = (i: number) => setOpen(prev => (prev === i ? null : i));

  return (
    <section className="faq-section">
      <div className="container">
        <div ref={headRef} className={headVis ? 'reveal-in' : 'reveal-hidden'}>
          <h2 className="section-heading text-center">Common Questions</h2>
          <p className="section-sub text-center">Everything you need to know about Bypass</p>
        </div>
        <div className="faq-list">
          {faqs.map((item, i) => (
            <FAQItem key={i} item={item} index={i} isOpen={open === i} onToggle={() => toggle(i)} />
          ))}
        </div>
        <div ref={ctaRef} className={`faq-cta-card ${ctaVis ? 'reveal-in' : 'reveal-hidden'}`}>
          <h3>Still have questions?</h3>
          <p>Can't find the answer you're looking for? Please talk to our team.</p>
          <IonButton className="btn-white" shape="round" href="/contact">Contact us</IonButton>
        </div>
      </div>
    </section>
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
          <MissionSection />
          <PrinciplesSection />
          <FAQSection />
          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
}
