import { memo, useState } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import TrainMap from './TrainMap';
import DisruptionBanner from './DisruptionBanner';
import DashboardStatusBar from './DashboardStatusBar';
import AgentReasoningFeed from './AgentReasoningFeed';
import IncidentCard from './IncidentCard';
import ScenarioSimulator from './ScenarioSimulator';
import AnnouncementsPanel from './AnnouncementsPanel';
import TrainListPanel from './TrainListPanel';
import TrainDetailPanel from './TrainDetailPanel';
import MaintenanceTicketModal from './MaintenanceTicketModal';
import MobileTabBar from './MobileTabBar';
import ChatPanel from './ChatPanel';
import { useAgent } from '../contexts/AgentContext';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState('map');
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const { maintenanceTicket } = useAgent();

  return (
    <div className="app">
      {/* Scanline overlay */}
      <div className="scanline-overlay" aria-hidden="true" />

      <TopBar
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        sidebarOpen={sidebarOpen}
      />

      <DashboardStatusBar />

      <div className="app-body">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="main-content">
          <DisruptionBanner />

          <div className="dashboard-grid">
            {/* LEFT PANEL — Map + Train List + Train Detail */}
            <div className={`dashboard-panel panel-left ${mobileTab === 'map' ? 'panel-mobile-visible' : ''}`}>
              <div className="panel-section panel-map-area">
                <TrainMap />
              </div>
              <TrainListPanel />
              <TrainDetailPanel />
            </div>

            {/* CENTER PANEL — AI Reasoning + Incident + Scenario + Chat */}
            <div className={`dashboard-panel panel-center ${mobileTab === 'feed' ? 'panel-mobile-visible' : ''}`}>
              <AgentReasoningFeed />
              <IncidentCard />
              <ScenarioSimulator />
              <div className="panel-section panel-chat-area">
                <ChatPanel />
              </div>
            </div>

            {/* RIGHT PANEL — Announcements + Maintenance Ticket */}
            <div className={`dashboard-panel panel-right ${mobileTab === 'announcements' ? 'panel-mobile-visible' : ''}`}>
              <AnnouncementsPanel />
              <div className="maintenance-ticket-trigger">
                <button
                  className="ticket-trigger-btn"
                  onClick={() => setTicketModalOpen(true)}
                  id="maintenance-ticket-btn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  {maintenanceTicket?.ticketNumber || 'MTX-0000'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile tab bar */}
      <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />

      {/* Maintenance ticket modal */}
      {ticketModalOpen && (
        <MaintenanceTicketModal
          ticket={maintenanceTicket}
          onClose={() => setTicketModalOpen(false)}
        />
      )}
    </div>
  );
}

export default memo(Dashboard);

/* Setup base dashboard layout */

/* Integrate i18n into dashboard */

/* Trigger ticket modal from dashboard */
