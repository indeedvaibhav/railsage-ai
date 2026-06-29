import { Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { TrainProvider } from './contexts/TrainContext'
import { AgentProvider } from './contexts/AgentContext'
import LandingPage from './components/LandingPage'
import AppLayout from './layouts/AppLayout'
import DashboardPage from './pages/DashboardPage'
import TrackerPage from './pages/TrackerPage'
import ChatPage from './pages/ChatPage'
import JourneyPage from './pages/JourneyPage'
import AlertsPage from './pages/AlertsPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <LanguageProvider>
      <TrainProvider>
        <AgentProvider>
          <Routes>
            {/* Landing — no navbar */}
            <Route path="/" element={<LandingPage />} />

            {/* All app pages share the AppLayout wrapper */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tracker"   element={<TrackerPage />} />
              <Route path="/chat"      element={<ChatPage />} />
              <Route path="/journey"   element={<JourneyPage />} />
              <Route path="/alerts"    element={<AlertsPage />} />
              <Route path="/settings"  element={<SettingsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AgentProvider>
      </TrainProvider>
    </LanguageProvider>
  )
}