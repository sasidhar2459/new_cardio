import React, { useEffect, useRef, useState } from 'react';
import { IonPage, IonContent, IonIcon, IonButton } from '@ionic/react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { founders, team } from '../../data/mock_about';
import { Icons } from '../../lib/icons';
import { useReveal, useSlideReveal } from '../../hooks/useScrollReveal';
import './AboutPage.css';

// ── Parallax hook — photo moves slower than scroll ─────────────────
// returns a ref to attach to the photo element + the live offset
function useParallax(strength = 0.25) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // IonContent uses its own scroll container — walk up to find it
    const el = wrapRef.current;
    if (!el) return;

    // find the nearest IonContent scroll element
    const scroller =
      document.querySelector('ion-content')?.shadowRoot?.querySelector('.inner-scroll') as HTMLElement
      ?? document.querySelector('ion-content') as HTMLElement;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // how far the card center is from viewport center (-1 to 1)
      const relY = (rect.top + rect.height / 2 - viewH / 2) / viewH;
      setOffset(relY * viewH * strength);
    };

    scroller?.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      scroller?.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, [strength]);

  return { wrapRef, offset };
}

// ── Founder card — parallax photo + slide-in reveal ───────────────
function FounderCard({ founder, reverse }: { founder: typeof founders[0]; reverse?: boolean }) {
  // first leader slides from left, second from right
  const { ref, visible, from } = useSlideReveal(reverse ? 'right' : 'left');
  const { wrapRef, offset } = useParallax(0.18);

  return (
    <div
      ref={ref}
      className={`founder-card ${reverse ? 'founder-card--reverse' : ''} slide-${from} ${visible ? 'slide-in' : 'slide-hidden'}`}
      style={{ direction: 'ltr' }}
    >
      {/* overflow hidden on wrap clips the parallax-shifted photo */}
      <div className="founder-photo-wrap" ref={wrapRef}>
        <img
          src={founder.image}
          alt={founder.name}
          className="founder-photo"
          style={{ transform: `translateY(${offset}px)`, willChange: 'transform' }}
        />
        <div className="founder-name-overlay">
          <h3>{founder.name}</h3>
          <p>{founder.title}</p>
        </div>
      </div>
      <div className="founder-info">
        <a href={founder.linkedin} target="_blank" rel="noreferrer" className="founder-linkedin">
          <IonIcon icon={Icons.linkedin} />
        </a>
        {founder.bio.map((para, i) => (
          <p key={i} className="founder-bio-para">{para}</p>
        ))}
        <IonButton className="btn-know-more" fill="outline" shape="round" size="small">
          Know More
        </IonButton>
      </div>
    </div>
  );
}

