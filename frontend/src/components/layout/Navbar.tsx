import { IonButton, IonIcon } from '@ionic/react';
import { menuOutline, closeOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let scrollEl: HTMLElement | null = null;
    let timers: ReturnType<typeof setTimeout>[] = [];

    const onScroll = () => {
      setScrolled((scrollEl?.scrollTop ?? 0) > 50);
    };

    const attach = (el: HTMLElement) => {
      if (scrollEl === el) return; // already attached
      if (scrollEl) scrollEl.removeEventListener('scroll', onScroll);
      scrollEl = el;
      el.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // sync initial state
    };

    const tryAttach = () => {
      const ionContent = document.querySelector('ion-content');
      if (ionContent) {
        (ionContent as any).getScrollElement().then((el: HTMLElement) => {
          if (el) attach(el);
        }).catch(() => {});
      }
    };

    // Try immediately, then at 100ms, 300ms, 600ms in case ion-content loads late
    [0, 100, 300, 600].forEach(delay => {
      timers.push(setTimeout(tryAttach, delay));
    });

    return () => {
      timers.forEach(clearTimeout);
      if (scrollEl) scrollEl.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className={`navbar-inner${scrolled ? ' scrolled' : ''}`}>
        {/* logo */}
        <a href="/" className="navbar-logo">
          <span className="logo-mark">bypass</span>
          <span className="logo-suffix">HEART HEALTH</span>
        </a>

        {/* desktop center links */}
        <div className="navbar-links-container">
          <ul className="navbar-links">
            {navLinks.map(l => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </div>

        {/* desktop right actions */}
        <div className="navbar-actions">
          <ThemeToggle />
          <a href="/login" className="nav-login-btn">Login</a>
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
          <a href="/signup" className="mobile-cta" onClick={() => setMobileOpen(false)}>Join Now →</a>
          <div className="mobile-theme-toggle"><ThemeToggle /></div>
        </div>
      )}
    </nav>
  );
}
