import { IonButton, IonIcon } from '@ionic/react';
import { menuOutline, closeOutline } from 'ionicons/icons';
import { useState } from 'react';
import './Navbar.css';

// TODO: Risk Assessment & Metrics should only show when logged in — wire up after auth
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Treatment', href: '/treatment' },
  { label: 'Risk Assessment', href: '/risk-assessment' },
  { label: 'Metrics', href: '/metrics' },
  { label: 'Wearables', href: '/wearables' },
  { label: 'Collaborate', href: '/collaborate' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* logo */}
        <a href="/" className="navbar-logo">
          <span className="logo-mark">bypass</span>
          <span className="logo-suffix">HEART HEALTH</span>
        </a>

        {/* desktop links */}
        <div className="navbar-links-container">
          <ul className="navbar-links">
            {navLinks.map(l => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </div>

        {/* desktop CTA */}
        <div className="navbar-actions">
          <a href="/login" className="nav-login">Login</a>
          <IonButton className="btn-join" size="small" shape="round" fill="outline" href="/signup">
            Join Now
          </IonButton>
        </div>

        {/* mobile hamburger */}
        <button className="nav-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
          <IonIcon icon={mobileOpen ? closeOutline : menuOutline} />
        </button>
      </div>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="navbar-mobile">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</a>
          ))}
          <a href="/login" onClick={() => setMobileOpen(false)}>Login</a>
          <a href="/signup" className="mobile-cta" onClick={() => setMobileOpen(false)}>Join Now</a>
        </div>
      )}
    </nav>
  );
}