// ── Team carousel — auto scrolls, click to pause, drag to scrub ────
function TeamSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  // use refs for loop-read values so the rAF closure always sees latest
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const didDrag = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  // mirror pause state to trigger re-render for cursor class only
  const [paused, setPaused] = useState(false);

  // single long-lived animation loop — never restarts
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf: number;
    const step = () => {
      if (!pausedRef.current && !draggingRef.current) {
        track.scrollLeft += 0.8;
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []); // runs once only

  const onMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    didDrag.current = false;
    dragStart.current = { x: e.clientX, scrollLeft: trackRef.current!.scrollLeft };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStart.current.x;
    if (Math.abs(dx) > 4) didDrag.current = true;
    trackRef.current!.scrollLeft = dragStart.current.scrollLeft - dx;
  };
  const onMouseUp = () => { draggingRef.current = false; };

  const onTouchStart = (e: React.TouchEvent) => {
    draggingRef.current = true;
    didDrag.current = false;
    dragStart.current = { x: e.touches[0].clientX, scrollLeft: trackRef.current!.scrollLeft };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    const dx = e.touches[0].clientX - dragStart.current.x;
    if (Math.abs(dx) > 4) didDrag.current = true;
    trackRef.current!.scrollLeft = dragStart.current.scrollLeft - dx;
  };
  const onTouchEnd = () => { draggingRef.current = false; };

  const togglePause = () => {
    if (didDrag.current) { didDrag.current = false; return; }
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current); // just for cursor class
  };

  // duplicate team list for seamless loop
  const looped = [...team, ...team];

  const { ref: headRef, visible: headVisible } = useReveal();

  return (
    <section className="team-section">
      <div className="container">
        <div ref={headRef} className={headVisible ? 'reveal-in' : 'reveal-hidden'}>
          <p className="section-eyebrow">The People</p>
          <h2 className="section-heading">Our Team</h2>
        </div>
      </div>

      {/* full-width carousel — no container constraint */}
      <div
        ref={trackRef}
        className={`team-carousel ${paused ? 'team-carousel--paused' : ''} ${draggingRef.current ? 'team-carousel--dragging' : ''}`}
        onClick={togglePause}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {looped.map((member, i) => (
          <div key={i} className="team-card">
            <img src={member.image} alt={member.name} className="team-photo" />
            <div className="team-name-overlay">
              <h4>{member.name}</h4>
              <p>{member.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Who We Are + Mission ───────────────────────────────────────────
function InfoSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="info-section">
      <div className="container">
        <p className="section-eyebrow">About Bypass</p>
        <h2 className="section-heading">Who We Are & Our Mission</h2>
        <div ref={ref} className={`info-grid ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          <div className="info-card">
            <h3 className="info-card-title">Who We Are</h3>
            <p className="info-card-body">
              Bypass is India's first comprehensive, cardiologist-designed preventive heart program.
            </p>
            <p className="info-card-body">
              We combine advanced diagnostics, continuous monitoring, and personalized medical care to help you stay ahead of heart disease—long before symptoms appear.
            </p>
          </div>
          <div className="info-card">
            <h3 className="info-card-title">Our Mission</h3>
            <p className="info-card-body">
              To reduce preventable heart attacks in India by making world-class prevention accessible, evidence-based, and measurable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Join Our Team ──────────────────────────────────────────────────
function JoinTeamSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="join-section">
      <div className="container">
        <div ref={ref} className={`join-card ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          <p className="section-eyebrow">Join Our Team</p>
          <h2 className="join-title">We're always on the lookout for passionate, dynamic, and talented individuals to join our team.</h2>
          <p className="join-sub">Find a role that fits you best!</p>
          <IonButton className="btn-white" shape="round" href="/careers">
            Check out the Current Openings
          </IonButton>
        </div>
      </div>
    </section>
  );
}

// ── Page ───────────────────────────────────────────────────────────
const AboutPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="about-page">
          <Navbar />

          {/* hero — full-bleed image with overlapping card (AHA style) */}
          <section className="about-hero">
            {/* grid bg overlay */}
            <div className="about-hero-bg-grid" />
            {/* hero background image */}
            <img
              src="https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=1920&q=80"
              alt="Doctor with patient discussing heart health"
              className="about-hero-img"
            />
            {/* text card overlays bottom-left of hero image */}
            <div className="about-hero-card">
              <p className="about-eyebrow">About Us</p>
              <h1 className="about-hero-title">About Bypass Heart Health</h1>
              <p className="about-hero-sub">
                Over our history, we've been fighting heart disease in India — striving to save and improve lives through prevention, precision, and personalized care.
              </p>
              <a href="#founders" className="about-hero-link">Learn more about our impact →</a>
            </div>
          </section>

          {/* founders — scroll reveal */}
          <section className="founders-section">
            <div className="container">
              <p className="section-eyebrow">Leadership</p>
              <h2 className="section-heading" style={{ marginBottom: 64 }}>Our Founders</h2>
              {founders.map((f, i) => (
                <FounderCard key={f.id} founder={f} reverse={i % 2 !== 0} />
              ))}
            </div>
          </section>

          {/* team — draggable auto-scroll carousel */}
          <TeamSection />

          <InfoSection />
          <JoinTeamSection />
          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AboutPage;
