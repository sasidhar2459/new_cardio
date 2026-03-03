import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ThemeProvider } from './hooks/useTheme';

import LandingPage from './pages/Landing/LandingPage';
import AboutPage from './pages/About/AboutPage';
import TreatmentPage from './pages/Treatment/TreatmentPage';
import RiskAssessmentPage from './pages/RiskAssessment/RiskAssessmentPage';
import RiskAssessmentFormPage from './pages/RiskAssessment/RiskAssessmentFormPage';
import RiskAnalyticsPage from './pages/RiskAssessment/RiskAnalyticsPage';
import MetricsPage from './pages/Metrics/MetricsPage';
import WearablesPage from './pages/Wearables/WearablesPage';
import WearablesDashboardPage from './pages/Wearables/WearablesDashboardPage';
import RiskAssessmentDashboardPage from './pages/RiskAssessment/RiskAssessmentDashboardPage';
import MetricsDashboardPage from './pages/Metrics/MetricsDashboardPage';
import CollaboratePage from './pages/Collaborate/CollaboratePage';
import ContactPage from './pages/Contact/ContactPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';

/* Core Ionic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* our dark theme */
import './theme/variables.css';
import './theme/light-overrides.css';

setupIonicReact();

const App: React.FC = () => (
  <ThemeProvider>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
        <Route exact path="/home">
          <LandingPage />
        </Route>
        <Route exact path="/about">
          <AboutPage />
        </Route>
        <Route exact path="/treatment">
          <TreatmentPage />
        </Route>
        <Route exact path="/risk-assessment">
          <RiskAssessmentPage />
        </Route>
        <Route exact path="/risk-assessment/form">
          <RiskAssessmentFormPage />
        </Route>
        <Route exact path="/risk-assessment/results">
          <RiskAnalyticsPage />
        </Route>
        <Route exact path="/metrics">
          <MetricsPage />
        </Route>
        <Route exact path="/wearables">
          <WearablesPage />
        </Route>
        <Route exact path="/wearables/dashboard">
          <WearablesDashboardPage />
        </Route>
        <Route exact path="/risk-assessment/dashboard">
          <RiskAssessmentDashboardPage />
        </Route>
        <Route exact path="/metrics/dashboard">
          <MetricsDashboardPage />
        </Route>
        <Route exact path="/collaborate">
          <CollaboratePage />
        </Route>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/signup">
          <SignupPage />
        </Route>
        <Route exact path="/contact">
          <ContactPage />
        </Route>
        <Redirect exact from="/" to="/home" />
        {/* more routes added as pages are built */}
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
  </ThemeProvider>
);

export default App;
