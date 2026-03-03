import './Footer.css';

const footerLinks = {
  Program: [
    { label: 'About Us', href: '/about' },
    { label: 'Treatment', href: '/treatment' },
    { label: 'Risk Assessment', href: '/risk-assessment' },
    { label: 'Metrics', href: '/metrics' },
  ],
  Tools: [
    { label: 'Wearables', href: '/wearables' },
    { label: 'Collaborate', href: '/collaborate' },
    { label: 'Dashboard', href: '/risk-assessment/dashboard' },
  ],
  Account: [
    { label: 'Login', href: '/login' },
    { label: 'Sign Up', href: '/signup' },
  ],
};

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">

          {/* Brand col */}
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              <span className="footer-logo-mark">bypass</span>
              <span className="footer-logo-suffix">HEART HEALTH</span>
            </a>
            <p className="footer-tagline">
              India's first cardiologist-designed preventive heart health program. Know your risk. Reduce it.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div className="footer-col" key={group}>
              <h4 className="footer-col-title">{group}</h4>
              <ul>
                {links.map(l => (
                  <li key={l.label}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="footer-bottom">
          <p>© 2025 Bypass Heart Health. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
