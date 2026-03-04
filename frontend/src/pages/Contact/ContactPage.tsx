import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useReveal, useSlideReveal } from '../../hooks/useScrollReveal';
import './ContactPage.css';

const reasons = [
  'General Inquiry',
  'Program Enrollment',
  'Medical Question',
  'Partnership / Collaboration',
  'Press & Media',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = React.useState({ name: '', email: '', phone: '', reason: '', message: '' });
  const [submitted, setSubmitted] = React.useState(false);
  const { ref: heroRef, visible: heroVis } = useReveal();
  const { ref: infoRef, visible: infoVis, from: infoFrom } = useSlideReveal('left');
  const { ref: formRef, visible: formVis, from: formFrom } = useSlideReveal('right');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 1 — open Gmail compose with pre-filled subject/body
    const subject = encodeURIComponent(`[${form.reason || 'Inquiry'}] from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nReason: ${form.reason}\n\n${form.message}`
    );
    window.open(`https://mail.google.com/mail/?view=cm&to=bypasshearthealth@gmail.com&su=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="contact-page">
          <Navbar />


          {/* ── Hero ── */}
          <section className="contact-hero">
            <div className="hero-bg-grid" />
            <div className="container">
              <div ref={heroRef} className={heroVis ? 'reveal-in' : 'reveal-hidden'}>
                <p className="section-eyebrow">Contact Us</p>
                <h1 className="contact-hero-title">Let's talk about your heart health.</h1>
                <p className="contact-hero-desc">
                  Whether you have questions about our program, want to enroll, or just need guidance — our team is here for you.
                </p>
              </div>
            </div>
          </section>

          {/* ── Main grid ── */}
          <section className="contact-main">
            <div className="container">
              <div className="contact-grid">

                {/* Left — info cards */}
                <div ref={infoRef} className={`contact-info slide-${infoFrom} ${infoVis ? 'slide-in' : 'slide-hidden'}`}>
                  <div className="contact-info-card">
                    <div className="contact-info-icon">✉</div>
                    <div>
                      <h4>Email us</h4>
                      <p>bypasshearthealth@gmail.com</p>
                    </div>
                  </div>
                  <div className="contact-info-card">
                    <div className="contact-info-icon">🕐</div>
                    <div>
                      <h4>Response time</h4>
                      <p>We typically respond within 24 hours on business days.</p>
                    </div>
                  </div>
                  <div className="contact-info-card">
                    <div className="contact-info-icon">❤</div>
                    <div>
                      <h4>Medical queries</h4>
                      <p>For urgent cardiac symptoms, please call emergency services immediately.</p>
                    </div>
                  </div>
                  <div className="contact-trust">
                    <p className="contact-trust-label">Trusted by patients across India</p>
                    <div className="contact-trust-stats">
                      <div className="contact-trust-stat">
                        <span className="contact-trust-num">500+</span>
                        <span className="contact-trust-sub">Patients enrolled</span>
                      </div>
                      <div className="contact-trust-stat">
                        <span className="contact-trust-num">98%</span>
                        <span className="contact-trust-sub">Satisfaction rate</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right — form */}
                <div ref={formRef} className={`contact-form-wrap slide-${formFrom} ${formVis ? 'slide-in' : 'slide-hidden'}`}>
                  {submitted ? (
                    <div className="contact-success">
                      <div className="contact-success-icon">✓</div>
                      <h3>Message sent!</h3>
                      <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                      <button className="contact-back-btn" onClick={() => setSubmitted(false)}>Send another message</button>
                    </div>
                  ) : (
                    <form className="contact-form" onSubmit={handleSubmit} noValidate>
                      <div className="contact-form-row">
                        <div className="contact-field">
                          <label>Full Name <span className="req">*</span></label>
                          <input type="text" placeholder="Dr. Ravi Kumar" value={form.name} onChange={set('name')} required />
                        </div>
                        <div className="contact-field">
                          <label>Email Address <span className="req">*</span></label>
                          <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                        </div>
                      </div>
                      <div className="contact-form-row">
                        <div className="contact-field">
                          <label>Phone Number</label>
                          <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                        </div>
                        <div className="contact-field">
                          <label>Reason for contact <span className="req">*</span></label>
                          <select value={form.reason} onChange={set('reason')} required>
                            <option value="">Select a reason…</option>
                            {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="contact-field contact-field-full">
                        <label>Message <span className="req">*</span></label>
                        <textarea
                          placeholder="Tell us what's on your mind — the more detail the better, so we can help you faster."
                          rows={5}
                          value={form.message}
                          onChange={set('message')}
                          required
                        />
                      </div>
                      <button type="submit" className="contact-submit-btn">
                        Send Message →
                      </button>
                      <p className="contact-form-note">
                        We never share your information with third parties.
                      </p>
                    </form>
                  )}
                </div>

              </div>
            </div>
          </section>

          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
}
