import { IonIcon } from '@ionic/react';
import { sunnyOutline, moonOutline } from 'ionicons/icons';
import { useTheme } from '../../hooks/useTheme';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      <IonIcon icon={theme === 'dark' ? sunnyOutline : moonOutline} />
    </button>
  );
}
