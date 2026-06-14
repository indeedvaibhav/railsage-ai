import { useState, useCallback, useEffect, useRef, lazy, Suspense } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { TrainProvider } from './contexts/TrainContext';
import { AgentProvider } from './contexts/AgentContext';
import LandingPage from './components/LandingPage';

const Dashboard = lazy(() => import('./components/Dashboard'));

export default function App() {
  const dashboardRef = useRef(null);
  const [dashboardMounted, setDashboardMounted] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const onRevealDashboard = useCallback(() => {
    setDashboardMounted(true);
  }, []);

  const onLandingComplete = useCallback(() => {
    setShowLanding(false);
  }, []);

  useEffect(() => {
    import('./components/Dashboard').then(() => setDashboardMounted(true));
  }, []);

  return (
    <LanguageProvider>
      <TrainProvider>
        <AgentProvider>
          <div className="app-shell">
            <Suspense fallback={null}>
              {dashboardMounted && (
                <div ref={dashboardRef} className={`dashboard-layer ${!showLanding ? 'dashboard-active' : ''}`}>
                  <Dashboard />
                </div>
              )}
            </Suspense>

            {showLanding && (
              <LandingPage
                dashboardRef={dashboardRef}
                onRevealDashboard={onRevealDashboard}
                onComplete={onLandingComplete}
              />
            )}
          </div>
        </AgentProvider>
      </TrainProvider>
    </LanguageProvider>
  );
}

/* Setup React entry files */
